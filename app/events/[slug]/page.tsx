import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canonicalSlugs, eventsData } from "../eventsData";
import { SubEventBadge } from "../../BrochureGraphics";
import { PendingTrigger } from "../PendingTrigger";

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
    <main className="riso-texture brochure-grain min-h-screen bg-[#174ae8] px-4 pt-32 pb-20 text-white sm:px-8 md:pt-36">
      {/* Consumes one-time chatbot-set pending animation trigger */}
      <PendingTrigger slug={slug} />

      <div className="mx-auto max-w-[1200px]">
        {/* Top Brochure Institutional & Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/30 pb-5">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 border-2 border-white bg-white px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider text-[#174ae8] transition hover:bg-transparent hover:text-white"
          >
            <span>&larr;</span>
            <span>All Sub-Events</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-widest text-[#0d0e15] bg-white px-2 py-0.5 uppercase">
              Page {item.pageNumber}
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/90">
              # Where Passion Meets Perseverance
            </span>
          </div>
        </div>

        {/* Hero Section: Brochure Headline with Word-Pair Contrast & Official Badge */}
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-block border border-white/40 bg-[#0d0e15] px-3.5 py-1 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[2px_2px_0px_#ffffff]">
              Official Prospectus Sub-Event · {item.category}
            </span>

            {/* Headline with Brochure Word-Pair Styling (Black + White Contrast) */}
            <h1 className="mt-4 font-brochure-title text-4xl font-black uppercase tracking-tight sm:text-6xl lg:text-8xl">
              <span className="mr-2 inline-block bg-white px-2.5 py-0.5 text-[#0d0e15] shadow-[3px_3px_0px_#0d0e15] sm:mr-3 sm:px-3 sm:shadow-[4px_4px_0px_#0d0e15]">
                {item.headlineWordPair.blackWord}
              </span>
              <span className="break-words text-white">{item.headlineWordPair.whiteWord}</span>
            </h1>
          </div>

          {/* Authentic Rounded Badge Card from Brochure Pages 05 & 06 */}
          <div className="shrink-0">
            <div className="flex h-[88px] min-w-[200px] items-center justify-center rounded-2xl border-2 border-white bg-white/10 px-6 py-4 shadow-[4px_4px_0px_rgba(0,0,0,0.25)] sm:min-w-[220px] sm:px-8">
              <SubEventBadge slug={item.slug} />
            </div>
          </div>
        </div>

        {/* Section Divider with Brochure Blueprint Tick Marks */}
        <div className="relative my-10 border-t border-white/40">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/60" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white" />
        </div>

        {/* Main Event Overview: Solid Black Contrast Block matching Brochure Sections */}
        <section className="border-2 border-white/40 bg-[#0d0e15] p-6 text-white shadow-[6px_6px_0px_#000000] sm:p-10">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-white/70">
            <span className="inline-block h-2.5 w-2.5 bg-white" />
            <span>Official Event Description · Prospectus Source of Truth</span>
          </div>
          <p className="mt-5 text-xl font-medium leading-relaxed text-white sm:text-2xl">
            {item.description}
          </p>
        </section>

        {/* Section Divider with Brochure Blueprint Tick Marks */}
        <div className="relative my-12 border-t border-white/40">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/60" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white" />
        </div>

        {/* Logistics Placeholders (Clearly marked TODO, zero invented rules/dates) */}
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-brochure-title text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Event Logistics
            </h2>
            <span className="font-mono text-xs uppercase tracking-wider text-white/80">
              Official Details · Pending CIE Scheduling
            </span>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Date & Timing Placeholder */}
            <div className="border-2 border-white/40 bg-[#0d0e15] p-6 shadow-[5px_5px_0px_#000000]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/70">
                  01 · Schedule
                </span>
                <span className="border border-white/60 bg-white/15 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white">
                  TODO
                </span>
              </div>
              <h3 className="mt-3 font-brochure-title text-xl font-bold uppercase text-white">
                Date &amp; Timing
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-white/85">
                {item.logistics.dateTime}
              </p>
            </div>

            {/* Venue Placeholder */}
            <div className="border-2 border-white/40 bg-[#0d0e15] p-6 shadow-[5px_5px_0px_#000000]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/70">
                  02 · Location
                </span>
                <span className="border border-white/60 bg-white/15 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white">
                  TODO
                </span>
              </div>
              <h3 className="font-brochure-title mt-3 text-xl font-bold uppercase text-white">
                Venue
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-white/85">
                {item.logistics.venue}
              </p>
            </div>

            {/* Rules & Guidelines Placeholder */}
            <div className="border-2 border-white/40 bg-[#0d0e15] p-6 shadow-[5px_5px_0px_#000000] sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white/70">
                  03 · Regulations
                </span>
                <span className="border border-white/60 bg-white/15 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white">
                  TODO
                </span>
              </div>
              <h3 className="font-brochure-title mt-3 text-xl font-bold uppercase text-white">
                Rules &amp; Guidelines
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-white/85">
                {item.logistics.rules}
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Timeline Footer (Brochure Style from Pages 03, 05, 06) */}
        <div className="relative mt-16 border-t border-white/40 pt-6">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/60" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white" />

          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-3 border-2 border-white bg-white px-6 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#174ae8] transition hover:bg-transparent hover:text-white"
            >
              <span>&larr;</span>
              <span>Back to All Events</span>
            </Link>

            {/* Brochure Page Marker */}
            <div className="flex items-center gap-4">
              <div className="leading-none text-right">
                <span className="block text-[10px] font-black tracking-widest uppercase text-white/70">
                  The
                </span>
                <span className="block text-base font-black tracking-tighter uppercase text-white">
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
