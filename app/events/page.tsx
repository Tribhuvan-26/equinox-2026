import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { event, events } from "@/lib/content";
import { EventCard, PageTransition, SectionHeading } from "../ui";

export const metadata: Metadata = {
  title: `Sub-Events — ${event.name} ${event.edition}`,
  description: `The 10 official sub-events at The Equinox 2.0: Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, Startup Poly, E-Cell Meet, and Pitch Deck.`,
};

export default function EventsPage() {
  return (
    <PageTransition>
      <main className="riso-texture brochure-grid min-h-screen bg-[#2A2A2A] text-white selection:bg-[#7484FE] selection:text-[#2A2A2A]">
        <section className="mx-auto max-w-[1400px] px-4 pt-28 pb-24 sm:px-8 sm:pt-36">
          <div className="mb-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 rounded-full border-2 border-white/30 bg-[#151515] px-4 py-2 font-mono text-xs font-black uppercase tracking-wider text-[#F7F2F6] shadow-[3px_3px_0px_#7484FE] transition-all hover:border-[#33FF67] hover:bg-[#202020] hover:text-[#33FF67] hover:shadow-[3px_3px_0px_#33FF67] active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 text-[#33FF67] transition-transform group-hover:-translate-x-1" />
              <span>Back to Homepage</span>
            </Link>
          </div>

          <SectionHeading
            eyebrow="Brochure Pages 05 & 06"
            heading={`All ${events.length} Sub-Events`}
          />
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((item) => (
              <EventCard key={item.slug} event={item} />
            ))}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
