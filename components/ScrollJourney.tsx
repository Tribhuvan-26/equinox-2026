"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";
import { ArrowRight, Mouse } from "lucide-react";
import Globe from "./Globe";
import { HangingTag, InstitutionalHeader } from "../app/EventGraphics";
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
  const heroBlockRef    = useRef<HTMLDivElement>(null);   // entire hero content
  const globeHeroRef    = useRef<HTMLDivElement>(null);   // large background globe
  const heroWordmarkRef = useRef<HTMLDivElement>(null);   // "EQUINOX"
  const equinRef        = useRef<HTMLSpanElement>(null);  // "EQUIN" part
  const oRef            = useRef<HTMLSpanElement>(null);  // "O" part
  const xRef            = useRef<HTMLSpanElement>(null);  // "X" part
  const heroSubtitleRef = useRef<HTMLDivElement>(null);   // tag + subtitle
  const exploreRef      = useRef<HTMLDivElement>(null);   // CTA button

  // ── PERSISTENT HEADER WRAPPER ──────────────────────────────────────────────
  const persistentHeaderRef = useRef<HTMLDivElement>(null);

  // ── JOURNEY LAYER ────────────────────────────────────────────────────────────
  const journeyLayerRef   = useRef<HTMLDivElement>(null);
  const worldRef          = useRef<HTMLDivElement>(null);
  const rocketRef         = useRef<SVGGElement>(null);
  const pathRef           = useRef<SVGPathElement>(null);
  const cardRefs          = useRef<(HTMLDivElement | null)[]>([]);
  const completionCardRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const indicatorEventRef  = useRef<HTMLSpanElement>(null);
  const lenisRef          = useRef<Lenis | null>(null);

  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [showLoader, setShowLoader]     = useState(true);

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
      const pt     = path.getPointAtLength(curLen);
      const nextPt = path.getPointAtLength(Math.min(curLen + 4, totalPathLen));
      const angle  = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);

      rocketRef.current.setAttribute("transform", `translate(${pt.x}, ${pt.y}) rotate(${angle})`);

      const targetScreenX = Math.min(window.innerWidth * 0.28, 420);
      const worldX = pt.x > targetScreenX ? -(pt.x - targetScreenX) : 0;
      worldRef.current.style.transform = `translate3d(${worldX}px, 0, 0)`;

      let currentEventTitle = "";
      PLANET_LAYOUTS.forEach((layout, idx) => {
        const cardEl = cardRefs.current[idx];
        if (!cardEl) return;
        const dist = Math.abs(pt.x - layout.x);
        if (dist < 480) {
          const t = Math.max(0, 1 - dist / 420);
          cardEl.style.opacity = `${t}`;
          cardEl.style.transform = `translateY(${(1 - t) * 20}px)`;
          cardEl.style.pointerEvents = t > 0.4 ? "auto" : "none";
          if (t > 0.3) currentEventTitle = `${layout.badge} · ${subEvents[idx]?.name || ""}`;
        } else {
          cardEl.style.opacity = "0";
          cardEl.style.pointerEvents = "none";
        }
      });

      if (completionCardRef.current) {
        if (pt.x > 14600) {
          const t = Math.min(1, Math.max(0, (pt.x - 14600) / 600));
          completionCardRef.current.style.opacity = `${t}`;
          completionCardRef.current.style.transform = `translateY(${(1 - t) * 20}px)`;
          completionCardRef.current.style.pointerEvents = t > 0.4 ? "auto" : "none";
          if (t > 0.3) currentEventTitle = "Expedition Complete · All 10 Explored";
        } else {
          completionCardRef.current.style.opacity = "0";
          completionCardRef.current.style.pointerEvents = "none";
        }
      }

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
        y: "-42vh", // Moves from center of screen up to underneath navbar
        scale: 0.35, 
        duration: 0.05,
        ease: "power2.inOut" 
      }, 0.1);

      // --- PHASE 3 (15%–20%): Journey layer fades in ---
      mainTl.to(journeyLayerRef.current, { opacity: 1, duration: 0.05 }, 0.15);
      mainTl.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.05 }, 0.15);

      // --- PHASE 4 (20%–100%): Horizontal journey ---
      const journeyProxy = { progress: 0 };
      mainTl.to(journeyProxy, {
        progress: 1,
        ease: "none",
        duration: 0.8,
        onUpdate: function() {
          updateJourneyProgress(this.targets()[0].progress);
        }
      }, 0.2);

      updateJourneyProgress(0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "1500vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#2A2A2A]">

        {/* ── SPARSE STAR FIELD ────────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <svg width="100%" height="100%">
            <pattern id="static-stars" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
              <circle fill="#F7F2F6" cx="28"  cy="22"  r="1.1" opacity="0.35" />
              <circle fill="#F7F2F6" cx="115" cy="48"  r="1.4" opacity="0.55" />
              <circle fill="#F7F2F6" cx="57"  cy="108" r="0.9" opacity="0.25" />
              <circle fill="#7484FE" cx="138" cy="125" r="1.6" opacity="0.45" />
              <circle fill="#33FF67" cx="88"  cy="18"  r="0.9" opacity="0.35" />
              <circle fill="#F7F2F6" cx="14"  cy="70"  r="1.0" opacity="0.30" />
              <circle fill="#F7F2F6" cx="145" cy="78"  r="1.3" opacity="0.40" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#static-stars)" />
          </svg>
        </div>

        {/* ================================================================
            INSTITUTIONAL HEADER (NavBar area) — always fixed on top
            ================================================================ */}
        <div
          className="fixed top-0 left-0 w-full px-4 pt-4 sm:px-8 sm:pt-6 pointer-events-auto"
          style={{ zIndex: 50 }}
        >
          <InstitutionalHeader />
        </div>

        {/* ================================================================
            COMBINED PERSISTENT HEADER WRAPPER
            Holds the HTML EQUIN X and the Globe in the center initially.
            Animates UP to navbar later.
            ================================================================ */}
        <div
          ref={persistentHeaderRef}
          className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 40 }}
        >
          {/* Large Globe — starts huge in hero, shrinks and moves to act as the "O" */}
          <div
            ref={globeHeroRef}
            className="absolute flex items-center justify-center will-change-transform pointer-events-none"
            style={{
              width: "min(85vw, 85vh)",
              height: "min(85vw, 85vh)",
              borderRadius: "50%",
              overflow: "hidden",
              zIndex: 3, // Sit alongside the text, not behind it
            }}
          >
            <Globe
              onReady={handleGlobeReady}
              speed={2}
              dots={{ color: "#ffffff", size: 5, density: 8, allDots: false }}
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
            <HangingTag />
            <p
              className="font-mono font-black uppercase tracking-[0.22em] text-[#F7F2F6]/70"
              style={{ fontSize: "clamp(0.6rem, 1.1vw, 0.85rem)" }}
            >
              Ideas today. A better tomorrow.
            </p>
          </div>

          {/* Explore CTA */}
          <div ref={exploreRef} className="relative mt-8 pointer-events-auto" style={{ zIndex: 2 }}>
            <button
              onClick={handleExplore}
              className="flex items-center gap-3 rounded-full border-2 border-white/20 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#F7F2F6] backdrop-blur-xs transition hover:scale-105 hover:border-[#33FF67] hover:bg-[#33FF67]/10"
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
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0, zIndex: 10 }}
        >
          {/* Side scroll indicator */}
          <div
            ref={scrollIndicatorRef}
            className="absolute right-6 bottom-10 z-20 hidden md:flex items-center gap-3 rounded-full border border-white/10 bg-[#2A2A2A]/85 px-4 py-2 backdrop-blur-md opacity-0 shadow-lg"
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

          {/* Horizontal world */}
          <div
            ref={worldRef}
            className="absolute top-1/2 left-0 will-change-transform"
            style={{ width: `${TOTAL_WORLD_WIDTH}px`, height: "1080px", marginTop: "-540px" }}
          >
            <svg
              viewBox={`0 0 ${TOTAL_WORLD_WIDTH} 1080`}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: "visible" }}
            >
              <defs>
                <radialGradient id="flame-glow" cx="0%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#33FF67" stopOpacity="1" />
                  <stop offset="60%"  stopColor="#33FF67" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#33FF67" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="earth-glow" cx="30%" cy="30%" r="70%">
                  <stop offset="0%"   stopColor="#7484FE" stopOpacity="0.8" />
                  <stop offset="70%"  stopColor="#2A2A2A" stopOpacity="1" />
                  <stop offset="100%" stopColor="#1E1E1E" stopOpacity="1" />
                </radialGradient>
                <radialGradient id="portal-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#33FF67" stopOpacity="0.9" />
                  <stop offset="50%"  stopColor="#7484FE" stopOpacity="0.5" />
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
                <circle cx="0" cy="0" r="160" fill="none" stroke="#7484FE" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
                <circle cx="0" cy="0" r="140" fill="url(#earth-glow)" />
                <circle cx="0" cy="0" r="140" fill="none" stroke="#7484FE" strokeWidth="2" opacity="0.4" />
                <ellipse cx="0" cy="0" rx="155" ry="40" fill="none" stroke="#7484FE" strokeWidth="1.5" opacity="0.5" transform="rotate(-15)" />
                <text x="0" y="5" textAnchor="middle" fill="#F7F2F6" fontFamily="monospace" fontSize="11" fontWeight="bold" letterSpacing="3">
                  EARTH · MLRIT
                </text>
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
              return (
                <div
                  key={ev.id}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  className="absolute opacity-0 rounded-3xl border border-white/10 bg-[#2A2A2A]/85 p-7 sm:p-8 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.55)] pointer-events-none"
                  style={{ left: `${layout.x + 220}px`, top: `${layout.cardTop}px`, width: "420px" }}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className={`font-mono text-xs font-black tracking-widest uppercase px-3 py-1 rounded-md border ${idx % 2 === 0 ? "text-[#7484FE] bg-[#7484FE]/10 border-[#7484FE]/30" : "text-[#33FF67] bg-[#33FF67]/10 border-[#33FF67]/30"}`}>
                      {String(idx + 1).padStart(2, "0")} / 10 · {ev.category}
                    </span>
                    <div className="mt-5 mb-2 relative h-10 sm:h-12 w-full flex justify-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`/logos/${ev.slug}.png`}
                        alt={ev.name} 
                        className="h-full w-auto object-contain object-left drop-shadow-md" 
                        draggable={false}
                      />
                    </div>
                    <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wider text-[#7484FE]">{ev.tagline}</p>
                    <p className="mt-4 text-sm text-[#F7F2F6]/90 leading-relaxed font-sans line-clamp-3">{ev.description}</p>
                    <div className="mt-6 flex items-center gap-4">
                      <Link href={`/events/${ev.slug}`} className="inline-flex items-center gap-2 rounded-full bg-[#33FF67] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[#2A2A2A] shadow-[0px_0px_25px_rgba(51,255,103,0.35)] transition hover:scale-105 hover:bg-[#F7F2F6]">
                        Explore Event <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Expedition completion card */}
            <div
              ref={completionCardRef}
              className="absolute opacity-0 rounded-3xl border border-[#33FF67]/30 bg-[#2A2A2A]/90 p-8 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.6)] pointer-events-none"
              style={{ left: "15200px", top: "280px", width: "440px" }}
            >
              <div className="flex flex-col items-start text-left">
                <span className="font-mono text-xs font-black tracking-widest text-[#33FF67] uppercase bg-[#33FF67]/10 px-3 py-1 rounded-md border border-[#33FF67]/30">Mission Accomplished · 10/10</span>
                <h3 className="mt-3 font-display-title text-4xl font-black uppercase text-[#F7F2F6] leading-none tracking-tight">Summit Gateway</h3>
                <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wider text-[#7484FE]">The Equinox 2.0 Awaits</p>
                <p className="mt-4 text-sm text-[#F7F2F6]/90 leading-relaxed font-sans">You have charted every event across the Equinox cosmos. Scroll down to enter the summit story, keynote schedule, venue guides, and registrations.</p>
                <div className="mt-6">
                  <a href="#about" className="inline-flex items-center gap-2 rounded-full bg-[#7484FE] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[#F7F2F6] shadow-[0px_0px_25px_rgba(116,132,254,0.35)] transition hover:scale-105 hover:bg-[#F7F2F6] hover:text-[#2A2A2A]">
                    Enter Summit Below <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
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
