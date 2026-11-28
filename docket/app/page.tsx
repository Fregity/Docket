
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import TrackPageView from "@/components/TrackPageView";
import LandingSampleCard from "@/components/LandingSampleCard";
import LandingLiveFeed from "@/components/LandingLiveFeed";

const displayFont = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-landing-display",
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-landing-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DueBird | Shared Classwork Tracker",
  description:
    "One shared assignment list for your class. Add work once, and everyone can see what's due.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DueBird | Shared Classwork Tracker",
    description: "A shared assignment list for your class.",
    url: "https://myduebird.com",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DueBird | Shared Classwork Tracker",
    description: "A shared assignment list for your class.",
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
    <main
      className={`${displayFont.variable} ${bodyFont.variable} landing-page`}
    >
      <TrackPageView eventName="landing_viewed" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className="landing-header">
        <Link href="/" className="landing-wordmark" aria-label="DueBird home">
          <Image
            src="/icons/icon-192.png"
            alt=""
            width={40}
            height={40}
            priority
          />
          <span>DueBird</span>
        </Link>

        <nav className="landing-nav" aria-label="Main navigation">
          <Link href="/login" className="landing-login">
            Log in
          </Link>
          <Link href="/get-started" className="landing-signup">
            Sign up
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <h1>
            Keep track
            <br />
            of what’s due.
          </h1>

          <p className="landing-description">
            One shared assignment list for your class. Add work once, and
            everyone sees what’s due.
          </p>

          <div className="landing-actions">
            <Link href="/get-started" className="landing-primary">
              Create your free account
            </Link>
            <Link href="/join" className="landing-secondary">
              Join a class
            </Link>
          </div>

          <p className="landing-footnote">
            No more digging through the group chat.
          </p>
        </div>

        <LandingSampleCard />
      </section>

      <LandingLiveFeed />

      <footer className="landing-footer">
        <p>
          <strong>DueBird</strong>
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
