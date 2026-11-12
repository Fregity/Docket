
"use client";

import { useEffect, useState } from "react";

type Props = {
  variant?: "settings" | "dashboard";
};

const DISMISS_KEY = "duebird_push_prompt_dismissed_session";

function decodeVapidKey(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const raw = window.atob(base64);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export function PushNotificationSettings({
  variant = "settings",
}: Props) {
  const [supported, setSupported] = useState(false);
  const [checked, setChecked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Checking notification support...");

  useEffect(() => {
    if (variant === "dashboard") {
      setDismissed(
        sessionStorage.getItem(DISMISS_KEY) === "1"
      );
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

        setSubscribed(!!subscription);

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
    if (!checked || !supported || subscribed || dismissed) return null;

    return (
      <section className="mb-5 rounded-2xl border border-ink/10 bg-paper p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-medium text-ink">
              Stay on top of assignments
            </h2>
            <p className="mt-1 text-sm text-muted">
              Enable notifications now so you're ready for upcoming
              assignment reminders.
            </p>
          </div>

          <button
            type="button"
            onClick={dismissPrompt}
            aria-label="Dismiss notification prompt"
            className="text-muted text-xl leading-none"
          >
            ×
          </button>
        </div>

        {Notification.permission === "denied" ? (
          <p className="mt-3 text-sm text-muted">
            Notifications are blocked. You can enable them in your
            browser settings.
          </p>
        ) : (
          <button
            type="button"
            className="btn-secondary mt-3"
            onClick={enableNotifications}
            disabled={busy}
          >
            {busy ? "Enabling..." : "Enable notifications"}
          </button>
        )}

        {message && (
          <p className="mt-2 text-xs text-muted" aria-live="polite">
            {message}
          </p>
        )}
      </section>
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
