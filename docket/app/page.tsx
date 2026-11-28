import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Dela_Gothic_One, Familjen_Grotesk } from "next/font/google";
import TrackPageView from "@/components/TrackPageView";
import LandingClothesline from "@/components/LandingClothesline";
import styles from "./landing.module.css";

const displayFont = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-landing-display",
  display: "swap",
});

const bodyFont = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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

const word = (k: number): CSSProperties => ({ ["--k" as string]: k });

export default function LandingPage() {
  return (
    <main
      className={`${displayFont.variable} ${bodyFont.variable} ${styles.page}`}
    >
      <TrackPageView eventName="landing_viewed" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <header className={styles.header}>
        <Link href="/" className={styles.wordmark} aria-label="DueBird home">
          <Image
            src="/icons/icon-192.png"
            alt=""
            width={46}
            height={46}
            className={styles.logo}
            priority
          />
          <span>DueBird</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/login" className={styles.login}>
            Log in
          </Link>
          <Link href="/get-started" className={styles.signup}>
            Sign up
          </Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <h1 aria-label="Keep track of what’s due.">
          <span className={styles.line} aria-hidden="true">
            <span className={styles.word} style={word(0)}>Keep track</span>
          </span>
          <span className={styles.line} aria-hidden="true">
            <span className={styles.word} style={word(1)}>of what’s</span>
          </span>
          <span className={styles.line} aria-hidden="true">
            <span className={styles.word} style={word(2)}>due.</span>
          </span>
        </h1>
      </section>

      <LandingClothesline />

      <section className={styles.cta}>
        <div>
          <p className={styles.description}>
            One shared assignment list for your class. Add work once, and
            everyone sees what’s due.
          </p>
          <p className={styles.footnote}>
            No more digging through the group chat.
          </p>
        </div>

        <div className={styles.actions}>
          <Link href="/login" className={styles.secondary}>
            Join another class
          </Link>
          <Link href="/get-started" className={styles.primary}>
            Create your free account
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
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