import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { event, nav } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_ORIGIN, summitJsonLd } from "@/lib/seo";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { Chatbot } from "./Chatbot";
import { OverlayAnimationHost } from "./overlay-animations";
import PreIntroCover from "@/components/PreIntroCover";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/* Utility face for scannable data — times, fees, prize pools, eyebrows. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Display face. Syne widens as it gets heavier, so the wordmark carries the
   day/night tension the whole design is built on. */
const display = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  /* Makes every relative URL below — canonicals, OG images — absolute. */
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `${SITE_NAME} — E-Summit ${event.year} at ${event.institution}`,
    /* Page titles set only their own half; this appends the brand. */
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  category: "event",
  authors: [{ name: event.host }],
  creator: event.host,
  publisher: event.host,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: SITE_ORIGIN,
    title: `${SITE_NAME} — E-Summit ${event.year}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — E-Summit ${event.year}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /* Tells the router our smooth scrolling is deliberate, so it suppresses
         it during route transitions instead of warning. */
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* SpiderIntro (the CIE->EQUINOX opener) animates this the instant it
            mounts. Preloading it here starts the fetch/decode during initial
            page load instead of when the intro's own effect runs, which is
            what was causing the stutter on the very first reveal (the C). */}
        <link rel="preload" as="image" href="/equinox-logo.svg" />
        {/* Event structured data: lets search engines show the dates, venue and
            sub-events as a rich result instead of a plain link. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(summitJsonLd()) }}
        />
      </head>
      <body className="night flex min-h-full flex-col" suppressHydrationWarning>
        <PreIntroCover />
        <NavBar
          items={nav.map((item) => ({ name: item.label, url: item.href }))}
        />
        <main className="flex-1">{children}</main>
        <Footer />
        <Chatbot />
        <OverlayAnimationHost />
      </body>
    </html>
  );
}
