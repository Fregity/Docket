import type { Metadata } from "next";
import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";
import { DemoDashboard } from "@/components/DemoDashboard";

export const metadata: Metadata = {
  title: "DueBird — Shared Classwork Tracker",
  description:
    "Create a class, share its invite link, and keep assignments and due dates on one shared class board.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DueBird — Shared Classwork Tracker",
    description:
      "A shared place for classmates to keep track of assignments and due dates.",
    url: "https://myduebird.com",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DueBird — Shared Classwork Tracker",
    description:
      "A shared place for classmates to keep track of assignments and due dates.",
    images: ["/opengraph-image"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "DueBird",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: "https://myduebird.com",
  description:
    "A classwork tracker where students can share classes and organize assignments and due dates.",
  isAccessibleForFree: true,
};

export default function LandingPage() {
  return (
    <main className="landing-paper min-h-screen bg-paper text-ink">
      <TrackPageView eventName="landing_viewed" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className="mx-auto flex max-w-[1320px] items-center justify-between border-b border-hairline px-5 py-5 sm:px-10 lg:px-14">
        <Link
          href="/"
          aria-label="DueBird home"
          className="font-serif text-[2rem] leading-none tracking-[-0.045em]"
        >
          DueBird
        </Link>

        <nav className="flex items-center gap-5 sm:gap-8">
          <span className="font-mono text-[9px] tracking-[0.16em] text-muted sm:text-[10px]">
            FREE FOR STUDENTS
          </span>
          <Link
            href="/login"
            className="font-mono text-[11px] tracking-wide text-ink underline decoration-hairline underline-offset-4 transition-colors hover:decoration-ink"
          >
            LOG IN →
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-16 sm:px-10 sm:pb-24 sm:pt-24 lg:px-14 lg:pt-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.55fr)] lg:items-end lg:gap-20">
          <div>
            <p className="mb-7 font-mono text-[10px] tracking-[0.19em] text-muted sm:text-xs">
              SHARED CLASSWORK TRACKER
            </p>

            <h1 className="max-w-[900px] font-serif text-[clamp(3.25rem,8.2vw,7.8rem)] leading-[0.91] tracking-[-0.045em]">
              Every assignment from your group chat, organized on one clean
              syllabus.
            </h1>
          </div>

          <div className="max-w-[390px] pb-1 lg:pb-3">
            <p className="text-[15px] leading-[1.75] text-muted sm:text-base">
              Create a class, share the invite link with classmates, and keep a
              shared list of what’s due. No more searching through buried
              messages for the latest assignment.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/get-started"
                className="inline-flex min-h-12 items-center justify-center border border-ink bg-ink px-5 py-3 font-mono text-[11px] tracking-wide text-paper transition-colors hover:bg-transparent hover:text-ink"
              >
                CREATE A CLASS — IT’S FREE →
              </Link>

              <Link
                href="/demo"
                className="font-mono text-[11px] tracking-wide text-ink underline decoration-hairline underline-offset-4 transition-colors hover:decoration-ink"
              >
                TRY LIVE DEMO
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="ledger-heading"
        className="mx-auto max-w-[1320px] px-5 pb-24 sm:px-10 lg:px-14"
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-ink pb-3">
          <div>
            <p className="font-mono text-[9px] tracking-[0.18em] text-muted">
              A LOOK INSIDE THE CLASS BOARD
            </p>
            <h2
              id="ledger-heading"
              className="mt-2 font-serif text-3xl tracking-[-0.035em] sm:text-4xl"
            >
              The assignment ledger
            </h2>
          </div>
          <p className="font-mono text-[9px] tracking-[0.12em] text-muted">
            INTERACTIVE SAMPLE
          </p>
        </div>

        <DemoDashboard />
      </section>

      <section className="border-y border-hairline">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20 lg:px-14">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-muted">
              HOW DUEBIRD WORKS
            </p>
            <h2 className="mt-5 max-w-[430px] font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.04em]">
              A class list everyone can keep up with.
            </h2>
          </div>

          <div className="border-t border-ink">
            <article className="grid gap-3 border-b border-hairline py-7 sm:grid-cols-[190px_1fr] sm:gap-8">
              <h3 className="font-serif text-2xl tracking-[-0.025em]">
                Shared by default
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-muted">
                Create a class and share its invite link. Members can add,
                update, and view assignments on the same class board, so
                everyone has access to the same list.
              </p>
            </article>

            <article className="grid gap-3 border-b border-hairline py-7 sm:grid-cols-[190px_1fr] sm:gap-8">
              <h3 className="font-serif text-2xl tracking-[-0.025em]">
                Quick to update
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-muted">
                Add an assignment with a title and due date. Keep classwork
                together by subject and check what still needs to be finished.
              </p>
            </article>

            <article className="grid gap-3 border-b border-hairline py-7 sm:grid-cols-[190px_1fr] sm:gap-8">
              <h3 className="font-serif text-2xl tracking-[-0.025em]">
                Free to use
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-muted">
                DueBird is currently free. Use it in a mobile or desktop
                browser; there’s no payment information to enter.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 py-20 sm:px-10 sm:py-28 lg:px-14">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-ink pb-10 sm:flex-row sm:items-end">
          <h2 className="max-w-[850px] font-serif text-[clamp(2.8rem,7vw,6.6rem)] leading-[0.94] tracking-[-0.045em]">
            Stop asking “wait, what’s due tomorrow?”
          </h2>

          <Link
            href="/get-started"
            className="inline-flex min-h-12 shrink-0 items-center justify-center border border-ink bg-ink px-5 py-3 font-mono text-[11px] tracking-wide text-paper transition-colors hover:bg-transparent hover:text-ink"
          >
            START YOUR FIRST CLASS →
          </Link>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-5 py-7 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-14">
          <div>
            <p className="font-serif text-xl tracking-[-0.035em]">
              DueBird
            </p>
            <p className="mt-1 text-xs text-muted">
              Made for students, by students.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] tracking-wide text-muted"
          >
            <Link className="hover:text-ink" href="/privacy">
              PRIVACY POLICY
            </Link>
            <Link className="hover:text-ink" href="/terms">
              TERMS
            </Link>
            <a
              className="hover:text-ink"
              href="mailto:myduebird@gmail.com"
            >
              CONTACT
            </a>
            <span title="A public status page has not been set up yet">
              STATUS: NOT PUBLISHED
            </span>
          </nav>
        </div>
      </footer>
    </main>
  );
}
