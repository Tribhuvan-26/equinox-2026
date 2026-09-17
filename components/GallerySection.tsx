"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Layers,
  ChevronLeft,
  ChevronRight,
  Move,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const mobileReelRef = useRef<HTMLDivElement>(null);

  // Map all 32 photo items from the gallery dataset
  const galleryItems: GalleryItem[] = useMemo(() => {
    return PREVIOUS_EVENT_PHOTOS.map((item) => ({
      ...item,
      imageUrl: item.image.src,
    }));
  }, []);

  const handleMobileScroll = () => {
    if (!mobileReelRef.current) return;
    const { scrollLeft, clientWidth } = mobileReelRef.current;
    if (clientWidth > 0) {
      const newIdx = Math.round(scrollLeft / clientWidth);
      if (newIdx !== currentIndex && newIdx >= 0 && newIdx < galleryItems.length) {
        setCurrentIndex(newIdx);
      }
    }
  };

  const scrollToPhoto = (index: number) => {
    const target = Math.max(0, Math.min(galleryItems.length - 1, index));
    if (mobileReelRef.current) {
      mobileReelRef.current.scrollTo({
        left: target * mobileReelRef.current.clientWidth,
        behavior: "smooth",
      });
    }
    setCurrentIndex(target);
  };

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
            className="mt-3 font-display-title font-black leading-[0.92] tracking-tighter text-[#F7F2F6] break-words hyphens-none"
            style={{ fontSize: "clamp(1.65rem, 6.5vw, 6.5rem)" }}
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
      {/* MOBILE GALLERY VIEW: Single Image per View, Touch-Friendly Snap Carousel   */}
      {/* ========================================================================= */}
      <div className="mt-8 block md:hidden">
        {/* Photo Counter Header */}
        <div className="flex items-center justify-between pb-2.5">
          <span className="font-mono text-xs font-black uppercase tracking-wider text-[#33FF67]">
            Archive Photo {String(currentIndex + 1).padStart(2, "0")} of {String(galleryItems.length).padStart(2, "0")}
          </span>
          <span className="font-mono text-[10px] uppercase text-[#F7F2F6]/60">
            Swipe left/right
          </span>
        </div>

        {/* Single-Image Snap Carousel (Only 1 full image visible per swipe, no partial cutoffs) */}
        <div
          ref={mobileReelRef}
          onScroll={handleMobileScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-none touch-pan-y rounded-2xl border border-white/10 bg-[#161618] shadow-2xl"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {galleryItems.map((photo, idx) => (
            <div
              key={photo.id}
              className="w-full shrink-0 snap-center p-2.5 sm:p-3"
            >
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-[#121214] shadow-inner select-none pointer-events-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  draggable={false}
                  loading={idx < 2 ? "eager" : "lazy"}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ WebkitTouchCallout: "none", userSelect: "none" }}
                  className="h-full w-full object-cover select-none pointer-events-none"
                />

                {/* Subtle caption overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3 sm:p-4 flex items-end justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-white/95 truncate">
                    {photo.title}
                  </span>
                  <span className="shrink-0 rounded-full bg-white/15 backdrop-blur-md px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#33FF67]">
                    {photo.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Bar (Prev / Progress Track / Next) */}
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToPhoto(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Previous photo"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#F7F2F6] transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-[#33FF67]/40 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Progress Indicator Bar */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <span className="font-mono text-sm font-black text-[#F7F2F6]">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs text-[#F7F2F6]/40">/</span>
              <span className="font-mono text-xs text-[#F7F2F6]/60">
                {String(galleryItems.length).padStart(2, "0")}
              </span>
            </div>
            {/* Mini Progress Track */}
            <div className="h-1 w-24 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#33FF67] transition-all duration-200"
                style={{ width: `${((currentIndex + 1) / galleryItems.length) * 100}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToPhoto(currentIndex + 1)}
            disabled={currentIndex === galleryItems.length - 1}
            aria-label="Next photo"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#F7F2F6] transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-[#33FF67]/40 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
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
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#151515] p-4 sm:p-5 flex flex-col justify-between">
          <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase text-[#7484FE] tracking-wider">
            Summits Hosted
          </span>
          <p className="mt-1 font-mono text-2xl xs:text-3xl font-black text-[#F7F2F6] tracking-tight whitespace-nowrap">4+</p>
          <p className="text-xs text-[#F7F2F6]/60">Flagship Editions</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#151515] p-4 sm:p-5 flex flex-col justify-between">
          <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase text-[#33FF67] tracking-wider">
            Past Footfall
          </span>
          <p className="mt-1 font-mono text-2xl xs:text-3xl font-black text-[#33FF67] tracking-tight whitespace-nowrap">2,000+</p>
          <p className="text-xs text-[#F7F2F6]/60">Student Delegates</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#151515] p-4 sm:p-5 flex flex-col justify-between">
          <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase text-[#7484FE] tracking-wider">
            Cash Distributed
          </span>
          <p className="mt-1 font-mono text-2xl xs:text-3xl font-black text-[#F7F2F6] tracking-tight whitespace-nowrap">₹5L+</p>
          <p className="text-xs text-[#F7F2F6]/60">Prize Pools Awarded</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#151515] p-4 sm:p-5 flex flex-col justify-between">
          <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase text-[#33FF67] tracking-wider">
            Startups Pitched
          </span>
          <p className="mt-1 font-mono text-2xl xs:text-3xl font-black text-[#33FF67] tracking-tight whitespace-nowrap">45+</p>
          <p className="text-xs text-[#F7F2F6]/60">Early Ventures</p>
        </div>
      </div>
    </section>
  );
}
