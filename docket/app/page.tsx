import type { Metadata } from "next";
import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";

export const metadata: Metadata = {
  title: "DueBird — the homework planner that actually gets used",
  description:
    "Stop asking the group chat. DueBird is a free homework planner for students: classes, assignments, due dates, shared with people who actually need them.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DueBird — stop asking the group chat",
    description:
      "A free homework planner built by a student. Classes, assignments, due dates. Shared when you want. No clutter.",
    url: "https://myduebird.com",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DueBird — stop asking the group chat",
    description:
      "A free homework planner built by a student. Classes, assignments, due dates. Shared when you want.",
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
    <main className="min-h-[100svh] flex flex-col landing-root">
      <TrackPageView eventName="landing_viewed" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {/* Top bar — logo left, status right */}
      <header className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="bird-mark" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path
                d="M6 18c2-6 8-10 14-9 3 .4 5 2 6 4-4 1-7 4-8 8-3-1-6-1-9-1 0-1 0-1.5-3-2z"
                fill="currentColor"
                className="text-ink"
              />
              <circle cx="22" cy="11" r="1.6" fill="currentColor" className="text-accent" />
            </svg>
          </span>
          <span className="font-serif text-[1.35rem] tracking-tight text-ink leading-none">
            DueBird
          </span>
        </div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted hidden sm:block">
          free · student-built
        </span>
      </header>

      {/* Hero — asymmetric, notebook energy */}
      <section className="relative flex-1 flex flex-col justify-center px-5 sm:px-8 pt-10 sm:pt-14 pb-12">
        <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
          {/* Left: voice */}
          <div>
            <p className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-medium text-accent-ink bg-accent-soft px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Built by a student who got tired of the group chat
            </p>

            <h1 className="font-serif text-[2.6rem] sm:text-[3.4rem] lg:text-[3.75rem] leading-[1.05] tracking-[-0.02em] text-ink">
              What did we
              <br />
              have for{" "}
              <span className="relative inline-block">
                homework?
                <span className="absolute -bottom-1 left-0 right-0 h-[0.35em] bg-accent/35 -z-10 rounded-sm rotate-[-1deg]" />
              </span>
            </h1>

            <p className="mt-6 text-[1.05rem] sm:text-lg text-muted leading-relaxed max-w-md">
              Stop scrolling the GC for due dates that disappeared three messages ago.
              Keep classes, assignments, and deadlines in one place — and share them only
              with people who actually need them.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/get-started"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-[15px]"
              >
                Start free
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/demo"
                className="btn-secondary inline-flex items-center gap-2 px-5 py-3.5 text-[15px]"
              >
                Peek the demo
              </Link>
            </div>

            <p className="mt-4 text-sm text-faint">
              No credit card. No spam. Takes under a minute.
            </p>
          </div>

          {/* Right: visual — messy chat → clean list */}
          <div className="relative">
            {/* Fake group chat card */}
            <div className="chat-card absolute -left-2 sm:left-0 top-0 w-[88%] sm:w-[92%] z-0 rotate-[-2.5deg]">
              <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-hairline">
                <div className="flex -space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-wash border border-hairline" />
                  <span className="w-5 h-5 rounded-full bg-accent-soft border border-hairline" />
                  <span className="w-5 h-5 rounded-full bg-wash border border-hairline" />
                </div>
                <span className="text-[11px] text-muted">period 3 group chat</span>
              </div>
              <div className="p-3 space-y-2.5 text-[13px]">
                <div className="flex gap-2">
                  <span className="text-faint shrink-0">maya</span>
                  <span className="text-muted">did we have the essay?</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-faint shrink-0">jay</span>
                  <span className="text-muted">idk check canvas</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-faint shrink-0">sam</span>
                  <span className="text-muted">wait was it friday or monday</span>
                </div>
                <div className="flex gap-2 opacity-60">
                  <span className="text-faint shrink-0">you</span>
                  <span className="text-muted italic">…</span>
                </div>
              </div>
            </div>

            {/* Clean DueBird card on top */}
            <div className="due-card relative z-10 mt-16 sm:mt-20 ml-auto w-[92%] sm:w-[90%] rotate-[1.5deg]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
                <span className="font-serif text-sm text-ink">History — period 3</span>
                <span className="text-[11px] text-accent-ink bg-accent-soft px-2 py-0.5 rounded-full">
                  2 due soon
                </span>
              </div>
              <ul className="p-3 space-y-2.5">
                <li className="flex items-start gap-3 rounded-xl bg-wash/80 px-3 py-2.5">
                  <span className="mt-0.5 w-4 h-4 rounded border-2 border-ink/25 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-ink leading-snug">Essay — Industrial Revolution</p>
                    <p className="text-[12px] text-muted mt-0.5">Due Mon · 2 pages</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                  <span className="mt-0.5 w-4 h-4 rounded border-2 border-ink/25 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-ink leading-snug">Chapter 14 reading</p>
                    <p className="text-[12px] text-muted mt-0.5">Due Wed</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl px-3 py-2.5 opacity-50">
                  <span className="mt-0.5 w-4 h-4 rounded bg-ink/10 border-2 border-ink/20 shrink-0 flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-ink line-through leading-snug">Primary source notes</p>
                    <p className="text-[12px] text-muted mt-0.5">Done</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Small floating sticky */}
            <div className="sticky-note absolute -right-1 sm:right-2 -bottom-3 sm:bottom-2 z-20 rotate-[6deg] hidden sm:block">
              <p className="text-[12px] leading-snug text-ink/90">
                no more
                <br />
                “was it due today?”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why it exists — short, human */}
      <section className="border-t border-hairline bg-wash/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-18">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight">
              The group chat is not a planner.
            </h2>
            <p className="mt-4 text-[15px] sm:text-base text-muted leading-relaxed">
              Messages get buried. Screenshots get lost. Someone always misses the update.
              DueBird keeps every class separate, every assignment visible, and due dates
              where you can actually see them — alone or with the people in the class.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-4 sm:gap-5">
            <article className="feature-tile">
              <div className="feature-num">01</div>
              <h3 className="font-serif text-lg text-ink mt-3">Classes stay separate</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                No dumping everything into one endless list. Each course has its own space
                so you can see what’s actually due for what.
              </p>
            </article>
            <article className="feature-tile">
              <div className="feature-num">02</div>
              <h3 className="font-serif text-lg text-ink mt-3">Assignments with context</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Title, due date, notes. Enough to know what it is without opening Canvas
                at 11pm.
              </p>
            </article>
            <article className="feature-tile">
              <div className="feature-num">03</div>
              <h3 className="font-serif text-lg text-ink mt-3">Share only when you want</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Create a class, invite with a code. Classmates see the same list. You
                control it — not the group chat.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-hairline">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-16 text-center">
          <h2 className="font-serif text-2xl sm:text-[1.85rem] text-ink tracking-tight">
            One less thing to stress about.
          </h2>
          <p className="mt-3 text-muted max-w-md mx-auto text-[15px]">
            Free. No accounts required to try the demo. Built for real school weeks,
            not productivity theater.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/get-started"
              className="btn-primary inline-flex items-center gap-2 px-7 py-3.5"
            >
              Get started
            </Link>
            <Link href="/demo" className="btn-secondary inline-flex px-6 py-3.5">
              Explore demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-hairline py-5 px-5 text-center text-[12px] text-faint">
        Made for students, by a student. ·{" "}
        <Link href="/privacy" className="hover:text-muted underline-offset-2 hover:underline">
          Privacy
        </Link>
        {" · "}
        <Link href="/terms" className="hover:text-muted underline-offset-2 hover:underline">
          Terms
        </Link>
      </footer>
    </main>
  );
}
