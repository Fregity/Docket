
import { NextRequest, NextResponse } from "next/server";
import * as webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

type Assignment = {
  id: string;
  title: string;
  due_date: string;
  class_id: string;
};

type Reminder = {
  type: "due_today" | "due_tomorrow" | "weekly_review";
  start: string;
  end: string;
  label: string;
  date: string;
};

function localDate(timeZone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

function localHour(timeZone: string) {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date())
  );
}

function addDays(date: string, days: number) {
  const result = new Date(`${date}T12:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

function localWeekday(timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(new Date());
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (
    !secret ||
    request.headers.get("authorization") !== `Bearer ${secret}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    return NextResponse.json(
      { error: "Push configuration missing" },
      { status: 500 }
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const admin = createAdminClient();

  const users: { id: string; timezone: string | null }[] = [];
  const pageSize = 500;

  for (let from = 0; ; from += pageSize) {
    const { data: page, error } = await admin
      .from("profiles")
      .select("id, timezone")
      .not("timezone", "is", null)
      .order("id")
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Could not load users:", error);
      return NextResponse.json(
        { error: "Could not load users" },
        { status: 500 }
      );
    }

    users.push(...(page ?? []));

    if (!page || page.length < pageSize) break;
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of users ?? []) {
    const timezone = user.timezone;

    let hour: number;

    try {
      if (!timezone) continue;
      hour = localHour(timezone);
    } catch (error) {
      console.error("Invalid user timezone:", {
        userId: user.id,
        timezone,
        error,
      });
      continue;
    }

    // Initial attempt at 8 AM, retries at 9, 10, and 11 AM.
    if (hour < 8 || hour > 11) {
      continue;
    }

    const today = localDate(timezone);
    const tomorrow = addDays(today, 1);

    const reminders: Reminder[] = [
      {
        type: "due_today",
        start: today,
        end: today,
        label: "due today",
        date: today,
      },
      {
        type: "due_tomorrow",
        start: tomorrow,
        end: tomorrow,
        label: "due tomorrow",
        date: tomorrow,
      },
    ];

    if (localWeekday(timezone) === "Sun") {
      reminders.push({
        type: "weekly_review",
        start: tomorrow,
        end: addDays(today, 7),
        label: "coming up next week",
        date: today,
      });
    }

    const { data: memberships, error: membershipError } = await admin
      .from("class_members")
      .select("class_id")
      .eq("user_id", user.id);

    if (membershipError) {
      console.error("Could not load class memberships:", {
        userId: user.id,
        error: membershipError,
      });
      failed++;
      continue;
    }

    if (!memberships?.length) {
      continue;
    }

    const classIds = memberships.map((membership) => membership.class_id);

    const { data: subscriptions, error: subscriptionError } = await admin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", user.id);

    if (subscriptionError) {
      console.error("Could not load push subscriptions:", {
        userId: user.id,
        error: subscriptionError,
      });
      failed++;
      continue;
    }

    if (!subscriptions?.length) {
      continue;
    }

    for (const reminder of reminders) {
      // Atomically claim this reminder. Failed attempts can be retried;
      // concurrent requests cannot claim the same reminder simultaneously.
      const { data: claimed, error: claimError } = await admin.rpc(
        "claim_push_reminder",
        {
          p_user_id: user.id,
          p_reminder_type: reminder.type,
          p_reminder_date: reminder.date,
        }
      );

      if (claimError) {
        console.error("Reminder claim failed:", {
          userId: user.id,
          reminderType: reminder.type,
          error: claimError,
        });
        failed++;
        continue;
      }

      if (!claimed) {
        skipped++;
        continue;
      }

      const { data: assignments, error: assignmentError } = await admin
        .from("assignments")
        .select("id, title, due_date, class_id")
        .in("class_id", classIds)
        .gte("due_date", reminder.start)
        .lte("due_date", reminder.end)
        .order("due_date", { ascending: true });

      if (assignmentError) {
        console.error("Could not load assignments:", {
          userId: user.id,
          reminderType: reminder.type,
          error: assignmentError,
        });

        await admin
          .from("push_reminder_logs")
          .update({ status: "failed" })
          .eq("user_id", user.id)
          .eq("reminder_type", reminder.type)
          .eq("reminder_date", reminder.date);

        failed++;
        continue;
      }

      const assignmentIds = (assignments ?? []).map((a) => a.id);

      // No assignments means there is nothing to notify about.
      if (!assignmentIds.length) {
        const { error: deleteError } = await admin
          .from("push_reminder_logs")
          .delete()
          .eq("user_id", user.id)
          .eq("reminder_type", reminder.type)
          .eq("reminder_date", reminder.date)
          .eq("status", "pending");

        if (deleteError) {
          console.error("Could not clear empty reminder claim:", deleteError);
          failed++;
        } else {
          skipped++;
        }

        continue;
      }

      // Load class names separately rather than relying on a nested relation.
      const assignmentClassIds = [
        ...new Set((assignments ?? []).map((a) => a.class_id)),
      ];

      const { data: classRows, error: classError } = await admin
        .from("classes")
        .select("id, name")
        .in("id", assignmentClassIds);

      if (classError) {
        console.error("Could not load assignment class names:", {
          userId: user.id,
          reminderType: reminder.type,
          error: classError,
        });

        await admin
          .from("push_reminder_logs")
          .update({ status: "failed" })
          .eq("user_id", user.id)
          .eq("reminder_type", reminder.type)
          .eq("reminder_date", reminder.date);

        failed++;
        continue;
      }

      const classNames = new Map(
        (classRows ?? []).map((c) => [c.id, c.name])
      );

      const { data: completions, error: completionError } = await admin
        .from("assignment_completions")
        .select("assignment_id")
        .eq("user_id", user.id)
        .in("assignment_id", assignmentIds);

      if (completionError) {
        console.error("Could not load assignment completions:", {
          userId: user.id,
          reminderType: reminder.type,
          error: completionError,
        });

        await admin
          .from("push_reminder_logs")
          .update({ status: "failed" })
          .eq("user_id", user.id)
          .eq("reminder_type", reminder.type)
          .eq("reminder_date", reminder.date);

        failed++;
        continue;
      }

      const completedIds = new Set(
        (completions ?? []).map((completion) => completion.assignment_id)
      );

      const incomplete = (assignments ?? []).filter(
        (assignment) => !completedIds.has(assignment.id)
      ) as Assignment[];

      if (!incomplete.length) {
        const { error: deleteError } = await admin
          .from("push_reminder_logs")
          .delete()
          .eq("user_id", user.id)
          .eq("reminder_type", reminder.type)
          .eq("reminder_date", reminder.date)
          .eq("status", "pending");

        if (deleteError) {
          console.error("Could not clear completed reminder:", deleteError);
          failed++;
        } else {
          skipped++;
        }

        continue;
      }

      const lines = incomplete.slice(0, 4).map((assignment) => {
        const className =
          classNames.get(assignment.class_id) ?? "Unknown class";

        return `${assignment.title} (${className})`;
      });

      const extra =
        incomplete.length > 4
          ? `, and ${incomplete.length - 4} more`
          : "";

      const payload = JSON.stringify({
        title:
          reminder.type === "weekly_review"
            ? "Your weekly DueBird review"
            : reminder.type === "due_today"
              ? "Assignments due today"
              : "Assignments due tomorrow",
        body: `${lines.join(", ")}${extra}`,
        url: "/dashboard",
        tag: `duebird-${reminder.type}-${reminder.date}`,
      });

      let deviceSent = 0;
      const staleEndpoints: string[] = [];

      await Promise.all(
        subscriptions.map(async (subscription) => {
          try {
            await webpush.sendNotification(
              {
                endpoint: subscription.endpoint,
                keys: {
                  p256dh: subscription.p256dh,
                  auth: subscription.auth,
                },
              },
              payload
            );

            deviceSent++;
          } catch (error) {
            const statusCode = (error as { statusCode?: number })?.statusCode;

            if (statusCode === 404 || statusCode === 410) {
              staleEndpoints.push(subscription.endpoint);
            } else {
              console.error("Reminder push failed:", {
                userId: user.id,
                reminderType: reminder.type,
                statusCode,
                error,
              });
            }
          }
        })
      );

      if (staleEndpoints.length) {
        const { error: deleteError } = await admin
          .from("push_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .in("endpoint", staleEndpoints);

        if (deleteError) {
          console.error("Could not remove stale subscriptions:", deleteError);
        }
      }

      // If at least one device accepted the notification, mark it sent.
      // This avoids resending to devices that already received it.
      const { error: logUpdateError } = await admin
        .from("push_reminder_logs")
        .update(
          deviceSent > 0
            ? { status: "sent", sent_at: new Date().toISOString() }
            : { status: "failed" }
        )
        .eq("user_id", user.id)
        .eq("reminder_type", reminder.type)
        .eq("reminder_date", reminder.date);

      if (logUpdateError) {
        console.error("Could not update reminder log:", {
          userId: user.id,
          reminderType: reminder.type,
          error: logUpdateError,
        });
        failed++;
        continue;
      }

      if (deviceSent > 0) {
        sent++;
      } else {
        failed++;
      }
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    skipped,
    failed,
  });
}
