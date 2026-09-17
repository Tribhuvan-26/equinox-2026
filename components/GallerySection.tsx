"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Layers,
  X,
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
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  // Map all 32 photo items from the gallery dataset
  const galleryItems: GalleryItem[] = useMemo(() => {
    return PREVIOUS_EVENT_PHOTOS.map((item) => ({
      ...item,
      imageUrl: item.image.src,
    }));
  }, []);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      } else if (e.key === "ArrowRight") {
        const idx = galleryItems.findIndex((p) => p.id === selectedPhoto.id);
        if (idx !== -1) {
          const nextIdx = (idx + 1) % galleryItems.length;
          setSelectedPhoto(galleryItems[nextIdx]);
        }
      } else if (e.key === "ArrowLeft") {
        const idx = galleryItems.findIndex((p) => p.id === selectedPhoto.id);
        if (idx !== -1) {
          const prevIdx = (idx - 1 + galleryItems.length) % galleryItems.length;
          setSelectedPhoto(galleryItems[prevIdx]);
        }
      }
    },
    [selectedPhoto, galleryItems]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleNext = useCallback(() => {
    if (!selectedPhoto || galleryItems.length === 0) return;
    const idx = galleryItems.findIndex((p) => p.id === selectedPhoto.id);
    const nextIdx = (idx + 1) % galleryItems.length;
    setSelectedPhoto(galleryItems[nextIdx]);
  }, [selectedPhoto, galleryItems]);

  const handlePrev = useCallback(() => {
    if (!selectedPhoto || galleryItems.length === 0) return;
    const idx = galleryItems.findIndex((p) => p.id === selectedPhoto.id);
    const prevIdx = (idx - 1 + galleryItems.length) % galleryItems.length;
    setSelectedPhoto(galleryItems[prevIdx]);
  }, [selectedPhoto, galleryItems]);

  // Window-level Trackpad 2-finger swipe & Touch swipe listener for modal (Next/Prev/Close)
  useEffect(() => {
    if (!selectedPhoto) return;
    let accumulatedX = 0;
    let accumulatedY = 0;
    let lastTriggerTime = 0;

    const handleModalWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastTriggerTime < 320) return; // Debounce after action

      accumulatedX += e.deltaX;
      accumulatedY += e.deltaY;

      // Detect horizontal swipe (left / right) -> flip photo
      if (Math.abs(accumulatedX) > Math.abs(accumulatedY)) {
        if (accumulatedX > 25) {
          lastTriggerTime = now;
          accumulatedX = 0;
          accumulatedY = 0;
          handleNext();
        } else if (accumulatedX < -25) {
          lastTriggerTime = now;
          accumulatedX = 0;
          accumulatedY = 0;
          handlePrev();
        }
      } else {
        // Detect vertical swipe (up / down) -> close modal
        if (Math.abs(accumulatedY) > 30) {
          lastTriggerTime = now;
          accumulatedX = 0;
          accumulatedY = 0;
          setSelectedPhoto(null);
        }
      }
    };

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchActive = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isTouchActive = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTouchActive || e.changedTouches.length === 0) return;
      isTouchActive = false;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - touchStartX;
      const diffY = endY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX < -30) {
          handleNext();
        } else if (diffX > 30) {
          handlePrev();
        }
      } else {
        // Vertical swipe -> close
        if (Math.abs(diffY) > 35) {
          setSelectedPhoto(null);
        }
      }
    };

    window.addEventListener("wheel", handleModalWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleModalWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [selectedPhoto, handleNext, handlePrev]);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleItemClick = (photo: GalleryItem, e: React.MouseEvent) => {
    if (pointerDownPos.current) {
      const dist = Math.hypot(
        e.clientX - pointerDownPos.current.x,
        e.clientY - pointerDownPos.current.y
      );
      // If pointer moved more than 7px, it was a swipe/pan, not a click!
      if (dist > 7) return;
    }
    setSelectedPhoto(photo);
  };

  const canvasHeight =
    containerHeight ||
    (isDedicatedPage
      ? "h-[700px] sm:h-[780px] lg:h-[840px]"
      : "h-[620px] sm:h-[700px] lg:h-[740px]");

  return (
    <section
      id="gallery"
      className={`relative mx-auto max-w-[1400px] px-4 py-16 sm:px-8 md:py-24 ${className}`}
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
            style={{ fontSize: "clamp(2.75rem, 6.5vw, 6.5rem)" }}
          >
            Past Event Moments
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[#F7F2F6]/90 sm:text-xl font-medium max-w-2xl">
            Swipe in any direction across our infinite photo tapestry of previous Equinox editions, hackathons, and summits. Explore real camera captures from past events.
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

      {/* Infinite Drag Scroll Canvas Container */}
      <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#141414] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]">
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
                  role="button"
                  tabIndex={0}
                  aria-label="View photo"
                  onPointerDown={handlePointerDown}
                  onClick={(e) => handleItemClick(photo, e)}
                  onContextMenu={(e) => e.preventDefault()}
                  className="group relative block w-[280px] sm:w-[320px] md:w-[360px] aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#1b1c22] shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#33FF67]/80 cursor-pointer select-none"
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
          <span>Swipe in any direction • Click photo to view</span>
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

      {/* Lightbox Modal (Clean Pure Image View with Swipe In Any Direction & No Download) */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md select-none touch-none"
            onClick={() => setSelectedPhoto(null)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.7}
              onDragEnd={(_, info) => {
                const { offset, velocity } = info;
                // Swipe left -> next photo
                if (offset.x < -35 || velocity.x < -150) {
                  handleNext();
                }
                // Swipe right -> prev photo
                else if (offset.x > 35 || velocity.x > 150) {
                  handlePrev();
                }
                // Swipe up or down -> close modal
                else if (Math.abs(offset.y) > 40 || Math.abs(velocity.y) > 200) {
                  setSelectedPhoto(null);
                }
              }}
              className="relative flex items-center justify-center max-h-[92vh] max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-[#121214] shadow-2xl p-2 sm:p-4 cursor-grab active:cursor-grabbing touch-none select-none"
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close dialog"
                className="absolute top-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-[#F7F2F6] transition hover:bg-white/20 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 z-40 flex -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-[#F7F2F6] transition hover:bg-white/20 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 z-40 flex -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-[#F7F2F6] transition hover:bg-white/20 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Pure Photo Display without Download Option */}
              <div
                className="relative flex items-center justify-center max-h-[85vh] w-full select-none pointer-events-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPhoto.imageUrl}
                  alt="Equinox Event Photo"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    WebkitTouchCallout: "none",
                    userSelect: "none",
                  }}
                  className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl pointer-events-none select-none"
                />

                {/* Protective Transparent Overlay */}
                <div
                  className="absolute inset-0 z-20 pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                />

                {/* Bottom Gesture Hint Badge */}
                <div className="pointer-events-none absolute bottom-4 left-4 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-3.5 py-1.5 font-mono text-[11px] text-[#F7F2F6]/80 backdrop-blur-md">
                  <span>Swipe ‹ › to browse • Swipe ↕ to close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
