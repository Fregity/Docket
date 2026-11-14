import type { Metadata } from "next";
import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";

export const metadata: Metadata = {
  title: "Free Homework Planner for Students",
  description:
    "DueBird is a free homework planner that helps students organize classes, track assignments, and remember due dates in one place.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DueBird - Free Homework Planner for Students",
    description:
      "Organize classes, track homework assignments, and keep due dates in one place with DueBird.",
    url: "https://myduebird.com",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DueBird - Free Homework Planner for Students",
    description:
      "Organize classes, track homework assignments, and keep due dates in one place with DueBird.",
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
    <main className="min-h-[100svh] flex flex-col onboarding-page">
      <TrackPageView eventName="landing_viewed" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className="w-full max-w-6xl mx-auto px-6 pt-5 sm:pt-7 flex items-center justify-between">
        <span className="font-serif text-xl text-ink">DueBird</span>
        <span className="text-xs text-muted">Step 1 of 3</span>
      </header>

      <div className="w-full max-w-6xl mx-auto px-6 mt-4">
        <div className="h-1 rounded-full bg-wash overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-ink onboarding-progress-fill" />
        </div>
      </div>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-7 sm:py-16 text-center">
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-muted mb-5 sm:mb-7">
          Made for students
        </p>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.1] max-w-3xl text-ink">
          What did we have for homework?
        </h1>

        <p className="font-serif italic text-xl sm:text-3xl mt-4 sm:mt-5 text-muted">
          Stop asking the group chat.
        </p>

        <p className="text-sm sm:text-lg text-muted max-w-md mt-5 sm:mt-7 leading-relaxed">
          Keep your classes, assignments, and due dates all in one place.
        </p>

        <Link
          href="/demo"
          className="btn-primary mt-8 sm:mt-10 px-10 py-4 text-base w-full max-w-xs"
        >
          See how it works
          <span className="ml-2" aria-hidden="true">→</span>
        </Link>

        <p className="text-xs text-faint mt-3">
          Takes less than a minute.
        </p>
      </section>

      <section className="w-full bg-wash/50 border-y border-hairline px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-muted mb-3">
              A simpler way to stay organized
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">
              A homework planner built around how students actually work.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted">
              DueBird is a free online homework planner for keeping track of
              classes, assignments, and upcoming due dates. Instead of
              searching through messages to remember what was assigned, keep
              classwork organized in one shared place.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mt-12">
            <article className="rounded-2xl border border-hairline bg-paper p-6">
              <h3 className="font-serif text-xl text-ink">Organize every class</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Keep each course separate so assignments are easier to find
                and your workload is easier to understand.
              </p>
            </article>
            <article className="rounded-2xl border border-hairline bg-paper p-6">
              <h3 className="font-serif text-xl text-ink">Track assignments</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Add homework, descriptions, and due dates, then see upcoming
                work together on your dashboard.
              </p>
            </article>
            <article className="rounded-2xl border border-hairline bg-paper p-6">
              <h3 className="font-serif text-xl text-ink">Share classwork</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Create a class or join one with classmates so everyone can
                keep up with the work assigned to the group.
              </p>
            </article>
          </div>

          <div className="max-w-2xl mx-auto text-center mt-14">
            <h2 className="font-serif text-2xl sm:text-3xl text-ink">
              Spend less time figuring out what’s due.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Whether you call it a homework tracker, student planner, or
              assignment organizer, DueBird gives your schoolwork one place
              to live. It’s free to use and designed for students.
            </p>
            <Link
              href="/demo"
              className="btn-primary inline-flex justify-center mt-7 px-8 py-3"
            >
              Explore the demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 px-6 text-xs text-faint">
        Made for students, by students.
      </footer>
    </main>
  );
}
