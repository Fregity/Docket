import type { Metadata } from "next";
import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";

export const metadata: Metadata = {
  title: "Homework tracker for students",
  description:
    "What did we have for homework? Keep assignments organized, see what's due, and share classes with friends using DueBird.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Homework tracker for students | DueBird",
    description:
      "Keep your classes' homework in one place. Add assignments, see what's due, and share your class with friends.",
    url: "https://myduebird.com",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "DueBird",
  applicationCategory: "Education",
  operatingSystem: "Web",
  url: "https://myduebird.com",
  description:
    "A homework tracker for students to organize assignments, see upcoming due dates, and share classes with friends.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <TrackPageView eventName="landing_viewed" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className="w-full max-w-6xl mx-auto px-6 pt-7 flex items-center justify-between">
        <span className="font-serif text-xl text-ink">DueBird</span>
        <span className="text-xs text-muted">Step 1 of 3</span>
      </header>

      <div className="w-full max-w-6xl mx-auto px-6 mt-5">
        <div className="h-1 rounded-full bg-wash overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-ink" />
        </div>
      </div>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted mb-7">
          A better way to keep track of school
        </p>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.08] max-w-3xl text-ink">
          What did we have for homework?
        </h1>

        <p className="font-serif italic text-2xl sm:text-3xl mt-5 text-muted">
          Stop asking the group chat.
        </p>

        <p className="text-base sm:text-lg text-muted max-w-lg mt-7 leading-relaxed">
          Your classes, assignments, and due dates, all in one place.
          Share homework with classmates and always know what's coming up.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl w-full mt-12 text-left">
          <div className="rounded-xl border border-hairline p-4">
            <p className="font-serif text-lg text-ink">Your classes</p>
            <p className="text-sm text-muted mt-1">
              Keep every class organized in one place.
            </p>
          </div>

          <div className="rounded-xl border border-hairline p-4">
            <p className="font-serif text-lg text-ink">Shared homework</p>
            <p className="text-sm text-muted mt-1">
              Keep your whole class on the same page.
            </p>
          </div>

          <div className="rounded-xl border border-hairline p-4">
            <p className="font-serif text-lg text-ink">Upcoming work</p>
            <p className="text-sm text-muted mt-1">
              Know what's due and when.
            </p>
          </div>
        </div>

        <Link
          href="/demo"
          className="btn-primary mt-10 px-10 py-4 text-base"
        >
          See how it works
          <span className="ml-2" aria-hidden="true">→</span>
        </Link>

        <p className="text-xs text-faint mt-4">
          Takes less than a minute to explore.
        </p>
      </section>

      <footer className="text-center pb-7 text-xs text-faint">
        Made for students, by students.
      </footer>
    </main>
  );
}