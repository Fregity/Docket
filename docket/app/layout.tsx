import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import { ThemeSync } from "@/components/ThemeSync";
import { OnboardingTransitions } from "@/components/OnboardingTransitions";
import "./globals.css";

const editorial = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myduebird.com"),
  title: {
    default: "DueBird — Free Homework Planner for Students",
    template: "%s | DueBird",
  },
  description:
    "Organize classes, homework assignments, and due dates in one place with DueBird, a free homework planner built for students.",
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
    title: "DueBird — Free Homework Planner for Students",
    description:
      "Organize classes, homework assignments, and due dates in one place with a free planner built for students.",
    url: "https://myduebird.com",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DueBird — Free Homework Planner for Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DueBird — Free Homework Planner for Students",
    description:
      "Organize classes, homework assignments, and due dates in one place with a free planner built for students.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F6F1" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A18" },
  ],
  width: "device-width",
  initialScale: 1,
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('duebird-theme');
    var isDark = stored === 'dark' || (stored !== 'light' && (stored === 'system' ? window.matchMedia('(prefers-color-scheme: dark)').matches : true));
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
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${editorial.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans">
        <ThemeSync />
        <OnboardingTransitions />
        {children}
      </body>
    </html>
  );
}
