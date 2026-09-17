"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Layers,
  Move,
  Grid3X3,
  Columns2,
} from "lucide-react";
import {
  DraggableContainer,
  GridBody,
  GridItem,
} from "@/components/ui/infinite-drag-scroll";
import { PREVIOUS_EVENT_PHOTOS, GalleryPhoto } from "@/lib/gallery-data";

interface GallerySectionProps {
  showViewAllLink?: boolean;
  className?: string;
  isDedicatedPage?: boolean;
  containerHeight?: string;
}

type GalleryItem = GalleryPhoto & { imageUrl: string };

export default function GallerySection({
  showViewAllLink = true,
  className = "",
  isDedicatedPage = false,
  containerHeight,
}: GallerySectionProps) {
  const [mobileLayout, setMobileLayout] = useState<"reel" | "grid">("reel");

  // Map all 32 photo items from the gallery dataset
  const galleryItems: GalleryItem[] = useMemo(() => {
    return PREVIOUS_EVENT_PHOTOS.map((item) => ({
      ...item,
      imageUrl: item.image.src,
    }));
  }, []);

  // Split items into 2 staggered horizontal reels for mobile
  const { reelRow1, reelRow2 } = useMemo(() => {
    const r1: GalleryItem[] = [];
    const r2: GalleryItem[] = [];
    galleryItems.forEach((photo, idx) => {
      if (idx % 2 === 0) r1.push(photo);
      else r2.push(photo);
    });
    return { reelRow1: r1, reelRow2: r2 };
  }, [galleryItems]);

  const canvasHeight =
    containerHeight ||
    (isDedicatedPage
      ? "h-[700px] sm:h-[780px] lg:h-[840px]"
      : "h-[620px] sm:h-[700px] lg:h-[740px]");

  return (
    <section
      id="gallery"
      className={`relative mx-auto max-w-[1400px] px-4 py-12 sm:px-8 md:py-24 ${className}`}
    >
      {/* Editorial Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-[#33FF67]">
              Archives &amp; Memories
            </span>
            <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#F7F2F6]/80 flex items-center gap-1">
              <Layers className="h-3 w-3 text-[#33FF67]" />
              32 ARCHIVED PHOTOS
            </span>
          </div>
          <h2
            className="mt-3 font-display-title font-black leading-[0.92] tracking-tighter text-[#F7F2F6]"
            style={{ fontSize: "clamp(2.25rem, 6.5vw, 6.5rem)" }}
          >
            Past Event Moments
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#F7F2F6]/90 sm:text-xl font-medium max-w-2xl sm:mt-6">
            Explore real camera captures of previous Equinox editions, hackathons, and CIE summits.
          </p>
        </div>

        {showViewAllLink && (
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 rounded-full border border-[#7484FE]/40 bg-[#7484FE]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F7F2F6] backdrop-blur-sm transition-all hover:border-[#7484FE] hover:bg-[#7484FE] hover:text-[#141414]"
            >
              <span>Explore Full Gallery ({galleryItems.length})</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MOBILE GALLERY VIEW: Fluid, Touch-Friendly, Never Traps Page Scroll       */}
      {/* ========================================================================= */}
      <div className="mt-8 block md:hidden">
        {/* Layout Toggle Pill */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#F7F2F6]/70">
            Showing {galleryItems.length} moments
          </span>
          <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMobileLayout("reel")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[10px] font-bold transition ${
                mobileLayout === "reel"
                  ? "bg-[#33FF67] text-[#141414] shadow"
                  : "text-[#F7F2F6]/70 hover:text-[#F7F2F6]"
              }`}
            >
              <Columns2 className="h-3 w-3" />
              <span>Reels</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileLayout("grid")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[10px] font-bold transition ${
                mobileLayout === "grid"
                  ? "bg-[#33FF67] text-[#141414] shadow"
                  : "text-[#F7F2F6]/70 hover:text-[#F7F2F6]"
              }`}
            >
              <Grid3X3 className="h-3 w-3" />
              <span>Grid</span>
            </button>
          </div>
        </div>

        {/* Mobile Layout Mode 1: Dual Staggered Swipe Reels (touch-pan-y allows effortless page scroll) */}
        {mobileLayout === "reel" ? (
          <div className="relative mt-4 space-y-3 -mx-4 px-4 overflow-hidden">
            {/* Top Reel Row */}
            <div className="flex gap-3 overflow-x-auto scrollbar-none touch-pan-y pb-1 snap-x snap-mandatory">
              {reelRow1.map((photo) => (
                <div
                  key={photo.id}
                  className="snap-start shrink-0 w-[260px] aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#1b1c22] select-none pointer-events-none shadow-lg"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    draggable={false}
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ WebkitTouchCallout: "none", userSelect: "none" }}
                    className="h-full w-full object-cover select-none pointer-events-none"
                  />
                </div>
              ))}
            </div>

            {/* Bottom Reel Row */}
            {reelRow2.length > 0 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-none touch-pan-y pb-1 snap-x snap-mandatory">
                {reelRow2.map((photo) => (
                  <div
                    key={photo.id}
                    className="snap-start shrink-0 w-[260px] aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#1b1c22] select-none pointer-events-none shadow-lg"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      draggable={false}
                      loading="lazy"
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ WebkitTouchCallout: "none", userSelect: "none" }}
                      className="h-full w-full object-cover select-none pointer-events-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Swipe Helper Pill */}
            <div className="mt-2 flex items-center justify-center gap-1.5 font-mono text-[11px] text-[#F7F2F6]/60">
              <Move className="h-3 w-3 text-[#33FF67]" />
              <span>Swipe photos horizontally • Scroll down for rest of page</span>
            </div>
          </div>
        ) : (
          /* Mobile Layout Mode 2: Clean 2-Column Photo Feed */
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {galleryItems.map((photo) => (
              <div
                key={photo.id}
                className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-[#1b1c22] select-none pointer-events-none shadow-md"
                onContextMenu={(e) => e.preventDefault()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  draggable={false}
                  loading="lazy"
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ WebkitTouchCallout: "none", userSelect: "none" }}
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP GALLERY VIEW: Rich 2D 360-Degree Infinite Drag Canvas              */}
      {/* ========================================================================= */}
      <div className="relative mt-10 hidden md:block overflow-hidden rounded-3xl border border-white/10 bg-[#141414] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-28 left-1/3 h-56 w-[450px] -translate-x-1/2 rounded-full bg-[#7484FE]/15 blur-3xl z-10" />
        <div className="pointer-events-none absolute -bottom-28 right-1/4 h-56 w-[450px] rounded-full bg-[#33FF67]/10 blur-3xl z-10" />

        {/* Edge Vignette Overlays for smooth endless-canvas feel */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-14 bg-gradient-to-b from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-14 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-14 bg-gradient-to-l from-[#141414] via-[#141414]/60 to-transparent" />

        {/* The Infinite Drag Scroll Container */}
        <DraggableContainer containerHeight={canvasHeight} className="bg-transparent">
          <GridBody>
            {galleryItems.map((photo, i) => (
              <GridItem key={`${photo.id}-${i}`}>
                <div
                  onContextMenu={(e) => e.preventDefault()}
                  className="group relative block w-[280px] sm:w-[320px] md:w-[360px] aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#1b1c22] shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#33FF67]/80 select-none pointer-events-none"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.imageUrl}
                    alt="Equinox Event Photo"
                    draggable={false}
                    loading="lazy"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                      WebkitTouchCallout: "none",
                      userSelect: "none",
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                  />
                  {/* Invisible protective overlay against saving / downloading */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              </GridItem>
            ))}
          </GridBody>
        </DraggableContainer>

        {/* Corner Swipe/Drag Instruction Pill */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-3.5 py-1.5 font-mono text-[11px] text-[#F7F2F6]/85 backdrop-blur-md shadow-lg">
          <Move className="h-3 w-3 text-[#33FF67] animate-pulse" />
          <span>Swipe in any direction to explore</span>
        </div>
      </div>

      {/* Highlights Metrics Strip */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#151515] p-5">
          <span className="font-mono text-[11px] font-bold uppercase text-[#7484FE]">
            Summits Hosted
          </span>
          <p className="mt-1 font-mono text-3xl font-black text-[#F7F2F6]">4+</p>
          <p className="text-xs text-[#F7F2F6]/60">Flagship Editions</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#151515] p-5">
          <span className="font-mono text-[11px] font-bold uppercase text-[#33FF67]">
            Past Footfall
          </span>
          <p className="mt-1 font-mono text-3xl font-black text-[#33FF67]">2,000+</p>
          <p className="text-xs text-[#F7F2F6]/60">Student Delegates</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#151515] p-5">
          <span className="font-mono text-[11px] font-bold uppercase text-[#7484FE]">
            Cash Distributed
          </span>
          <p className="mt-1 font-mono text-3xl font-black text-[#F7F2F6]">₹5L+</p>
          <p className="text-xs text-[#F7F2F6]/60">Prize Pools Awarded</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#151515] p-5">
          <span className="font-mono text-[11px] font-bold uppercase text-[#33FF67]">
            Startups Pitched
          </span>
          <p className="mt-1 font-mono text-3xl font-black text-[#33FF67]">45+</p>
          <p className="text-xs text-[#F7F2F6]/60">Early Ventures</p>
        </div>
      </div>
    </section>
  );
}
