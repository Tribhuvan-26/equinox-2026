"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Move,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import DraggableGrid, { GridItem } from "./DraggableGrid";
import {
  PREVIOUS_EVENT_PHOTOS,
  GALLERY_CATEGORIES,
  GalleryPhoto,
} from "@/lib/gallery-data";

interface GallerySectionProps {
  showViewAllLink?: boolean;
  className?: string;
}

export default function GallerySection({
  showViewAllLink = true,
  className = "",
}: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All Moments");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [modalImgSrc, setModalImgSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    setModalImgSrc(selectedPhoto?.image?.src);
  }, [selectedPhoto]);

  // Filter items based on active category
  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All Moments") return PREVIOUS_EVENT_PHOTOS;
    return PREVIOUS_EVENT_PHOTOS.filter(
      (item) => item.category === activeCategory
    );
  }, [activeCategory]);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      } else if (e.key === "ArrowRight") {
        const idx = PREVIOUS_EVENT_PHOTOS.findIndex(
          (p) => p.id === selectedPhoto.id
        );
        if (idx !== -1 && idx < PREVIOUS_EVENT_PHOTOS.length - 1) {
          setSelectedPhoto(PREVIOUS_EVENT_PHOTOS[idx + 1]);
        } else {
          setSelectedPhoto(PREVIOUS_EVENT_PHOTOS[0]);
        }
      } else if (e.key === "ArrowLeft") {
        const idx = PREVIOUS_EVENT_PHOTOS.findIndex(
          (p) => p.id === selectedPhoto.id
        );
        if (idx > 0) {
          setSelectedPhoto(PREVIOUS_EVENT_PHOTOS[idx - 1]);
        } else {
          setSelectedPhoto(
            PREVIOUS_EVENT_PHOTOS[PREVIOUS_EVENT_PHOTOS.length - 1]
          );
        }
      }
    },
    [selectedPhoto]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleNext = () => {
    if (!selectedPhoto) return;
    const idx = PREVIOUS_EVENT_PHOTOS.findIndex(
      (p) => p.id === selectedPhoto.id
    );
    const nextIdx = (idx + 1) % PREVIOUS_EVENT_PHOTOS.length;
    setSelectedPhoto(PREVIOUS_EVENT_PHOTOS[nextIdx]);
  };

  const handlePrev = () => {
    if (!selectedPhoto) return;
    const idx = PREVIOUS_EVENT_PHOTOS.findIndex(
      (p) => p.id === selectedPhoto.id
    );
    const prevIdx =
      (idx - 1 + PREVIOUS_EVENT_PHOTOS.length) % PREVIOUS_EVENT_PHOTOS.length;
    setSelectedPhoto(PREVIOUS_EVENT_PHOTOS[prevIdx]);
  };

  return (
    <section
      id="gallery"
      className={`relative mx-auto max-w-[1400px] px-4 py-24 sm:px-8 md:py-36 ${className}`}
    >
      {/* Editorial Header matching Brochure Design Language */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-[#33FF67]">
              Archives &amp; Memories
            </span>
            <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#F7F2F6]/80">
              PREVIOUS EDITIONS
            </span>
          </div>
          <h2
            className="mt-3 font-display-title font-black leading-[0.92] tracking-tighter text-[#F7F2F6]"
            style={{ fontSize: "clamp(2.75rem, 6.5vw, 6.5rem)" }}
          >
            Past Event Moments
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[#F7F2F6]/90 sm:text-xl font-medium max-w-2xl">
            Relive the fierce pitches, overnight code sprints, high-stakes auction battles,
            and grand celebrations from previous editions of Equinox and CIE MLRIT summits.
          </p>
        </div>

        {showViewAllLink && (
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 rounded-full border border-[#7484FE]/40 bg-[#7484FE]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F7F2F6] backdrop-blur-sm transition-all hover:border-[#7484FE] hover:bg-[#7484FE] hover:text-[#141414]"
            >
              <span>Explore Full Gallery</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>

      {/* Category Pills & Affordance Bar */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#33FF67] text-[#141414] shadow-[0_0_15px_rgba(51,255,103,0.35)]"
                    : "bg-white/5 text-[#F7F2F6]/75 hover:bg-white/15 hover:text-[#F7F2F6]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#F7F2F6]/60">
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] text-[#33FF67]">
            <Move className="h-3 w-3 animate-pulse" />
            <span>Drag in any direction</span>
          </span>
          <span className="hidden sm:inline-block">Click photo to expand</span>
        </div>
      </div>

      {/* Interactive Draggable Canvas Container */}
      <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#121214] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-[#7484FE]/15 blur-3xl" />

        {/* Edge Vignette Overlays for smooth endless-canvas feel */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-[#121214] via-[#121214]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-[#121214] via-[#121214]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#121214] via-[#121214]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#121214] via-[#121214]/60 to-transparent" />

        {/* The Draggable Grid Canvas */}
        <div className="h-[520px] sm:h-[600px] lg:h-[660px] w-full cursor-grab active:cursor-grabbing">
          <DraggableGrid
            items={filteredPhotos}
            columns={6}
            imageWidth={225}
            imageHeight={225}
            gap={4}
            rounded={4}
            enableWheel={false}
            placeholderColor="#18181c"
            onItemClick={(item) => setSelectedPhoto(item as GalleryPhoto)}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Bottom Floating Hint Overlay */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-1.5 font-mono text-[11px] text-[#F7F2F6]/75 backdrop-blur-md">
          <Sparkles className="h-3 w-3 text-[#33FF67]" />
          <span>Interactive Grid Canvas • Click tile for details</span>
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#17171a] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close dialog"
                className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-[#F7F2F6] transition hover:bg-white/20 hover:scale-110 active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 z-30 flex -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-[#F7F2F6] transition hover:bg-white/20 hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 z-30 flex -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-[#F7F2F6] transition hover:bg-white/20 hover:scale-110 active:scale-95"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Modal Body */}
              <div className="flex flex-col lg:grid lg:grid-cols-12 overflow-y-auto max-h-[90vh]">
                {/* Photo Viewer */}
                <div className="relative flex items-center justify-center bg-black/60 lg:col-span-8 min-h-[320px] sm:min-h-[440px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={modalImgSrc || selectedPhoto.image?.src}
                    alt={selectedPhoto.alt || selectedPhoto.title}
                    onError={() => {
                      if (modalImgSrc && modalImgSrc.endsWith(".jpg")) {
                        setModalImgSrc(modalImgSrc.replace(".jpg", ".svg"));
                      }
                    }}
                    className="h-full max-h-[60vh] w-full object-contain p-2"
                  />
                </div>

                {/* Photo Details Sidebar */}
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#151518]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#33FF67]/20 border border-[#33FF67]/40 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#33FF67]">
                        {selectedPhoto.category}
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#F7F2F6]/80">
                        {selectedPhoto.edition}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display-title text-2xl font-black text-[#F7F2F6] leading-tight">
                      {selectedPhoto.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#F7F2F6]/80">
                      {selectedPhoto.description}
                    </p>

                    {selectedPhoto.stats && (
                      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
                        <span className="font-mono text-[10px] uppercase text-[#7484FE] font-bold">
                          Key Metric
                        </span>
                        <p className="font-mono text-base font-black text-[#F7F2F6]">
                          {selectedPhoto.stats}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#F7F2F6]/50">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {selectedPhoto.date}
                    </span>
                    <span>MLRIT CIE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
