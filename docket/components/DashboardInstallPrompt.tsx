
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

    if (
      !standalone &&
      mobile &&
      !localStorage.getItem(DISMISS_KEY)
    ) {
      setVisible(true);
      void trackEvent("install_prompt_shown");
    }

    const onInstalled = () => {
      localStorage.setItem(DISMISS_KEY, "1");
      setVisible(false);
      notifyInstallPromptClosed();
    };

    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    notifyInstallPromptClosed();
    void trackEvent("install_prompt_dismissed");
  }

  function notifyInstallPromptClosed() {
    window.dispatchEvent(
      new Event("duebird:install-prompt-closed")
    );
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5 py-8 backdrop-blur-md">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-modal-title"
        className="relative w-full max-w-sm rounded-3xl border border-ink/10 bg-paper p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-muted transition hover:bg-ink/5 hover:text-ink"
        >
          ×
        </button>

        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/5 text-ink">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="6" y="2" width="12" height="20" rx="3" />
            <path d="M12 8v6" />
            <path d="m9 11.5 3 3 3-3" />
          </svg>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Make DueBird yours
        </p>

        <h2
          id="install-modal-title"
          className="font-serif text-2xl leading-tight text-ink"
        >
          Your assignments, one tap away.
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          Add DueBird to your home screen for quicker access and an app-like
          experience whenever you need to check your assignments.
        </p>

        <div className="mt-6">
          <InstallButton />
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mt-4 w-full py-2 text-sm text-muted transition hover:text-ink"
        >
          Maybe later
        </button>
      </section>
    </div>
  );
}
