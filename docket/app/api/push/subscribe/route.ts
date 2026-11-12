
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function checkOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const timezone = body?.timezone;

  if (typeof timezone !== "string" || timezone.length > 100) {
    return NextResponse.json(
      { error: "Invalid timezone" },
      { status: 400 }
    );
  }

  // Validate that this is a real IANA timezone.
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
  } catch {
    return NextResponse.json(
      { error: "Invalid timezone" },
      { status: 400 }
    );
  }

  const endpoint = body?.endpoint;
  const p256dh = body?.keys?.p256dh;
  const auth = body?.keys?.auth;

  if (
    typeof endpoint !== "string" ||
    !endpoint.startsWith("https://") ||
    endpoint.length > 2048 ||
    typeof p256dh !== "string" ||
    p256dh.length > 256 ||
    typeof auth !== "string" ||
    auth.length > 256
  ) {
    return NextResponse.json(
      { error: "Invalid push subscription" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Never allow a subscription already belonging to another account
  // to be silently reassigned.
  const { data: existing, error: lookupError } = await admin
    .from("push_subscriptions")
    .select("user_id")
    .eq("endpoint", endpoint)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (existing && existing.user_id !== user.id) {
    return NextResponse.json(
      { error: "This device subscription belongs to another account." },
      { status: 409 }
    );
  }

  const { error } = await admin.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint,
      p256dh,
      auth,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    return NextResponse.json({ error: "Could not save subscription" }, {
      status: 500,
    });
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({ timezone })
    .eq("id", user.id);

  if (profileError) {
    return NextResponse.json(
      { error: "Subscription saved, but timezone could not be saved." },
      { status: 500 }
    );
  }


  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body?.endpoint !== "string") {
    return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", body.endpoint);

  if (error) {
    return NextResponse.json({ error: "Could not remove subscription" }, {
      status: 500,
    });
  }

  return NextResponse.json({ success: true });
}
