import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Get started",
  description: "Start using DueBird to keep track of your class homework.",
  alternates: {
    canonical: "/get-started",
  },
};

export default function GetStartedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-full max-w-lg">
        <p className="text-sm text-muted tracking-wide mb-5">DueBird</p>

        <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-ink">
          Ready to get your homework organized?
        </h1>

        <p className="text-muted text-base sm:text-lg mt-5 max-w-sm mx-auto">
          Keep your classes, assignments, and due dates together. No more
          searching through the group chat.
        </p>

        <div className="flex flex-col gap-4 mt-10 w-full max-w-sm mx-auto">
          <Link
            href="/login?mode=signup"
            className="btn-primary w-full py-5 text-lg"
          >
            Get started
          </Link>

          <Link
            href="/login?intent=join"
            className="btn-secondary w-full py-5 text-lg"
          >
            Join a class
          </Link>
        </div>

        <p className="text-sm text-muted mt-8">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-2 text-ink">
            Sign in
          </Link>
        </p>

        <Link
          href="/demo"
          className="inline-block text-sm text-muted mt-8 hover:text-ink"
        >
          Back to the demo
        </Link>
      </div>

      <footer className="absolute bottom-6 text-xs text-faint">
        Made for students, by students.
      </footer>
    </main>
  );
}