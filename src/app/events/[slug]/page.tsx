import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canonicalSlugs, eventsData } from "../eventsData";
import { SubEventBadge } from "../../EventGraphics";
import { EventPageReveal } from "../EventPageReveal";
import { EVENT_SPOCS } from "@/chatbot/data/events";
import { Phone, ArrowUpRight, Ticket } from "lucide-react";
import { SITE_NAME, subEventJsonLd } from "@/lib/seo";

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
    title: item.title,
    description: item.description,
    alternates: { canonical: `/events/${slug}` },
    openGraph: {
      title: `${item.title} — ${SITE_NAME}`,
      description: item.description,
      url: `/events/${slug}`,
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const item = eventsData[slug];
  if (!item) notFound();

  const spocs = EVENT_SPOCS[slug] || [];
  const isInternshipDrive = slug === "internship-drive";
  const bgClasses = isInternshipDrive ? "riso-texture brochure-grid" : "";

  return (
    <main className={`${bgClasses} min-h-screen w-full max-w-full overflow-x-clip bg-[#2A2A2A] px-4 pt-24 pb-16 text-[#F7F2F6] sm:px-8 sm:pt-32 sm:pb-20 md:pt-36 selection:bg-[#7484FE] selection:text-[#2A2A2A]`}>
      {/* Sub-event structured data, linked to the summit as its superEvent. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(subEventJsonLd({ name: item.title, slug, description: item.description })),
        }}
      />
      <EventPageReveal slug={slug}>
        <div className="mx-auto max-w-[1200px]">
        {/* Top Institutional & Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-5">
          <div className="flex items-center gap-2">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 border-2 border-white/40 bg-[#7484FE] px-3.5 py-1.5 font-mono text-xs font-black uppercase tracking-wider text-[#F7F2F6] shadow-[2px_2px_0px_#2A2A2A] transition hover:bg-[#5868DF] active:scale-95"
            >
              <span>&larr;</span>
              <span>All Sub-Events</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 border border-white/20 bg-[#151515] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/80 shadow-[2px_2px_0px_#2A2A2A] transition hover:border-[#33FF67] hover:bg-white/10 hover:text-white active:scale-95"
            >
              <span>Home</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-widest text-[#2A2A2A] bg-[#33FF67] px-2 py-0.5 uppercase">
              Page {item.pageNumber}
            </span>
            <span className="hidden font-mono text-xs font-bold uppercase tracking-wider text-[#33FF67]/90 sm:inline">
              # Where Passion Meets Perseverance
            </span>
          </div>
        </div>

        {/* Hero Section: Headline with Word-Pair Contrast & Official Badge */}
        <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="inline-block border border-white/20 bg-[#2A2A2A] px-3.5 py-1 font-mono text-xs font-black uppercase tracking-widest text-[#7484FE] shadow-[2px_2px_0px_#7484FE]">
              Official Equinox Sub-Event · {item.category}
            </span>

            {/* Headline with Word-Pair Styling (Off-White + Periwinkle Accent Contrast) */}
            <h1 className="mt-4 font-display-title text-3xl font-black uppercase tracking-tight hyphens-none sm:text-6xl lg:text-7xl">
              <span className="mr-2 inline-block bg-[#F7F2F6] px-2.5 py-0.5 text-[#2A2A2A] shadow-[3px_3px_0px_#2A2A2A] sm:mr-3 sm:px-3 sm:shadow-[4px_4px_0px_#2A2A2A]">
                {item.headlineWordPair.blackWord}
              </span>
              <span className="text-[#F7F2F6]">{item.headlineWordPair.whiteWord}</span>
            </h1>
          </div>

          {/* Rounded Badge Card */}
          <div className="w-full shrink-0 sm:w-auto">
            <div className="flex h-[76px] w-full items-center justify-center rounded-2xl border-2 border-white/30 bg-gradient-to-br from-[#7484FE] to-[#33FF67] px-4 py-3 shadow-[4px_4px_0px_rgba(0,0,0,0.35)] sm:h-[88px] sm:min-w-[220px] sm:px-8">
              <SubEventBadge slug={item.slug} />
            </div>
          </div>
        </div>

        {/* Section Divider with Blueprint Tick Marks */}
        <div className="relative my-8 border-t border-white/20 sm:my-10">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white/40" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/40" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white/40" />
        </div>

        {/* 1. Main Event Overview: Dark Section matching Brochure Sections */}
        <section className="rounded-3xl border-2 border-white/20 bg-[#2A2A2A]/90 p-5 text-[#F7F2F6] shadow-[6px_6px_0px_rgba(0,0,0,0.35)] backdrop-blur-xs sm:p-10">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-[#33FF67]">
            <span className="inline-block h-2.5 w-2.5 bg-[#7484FE]" />
            <span>Event Description</span>
          </div>
          <p className="mt-4 text-lg font-medium leading-relaxed text-[#F7F2F6] sm:mt-5 sm:text-2xl">
            {item.description}
          </p>
        </section>

        {/* Section Divider with Blueprint Tick Marks */}
        <div className="relative my-8 border-t border-white/20 sm:my-10">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white/40" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/40" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white/40" />
        </div>

        {/* 2. Event SPOCs / Contacts Section */}
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-display-title text-2xl font-black uppercase tracking-tight text-[#F7F2F6] sm:text-4xl">
              Event SPOCs
            </h2>
            <span className="font-mono text-xs uppercase tracking-wider text-[#33FF67]">
              Official Points of Contact · Direct Coordination
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spocs.map((spoc, index) => {
              const telHref = `tel:${spoc.phoneRaw || spoc.phone.replace(/[^0-9+]/g, "")}`;
              const spocNum = String(index + 1).padStart(2, "0");
              return (
                <div
                  key={`${spoc.name}-${spoc.phone}`}
                  className="group relative flex flex-col justify-between rounded-2xl border-2 border-white/20 bg-[#2A2A2A]/90 p-5 shadow-[4px_4px_0px_rgba(0,0,0,0.35)] backdrop-blur-xs transition hover:border-[#7484FE]/80 sm:p-6"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7484FE]">
                        SPOC {spocNum}
                      </span>
                      <span className="flex items-center gap-1.5 border border-white/10 bg-[#1E1E1E] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#33FF67]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#33FF67] animate-pulse" />
                        Direct Contact
                      </span>
                    </div>

                    <h3 className="mt-4 font-display-title text-xl font-bold uppercase text-[#F7F2F6] sm:text-2xl">
                      {spoc.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[#F7F2F6]/60">
                      Sub-Event Coordinator
                    </p>
                  </div>

                  <a
                    href={telHref}
                    className="mt-6 flex items-center justify-between rounded-xl border border-white/20 bg-[#1E1E1E] px-4 py-3 font-mono text-sm font-bold text-[#33FF67] transition group-hover:border-[#33FF67] group-hover:bg-[#33FF67]/10"
                  >
                    <span className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-[#7484FE]" />
                      <span>{spoc.phone}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#33FF67]" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section Divider with Blueprint Tick Marks */}
        <div className="relative my-8 border-t border-white/20 sm:my-10">
          <div className="absolute -top-1.5 left-0 h-3 w-[2px] bg-white/40" />
          <div className="absolute -top-1.5 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-white/40" />
          <div className="absolute -top-1.5 right-0 h-3 w-[2px] bg-white/40" />
        </div>

        {/* 3. Summit Registration / Action Area */}
        <section className="rounded-3xl border-2 border-white/20 bg-[#2A2A2A]/90 p-5 shadow-[6px_6px_0px_rgba(0,0,0,0.35)] backdrop-blur-xs sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#7484FE]">
                  Summit Registration
                </span>
                <span className="rounded bg-[#33FF67] px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-[#2A2A2A]">
                  Register Now
                </span>
              </div>
              <h3 className="mt-2 font-display-title text-xl font-bold uppercase text-[#F7F2F6] sm:text-2xl">
                Participate in {item.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#F7F2F6]/75 sm:text-base">
                Official registrations for The Equinox 2.0 summit passes and sub-event delegate spots are centralized through the official registration portal.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              {item.applyUrl && (
                <a
                  href={item.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 border-2 border-white/40 bg-[#33FF67] px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#2A2A2A] shadow-[3px_3px_0px_#2A2A2A] transition hover:bg-[#2BE05A] hover:shadow-[4px_4px_0px_#7484FE]"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 border-2 border-white/40 bg-[#7484FE] px-6 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-[#F7F2F6] shadow-[3px_3px_0px_#2A2A2A] transition hover:bg-[#5868DF] hover:shadow-[4px_4px_0px_#33FF67]"
              >
                <Ticket className="h-4 w-4" />
                <span>Registration Desk</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom Timeline Footer */}
        <div className="relative mt-12 border-t border-white/20 pt-6 sm:mt-16">
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
      </EventPageReveal>
    </main>
  );
}
