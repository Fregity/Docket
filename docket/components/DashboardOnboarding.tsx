
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AddHomeworkModal } from "@/components/AddHomeworkModal";
import { completeOnboarding } from "@/lib/actions/onboarding";

type ClassOption = {
  id: string;
  name: string;
  accent_color: string;
};

export function DashboardOnboarding({
  classes,
  hasAssignments,
}: {
  classes: ClassOption[];
  hasAssignments: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const step = classes.length === 0 ? 1 : hasAssignments ? 3 : 2;

  function finish() {
    startTransition(async () => {
      await completeOnboarding();
      router.refresh();
    });
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/35 px-5 py-8 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="w-full max-w-md rounded-3xl border border-hairline bg-paper p-7 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Getting started
          </p>
          <p className="text-xs text-muted">Step {step} of 3</p>
        </div>

        <div className="mb-7 flex gap-2" aria-hidden="true">
          {[1, 2, 3].map((number) => (
            <div
              key={number}
              className={`h-1.5 flex-1 rounded-full ${
                number <= step ? "bg-ink" : "bg-ink/10"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 id="onboarding-title" className="font-serif text-3xl leading-tight text-ink">
              Start with a class.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Create a class for one of your courses, or join one using an
              invite code from a classmate.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <Link href="/classes/new" className="btn-primary w-full justify-center">
                Create a class
              </Link>
              <Link href="/onboarding?intent=join" className="btn-secondary w-full justify-center">
                Join with an invite code
              </Link>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 id="onboarding-title" className="font-serif text-3xl leading-tight text-ink">
              Add your first assignment.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Add something you need to remember for{" "}
              {classes[0]?.name ?? "your class"}. You can add more classes and
              assignments anytime.
            </p>

            <div className="mt-7">
              <AddHomeworkModal
                classes={classes}
                trigger={(open) => (
                  <button
                    type="button"
                    onClick={open}
                    className="btn-primary w-full justify-center"
                  >
                    Add your first assignment
                  </button>
                )}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 id="onboarding-title" className="font-serif text-3xl leading-tight text-ink">
              You're all set.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Your first class and assignment are in DueBird. Your dashboard
              will keep upcoming work in one place.
            </p>

            <button
              type="button"
              onClick={finish}
              disabled={pending}
              className="btn-primary mt-7 w-full justify-center"
            >
              {pending ? "Finishing…" : "Go to my dashboard"}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={finish}
          disabled={pending}
          className="mt-5 w-full py-2 text-sm text-muted transition hover:text-ink disabled:opacity-50"
        >
          Skip setup
        </button>
      </section>
    </div>
  );
}
