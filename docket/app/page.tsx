
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";
import { DemoDashboard } from "@/components/DemoDashboard";

export const metadata: Metadata = {
  title: "DueBird — Know What's Due",
  description:
    "Keep your classes, homework, and due dates in one simple place. DueBird is a free homework planner made for students.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DueBird — Know What's Due",
    description:
      "Keep your classes, homework, and due dates in one simple place.",
    url: "https://myduebird.com",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DueBird — Know What's Due",
    description:
      "Keep your classes, homework, and due dates in one simple place.",
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
    "A free homework planner for students to organize classes, track assignments, see upcoming due dates, and share classwork with classmates.",
  isAccessibleForFree: true,
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <TrackPageView eventName="landing_viewed" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Link
          href="/"
          aria-label="DueBird home"
          className="flex items-center gap-2.5"
        >
          <Image
            src="/apple-touch-icon.png"
            alt=""
            width={38}
            height={38}
            priority
            className="rounded-xl"
          />
          <span className="text-[21px] font-extrabold tracking-[-0.06em]">
            duebird
          </span>
        </Link>

        <span className="rounded-full border border-hairline px-3 py-1.5 text-xs font-medium text-muted">
          Free for students
        </span>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -right-28 top-8 -z-10 h-80 w-80 rounded-full bg-[#e7f1fa] blur-3xl dark:bg-[#19334a]/40" />
        <div className="pointer-events-none absolute -left-32 bottom-0 -z-10 h-72 w-72 rounded-full bg-[#fff0dc] blur-3xl dark:bg-[#4b321b]/25" />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:pt-20">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#edf5fc] px-3 py-1.5 text-xs font-semibold text-[#285d88] dark:bg-[#1d3448] dark:text-[#b8d9f5]">
              <span className="h-2 w-2 rounded-full bg-[#ed9a45]" />
              Your schoolwork, in one place
            </div>

            <h1 className="max-w-[11ch] text-[clamp(3.1rem,7vw,5.7rem)] font-extrabold leading-[0.98] tracking-[-0.075em]">
              Know what’s due.{" "}
              <span className="text-[#3979ad]">
                Skip the group chat.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Classes, assignments, and due dates—organized in one place, so
              you can stop digging through messages to figure out what to do.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/get-started"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#276b9f] px-7 py-3 text-sm font-bold text-white shadow-[0_8px_22px_rgba(39,107,159,0.2)] transition hover:-translate-y-0.5 hover:bg-[#205b88] sm:w-auto"
              >
                Get started free
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>

              <span className="text-xs text-muted">
                No payment. No complicated setup.
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted">
              <span className="flex items-center gap-2">
                <span className="text-[#e4933d]">✓</span>
                Made for students
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#e4933d]">✓</span>
                Free to use
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#e4933d]">✓</span>
                Works on your phone
              </span>
            </div>
          </div>

          {/* Interactive product preview */}
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -inset-3 -rotate-2 rounded-[2rem] bg-[#eaf3fa] dark:bg-[#1b3448]" />

            <div className="relative overflow-hidden rounded-[1.6rem] border border-[#dce7ef] bg-paper shadow-[0_24px_70px_rgba(28,61,88,0.14)] dark:border-[#35495a]">
              <div className="flex items-center justify-between border-b border-hairline bg-[#f8fbfd] px-5 py-3 dark:bg-[#202b33]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#eea04d]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9fc4a9]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#a9c8e3]" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  A little preview
                </span>
              </div>

              <DemoDashboard />
            </div>

            <div className="absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-hairline bg-paper px-4 py-3 text-xs font-semibold shadow-lg sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff0dc] text-[#b96b21]">
                ✓
              </span>
              One less thing to remember
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-hairline bg-wash">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3 md:gap-10 md:py-16">
          <article>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#3979ad]">
              01 / See it
            </p>
            <h2 className="text-xl font-bold tracking-tight">
              Every class, together.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Keep each subject in its own place. No more searching old chats
              for the right assignment.
            </p>
          </article>

          <article>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#3979ad]">
              02 / Track it
            </p>
            <h2 className="text-xl font-bold tracking-tight">
              Know what’s coming up.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Add work and due dates, then see what needs your attention in one
              clear view.
            </p>
          </article>

          <article>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#3979ad]">
              03 / Share it
            </p>
            <h2 className="text-xl font-bold tracking-tight">
              Stay on the same page.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Create a class or join classmates so shared classwork stays easy
              to find.
            </p>
          </article>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-5 py-16 sm:px-8 sm:py-20 md:flex-row md:items-center">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3979ad]">
            Less chasing. More doing.
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.055em] sm:text-4xl">
            Your next assignment shouldn’t be hiding in a chat.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Put your schoolwork somewhere you can actually find it.
          </p>
        </div>

        <Link
          href="/get-started"
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[#276b9f] px-7 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#205b88]"
        >
          Get started free
          <span className="ml-2" aria-hidden="true">
            →
          </span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-extrabold tracking-[-0.04em]"
          >
            <Image
              src="/apple-touch-icon.png"
              alt=""
              width={25}
              height={25}
              className="rounded-lg"
            />
            duebird
          </Link>

          <p className="text-xs text-muted">
            Made for students, by students.
          </p>
        </div>
      </footer>
    </main>
  );
}
