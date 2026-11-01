import type { Metadata } from "next";
import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";
import { DemoDashboard } from "@/components/DemoDashboard";

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

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-sm text-muted tracking-wide mb-6">DueBird</p>

        <h1 className="font-serif text-4xl sm:text-5xl leading-tight max-w-lg text-ink">
          What did we have for homework?
        </h1>

        <p className="text-lg text-ink/80 mt-5">
          Stop asking the group chat.
        </p>

        <p className="text-muted text-[15px] max-w-sm mt-3">
          Keep your classes&rsquo; homework in one place. Add assignments,
          see what&rsquo;s due, and share your class with friends.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-9 w-full max-w-xs sm:max-w-none sm:w-auto">
          <Link href="/login" className="btn-primary">
            Get started
          </Link>
          <Link href="/login?intent=join" className="btn-secondary">
            Join a class
          </Link>
        </div>
      </div>

      <footer className="text-center pb-8 text-xs text-faint">
        Made for students, by students.
      </footer>
    </main>
  );
}