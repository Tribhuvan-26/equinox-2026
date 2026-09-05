import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { event, nav } from "@/lib/content";
import PillNav from "./PillNav";
import { FooterMinimal } from "./FooterMinimal";
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
  title: `${event.name} ${event.year} — ${event.date}`,
  description: `${event.name} ${event.year}: ${event.tagline} builder. ${event.date}, ${event.venue}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /* Tells the router our smooth scrolling is deliberate, so it suppresses
         it during route transitions instead of warning. */
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="night flex min-h-full flex-col">
        <PillNav
          logo="/logo.svg"
          logoAlt={`${event.name} ${event.year} Logo`}
          items={nav}
          baseColor="#0a0812"  // night background
          pillColor="#a78bfa"  // beam purple
          hoveredPillTextColor="#0a0812"  // night background
          pillTextColor="#edeaf5"  // fg color
          ease="power3.out"
          initialLoadAnimation={true}
        />
        <main className="flex-1">{children}</main>
        <FooterMinimal />
      </body>
    </html>
  );
}
