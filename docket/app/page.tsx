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

/** Your actual logo — blue bird, yellow beak */
function Bird({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      aria-hidden
    >
      <rect width="512" height="512" rx="112" fill="#1C1C1A" />
      <g transform="translate(30,10)">
        <path d="M 168,300 Q 70,300 15,352 Q 95,340 155,325 Z" fill="#3159C4" />
        <path d="M 170,318 Q 78,330 30,378 Q 105,355 162,336 Z" fill="#2A4FB0" />
        <ellipse cx="235" cy="278" rx="102" ry="84" transform="rotate(-8 235 278)" fill="#3B6FE0" />
        <circle cx="308" cy="196" r="64" fill="#3B6FE0" />
        <path d="M 362,190 Q 396,180 414,192 Q 396,202 362,204 Z" fill="#E0A72E" />
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
    <main className="db">
      <TrackPageView eventName="landing_viewed" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {/* ═══════════════ COVER ═══════════════ */}
      <section className="cover">
        <div className="cover-top">
          <Bird size={44} />
          <span className="cover-meta">free · student-built</span>
        </div>

        <div className="cover-center">
          <p className="cover-kicker">The group chat is not a planner.</p>
          <h1 className="cover-title">
            What did we
            <br />
            have for
            <br />
            <span className="hl">homework?</span>
          </h1>
        </div>

        <div className="cover-bottom">
          <Link href="/get-started" className="cover-cta">
            Start free →
          </Link>
          <Link href="/demo" className="cover-link">
            or open the demo
          </Link>
        </div>
      </section>

      {/* ═══════════════ CHAOS → ORDER ═══════════════ */}
      <section className="split">
        <div className="split-left">
          <span className="split-label">01 — before</span>
          <h2>The group chat</h2>
          <div className="chat">
            <div className="chat-row">
              <span className="who">maya</span>
              <span>did we have the essay?</span>
            </div>
            <div className="chat-row">
              <span className="who">jay</span>
              <span>idk check canvas</span>
            </div>
            <div className="chat-row">
              <span className="who">sam</span>
              <span>wait was it friday or monday</span>
            </div>
            <div className="chat-row dim">
              <span className="who">you</span>
              <span>…</span>
            </div>
            <div className="chat-row">
              <span className="who">maya</span>
              <span>anyone??</span>
            </div>
          </div>
        </div>

        <div className="split-right">
          <span className="split-label">02 — after</span>
          <h2>DueBird</h2>
          <div className="board">
            <div className="board-head">
              <span>History · period 3</span>
              <span className="tag">2 due</span>
            </div>
            <ul>
              <li>
                <i />
                <div>
                  <b>Essay — Industrial Revolution</b>
                  <em>Due Mon · 2 pages</em>
                </div>
              </li>
              <li>
                <i />
                <div>
                  <b>Chapter 14 reading</b>
                  <em>Due Wed</em>
                </div>
              </li>
              <li className="done">
                <i className="on" />
                <div>
                  <b>Primary source notes</b>
                  <em>Done</em>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════ MANIFESTO ═══════════════ */}
      <section className="manifesto">
        <p>
          Messages get buried.
          <br />
          Screenshots get lost.
          <br />
          Someone always misses the update.
        </p>
        <p className="manifesto-end">
          DueBird keeps every class separate,
          <br />
          every assignment visible,
          <br />
          and due dates where you can actually see them.
        </p>
      </section>

      {/* ═══════════════ THREE RULES ═══════════════ */}
      <section className="rules">
        <article>
          <span>01</span>
          <h3>Classes stay separate</h3>
          <p>Each course has its own space. No endless dump of everything at once.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Assignments with context</h3>
          <p>Title, due date, a short note. Enough to know what it is at 11pm.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Share only when you want</h3>
          <p>Invite with a code. Classmates see the same list. You control it.</p>
        </article>
      </section>

      {/* ═══════════════ CLOSE ═══════════════ */}
      <section className="end">
        <Bird size={72} />
        <h2>
          One less thing
          <br />
          to stress about.
        </h2>
        <p>Free. No credit card. Built for real school weeks.</p>
        <div className="end-actions">
          <Link href="/get-started" className="cover-cta">
            Get started
          </Link>
          <Link href="/demo" className="cover-link">
            Explore demo
          </Link>
        </div>
      </section>

      <footer className="db-foot">
        <span>Made for students, by a student.</span>
        <span>
          <Link href="/privacy">Privacy</Link>
          {" · "}
          <Link href="/terms">Terms</Link>
        </span>
      </footer>
    </main>
  );
}
