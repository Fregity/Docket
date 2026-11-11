"use client";

import { useEffect, useState } from "react";
import InstallButton from "@/components/InstallButton";
import { trackEvent } from "@/lib/analytics";

const DISMISS_KEY = "duebird_install_prompt_dismissed_v1";

export function DashboardInstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    const mobile =
      /android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);

    if (!standalone && mobile && !localStorage.getItem(DISMISS_KEY)) {
      setVisible(true);
      void trackEvent("install_prompt_shown");
    }

    const onInstalled = () => setVisible(false);
    window.addEventListener("appinstalled", onInstalled);

    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section className="mb-6 rounded-2xl border border-ink/10 bg-paper p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="font-medium text-ink">
            Keep DueBird one tap away
          </h2>
          <p className="text-sm text-muted mt-1">
            Add it to your home screen so checking assignments becomes a habit.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="text-muted text-xl leading-none"
        >
          ×
        </button>
      </div>
      <InstallButton />
    </section>
  );
}
