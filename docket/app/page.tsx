import type { Metadata } from "next";
import Link from "next/link";
import TrackPageView from "@/components/TrackPageView";

export const metadata: Metadata = {
  title: "DueBird — stop asking the group chat",
  description:
    "A free homework planner built by a student. Classes, assignments, due dates — shared only with people who need them.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DueBird — stop asking the group chat",
    description:
      "Free homework planner for students. One place for classes, assignments, and due dates.",
    url: "https://myduebird.com",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DueBird — stop asking the group chat",
    description:
      "Free homework planner for students. One place for classes, assignments, and due dates.",
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

/** Your actual logo mark — blue bird, yellow beak, dark rounded square */
function DueBirdMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      aria-hidden
      className="bird-logo"
    >
      <rect width="512" height="512" rx="112" fill="#1C1C1A" />
      <g transform="translate(30,10)">
        <path
          d="M 168,300 Q 70,300 15,352 Q 95,340 155,325 Z"
          fill="#3159C4"
        />
        <path
          d="M 170,318 Q 78,330 30,378 Q 105,355 162,336 Z"
          fill="#2A4FB0"
        />
        <ellipse
          cx="235"
          cy="278"
          rx="102"
          ry="84"
          transform="rotate(-8 235 278)"
          fill="#3B6FE0"
        />
        <circle cx="308" cy="196" r="64" fill="#3B6FE0" />
        <path
          d="M 362,190 Q 396,180 414,192 Q 396,202 362,204 Z"
          fill="#E0A72E"
        />
        <ellipse cx="258" cy="278" rx="56" ry="70" fill="#C1652E" />
        <ellipse cx="240" cy="335" rx="34" ry="27" fill="#F2ECDD" />
        <path
          d="M 270,222 C 232,232 198,252 182,282 C 174,297 172,312 178,325"
          fill="none"
          stroke="#2A4FB0"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="322" cy="182" r="7.5" fill="#1C1C1A" />
      </g>
      <rect x="95" y="415" width="322" height="14" rx="7" fill="#3A3530" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main className="landing">
      <TrackPageView eventName="landing_viewed" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {/* Rail — fixed identity strip (Stripe Press energy) */}
      <aside className="rail" aria-label="Site">
        <Link href="/" className="rail-logo" aria-label="DueBird home">
          <DueBirdMark size={40} />
        </Link>
        <div className="rail-marks" aria-hidden>
          <span />
          <span />
          <span className="active" />
          <span />
          <span />
        </div>
        <span className="rail-meta">v0</span>
      </aside>

      <div className="stage">
        {/* Hero */}
        <header className="band band-hero">
          <div className="band-inner">
            <p className="eyebrow">
              <span className="dot" />
              free · built by a student · no ads
            </p>

            <h1 className="display">
              What did we
              <br />
              have for <em className="mark">homework?</em>
            </h1>

            <p className="lede">
              The group chat is not a planner. DueBird keeps every class,
              assignment, and due date in one place — and only shares them
              with people who actually need them.
            </p>

            <div className="actions">
              <Link href="/get-started" className="btn-ink">
                Start free
              </Link>
              <Link href="/demo" className="btn-ghost">
                Open the demo
              </Link>
            </div>
          </div>

          <div className="pages" aria-hidden>
            <div className="page page-chat">
              <div className="page-top">
                <span className="pips">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="page-label">period 3 · group chat</span>
              </div>
              <div className="page-body">
                <p>
                  <b>maya</b> did we have the essay?
                </p>
                <p>
                  <b>jay</b> idk check canvas
                </p>
                <p>
                  <b>sam</b> wait was it friday or monday
                </p>
                <p className="fade">
                  <b>you</b> …
                </p>
              </div>
            </div>

            <div className="page page-due">
              <div className="page-top">
                <span className="page-label">History · period 3</span>
                <span className="pill">2 due</span>
              </div>
              <ul className="due-list">
                <li>
                  <span className="box" />
                  <div>
                    <strong>Essay — Industrial Revolution</strong>
                    <small>Due Mon · 2 pages</small>
                  </div>
                </li>
                <li>
                  <span className="box" />
                  <div>
                    <strong>Chapter 14 reading</strong>
                    <small>Due Wed</small>
                  </div>
                </li>
                <li className="done">
                  <span className="box checked" />
                  <div>
                    <strong>Primary source notes</strong>
                    <small>Done</small>
                  </div>
                </li>
              </ul>
            </div>

            <div className="scrap">
              no more
              <br />
              “was it due today?”
            </div>
          </div>
        </header>

        {/* Color field band */}
        <section className="band band-why">
          <div className="band-inner narrow">
            <h2 className="section-title">
              The group chat
              <br />
              is not a planner.
            </h2>
            <p className="section-body">
              Messages get buried. Screenshots get lost. Someone always
              misses the update. DueBird keeps every class separate, every
              assignment visible, and due dates where you can actually see
              them — alone or with the people in the class.
            </p>
          </div>
        </section>

        {/* Three truths */}
        <section className="band band-truths">
          <div className="truth-grid">
            <article className="truth">
              <span className="truth-num">01</span>
              <h3>Classes stay separate</h3>
              <p>
                No dumping everything into one endless list. Each course has
                its own space so you can see what’s actually due for what.
              </p>
            </article>
            <article className="truth">
              <span className="truth-num">02</span>
              <h3>Assignments with context</h3>
              <p>
                Title, due date, a short note. Enough to know what it is
                without opening Canvas at 11pm.
              </p>
            </article>
            <article className="truth">
              <span className="truth-num">03</span>
              <h3>Share only when you want</h3>
              <p>
                Create a class, invite with a code. Classmates see the same
                list. You control it — not the group chat.
              </p>
            </article>
          </div>
        </section>

        {/* Close */}
        <section className="band band-close">
          <div className="band-inner center">
            <DueBirdMark size={48} />
            <h2 className="section-title tight">
              One less thing
              <br />
              to stress about.
            </h2>
            <p className="section-body">
              Free. No credit card. Built for real school weeks, not
              productivity theater.
            </p>
            <div className="actions">
              <Link href="/get-started" className="btn-ink">
                Get started
              </Link>
              <Link href="/demo" className="btn-ghost">
                Explore demo
              </Link>
            </div>
          </div>
        </section>

        <footer className="foot">
          <span>Made for students, by a student.</span>
          <span className="foot-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </span>
        </footer>
      </div>
    </main>
  );
}
