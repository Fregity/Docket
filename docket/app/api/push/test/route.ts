
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    return NextResponse.json(
      { error: "Push notification settings are missing on the server." },
      { status: 500 }
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const admin = createAdminClient();
  const { data: subscriptions, error } = await admin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Could not load subscriptions" }, {
      status: 500,
    });
  }

  if (!subscriptions?.length) {
    return NextResponse.json(
      { error: "No notification subscription found for this account." },
      { status: 404 }
    );
  }

  let sent = 0;
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
          JSON.stringify({
            title: "DueBird test",
            body: "Notifications are working on this device.",
            url: "/dashboard",
            tag: "duebird-test",
          })
        );

        sent++;
      } catch (err) {
        const statusCode = (err as { statusCode?: number })?.statusCode;

        if (statusCode === 404 || statusCode === 410) {
          staleEndpoints.push(subscription.endpoint);
        } else {
          console.error("DueBird test push failed:", err);
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

  if (sent === 0) {
    return NextResponse.json(
      { error: "The test notification could not be delivered." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, sent });
}
