import type { Metadata } from "next";
import Link from "next/link";
import { DemoDashboard } from "@/components/DemoDashboard";

export const metadata: Metadata = {
  title: "See how DueBird works",
  description:
    "Explore an interactive preview of how DueBird keeps class assignments organized.",
  alternates: {
    canonical: "/demo",
  },
};

export default function DemoPage() {
  return (
    <main className="min-h-screen flex flex-col px-5 py-8 sm:py-10 onboarding-page">
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-serif text-lg text-ink">
          DueBird
        </Link>

        <p className="text-xs text-muted">
          Step 2 of 3
        </p>
      </header>

      <div className="w-full max-w-5xl mx-auto mt-5">
        <div className="h-1 rounded-full bg-wash overflow-hidden">
          <div className="h-full w-2/3 rounded-full bg-ink onboarding-progress-fill" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <DemoDashboard />

        <div className="w-full max-w-xl px-5 flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/"
            className="btn-secondary flex-1 text-center"
          >
            Back
          </Link>

          <Link
            href="/get-started"
            className="btn-primary flex-1 text-center"
          >
            Continue
          </Link>
        </div>
      </div>

      <footer className="text-center text-xs text-faint mt-8">
        Made for students, by students.
      </footer>
    </main>
  );
}