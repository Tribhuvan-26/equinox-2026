"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "equinox_first_visit_tutorial_seen";

interface ScrollTutorialOverlayProps {
  showLoader?: boolean;
}

export default function ScrollTutorialOverlay({ showLoader = false }: ScrollTutorialOverlayProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Show only on the first visit / session
    const hasSeen = sessionStorage.getItem(STORAGE_KEY);
    if (hasSeen) return;

    setShouldRender(true);

    const handleScroll = () => {
      if (window.scrollY > 5) {
        dismiss();
      }
    };

    const dismiss = () => {
      setIsFadingOut(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // Ignore storage error
      }
      setTimeout(() => {
        setShouldRender(false);
      }, 700);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, []);

  if (!shouldRender || showLoader) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-700 ease-out ${
        isFadingOut ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="flex items-center gap-2.5 rounded-full bg-[#0E0E0E] border border-white/15 px-4 py-2 text-white shadow-xl">
        {/* Minimal Mouse / Scroll Wheel Indicator */}
        <div className="relative flex h-5 w-3.5 items-center justify-center rounded-full border border-white/60">
          <span className="h-1 w-0.5 rounded-full bg-white animate-[scrollWheel_1.5s_infinite_easeInOut]" />
        </div>

        {/* Text */}
        <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-white/80 uppercase">
          Scroll to explore
        </span>

        {/* Tiny Horizontal Arrow indicating journey direction */}
        <svg
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
          className="shrink-0 text-[#7484FE] opacity-80"
        >
          <path
            d="M1 5H11M11 5L7 1M11 5L7 9"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes scrollWheel {
          0% {
            transform: translateY(-2px);
            opacity: 1;
          }
          60% {
            transform: translateY(3px);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-2px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
