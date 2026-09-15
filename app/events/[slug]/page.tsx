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
    <main className="riso-texture brochure-grid min-h-screen bg-[#2A2A2A] px-4 pt-32 pb-20 text-[#F7F2F6] sm:px-8 md:pt-36 selection:bg-[#7484FE] selection:text-[#2A2A2A]">
      <AutoPlayAnimation slug={slug} />

      <div className="mx-auto max-w-[1200px]">
        {/* Top Institutional & Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-5">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 border-2 border-white/40 bg-[#7484FE] px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider text-[#F7F2F6] shadow-[2px_2px_0px_#2A2A2A] transition hover:bg-[#5868DF]"
          >
            <span>&larr;</span>
            <span>All Sub-Events</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-widest text-[#2A2A2A] bg-[#33FF67] px-2 py-0.5 uppercase">
              Page {item.pageNumber}
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#33FF67]/90">
              # Where Passion Meets Perseverance
            </span>
          </div>
        </div>

        {/* Hero Section: Headline with Word-Pair Contrast & Official Badge */}
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="inline-block border border-white/20 bg-[#2A2A2A] px-3.5 py-1 font-mono text-xs font-black uppercase tracking-widest text-[#7484FE] shadow-[2px_2px_0px_#7484FE]">
              Official Equinox Sub-Event · {item.category}
            </span>

            {/* Headline with Word-Pair Styling (Off-White + Periwinkle Accent Contrast) */}
            <h1 className="mt-4 font-display-title text-4xl font-black uppercase tracking-tight break-words sm:text-6xl lg:text-7xl">
              <span className="mr-2 inline-block bg-[#F7F2F6] px-2.5 py-0.5 text-[#2A2A2A] shadow-[3px_3px_0px_#2A2A2A] sm:mr-3 sm:px-3 sm:shadow-[4px_4px_0px_#2A2A2A]">
                {item.headlineWordPair.blackWord}
              </span>
              <span className="break-words text-[#F7F2F6]">{item.headlineWordPair.whiteWord}</span>
            </h1>
          </div>

          {/* Rounded Badge Card */}
          <div className="shrink-0">
            <div className="flex h-[88px] min-w-[200px] items-center justify-center rounded-2xl border-2 border-white/30 bg-gradient-to-br from-[#7484FE] to-[#33FF67] px-6 py-4 shadow-[4px_4px_0px_rgba(0,0,0,0.35)] sm:min-w-[220px] sm:px-8">
              <SubEventBadge slug={item.slug} />
            </div>
          </div>
        </div>

        {/* Section Divider with Blueprint Tick Marks */}
        <div className="relative my-10 border-t border-white/20">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white/40" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/40" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white/40" />
        </div>

        {/* Main Event Overview: Dark Section matching Brochure Sections */}
        <section className="rounded-3xl border-2 border-white/20 bg-[#2A2A2A]/90 p-6 text-[#F7F2F6] shadow-[6px_6px_0px_rgba(0,0,0,0.35)] backdrop-blur-xs sm:p-10">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-[#33FF67]">
            <span className="inline-block h-2.5 w-2.5 bg-[#7484FE]" />
            <span>Official Event Description · Source of Truth</span>
          </div>
          <p className="mt-5 text-xl font-medium leading-relaxed text-[#F7F2F6] sm:text-2xl">
            {item.description}
          </p>
        </section>

        {/* Section Divider with Blueprint Tick Marks */}
        <div className="relative my-12 border-t border-white/20">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white/40" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/40" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white/40" />
        </div>

        {/* Logistics Placeholders (Clearly marked TODO, zero invented rules/dates) */}
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-display-title text-3xl font-black uppercase tracking-tight text-[#F7F2F6] sm:text-5xl">
              Event Logistics
            </h2>
            <span className="font-mono text-xs uppercase tracking-wider text-[#F7F2F6]/70">
              Official Details · Pending CIE Scheduling
            </span>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Date & Timing Placeholder */}
            <div className="rounded-2xl border-2 border-white/20 bg-[#2A2A2A]/90 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.35)] backdrop-blur-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7484FE]">
                  01 · Schedule
                </span>
                <span className="border border-transparent bg-[#33FF67] px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-[#2A2A2A]">
                  TODO
                </span>
              </div>
              <h3 className="mt-3 font-display-title text-xl font-bold uppercase text-[#F7F2F6]">
                Date &amp; Timing
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-[#F7F2F6]/85">
                {item.logistics.dateTime}
              </p>
            </div>

            {/* Venue Placeholder */}
            <div className="rounded-2xl border-2 border-white/20 bg-[#2A2A2A]/90 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.35)] backdrop-blur-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7484FE]">
                  02 · Location
                </span>
                <span className="border border-transparent bg-[#33FF67] px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-[#2A2A2A]">
                  TODO
                </span>
              </div>
              <h3 className="font-display-title mt-3 text-xl font-bold uppercase text-[#F7F2F6]">
                Venue
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-[#F7F2F6]/85">
                {item.logistics.venue}
              </p>
            </div>

            {/* Rules & Guidelines Placeholder */}
            <div className="rounded-2xl border-2 border-white/20 bg-[#2A2A2A]/90 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.35)] backdrop-blur-xs sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7484FE]">
                  03 · Regulations
                </span>
                <span className="border border-transparent bg-[#33FF67] px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-[#2A2A2A]">
                  TODO
                </span>
              </div>
              <h3 className="font-display-title mt-3 text-xl font-bold uppercase text-[#F7F2F6]">
                Rules &amp; Guidelines
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-[#F7F2F6]/85">
                {item.logistics.rules}
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Timeline Footer */}
        <div className="relative mt-16 border-t border-white/20 pt-6">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white/40" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/40" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white/40" />

          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-3 border-2 border-white/40 bg-[#7484FE] px-6 py-3 font-mono text-xs font-black uppercase tracking-wider text-[#F7F2F6] shadow-[3px_3px_0px_#2A2A2A] transition hover:bg-[#5868DF]"
            >
              <span>&larr;</span>
              <span>Back to All Events</span>
            </Link>

            {/* Page Marker */}
            <div className="flex items-center gap-4">
              <div className="leading-none text-right">
                <span className="block text-[10px] font-black tracking-widest uppercase text-[#7484FE]">
                  The
                </span>
                <span className="block text-base font-black tracking-tighter uppercase text-[#F7F2F6]">
                  Equinox 2.0
                </span>
              </div>
              <div className="font-mono text-3xl font-black tracking-widest text-[#33FF67]">
                {item.pageNumber}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
