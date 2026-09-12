"use client";

import { useState, useTransition } from "react";
import { isNextRedirectError } from "@/lib/errors";
import { leaveClass } from "@/lib/actions/classes";

export function LeaveClassButton({
  classId,
  className,
  isLastMember,
}: {
  classId: string;
  className: string;
  isLastMember: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await leaveClass(classId);
      } catch (err) {
        if (isNextRedirectError(err)) throw err;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <>
      <button className="btn-ghost text-danger" onClick={() => setOpen(true)}>
        {isLastMember ? "Delete class" : "Leave class"}
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
              {isLastMember ? `Delete ${className}?` : `Leave ${className}?`}
            </h2>
            <p className="text-muted text-[15px] mb-6">
              {isLastMember
                ? "You're the only member. Leaving will permanently delete this class and its homework for everyone."
                : "You'll no longer see this class's homework. Other members can keep using it, and you can rejoin later with the invite link."}
            </p>

            {error && <p className="text-sm mb-4 text-danger">{error}</p>}

            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-primary flex-1"
                style={{ backgroundColor: "var(--danger)" }}
                onClick={handleConfirm}
                disabled={pending}
              >
                {pending ? "Leaving…" : isLastMember ? "Delete" : "Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}