import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Fraunces } from "next/font/google";
import { ThemeSync } from "@/components/ThemeSync";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myduebird.com"),
  title: {
    default: "DueBird — Homework tracker for students",
    template: "%s | DueBird",
  },
  description:
    "Keep your homework organized. Add assignments, see what's due, and share classwork with friends using DueBird.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DueBird",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "DueBird",
    title: "DueBird — Homework tracker for students",
    description:
      "Keep your homework organized. Add assignments, see what's due, and share classwork with friends.",
    url: "https://myduebird.com",
  },
  twitter: {
    card: "summary",
    title: "DueBird — Homework tracker for students",
    description:
      "Keep your homework organized. Add assignments, see what's due, and share classwork with friends.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A18" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before hydration so the correct theme class is on <html> before the
// very first paint — avoids a flash of the wrong theme on load. Reads the
// user's saved preference (set via the toggle in Settings); falls back to
// the OS-level preference if they've never chosen one
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('duebird-theme');
    var isDark = stored === 'dark' || (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}