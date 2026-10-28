"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallButton() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    const ua = navigator.userAgent;
    setIsIos(
      /iphone|ipad|ipod/i.test(ua) ||
        (ua.includes("Mac") && navigator.maxTouchPoints > 1)
    );
    setReady(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleClick() {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    setShowHelp((v) => !v);
  }

  if (!ready || installed) return null;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-white shadow-lg shadow-blue-500/25 transition active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 55%, #4f46e5 100%)" }}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="6" y="2" width="12" height="20" rx="3" />
            <path d="M12 8v6" />
            <path d="M9 11.5l3 3 3-3" />
          </svg>
        </span>
        <span className="flex-1">
          <span className="block text-[15px] font-semibold leading-tight">
            Add to home screen
          </span>
          <span className="block text-xs text-white/80">
            Open DueBird like a real app
          </span>
        </span>
      </button>

      {showHelp && (
        <div className="mt-3 rounded-2xl border border-black/10 bg-black/5 p-4 text-sm dark:border-white/10 dark:bg-white/5">
          {isIos ? (
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Tap the Share button in Safari.</li>
              <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
              <li>Tap <b>Add</b>.</li>
            </ol>
          ) : (
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Open your browser menu (⋮).</li>
              <li>Tap <b>Install app</b> or <b>Add to Home screen</b>.</li>
              <li>Confirm.</li>
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
