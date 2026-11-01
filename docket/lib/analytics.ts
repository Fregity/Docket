
import { createClient } from "@/lib/supabase/client";

export type AnalyticsEvent =
  | "landing_viewed"
  | "demo_started"
  | "demo_step_completed"
  | "signup_page_viewed"
  | "signup_completed"
  | "class_created"
  | "class_joined"
  | "assignment_created"
  | "assignment_completed"
  | "invite_link_copied"
  | "dashboard_returned";

function getOrCreateId(storage: Storage, key: string): string {
  let id = storage.getItem(key);

  if (!id) {
    id = crypto.randomUUID();
    storage.setItem(key, id);
  }

  return id;
}

export async function trackEvent(
  eventName: AnalyticsEvent,
  properties: Record<string, unknown> = {}
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const visitorId = getOrCreateId(
      localStorage,
      "duebird_visitor_id"
    );

    const sessionId = getOrCreateId(
      sessionStorage,
      "duebird_session_id"
    );

    // Keep event metadata small and avoid accidentally sending
    // large or unserializable objects.
    const serialized = JSON.stringify(properties);

    if (new TextEncoder().encode(serialized).length > 2048) {
      return;
    }

    const supabase = createClient();

    const { error } = await supabase
      .from("analytics_events")
      .insert({
        event_name: eventName,
        visitor_id: visitorId,
        session_id: sessionId,
        properties,
      });

    if (error && process.env.NODE_ENV === "development") {
      console.warn("Analytics event failed:", error.message);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Analytics tracking error:", error);
    }
  }
}
