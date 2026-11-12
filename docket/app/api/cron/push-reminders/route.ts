
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
  classes: { name: string }[] | null;
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

  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
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

  const { data: users, error: usersError } = await admin
    .from("profiles")
    .select("id, timezone")
    .not("timezone", "is", null);

  if (usersError) {
    return NextResponse.json({ error: "Could not load users" }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of users ?? []) {
    const timezone = user.timezone;

    if (!timezone || localHour(timezone) !== 8) {
      continue;
    }

    const today = localDate(timezone);
    const tomorrow = addDays(today, 1);

    const reminders: {
      type: "due_today" | "due_tomorrow" | "weekly_review";
      start: string;
      end: string;
      label: string;
      date: string;
    }[] = [
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

    if (membershipError || !memberships?.length) {
      continue;
    }

    const classIds = memberships.map((membership) => membership.class_id);

    const { data: subscriptions, error: subscriptionError } = await admin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", user.id);

    if (subscriptionError || !subscriptions?.length) {
      continue;
    }

    for (const reminder of reminders) {

      const { data: assignments, error: assignmentError } = await admin
        .from("assignments")
        .select("id, title, due_date, class_id, classes(name)")
        .in("class_id", classIds)
        .gte("due_date", reminder.start)
        .lte("due_date", reminder.end)
        .order("due_date", { ascending: true });

      if (assignmentError) {
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

      if (!assignmentIds.length) {
        await admin
          .from("push_reminder_logs")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .eq("reminder_type", reminder.type)
          .eq("reminder_date", reminder.date);

        skipped++;
        continue;
      }

      const { data: completions, error: completionError } = await admin
        .from("assignment_completions")
        .select("assignment_id")
        .eq("user_id", user.id)
        .in("assignment_id", assignmentIds);

      if (completionError) {
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
      skipped++;
      continue;
      }

      // Claim only after confirming there is work to notify about.
      const { data: claimed, error: claimError } = await admin.rpc(
      "claim_push_reminder",
      {
          p_user_id: user.id,
          p_reminder_type: reminder.type,
          p_reminder_date: reminder.date,
      }
      );

      if (claimError) {
      console.error("Reminder claim failed:", claimError);
      failed++;
      continue;
      }

      if (!claimed) {
      skipped++;
      continue;
      }

      const lines = incomplete.slice(0, 4).map((assignment) => {
        const className = assignment.classes?.[0]?.name ?? "Class";
        return `${assignment.title} (${className})`;
      });

      const extra = incomplete.length > 4
        ? ` and ${incomplete.length - 4} more`
        : "";

      const payload = JSON.stringify({
        title: reminder.type === "weekly_review"
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
              console.error("Reminder push failed:", error);
            }
          }
        })
      );

      if (staleEndpoints.length) {
        await admin
          .from("push_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .in("endpoint", staleEndpoints);
      }

      await admin
        .from("push_reminder_logs")
        .update(
          deviceSent > 0
            ? { status: "sent", sent_at: new Date().toISOString() }
            : { status: "failed" }
        )
        .eq("user_id", user.id)
        .eq("reminder_type", reminder.type)
        .eq("reminder_date", reminder.date);

      if (deviceSent > 0) sent++;
      else failed++;
    }
  }

  return NextResponse.json({ success: true, sent, skipped, failed });
}
