
import type { Metadata } from "next";
import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";

export const metadata: Metadata = {
  title: "DueBird | Shared Classwork Tracker",
  description:
    "Create a class, invite classmates, and keep track of assignments and due dates together.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DueBird | Shared Classwork Tracker",
    description:
      "A shared assignment list for you and your classmates.",
    url: "https://myduebird.com",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DueBird | Shared Classwork Tracker",
    description:
      "A shared assignment list for you and your classmates.",
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
    "A shared classwork tracker for students to organize assignments and due dates.",
  isAccessibleForFree: true,
};

export default function LandingPage() {
  return (
    <main className="landing-page flex min-h-screen flex-col bg-paper text-ink">
      <TrackPageView eventName="landing_viewed" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 sm:px-10">
        <Link
          href="/"
          aria-label="DueBird home"
          className="text-2xl font-extrabold tracking-[-0.055em]"
        >
          DueBird
        </Link>

        <div className="flex items-center gap-6">
          <span className="hidden font-mono text-[10px] font-medium tracking-[0.12em] text-muted sm:inline">
            FREE FOR STUDENTS
          </span>
          <Link
            href="/login"
            className="text-sm font-semibold underline decoration-hairline underline-offset-4 hover:decoration-ink"
          >
            Log in
          </Link>
        </div>
      </header>

      <section className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 pb-28 pt-20 sm:px-10 sm:pb-36 sm:pt-28">
          <h1 className="max-w-4xl text-[clamp(3.2rem,8vw,6.8rem)] font-extrabold leading-[0.98] tracking-[-0.055em]">
            Keep track of what’s due.
          </h1>

          <p className="mt-8 max-w-xl text-lg font-medium leading-[1.65] text-muted sm:text-xl">
            Create a class, invite your classmates, and add assignments as
            they come up. Everyone in the class can see the same list.
          </p>

          <div className="mt-9">
            <Link
              href="/get-started"
              className="inline-flex min-h-14 items-center justify-center rounded-[3px] bg-ink px-7 text-[15px] font-bold text-paper transition-colors hover:opacity-80"
            >
              Create a class
              <span className="ml-3" aria-hidden="true">→</span>
            </Link>
          </div>

          <p className="mt-5 text-sm font-medium text-muted">
            Free to use. No payment information required.
          </p>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="text-sm font-semibold">
            DueBird
            <span className="ml-2 font-normal text-muted">
              Made for students, by students.
            </span>
          </p>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-muted"
          >
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
            <a href="mailto:myduebird@gmail.com" className="hover:text-ink">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
