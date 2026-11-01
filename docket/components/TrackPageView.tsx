
"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

export default function TrackPageView({
  eventName,
}: {
  eventName: AnalyticsEvent;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    void trackEvent(eventName);
  }, [eventName]);

  return null;
}
