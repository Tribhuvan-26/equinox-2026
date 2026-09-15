"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";
import { ArrowRight, Mouse } from "lucide-react";
import Globe from "./Globe";
import { InstitutionalHeader } from "../app/EventGraphics";
import { subEvents } from "@/lib/content";
import {
  PLANET_LAYOUTS,
  JOURNEY_SQUIGGLY_PATH,
  TOTAL_WORLD_WIDTH,
  PlanetSVG,
  PlanetGradients,
} from "./JourneyPlanets";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── HERO LAYER (initial state, fades out on scroll) ─────────────────────────
  const heroBlockRef = useRef<HTMLDivElement>(null);   // entire hero content
  const globeHeroRef = useRef<HTMLDivElement>(null);   // large background globe
  const heroWordmarkRef = useRef<HTMLDivElement>(null);   // "EQUINOX"
  const equinRef = useRef<HTMLSpanElement>(null);  // "EQUIN" part
  const oRef = useRef<HTMLSpanElement>(null);  // "O" part
  const xRef = useRef<HTMLSpanElement>(null);  // "X" part
  const heroSubtitleRef = useRef<HTMLDivElement>(null);   // tag + subtitle
  const exploreRef = useRef<HTMLDivElement>(null);   // CTA button

  const persistentHeaderRef = useRef<HTMLDivElement>(null);
  const navbarWrapperRef = useRef<HTMLDivElement>(null);

  // ── JOURNEY LAYER ────────────────────────────────────────────────────────────
  const journeyLayerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const indicatorEventRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const journeyScaleRef = useRef(0.65);

  const [isGlobeReady, setIsGlobeReady] = useState(false);
  // Globe keeps rendering every frame while it spins; it is a few pixels wide once
  // the journey starts, so pause it there and give those frames to the scroll.
  const [isGlobePaused, setIsGlobePaused] = useState(false);
  const globePausedRef = useRef(false);
  const [showLoader, setShowLoader] = useState(true);

  const handleGlobeReady = useCallback(() => setIsGlobeReady(true), []);

  const handleExplore = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(window.innerHeight * 1.2, { duration: 1.4 });
    } else {
      window.scrollTo({ top: window.innerHeight * 1.2, behavior: "smooth" });
    }
  };

  // ── LENIS + GSAP ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsGlobeReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isGlobeReady) {
      const t = setTimeout(() => setShowLoader(false), 400);
      return () => clearTimeout(t);
    }
  }, [isGlobeReady]);

  useEffect(() => {
    document.body.style.overflow = showLoader ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showLoader]);

  // ── JOURNEY PROGRESS ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pathRef.current || !rocketRef.current || !worldRef.current) return;
    const path = pathRef.current;
    const totalPathLen = path.getTotalLength();

    const updateJourneyProgress = (p: number) => {
      if (!rocketRef.current || !worldRef.current || !pathRef.current) return;
      const curLen = p * totalPathLen;
      const pt = path.getPointAtLength(curLen);
      const nextPt = path.getPointAtLength(Math.min(curLen + 4, totalPathLen));
      const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);

      rocketRef.current.setAttribute("transform", `translate(${pt.x}, ${pt.y}) rotate(${angle})`);

      // Scale is recomputed only on resize (updateHeaderSpace); reading it from a ref
      // keeps this scroll callback write-only, so it never forces a style flush per frame.
      const currentScale = journeyScaleRef.current;
      const inverseScale = 1 / currentScale;

      const targetScreenX = Math.min(window.innerWidth * 0.28, 420);
      const unscaledTargetScreenX = targetScreenX / currentScale;

      const worldX = pt.x > unscaledTargetScreenX ? -(pt.x - unscaledTargetScreenX) : 0;
      worldRef.current.style.transform = `translate3d(${worldX}px, 0, 0)`;

      let currentEventTitle = "";
      PLANET_LAYOUTS.forEach((layout, idx) => {
        const cardEl = cardRefs.current[idx];
        if (!cardEl) return;
        const dist = Math.abs(pt.x - layout.x);
        if (dist < 480) {
          const t = Math.max(0, 1 - dist / 420);
          cardEl.style.opacity = `${t}`;
          cardEl.style.transform = `translateY(${(1 - t) * 20}px) scale(${inverseScale})`;
          cardEl.style.pointerEvents = t > 0.4 ? "auto" : "none";
          if (t > 0.3) currentEventTitle = `${layout.badge} · ${subEvents[idx]?.name || ""}`;
        } else if (cardEl.style.opacity !== "0") {
          cardEl.style.opacity = "0";
          cardEl.style.pointerEvents = "none";
        }
      });

      if (indicatorEventRef.current && currentEventTitle) {
        indicatorEventRef.current.textContent = currentEventTitle;
      }
    };

    const ctx = gsap.context(() => {
      // ── SINGLE UNIFIED TIMELINE FOR ENTIRE SCROLL ─────────────────────────
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const shouldPause = self.progress > 0.14;
            if (shouldPause !== globePausedRef.current) {
              globePausedRef.current = shouldPause;
              setIsGlobePaused(shouldPause);
            }
          },
        },
      });

      // --- PHASE 1 (0%–10%): Hero to Wordmark ---
      mainTl.to([heroSubtitleRef.current, exploreRef.current], {
        opacity: 0, y: -20, duration: 0.1
      }, 0);

      mainTl.fromTo(equinRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.1 },
        0
      );

      mainTl.fromTo(xRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.1 },
        0
      );

      mainTl.to(globeHeroRef.current, {
        scale: () => {
          if (!oRef.current || !globeHeroRef.current) return 0.22;
          const oHeight = oRef.current.getBoundingClientRect().height;
          return (oHeight * 1.1) / globeHeroRef.current.offsetHeight;
        },
        x: () => {
          if (!oRef.current) return window.innerWidth * 0.16;
          const oRect = oRef.current.getBoundingClientRect();
          const oCenterX = oRect.left + oRect.width / 2;
          const windowCenterX = window.innerWidth / 2;
          return oCenterX - windowCenterX;
        },
        duration: 0.1
      }, 0);

      // --- PHASE 2 (10%–15%): Move Wordmark UP to Sticky Header ---
      mainTl.to(persistentHeaderRef.current, {
        y: () => {
          if (!navbarWrapperRef.current || !heroWordmarkRef.current) return 0;
          const navBottom = navbarWrapperRef.current.offsetHeight || 80;
          const unscaledWordmarkHeight = heroWordmarkRef.current.offsetHeight || 120;

          // Target scale for the container
          const targetScale = window.innerWidth < 768 ? 0.22 : window.innerWidth < 1280 ? 0.28 : 0.35;

          // The visual height of the text after scaling the container
          const scaledWordmarkHeight = unscaledWordmarkHeight * targetScale;

          // We want the TOP of the scaled text to sit just below the navbar + some padding (e.g. 16px)
          const targetWordmarkTop = navBottom + 16;

          // The container (persistentHeaderRef) scales from its center (50% 50%).
          // So the text (which is in the center) will also scale down around its center.
          // Its visual center doesn't change relative to the screen before translation.
          const wordmarkCenterY = window.innerHeight / 2;

          // Its un-translated scaled top is:
          const scaledWordmarkTopBeforeTranslate = wordmarkCenterY - (scaledWordmarkHeight / 2);

          // The translation needed is the difference:
          return targetWordmarkTop - scaledWordmarkTopBeforeTranslate;
        },
        scale: () => window.innerWidth < 768 ? 0.22 : window.innerWidth < 1280 ? 0.28 : 0.35,
        autoAlpha: 1,
        duration: 0.05,
        ease: "power2.inOut"
      }, 0.1);

      // --- PHASE 3 (15%–20%): Journey layer fades in ---
      mainTl.to(journeyLayerRef.current, { autoAlpha: 1, duration: 0.05 }, 0.15);
      mainTl.to(scrollIndicatorRef.current, { autoAlpha: 1, duration: 0.05 }, 0.15);

      // --- PHASE 4 (20%–90%): Horizontal journey ---
      const journeyProxy = { progress: 0 };
      mainTl.to(journeyProxy, {
        progress: 1,
        ease: "none",
        duration: 0.70,
        onUpdate: function () {
          updateJourneyProgress(this.targets()[0].progress);
        }
      }, 0.2);

      // --- PHASE 5 (90%–100%): Clean exit as journey ends ---
      // At the end of the scroll journey, the persistent EQUINOX title, institutional header,
      // and scroll indicator completely disappear before the next section appears.
      mainTl.to(persistentHeaderRef.current, {
        autoAlpha: 0,
        y: "-=40",
        duration: 0.07,
        ease: "power2.in"
      }, 0.91);

      mainTl.to(navbarWrapperRef.current, {
        autoAlpha: 0,
        y: "-=20",
        duration: 0.07,
        ease: "power2.in"
      }, 0.91);

      mainTl.to(scrollIndicatorRef.current, {
        autoAlpha: 0,
        duration: 0.05,
        ease: "power2.in"
      }, 0.89);

      mainTl.to(journeyLayerRef.current, {
        autoAlpha: 0,
        duration: 0.07,
        ease: "power2.in"
      }, 0.91);

      updateJourneyProgress(0);

      // Store header space in CSS variable for journey centering
      const updateHeaderSpace = () => {
        if (!navbarWrapperRef.current || !heroWordmarkRef.current) return;
        const navBottom = navbarWrapperRef.current.offsetHeight || 80;
        const unscaledWordmarkHeight = heroWordmarkRef.current.offsetHeight || 120;
        const targetScale = window.innerWidth < 768 ? 0.22 : window.innerWidth < 1280 ? 0.28 : 0.35;
        const scaledWordmarkHeight = unscaledWordmarkHeight * targetScale;
        const headerSpace = navBottom + 16 + scaledWordmarkHeight + 32; // 32px padding below wordmark
        document.documentElement.style.setProperty('--header-space', `${headerSpace}px`);

        // Dynamically scale the horizontal journey to fit the remaining viewport
        // 48px of breathing room so no planet ring or badge ever rides the bottom edge.
        const availableHeight = window.innerHeight - headerSpace - 48;
        // Real vertical extent of the world: top-row planets reach Y=300-290(ring)=10,
        // bottom-row planets reach Y=760+290(ring)+30(badge pill)=1080. Scaling to 820
        // cropped the bottom row, so the lower planets ran off the viewport.
        const activeHeight = 1010;
        // Fill the height that is actually free. The old 0.65 cap left the world stuck in
        // the top half of tall or zoomed-out windows, with a dead band underneath.
        const journeyScale = Math.max(0.3, Math.min(availableHeight / activeHeight, 1));
        document.documentElement.style.setProperty('--journey-scale', `${journeyScale}`);
        journeyScaleRef.current = journeyScale;

        // Centre the scaled world in that free height instead of pinning it to the top.
        const offsetY = Math.max(0, (availableHeight - activeHeight * journeyScale) / 2);
        document.documentElement.style.setProperty('--journey-offset-y', `${offsetY}px`);
      };
      updateHeaderSpace();
      window.addEventListener('resize', updateHeaderSpace);
      return () => {
        window.removeEventListener("resize", updateHeaderSpace);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [subEvents]);

  // Force a ScrollTrigger refresh after a short delay to handle font loading
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "1500vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#2A2A2A]">

        {/* ── SPARSE STAR FIELD ────────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <svg width="100%" height="100%">
            <pattern id="static-stars" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
              <circle fill="#F7F2F6" cx="28" cy="22" r="1.1" opacity="0.35" />
              <circle fill="#F7F2F6" cx="115" cy="48" r="1.4" opacity="0.55" />
              <circle fill="#F7F2F6" cx="57" cy="108" r="0.9" opacity="0.25" />
              <circle fill="#7484FE" cx="138" cy="125" r="1.6" opacity="0.45" />
              <circle fill="#33FF67" cx="88" cy="18" r="0.9" opacity="0.35" />
              <circle fill="#F7F2F6" cx="14" cy="70" r="1.0" opacity="0.30" />
              <circle fill="#F7F2F6" cx="145" cy="78" r="1.3" opacity="0.40" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#static-stars)" />
          </svg>
        </div>

        {/* ================================================================
            INSTITUTIONAL HEADER (NavBar area) — sticky to journey section
            ================================================================ */}
        <div
          ref={navbarWrapperRef}
          className="absolute top-0 left-0 w-full px-4 pt-4 sm:px-8 sm:pt-6 pointer-events-auto"
          style={{ zIndex: 50 }}
        >
          <InstitutionalHeader />
        </div>

        {/* ================================================================
            COMBINED PERSISTENT HEADER WRAPPER
            Holds the HTML EQUIN X and the Globe in the center initially.
            Animates UP to navbar later. Scoped to journey section.
            ================================================================ */}
        <div
          ref={persistentHeaderRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 40 }}
        >
          {/* Large Globe — starts huge in hero, shrinks and moves to act as the "O" */}
          <div
            ref={globeHeroRef}
            className="absolute flex items-center justify-center will-change-transform pointer-events-none"
            style={{
              width: "min(72vh, 88vw)",
              height: "min(72vh, 88vw)",
              borderRadius: "50%",
              overflow: "hidden",
              zIndex: 3, // Sit alongside the text, not behind it
            }}
          >
            <Globe
              isPaused={isGlobePaused}
              onReady={handleGlobeReady}
              speed={2}
              dots={
                isGlobePaused
                  ? { color: "#ffffff", size: 16, density: 4, allDots: false }
                  : { color: "#ffffff", size: 5, density: 8, allDots: false }
              }
              oceanColor="#0a0a0a"
              graticuleColor="#333333"
              outlineColor="#eeeeee"
              showGrid={true}
              showOutline={true}
            />
          </div>

          {/* Massive "EQUINOX" HTML text split into parts */}
          <div
            ref={heroWordmarkRef}
            className="absolute flex items-center justify-center font-display-title text-[#F7F2F6] leading-none tracking-tight select-none pointer-events-none"
            style={{
              fontSize: "clamp(3.5rem, 10.5vw, 11rem)",
              zIndex: 3,
              textShadow: "0 4px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.75)",
            }}
          >
            <span ref={equinRef} className="will-change-transform opacity-0">EQUIN</span>
            <span ref={oRef} className="will-change-transform opacity-0">O</span>
            <span ref={xRef} className="will-change-transform opacity-0">X</span>
          </div>
        </div>

        {/* ================================================================
            HERO BLOCK (Eyebrow, Subtitle)
            Fades away on scroll.
            ================================================================ */}
        <div
          ref={heroBlockRef}
          className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-16 pointer-events-none"
          style={{ zIndex: 45 }}
        >
          {/* Subtitle & hanging tag */}
          <div
            ref={heroSubtitleRef}
            className="relative flex flex-col items-center gap-4 pointer-events-none"
            style={{ zIndex: 2 }}
          >
            <p
              className="rounded-full bg-[#141414] px-5 py-2 font-mono font-black uppercase tracking-[0.22em] text-[#F7F2F6]/85"
              style={{ fontSize: "clamp(0.6rem, 1.1vw, 0.85rem)" }}
            >
              Ideas today. A better tomorrow.
            </p>
          </div>

          {/* Explore CTA */}
          <div ref={exploreRef} className="relative mt-8 pointer-events-auto" style={{ zIndex: 2 }}>
            <button
              onClick={handleExplore}
              className="flex items-center gap-3 rounded-full border-2 border-white/25 bg-[#141414] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#F7F2F6] transition hover:scale-105 hover:border-[#33FF67] hover:bg-[#1c2a1f]"
            >
              EXPLORE THE JOURNEY <ArrowRight className="h-4 w-4 ml-1 text-[#33FF67]" />
            </button>
          </div>
        </div>

        {/* ================================================================
            JOURNEY LAYER — 2D Horizontal Space World
            Appears as hero fades; moves LEFT as user scrolls down.
            ================================================================ */}
        <div
          ref={journeyLayerRef}
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{ top: "var(--header-space, 200px)", opacity: 0, zIndex: 10, overflow: "hidden" }}
        >
          {/* Side scroll indicator */}
          <div
            ref={scrollIndicatorRef}
            className="absolute right-6 bottom-28 z-20 hidden md:flex items-center gap-3 rounded-full border border-white/10 bg-[#1A1A1A] px-4 py-2 opacity-0 shadow-lg"
          >
            <Mouse className="h-4 w-4 text-[#33FF67] animate-bounce" />
            <div className="text-left">
              <span className="block font-mono text-[9px] font-black uppercase tracking-widest text-[#F7F2F6]">
                Scroll Down To Move Left
              </span>
              <span ref={indicatorEventRef} className="block font-mono text-[8px] font-medium tracking-wider text-[#7484FE]">
                Journey through 10 Events
              </span>
            </div>
          </div>

          {/* Scaler Wrapper: dynamically shrinks world to fit available height */}
          <div
            className="absolute inset-0"
            style={{
              transform: "translateY(var(--journey-offset-y, 0px)) scale(var(--journey-scale, 0.65))",
              transformOrigin: "0% 0%",
            }}
          >
            {/* Horizontal world */}
            <div
              ref={worldRef}
              className="absolute left-0 will-change-transform"
              style={{ width: `${TOTAL_WORLD_WIDTH}px`, height: "1080px", top: "0%" }}
            >
              <svg
                viewBox={`0 0 ${TOTAL_WORLD_WIDTH} 1080`}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <radialGradient id="flame-glow" cx="0%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#33FF67" stopOpacity="1" />
                    <stop offset="60%" stopColor="#33FF67" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#33FF67" stopOpacity="0" />
                  </radialGradient>
                  <clipPath id="earth-launch-clip">
                    <circle cx="0" cy="0" r="140" />
                  </clipPath>
                  <radialGradient id="earth-launch-backing" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="#E0E7FF" />
                    <stop offset="65%" stopColor="#818CF8" />
                    <stop offset="90%" stopColor="#4338CA" />
                    <stop offset="100%" stopColor="#1E1B4B" />
                  </radialGradient>
                  <radialGradient id="earth-glow" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#7484FE" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#4154F5" stopOpacity="0.7" />
                    <stop offset="70%" stopColor="#2A2A2A" stopOpacity="1" />
                    <stop offset="100%" stopColor="#1E1E1E" stopOpacity="1" />
                  </radialGradient>
                  {/* Painted halo, replaces an SVG drop-shadow filter: a filter re-rasterizes
                      its whole subtree on every repaint of the translating world. */}
                  <radialGradient id="earth-halo" cx="50%" cy="50%" r="50%">
                    <stop offset="60%" stopColor="#7484FE" stopOpacity="0" />
                    <stop offset="78%" stopColor="#7484FE" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#7484FE" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="portal-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#33FF67" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#7484FE" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#2A2A2A" stopOpacity="0" />
                  </radialGradient>
                  <PlanetGradients />
                </defs>

                {/* Ambient stars */}
                <g opacity="0.35">
                  {Array.from({ length: 75 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={(i * 240 + 180) % TOTAL_WORLD_WIDTH}
                      cy={(i * 143 + 110) % 960}
                      r={i % 3 === 0 ? 2 : 1.2}
                      fill={i % 4 === 0 ? "#7484FE" : i % 5 === 0 ? "#33FF67" : "#F7F2F6"}
                    />
                  ))}
                </g>

                {/* Earth launch site */}
                <g transform="translate(320, 800)">
                  <circle cx="0" cy="0" r="165" fill="none" stroke="#7484FE" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
                  <ellipse cx="0" cy="0" rx="170" ry="48" fill="none" stroke="#7484FE" strokeWidth="1.5" opacity="0.6" transform="rotate(-15)" />
                  
                  <circle cx="0" cy="0" r="200" fill="url(#earth-halo)" />
                  <g>
                    <circle cx="0" cy="0" r="140" fill="url(#earth-launch-backing)" />
                    <image
                      href="/planets/Earth.png"
                      x="-155"
                      y="-155"
                      width="310"
                      height="310"
                      clipPath="url(#earth-launch-clip)"
                      preserveAspectRatio="xMidYMid slice"
                    />
                    <circle cx="0" cy="0" r="140" fill="none" stroke="#7484FE" strokeWidth="2" opacity="0.85" />
                  </g>

                  {/* Editorial Pill Tag Under Earth */}
                  <g transform="translate(0, 165)">
                    <rect
                      x="-85"
                      y="-12"
                      width="170"
                      height="24"
                      rx="12"
                      fill="#2A2A2A"
                      stroke="#7484FE"
                      strokeWidth="1.2"
                      opacity="0.95"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#7484FE"
                      fontFamily="monospace"
                      fontSize="10"
                      fontWeight="bold"
                      letterSpacing="1.5"
                    >
                      EARTH · MLRIT
                    </text>
                  </g>
                </g>

                {/* 10 planets */}
                {PLANET_LAYOUTS.map((layout, idx) => {
                  const ev = subEvents[idx];
                  if (!ev) return null;
                  return <PlanetSVG key={ev.id} index={idx} event={ev} x={layout.x} y={layout.y} badge={layout.badge} />;
                })}

                {/* Summit gateway */}
                <g transform="translate(15800, 540)">
                  <circle cx="0" cy="0" r="180" fill="none" stroke="#7484FE" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
                  <circle cx="0" cy="0" r="145" fill="none" stroke="#33FF67" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.6" />
                  <circle cx="0" cy="0" r="105" fill="url(#portal-glow)" />
                  <circle cx="0" cy="0" r="105" fill="none" stroke="#F7F2F6" strokeWidth="2" opacity="0.8" />
                  <text x="0" y="4" textAnchor="middle" fill="#F7F2F6" fontFamily="monospace" fontSize="11" fontWeight="bold" letterSpacing="2">
                    SUMMIT GATEWAY
                  </text>
                </g>

                {/* Journey path */}
                <path ref={pathRef} d={JOURNEY_SQUIGGLY_PATH} fill="none" stroke="#7484FE" strokeWidth="3.5" opacity="0.85" strokeLinecap="round" />
                <path d={JOURNEY_SQUIGGLY_PATH} fill="none" stroke="#33FF67" strokeWidth="1.5" strokeDasharray="6 10" opacity="0.65" />

                {/* Rocket */}
                <g ref={rocketRef} style={{ willChange: "transform" }}>
                  <path d="M -22,-5 L -38,0 L -22,5 Z" fill="url(#flame-glow)" className="animate-pulse" />
                  <path d="M -20,-3 L -30,0 L -20,3 Z" fill="#33FF67" opacity="0.9" />
                  <path d="M 28,0 Q 8,-12 -18,-10 L -22,-6 L -22,6 L -18,10 Q 8,12 28,0 Z" fill="#F7F2F6" stroke="#2A2A2A" strokeWidth="2" />
                  <path d="M -8,-9 L -18,-18 L -14,-9 Z" fill="#7484FE" />
                  <path d="M -8,9 L -18,18 L -14,9 Z" fill="#7484FE" />
                  <circle cx="14" cy="0" r="5.5" fill="#2A2A2A" stroke="#7484FE" strokeWidth="1.5" />
                  <circle cx="16" cy="-1.5" r="1.5" fill="#F7F2F6" opacity="0.8" />
                </g>
              </svg>

              {/* Event detail cards */}
              {PLANET_LAYOUTS.map((layout, idx) => {
                const ev = subEvents[idx];
                if (!ev) return null;
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={ev.id}
                    ref={(el) => { cardRefs.current[idx] = el; }}
                    className="absolute opacity-0 rounded-[28px] p-1.5 bg-[#0E0E0E] border border-white/[0.10] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] pointer-events-none"
                    style={{
                      left: `${layout.x + 220}px`,
                      top: `${layout.cardTop}px`,
                      width: "430px",
                      transform: "scale(calc(1 / var(--journey-scale, 0.65)))",
                      transformOrigin: "left center"
                    }}
                  >
                    {/* Inner core: solid dark panel (no backdrop-filter — it repainted every
                        scroll frame while the world translated, which is what made this lag) */}
                    <div className="relative rounded-[22px] bg-[#151515] p-5 border border-white/[0.06] shadow-[inset_0_1px_1px_rgba(255,255,255,0.10)] overflow-hidden">
                      {/* Accent edge, replaces the blurred corner aura */}
                      <div
                        className={`pointer-events-none absolute inset-x-0 top-0 h-px ${isEven ? "bg-[#7484FE]/50" : "bg-[#33FF67]/50"}`}
                      />
                      {/* Subtle background blueprint grid accent */}
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                      <div className="relative z-10 flex flex-col items-start text-left">
                        {/* Eyebrow Pill Tag */}
                        <div className="flex items-center justify-between w-full">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-[0.16em] uppercase border ${isEven
                              ? "text-[#7484FE] bg-[#7484FE]/10 border-[#7484FE]/30 shadow-[0_0_15px_rgba(116,132,254,0.15)]"
                              : "text-[#33FF67] bg-[#33FF67]/10 border-[#33FF67]/30 shadow-[0_0_15px_rgba(51,255,103,0.15)]"
                            }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isEven ? "bg-[#7484FE]" : "bg-[#33FF67]"}`} />
                            <span>{String(idx + 1).padStart(2, "0")} / 10 · {ev.category}</span>
                          </div>

                        </div>

                        {/* Event Logo Header */}
                        <div className="mt-4 mb-2 relative h-24 w-full flex items-center justify-start border-b border-white/[0.06] pb-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/logos/${ev.slug}.png`}
                            alt={ev.name}
                            className="h-full w-auto object-contain object-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                            draggable={false}
                          />
                        </div>

                        {/* Tagline */}
                        <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#7484FE]">
                          {ev.tagline}
                        </p>

                        {/* Description */}
                        <p className="mt-2 text-[13px] leading-relaxed text-[#F7F2F6]/75 font-sans line-clamp-2 font-normal">
                          {ev.description}
                        </p>

                        {/* Nested CTA & "Button-in-Button" Trailing Icon Architecture */}
                        <div className="mt-4 flex items-center w-full">
                          <Link
                            href={`/events/${ev.slug}`}
                            className="group relative inline-flex items-center justify-between gap-4 rounded-full pl-6 pr-2 py-2 text-xs font-mono font-bold uppercase tracking-[0.12em] text-[#161616] bg-[#33FF67] shadow-[0_0_20px_rgba(51,255,103,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(51,255,103,0.55)] hover:bg-[#45ff75] hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <span>Explore Event</span>
                            <span className="w-7 h-7 rounded-full bg-[#181818]/15 flex items-center justify-center text-[#161616] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* ================================================================
            LOADING SCREEN
            ================================================================ */}
        <div
          className={`fixed inset-0 flex flex-col items-center justify-center bg-[#2A2A2A] transition-opacity duration-700 ${showLoader ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          style={{ zIndex: 60 }}
        >
          <div className="flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-display-title text-4xl sm:text-6xl tracking-tighter text-[#F7F2F6] mb-6">EQUINOX</h1>
            <span className="font-mono text-xs sm:text-sm font-black tracking-[0.25em] text-[#7484FE] uppercase mb-4">LOADING EXPERIENCE</span>
            <div className="h-[2px] w-48 sm:w-64 bg-white/15 overflow-hidden relative">
              <div className="absolute inset-0 bg-[#33FF67] w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
