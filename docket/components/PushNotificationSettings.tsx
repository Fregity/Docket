
"use client";

import { useEffect, useState } from "react";

type Props = {
  variant?: "settings" | "dashboard";
};

const DISMISS_KEY = "duebird_push_prompt_dismissed_session";
const INSTALL_DISMISS_KEY = "duebird_install_prompt_dismissed_v1";

function decodeVapidKey(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const raw = window.atob(base64);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isMobile() {
  return (
    /android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1)
  );
}

export function PushNotificationSettings({
  variant = "settings",
}: Props) {
  const [supported, setSupported] = useState(false);
  const [checked, setChecked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installFinished, setInstallFinished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Checking notification support...");

  useEffect(() => {
    if (variant === "dashboard") {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");

      const installAlreadyHandled =
        localStorage.getItem(INSTALL_DISMISS_KEY) === "1" ||
        isStandalone() ||
        !isMobile();

      setInstallFinished(installAlreadyHandled);

      const onInstallPromptClosed = () => setInstallFinished(true);

      window.addEventListener(
        "duebird:install-prompt-closed",
        onInstallPromptClosed
      );

      // If the install prompt was already dismissed in a previous session,
      // don't make the user wait for an event that won't happen.
      if (installAlreadyHandled) {
        setInstallFinished(true);
      }

      async function checkSupport() {
        const available =
          "serviceWorker" in navigator &&
          "PushManager" in window &&
          "Notification" in window &&
          window.isSecureContext;

        setSupported(available);

        if (!available) {
          setMessage("Push notifications aren't supported by this browser.");
          setChecked(true);
          return;
        }

        try {
          const registration =
            await navigator.serviceWorker.register("/sw.js");

          const subscription =
            await registration.pushManager.getSubscription();

          if (subscription && Notification.permission === "granted") {
            const response = await fetch("/api/push/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...subscription.toJSON(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              }),
            });

            if (!response.ok) {
              throw new Error("Could not verify notification settings.");
            }
          }

          setSubscribed(
            !!subscription && Notification.permission === "granted"
          );

          if (Notification.permission === "denied") {
            setMessage(
              "Notifications are blocked in your browser settings."
            );
          } else {
            setMessage(
              subscription
                ? "Notifications are enabled on this device."
                : "Notifications are currently disabled."
            );
          }
        } catch {
          setMessage("Could not check notification settings.");
        } finally {
          setChecked(true);
        }
      }

      void checkSupport();

      return () => {
        window.removeEventListener(
          "duebird:install-prompt-closed",
          onInstallPromptClosed
        );
      };
    }

    async function checkSettingsSupport() {
      const available =
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window &&
        window.isSecureContext;

      setSupported(available);

      if (!available) {
        setMessage("Push notifications aren't supported by this browser.");
        setChecked(true);
        return;
      }

      try {
        const registration =
          await navigator.serviceWorker.register("/sw.js");

        const subscription =
          await registration.pushManager.getSubscription();

        if (subscription && Notification.permission === "granted") {
          const response = await fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...subscription.toJSON(),
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
          });

          if (!response.ok) {
            throw new Error("Could not verify notification settings.");
          }
        }

        setSubscribed(
          !!subscription && Notification.permission === "granted"
        );

        if (Notification.permission === "denied") {
          setMessage("Notifications are blocked in your browser settings.");
        } else {
          setMessage(
            subscription
              ? "Notifications are enabled on this device."
              : "Notifications are currently disabled."
          );
        }
      } catch {
        setMessage("Could not check notification settings.");
      } finally {
        setChecked(true);
      }
    }

    void checkSettingsSupport();
  }, [variant]);

  async function enableNotifications() {
    setBusy(true);
    setMessage("");

    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error("Notification configuration is missing.");
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error(
          "Permission wasn't granted. Check your browser settings."
        );
      }

      const registration =
        await navigator.serviceWorker.register("/sw.js");

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: decodeVapidKey(publicKey) as BufferSource,
        });
      }

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...subscription.toJSON(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not enable notifications.");
      }

      setSubscribed(true);
      setMessage("Notifications enabled on this device.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not enable notifications."
      );
    } finally {
      setBusy(false);
    }
  }

  async function disableNotifications() {
    setBusy(true);
    setMessage("");

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription =
        await registration.pushManager.getSubscription();

      if (subscription) {
        const response = await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Could not disable notifications.");
        }

        await subscription.unsubscribe();
      }

      setSubscribed(false);
      setMessage("Notifications disabled on this device.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not disable notifications."
      );
    } finally {
      setBusy(false);
    }
  }

  function dismissPrompt() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  if (variant === "dashboard") {
    if (
      !checked ||
      !supported ||
      subscribed ||
      dismissed ||
      !installFinished
    ) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5 py-8 backdrop-blur-md">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="notification-modal-title"
          className="relative w-full max-w-sm rounded-3xl border border-ink/10 bg-paper p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          <button
            type="button"
            onClick={dismissPrompt}
            aria-label="Dismiss notification prompt"
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
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Never miss a deadline
          </p>

          <h2
            id="notification-modal-title"
            className="font-serif text-2xl leading-tight text-ink"
          >
            Let DueBird remind you.
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted">
            Get helpful reminders about upcoming assignments, so important
            deadlines don't sneak up on you.
          </p>

          {Notification.permission === "denied" ? (
            <p className="mt-5 rounded-xl bg-ink/5 p-3 text-sm text-muted">
              Notifications are blocked by your browser. You can enable them
              in your device or browser settings.
            </p>
          ) : (
            <button
              type="button"
              className="btn-primary mt-6 w-full justify-center"
              onClick={enableNotifications}
              disabled={busy}
            >
              {busy ? "Enabling..." : "Enable notifications"}
            </button>
          )}

          {message && (
            <p className="mt-3 text-center text-xs text-muted" aria-live="polite">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={dismissPrompt}
            className="mt-4 w-full py-2 text-sm text-muted transition hover:text-ink"
          >
            Maybe later
          </button>
        </section>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-[15px] font-medium text-ink">
          Push notifications
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Enable or disable notifications on this device.
        </p>
      </div>

      <p className="text-sm text-ink/70" aria-live="polite">
        {message}
      </p>

      {supported && checked && (
        subscribed ? (
          <button
            type="button"
            className="btn-ghost self-start"
            onClick={disableNotifications}
            disabled={busy}
          >
            {busy ? "Please wait..." : "Disable notifications"}
          </button>
        ) : (
          <button
            type="button"
            className="btn-secondary self-start"
            onClick={enableNotifications}
            disabled={busy || Notification.permission === "denied"}
          >
            {busy ? "Please wait..." : "Enable notifications"}
          </button>
        )
      )}
    </section>
  );
}
