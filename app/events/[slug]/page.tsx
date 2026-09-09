import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canonicalSlugs, eventsData } from "../eventsData";
import { SubEventBadge } from "../../EventGraphics";
import { AutoPlayAnimation } from "../AutoPlayAnimation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return canonicalSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = eventsData[slug];
  if (!item) return {};

  return {
    title: `${item.title} — The Equinox 2026`,
    description: item.description,
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const item = eventsData[slug];
  if (!item) notFound();

  return (
    <main className="riso-texture brochure-grid min-h-screen bg-[#2074D5] px-4 pt-32 pb-20 text-white sm:px-8 md:pt-36 selection:bg-[#F9D47B] selection:text-[#282828]">
      <AutoPlayAnimation slug={slug} />

      <div className="mx-auto max-w-[1200px]">
        {/* Top Institutional & Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/30 pb-5">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 border-2 border-white bg-[#F9D47B] px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider text-[#282828] shadow-[2px_2px_0px_#282828] transition hover:bg-white hover:text-[#2074D5]"
          >
            <span>&larr;</span>
            <span>All Sub-Events</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-widest text-[#282828] bg-[#F9D47B] px-2 py-0.5 uppercase">
              Page {item.pageNumber}
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/90">
              # Where Passion Meets Perseverance
            </span>
          </div>
        </div>

        {/* Hero Section: Headline with Word-Pair Contrast & Official Badge */}
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="inline-block border border-white/40 bg-[#0B2D6D] px-3.5 py-1 font-mono text-xs font-black uppercase tracking-widest text-[#F9D47B] shadow-[2px_2px_0px_#ffffff]">
              Official Equinox Sub-Event · {item.category}
            </span>

            {/* Headline with Word-Pair Styling (Golden Yellow + White Contrast) */}
            <h1 className="mt-4 font-display-title text-4xl font-black uppercase tracking-tight break-words sm:text-6xl lg:text-7xl">
              <span className="mr-2 inline-block bg-[#F9D47B] px-2.5 py-0.5 text-[#282828] shadow-[3px_3px_0px_#282828] sm:mr-3 sm:px-3 sm:shadow-[4px_4px_0px_#282828]">
                {item.headlineWordPair.blackWord}
              </span>
              <span className="break-words text-white">{item.headlineWordPair.whiteWord}</span>
            </h1>
          </div>

          {/* Authentic Coral Rounded Badge Card from Brochure Pages 05 & 06 */}
          <div className="shrink-0">
            <div className="flex h-[88px] min-w-[200px] items-center justify-center rounded-2xl border-2 border-white bg-[#EB547C] px-6 py-4 shadow-[4px_4px_0px_rgba(0,0,0,0.25)] sm:min-w-[220px] sm:px-8">
              <SubEventBadge slug={item.slug} />
            </div>
          </div>
        </div>

        {/* Section Divider with Blueprint Tick Marks */}
        <div className="relative my-10 border-t border-white/40">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/60" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white" />
        </div>

        {/* Main Event Overview: Royal Deep Block matching Brochure Sections */}
        <section className="rounded-3xl border-2 border-white/40 bg-[#0B2D6D]/80 p-6 text-white shadow-[6px_6px_0px_rgba(0,0,0,0.25)] backdrop-blur-xs sm:p-10">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-[#F9D47B]">
            <span className="inline-block h-2.5 w-2.5 bg-[#EB547C]" />
            <span>Official Event Description · Source of Truth</span>
          </div>
          <p className="mt-5 text-xl font-medium leading-relaxed text-white sm:text-2xl">
            {item.description}
          </p>
        </section>

        {/* Section Divider with Blueprint Tick Marks */}
        <div className="relative my-12 border-t border-white/40">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/60" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white" />
        </div>

        {/* Logistics Placeholders (Clearly marked TODO, zero invented rules/dates) */}
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-display-title text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Event Logistics
            </h2>
            <span className="font-mono text-xs uppercase tracking-wider text-white/80">
              Official Details · Pending CIE Scheduling
            </span>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Date & Timing Placeholder */}
            <div className="rounded-2xl border-2 border-white/40 bg-[#0B2D6D]/80 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F9D47B]">
                  01 · Schedule
                </span>
                <span className="border border-white/60 bg-[#EB547C] px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white">
                  TODO
                </span>
              </div>
              <h3 className="mt-3 font-display-title text-xl font-bold uppercase text-white">
                Date &amp; Timing
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-white/85">
                {item.logistics.dateTime}
              </p>
            </div>

            {/* Venue Placeholder */}
            <div className="rounded-2xl border-2 border-white/40 bg-[#0B2D6D]/80 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F9D47B]">
                  02 · Location
                </span>
                <span className="border border-white/60 bg-[#EB547C] px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white">
                  TODO
                </span>
              </div>
              <h3 className="font-display-title mt-3 text-xl font-bold uppercase text-white">
                Venue
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-white/85">
                {item.logistics.venue}
              </p>
            </div>

            {/* Rules & Guidelines Placeholder */}
            <div className="rounded-2xl border-2 border-white/40 bg-[#0B2D6D]/80 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-xs sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F9D47B]">
                  03 · Regulations
                </span>
                <span className="border border-white/60 bg-[#EB547C] px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white">
                  TODO
                </span>
              </div>
              <h3 className="font-display-title mt-3 text-xl font-bold uppercase text-white">
                Rules &amp; Guidelines
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-white/85">
                {item.logistics.rules}
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Timeline Footer (Page Style from Pages 03, 05, 06) */}
        <div className="relative mt-16 border-t border-white/40 pt-6">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/60" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white" />

          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-3 border-2 border-white bg-[#F9D47B] px-6 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#282828] shadow-[3px_3px_0px_#282828] transition hover:bg-white hover:text-[#2074D5]"
            >
              <span>&larr;</span>
              <span>Back to All Events</span>
            </Link>

            {/* Page Marker */}
            <div className="flex items-center gap-4">
              <div className="leading-none text-right">
                <span className="block text-[10px] font-black tracking-widest uppercase text-[#EB547C]">
                  The
                </span>
                <span className="block text-base font-black tracking-tighter uppercase text-[#F9D47B]">
                  Equinox 2.0
                </span>
              </div>
              <div className="font-mono text-3xl font-black tracking-widest text-white">
                {item.pageNumber}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
