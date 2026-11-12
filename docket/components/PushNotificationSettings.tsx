
"use client";

import { useEffect, useState } from "react";

function decodeVapidKey(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const raw = window.atob(base64);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export function PushNotificationSettings() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Checking notification support...");

  useEffect(() => {
    async function checkSupport() {
      const available =
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window &&
        window.isSecureContext;

      setSupported(available);

      if (!available) {
        setMessage("Push notifications aren't supported by this browser.");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const subscription = await registration.pushManager.getSubscription();

        setSubscribed(!!subscription);

        if (Notification.permission === "denied") {
          setMessage(
            "Notifications are blocked in your browser settings. Change that permission there to enable them."
          );
        } else {
          setMessage(
            subscription
              ? "Notifications are enabled on this device."
              : "Get reminders about upcoming assignments."
          );
        }
      } catch {
        setMessage("Could not initialize notifications on this device.");
      }
    }

    void checkSupport();
  }, []);

  async function enableNotifications() {
    setBusy(true);
    setMessage("");

    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error("The public notification key is missing.");
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error("Notification permission was not granted.");
      }

      const registration = await navigator.serviceWorker.register("/sw.js");

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: decodeVapidKey(publicKey) as BufferSource,
        });
      }

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save your subscription.");
      }

      setSubscribed(true);
      setMessage("Notifications are enabled on this device.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not enable notifications."
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
      const subscription = await registration.pushManager.getSubscription();

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
      setMessage("Notifications are disabled on this device.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not disable notifications."
      );
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/push/test", {
        method: "POST",
      });

      const text = await response.text();

      let result: any;
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `HTTP ${response.status}: Server returned invalid JSON. ${text.slice(0, 300)}`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.error || `Test failed (HTTP ${response.status})`
        );
      }

      setMessage("Test sent. Check your device's notifications.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Test notification failed."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-[15px] font-medium text-ink">
          Push notifications
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Receive reminders about upcoming assignments.
        </p>
      </div>

      <p className="text-sm text-ink/70" aria-live="polite">
        {message}
      </p>

      {!supported ? null : subscribed ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={sendTest}
            disabled={busy}
          >
            Send test
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={disableNotifications}
            disabled={busy}
          >
            Disable
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn-secondary self-start"
          onClick={enableNotifications}
          disabled={busy}
        >
          {busy ? "Please wait..." : "Enable notifications"}
        </button>
      )}
    </section>
  );
}
