"use client";

import { useState } from "react";

export function ShareClass({
  className,
  inviteUrl,
  autoOpen,
}: {
  className: string;
  inviteUrl: string;
  autoOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!autoOpen);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${className} on DueBird`,
          text: `Join ${className} on DueBird so we can stop asking what the homework is.`,
          url: inviteUrl,
        });
      } catch {
        // user cancelled — no-op
      }
    }
  }

  return (
    <>
      <button className="btn-secondary" onClick={() => setOpen(true)}>
        Share class
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/30 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-sm bg-paper rounded-t-2xl sm:rounded-2xl border border-hairline p-6 sm:p-7"
          >
            <h2 className="font-serif text-2xl mb-2">
              {autoOpen ? "Your class is ready" : "Invite your classmates"}
            </h2>
            <p className="text-muted text-[15px] mb-5">
              {autoOpen
                ? "Invite your classmates so everyone can keep the homework updated."
                : "Send this link to your class group chat."}
            </p>

            <div className="rounded-xl border border-hairline bg-wash px-4 py-3 text-sm text-ink mb-4 break-all">
              {inviteUrl}
            </div>

            <div className="flex flex-col gap-2">
              <button className="btn-primary" onClick={handleCopy}>
                {copied ? "Link copied!" : "Copy invite link"}
              </button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button className="btn-secondary" onClick={handleNativeShare}>
                  Share
                </button>
              )}
              <button className="btn-ghost" onClick={() => setOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
