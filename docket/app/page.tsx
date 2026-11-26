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
    description: "A shared assignment list for you and your classmates.",
    url: "https://myduebird.com",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DueBird | Shared Classwork Tracker",
    description: "A shared assignment list for you and your classmates.",
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
    <main className="landing-page">
      <TrackPageView eventName="landing_viewed" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className="landing-header">
        <Link href="/" className="landing-wordmark" aria-label="DueBird home">
          DueBird<span>.</span>
        </Link>

        <nav className="landing-nav" aria-label="Main navigation">
          <Link href="/login" className="landing-login">
            Log in
          </Link>
          <Link href="/get-started" className="landing-signup">
            Sign up <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-kicker">
            <span className="landing-kicker-line" />
            CLASSWORK, TOGETHER
          </div>

          <h1>
            Keep track
            <br />
            of <span className="landing-highlight">what’s due.</span>
          </h1>

          <p className="landing-description">
            One shared assignment list for your class. Add work once, and
            everyone can see what’s coming up.
          </p>

          <div className="landing-actions">
            <Link href="/get-started" className="landing-primary">
              Create a class <span aria-hidden="true">↗</span>
            </Link>

            <Link href="/join" className="landing-secondary">
              Join a class
            </Link>
          </div>

          <p className="landing-footnote">
            Less digging through chats. More knowing what’s next.
          </p>
        </div>

        <div className="landing-art" aria-hidden="true">
          <span className="landing-art-small">THE CLASS LIST</span>
          <span className="landing-art-word">DUE</span>
          <span className="landing-art-line landing-art-line-one" />
          <span className="landing-art-line landing-art-line-two" />
          <span className="landing-art-line landing-art-line-three" />
          <span className="landing-art-caption">ALL IN ONE PLACE.</span>
        </div>
      </section>

      <footer className="landing-footer">
        <p>
          <strong>DueBird.</strong>
          <span>Made for students, by students.</span>
        </p>

        <nav aria-label="Footer">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <a href="mailto:myduebird@gmail.com">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
