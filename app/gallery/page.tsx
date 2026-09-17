import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Ticket } from "lucide-react";
import GallerySection from "@/components/GallerySection";
import { event } from "@/lib/content";

export const metadata: Metadata = {
  title: `Previous Event Gallery — ${event.name} ${event.edition}`,
  description: `Browse photos and memories from previous editions of ${event.name} and CIE MLRIT summits. Drop your photos into public/gallery to display them live.`,
};

export default function GalleryPage() {
  return (
    <div className="relative min-h-screen riso-texture bg-[#141414] text-[#F7F2F6] selection:bg-[#33FF67] selection:text-[#141414]">
      {/* Background Decorative Mesh / Ambient Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-[#7484FE]/10 blur-[120px]" />
        <div className="absolute top-2/3 -right-48 h-96 w-96 rounded-full bg-[#33FF67]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-32 pb-24 sm:pt-40">
        {/* Top Breadcrumb / Return Nav */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70 transition-colors hover:text-[#33FF67]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mx-auto mt-6 max-w-[1400px] px-4 sm:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#33FF67]">
                  Archived Editions
                </span>
                <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#F7F2F6]/80">
                  MLRIT CIE
                </span>
              </div>
              <h1
                className="mt-3 font-display-title font-black leading-[0.9] tracking-tighter text-[#F7F2F6]"
                style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)" }}
              >
                Previous Event Gallery
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[#F7F2F6]/90 sm:text-xl max-w-2xl">
                Relive the electric energy, intense pitch battles, overnight hackathon builds,
                and victory celebrations from past editions of Equinox and CIE summits.
              </p>
            </div>

            {/* Live Gallery Status Card */}
            <div className="rounded-2xl border border-white/10 bg-[#1b1c22]/80 p-5 backdrop-blur-md max-w-md">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#33FF67]/15 text-[#33FF67]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-[#F7F2F6]">
                    32 Archival Photos Live
                  </p>
                  <p className="font-mono text-[11px] text-[#33FF67]">
                    Original Sony &amp; Fuji Camera Archives
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#F7F2F6]/75">
                Swipe or drag across the infinite canvas in any direction to explore archival photos.
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Section with Draggable Canvas & Lightbox */}
        <GallerySection showViewAllLink={false} isDedicatedPage={true} className="!pt-10 !pb-16" />

        {/* Milestone Editions Cards */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8 mt-12">
          <div className="border-t border-white/10 pt-16">
            <h3 className="font-display-title text-2xl sm:text-3xl font-black text-[#F7F2F6]">
              Past Summit Milestones
            </h3>
            <p className="mt-2 text-sm text-[#F7F2F6]/70">
              Key moments that shaped the legacy of CIE MLRIT events
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-[#161618] p-6 transition-all hover:border-[#7484FE]">
                <span className="font-mono text-xs font-bold text-[#7484FE]">EDITION 01</span>
                <h4 className="mt-2 text-lg font-bold text-[#F7F2F6]">The Equinox 1.0</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#F7F2F6]/75">
                  The foundational entrepreneurship summit bringing together 1,500+ participants, angel rounds, and student-run venture stalls.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161618] p-6 transition-all hover:border-[#33FF67]">
                <span className="font-mono text-xs font-bold text-[#33FF67]">HACKATHON</span>
                <h4 className="mt-2 text-lg font-bold text-[#F7F2F6]">MetaLoop AR/VR</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#F7F2F6]/75">
                  India’s premier student AR/VR hackathon spanning 36 continuous hours of spatial hardware and 3D environment development.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161618] p-6 transition-all hover:border-[#7484FE]">
                <span className="font-mono text-xs font-bold text-[#7484FE]">HARDWARE</span>
                <h4 className="mt-2 text-lg font-bold text-[#F7F2F6]">Inventron Challenge</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#F7F2F6]/75">
                  Rapid hardware prototyping challenge that produced patent-pending mechanical and IoT solutions from student teams.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161618] p-6 transition-all hover:border-[#33FF67]">
                <span className="font-mono text-xs font-bold text-[#33FF67]">ECOSYSTEM</span>
                <h4 className="mt-2 text-lg font-bold text-[#F7F2F6]">E-Cell Conclave</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#F7F2F6]/75">
                  Gathering 25+ university entrepreneurship leaders across Telangana to collaborate on cross-institutional student incubation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Banner Call to Action */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8 mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-[#33FF67]/30 bg-gradient-to-r from-[#17171a] via-[#141416] to-[#17171a] p-8 sm:p-12 text-center">
            <div className="mx-auto max-w-2xl">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#33FF67]">
                The Next Chapter
              </span>
              <h2 className="mt-2 font-display-title text-3xl sm:text-5xl font-black text-[#F7F2F6]">
                Ready to make history at Equinox 2.0?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#F7F2F6]/80">
                Join 2,000+ builders, founders, and competitors on 30 - 31 October 2026 at MLRIT Hyderabad.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-[#33FF67] px-8 py-3.5 text-sm font-black text-[#141414] shadow-[0_0_25px_rgba(51,255,103,0.4)] transition hover:bg-[#5aff87] hover:scale-105 active:scale-95"
                >
                  <Ticket className="h-4 w-4" />
                  <span>Register for Equinox 2.0</span>
                </Link>
                <Link
                  href="/#events"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-[#F7F2F6] backdrop-blur-sm transition hover:bg-white/15"
                >
                  <span>Explore Sub-Events</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
