"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function ShareClass({
  className,
  inviteUrl,
  inviteCode,
  autoOpen,
}: {
  className: string;
  inviteUrl: string;
  inviteCode: string;
  autoOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!autoOpen);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  async function handleCopyLink() {
    await navigator.clipboard.writeText(inviteUrl);
    void trackEvent("invite_link_copied");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  async function handleCopyCode() {
    await navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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
                : "Send this link to your class group chat, or share the code directly."}
            </p>

            <label className="label">Invite link</label>
            <div className="rounded-xl border border-hairline bg-wash px-4 py-3 text-sm text-ink mb-2 break-all">
              {inviteUrl}
            </div>
            <button className="btn-primary w-full mb-5" onClick={handleCopyLink}>
              {copiedLink ? "Link copied!" : "Copy invite link"}
            </button>

            <label className="label">Invite code</label>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 rounded-xl border border-hairline bg-wash px-4 py-3 text-lg tracking-widest font-serif text-ink text-center">
                {inviteCode}
              </div>
              <button className="btn-secondary" onClick={handleCopyCode}>
                {copiedCode ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="flex flex-col gap-2">
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
