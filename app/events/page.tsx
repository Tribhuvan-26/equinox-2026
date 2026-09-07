import type { Metadata } from "next";
import { event, events } from "@/lib/content";
import { EventCard, PageTransition, SectionHeading } from "../ui";

export const metadata: Metadata = {
  title: `Sub-Events — ${event.name} ${event.edition}`,
  description: `The 10 official sub-events at The Equinox 2.0: Spotlight, Crossroads, Startup Expo, Brand Battles, IPL Auction, Hustle Mania, Internship Drive, Startup Poly, E-Cell Meet, and Pitch Deck.`,
};

export default function EventsPage() {
  return (
    <PageTransition>
      <main className="riso-texture brochure-grid min-h-screen bg-[#1B5FD6] text-white selection:bg-[#F7CA50] selection:text-[#0d0e15]">
        <section className="mx-auto max-w-[1400px] px-4 pt-40 pb-24 sm:px-8">
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
