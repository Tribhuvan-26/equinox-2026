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
import SpiderIntro from "./SpiderIntro";
import GlitchWordmark from "./GlitchWordmark";
import MobileJourney from "./MobileJourney";
import {
  PLANET_LAYOUTS,
  JOURNEY_SQUIGGLY_PATH,
  TOTAL_WORLD_WIDTH,
  PlanetSVG,
  PlanetGradients,
} from "./JourneyPlanets";

gsap.registerPlugin(ScrollTrigger);

// Prominent, beautiful twinkling stars with deterministic coordinates and asynchronous phases
const TWINKLE_STARS = [
  // Top quadrant
  { x: 5, y: 11, size: 4.5, color: "#F7F2F6", duration: 3.2, delay: -0.8, type: "dot" as const },
  { x: 13, y: 21, size: 6.0, color: "#7484FE", duration: 4.1, delay: -2.3, type: "dot" as const },
  { x: 22, y: 8, size: 3.5, color: "#F7F2F6", duration: 2.8, delay: -1.4, type: "dot" as const },
  { x: 31, y: 17, size: 16.0, color: "#F7F2F6", duration: 5.2, delay: -3.7, type: "sparkle" as const },
  { x: 41, y: 10, size: 4.5, color: "#33FF67", duration: 3.6, delay: -0.5, type: "dot" as const },
  { x: 52, y: 6, size: 5.2, color: "#F7F2F6", duration: 4.4, delay: -1.9, type: "dot" as const },
  { x: 63, y: 15, size: 3.8, color: "#7484FE", duration: 3.0, delay: -2.7, type: "dot" as const },
  { x: 74, y: 9, size: 18.0, color: "#F7F2F6", duration: 4.8, delay: -0.9, type: "sparkle" as const },
  { x: 83, y: 19, size: 4.5, color: "#F7F2F6", duration: 3.5, delay: -3.1, type: "dot" as const },
  { x: 93, y: 12, size: 5.2, color: "#33FF67", duration: 4.2, delay: -1.6, type: "dot" as const },

  // Upper-middle band
  { x: 4, y: 34, size: 5.2, color: "#F7F2F6", duration: 3.9, delay: -2.1, type: "dot" as const },
  { x: 11, y: 43, size: 3.5, color: "#7484FE", duration: 2.6, delay: -0.7, type: "dot" as const },
  { x: 20, y: 30, size: 18.0, color: "#7484FE", duration: 5.5, delay: -4.0, type: "sparkle" as const },
  { x: 35, y: 37, size: 4.5, color: "#F7F2F6", duration: 3.3, delay: -1.2, type: "dot" as const },
  { x: 47, y: 28, size: 3.8, color: "#F7F2F6", duration: 4.6, delay: -3.4, type: "dot" as const },
  { x: 57, y: 38, size: 6.0, color: "#F7F2F6", duration: 3.7, delay: -0.4, type: "dot" as const },
  { x: 68, y: 32, size: 4.2, color: "#33FF67", duration: 4.0, delay: -2.8, type: "dot" as const },
  { x: 78, y: 41, size: 3.5, color: "#F7F2F6", duration: 3.1, delay: -1.5, type: "dot" as const },
  { x: 87, y: 31, size: 17.0, color: "#F7F2F6", duration: 5.0, delay: -2.2, type: "sparkle" as const },
  { x: 95, y: 39, size: 4.5, color: "#7484FE", duration: 3.8, delay: -0.3, type: "dot" as const },

  // Center / Lower-middle band
  { x: 7, y: 55, size: 3.5, color: "#F7F2F6", duration: 3.4, delay: -1.8, type: "dot" as const },
  { x: 17, y: 61, size: 6.0, color: "#33FF67", duration: 4.5, delay: -3.5, type: "dot" as const },
  { x: 26, y: 51, size: 4.5, color: "#F7F2F6", duration: 2.9, delay: -0.6, type: "dot" as const },
  { x: 37, y: 58, size: 3.8, color: "#7484FE", duration: 4.3, delay: -2.4, type: "dot" as const },
  { x: 46, y: 50, size: 18.0, color: "#F7F2F6", duration: 5.8, delay: -4.5, type: "sparkle" as const },
  { x: 55, y: 62, size: 4.5, color: "#F7F2F6", duration: 3.2, delay: -1.1, type: "dot" as const },
  { x: 66, y: 53, size: 5.2, color: "#7484FE", duration: 4.1, delay: -2.9, type: "dot" as const },
  { x: 75, y: 60, size: 3.5, color: "#F7F2F6", duration: 2.7, delay: -0.8, type: "dot" as const },
  { x: 84, y: 52, size: 6.0, color: "#F7F2F6", duration: 4.7, delay: -3.9, type: "dot" as const },
  { x: 93, y: 63, size: 4.2, color: "#33FF67", duration: 3.5, delay: -1.7, type: "dot" as const },

  // Bottom quadrant
  { x: 4, y: 77, size: 16.0, color: "#F7F2F6", duration: 4.9, delay: -2.0, type: "sparkle" as const },
  { x: 14, y: 87, size: 4.2, color: "#F7F2F6", duration: 3.3, delay: -0.7, type: "dot" as const },
  { x: 22, y: 73, size: 5.2, color: "#7484FE", duration: 4.2, delay: -3.3, type: "dot" as const },
  { x: 32, y: 84, size: 3.5, color: "#F7F2F6", duration: 2.8, delay: -1.3, type: "dot" as const },
  { x: 43, y: 75, size: 4.8, color: "#33FF67", duration: 3.9, delay: -2.5, type: "dot" as const },
  { x: 53, y: 88, size: 3.5, color: "#F7F2F6", duration: 4.5, delay: -4.1, type: "dot" as const },
  { x: 62, y: 78, size: 19.0, color: "#7484FE", duration: 5.4, delay: -1.0, type: "sparkle" as const },
  { x: 71, y: 85, size: 4.5, color: "#F7F2F6", duration: 3.1, delay: -2.6, type: "dot" as const },
  { x: 82, y: 74, size: 5.2, color: "#F7F2F6", duration: 4.0, delay: -0.4, type: "dot" as const },
  { x: 92, y: 86, size: 3.5, color: "#7484FE", duration: 3.6, delay: -3.0, type: "dot" as const },
];

export default function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── HERO LAYER (initial state, fades out on scroll) ─────────────────────────
  const heroBlockRef = useRef<HTMLDivElement>(null);   // entire hero content
  const globeHeroRef = useRef<HTMLDivElement>(null);   // large background globe
  const heroWordmarkRef = useRef<HTMLDivElement>(null);   // "EQUINOX"
  const heroSubtitleRef = useRef<HTMLDivElement>(null);   // tag + subtitle

  const persistentHeaderRef = useRef<HTMLDivElement>(null);
  const navbarWrapperRef = useRef<HTMLDivElement>(null);

  // ── JOURNEY LAYER ────────────────────────────────────────────────────────────
  const journeyLayerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<SVGGElement>(null);
  const flameTrailRef = useRef<SVGGElement>(null);
  const idleFlameRef = useRef<SVGGElement>(null);
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
  // Below 768px the 16500px horizontal world is unusable, so the journey phases
  // are skipped and <MobileJourney /> renders the same 10 events as a vertical spine.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const handleGlobeReady = useCallback(() => setIsGlobeReady(true), []);

  // ── LENIS + GSAP ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;
    if (typeof window !== "undefined") (window as any).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== "undefined") delete (window as any).__lenis;
    };
  }, []);

  // ── VELOCITY-REACTIVE ROCKET IGNITION ───────────────────────────────────────
  useEffect(() => {
    let currentIntensity = 0;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const flameTick = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      const lenisVelocity = Math.abs(lenisRef.current?.velocity || 0);
      const effectiveSpeed = Math.max(lenisVelocity, scrollDelta);

      // Thresholds:
      // Slow/normal scroll has effectiveSpeed < 10 -> 0 ignition.
      // Fast scroll / flick produces effectiveSpeed up to 60+ -> powerful energetic ignition trail.
      const minThreshold = 8;
      const maxThreshold = 65;
      const targetIntensity = Math.min(
        Math.max((effectiveSpeed - minThreshold) / (maxThreshold - minThreshold), 0),
        1
      );

      // Asymmetric GSAP-style smoothing: fast attack (0.28), smooth natural dissipation (0.09)
      const lerpSpeed = targetIntensity > currentIntensity ? 0.28 : 0.09;
      currentIntensity += (targetIntensity - currentIntensity) * lerpSpeed;

      if (currentIntensity < 0.003) {
        currentIntensity = 0;
      }

      if (flameTrailRef.current) {
        if (currentIntensity > 0) {
          // Dynamic flame flare with natural high-speed plasma jitter
          const jitterX = 1 + (Math.random() - 0.5) * 0.16 * currentIntensity;
          const jitterY = 1 + (Math.random() - 0.5) * 0.12 * currentIntensity;
          const scaleX = (0.25 + currentIntensity * 1.35) * jitterX;
          const scaleY = (0.35 + currentIntensity * 0.85) * jitterY;
          const opacity = Math.min(1, currentIntensity * 1.3);

          flameTrailRef.current.style.transform = `scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
          flameTrailRef.current.style.opacity = opacity.toFixed(3);
        } else {
          flameTrailRef.current.style.opacity = "0";
        }
      }

      if (idleFlameRef.current) {
        // Idle pilot flame is subtle at rest and gently yields when the main afterburner ignites
        const idleOpacity = Math.max(0, 0.75 - currentIntensity * 1.5);
        idleFlameRef.current.style.opacity = idleOpacity.toFixed(3);
      }
    };

    gsap.ticker.add(flameTick);
    return () => {
      gsap.ticker.remove(flameTick);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsGlobeReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // The opener plays for a fixed beat; it calls back when its last frame lands.
  // The globe keeps loading underneath, so the two never wait on each other.
  const handleIntroDone = useCallback(() => setShowLoader(false), []);

  useEffect(() => {
    document.body.style.overflow = showLoader ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showLoader]);

  // ── JOURNEY PROGRESS ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pathRef.current || !rocketRef.current || !worldRef.current) return;
    const path = pathRef.current;
    const totalPathLen = path.getTotalLength();

    // Rocket directional state & smooth 180° rotation when scrolling in the opposite direction
    let lastProgress = 0;
    let rocketDirection: 1 | -1 = 1;
    const turnRotation = { value: 0 };
    let currentRocketState = { x: 360, y: 690, baseAngle: 0, scale: 1, opacity: 1 };

    const applyRocketTransform = () => {
      if (!rocketRef.current) return;
      const totalAngle = currentRocketState.baseAngle + turnRotation.value;
      const scale = currentRocketState.scale ?? 1;
      const opacity = currentRocketState.opacity ?? 1;
      rocketRef.current.setAttribute(
        "transform",
        `translate(${currentRocketState.x}, ${currentRocketState.y}) rotate(${totalAngle.toFixed(2)}) scale(${scale.toFixed(3)})`
      );
      rocketRef.current.style.opacity = `${opacity.toFixed(3)}`;
      rocketRef.current.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
    };

    const setRocketDirection = (newDir: 1 | -1) => {
      if (rocketDirection === newDir) return;
      rocketDirection = newDir;
      const targetValue = newDir === -1 ? 180 : 0;
      gsap.to(turnRotation, {
        value: targetValue,
        duration: 0.42,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: applyRocketTransform,
      });
    };

    const updateJourneyProgress = (p: number) => {
      if (!rocketRef.current || !worldRef.current || !pathRef.current) return;
      const curLen = p * totalPathLen;
      const pt = path.getPointAtLength(curLen);
      const stepAhead = curLen + 4 <= totalPathLen ? 4 : -4;
      const refPt = path.getPointAtLength(curLen + stepAhead);
      const angle = stepAhead > 0
        ? Math.atan2(refPt.y - pt.y, refPt.x - pt.x) * (180 / Math.PI)
        : Math.atan2(pt.y - refPt.y, pt.x - refPt.x) * (180 / Math.PI);

      // Detect motion delta along the path
      const deltaP = p - lastProgress;
      lastProgress = p;
      if (deltaP < -0.0002) {
        setRocketDirection(-1);
      } else if (deltaP > 0.0002) {
        setRocketDirection(1);
      }

      // Smooth black hole event horizon entry: progressively scale down and fade
      const blackHoleX = 15800;
      const blackHoleY = 540;
      const distToBlackHole = Math.hypot(pt.x - blackHoleX, pt.y - blackHoleY);

      let blackHoleScale = 1;
      let blackHoleOpacity = 1;

      if (pt.x > 15300) {
        const horizonOuter = 260; // Event horizon approach
        const horizonCenter = 40; // Singularity center
        if (distToBlackHole <= horizonCenter) {
          blackHoleScale = 0;
          blackHoleOpacity = 0;
        } else if (distToBlackHole < horizonOuter) {
          const norm = (distToBlackHole - horizonCenter) / (horizonOuter - horizonCenter);
          blackHoleScale = Math.max(0, Math.min(1, Math.pow(norm, 1.2)));
          blackHoleOpacity = Math.max(0, Math.min(1, Math.pow(norm, 1.4)));
        }
      }

      currentRocketState = {
        x: pt.x,
        y: pt.y,
        baseAngle: angle,
        scale: blackHoleScale,
        opacity: blackHoleOpacity,
      };
      applyRocketTransform();

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
            if (self.progress > 0.15 && self.progress < 0.95) {
              if (self.direction === -1) {
                setRocketDirection(-1);
              } else if (self.direction === 1) {
                setRocketDirection(1);
              }
            } else if (self.progress <= 0.15) {
              setRocketDirection(1);
            }
          },
        },
      });

      // --- PHASE 1 (0%–10%): Hero to Wordmark ---
      mainTl.fromTo(heroSubtitleRef.current,
        { scale: 1 },
        { opacity: 0, y: -20, scale: 1.35, duration: 0.1, ease: "power1.in" },
        0
      );

      // The lockup is on screen from the first frame; scroll only settles its scale.
      mainTl.fromTo(heroWordmarkRef.current,
        { scale: 1.06 },
        { scale: 1, duration: 0.1 },
        0
      );

      mainTl.to(globeHeroRef.current, {
        scale: 0.18,
        autoAlpha: 0,
        duration: 0.1,
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
      if (!isMobile) {
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
      }

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
        // Measure what the world actually occupies instead of hard-coding it: the
        // planets, their rings, badges and the launch site all move when the layout
        // changes, and a stale constant either crops them or wastes half the screen.
        const worldSvg = worldRef.current?.querySelector("#journey-content");
        let contentTop = 0;
        let activeHeight = 1055;
        if (worldSvg) {
          try {
            const box = (worldSvg as SVGGraphicsElement).getBBox();
            if (box.height > 0) {
              contentTop = box.y;
              activeHeight = box.height;
            }
          } catch {
            // getBBox throws while the SVG is still hidden; the fallback above holds.
          }
        }
        // Fill the height that is actually free. The old 0.65 cap left the world stuck in
        // the top half of tall or zoomed-out windows, with a dead band underneath.
        const journeyScale = Math.max(0.3, Math.min(availableHeight / activeHeight, 1));
        document.documentElement.style.setProperty('--journey-scale', `${journeyScale}`);
        journeyScaleRef.current = journeyScale;

        // Centre the measured content in that free height instead of pinning the
        // world box (whose empty top band is not content) to the top.
        const offsetY =
          Math.max(0, (availableHeight - activeHeight * journeyScale) / 2) - contentTop * journeyScale;
        document.documentElement.style.setProperty('--journey-offset-y', `${offsetY}px`);
      };
      updateHeaderSpace();
      window.addEventListener('resize', updateHeaderSpace);

      // ── DIRECT INSTANT RESET FOR HOMEPAGE NAVIGATION (NO REVERSE SCROLL) ────
      const resetScrollJourney = () => {
        // 1. Immediately cancel lenis velocity and teleport to top with zero smoothing
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
          lenisRef.current.velocity = 0;
        }
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        // 2. Snap GSAP timeline and its ScrollTrigger directly to 0 (no scrub delay)
        if (mainTl) {
          const st = mainTl.scrollTrigger;
          if (st) {
            st.scroll(0);
          }
          mainTl.progress(0, false);
        }

        // 3. Reset directional state & rotation
        rocketDirection = 1;
        turnRotation.value = 0;
        setIsGlobePaused(false);
        globePausedRef.current = false;

        // 4. Force reset rocket, world transform, cards, and HUD
        updateJourneyProgress(0);

        // 5. Tell ScrollTrigger to sync immediately at 0
        ScrollTrigger.update();
      };

      if (typeof window !== "undefined") {
        (window as any).__resetScrollJourney = resetScrollJourney;
      }

      return () => {
        window.removeEventListener("resize", updateHeaderSpace);
        if (typeof window !== "undefined") {
          delete (window as any).__resetScrollJourney;
        }
      };
    }, containerRef);

    return () => ctx.revert();
  }, [subEvents, isMobile]);

  // Force a ScrollTrigger refresh after a short delay to handle font loading
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <div ref={containerRef} className="relative w-full" style={{ height: isMobile ? "115vh" : "1500vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#2A2A2A]">

        {/* ── SPARSE STAR FIELD WITH MINIMAL TWINKLING STARS ──────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {/* Faint static backdrop pattern */}
          <svg width="100%" height="100%" className="absolute inset-0">
            <pattern id="static-stars" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
              <circle fill="#F7F2F6" cx="28" cy="22" r="2.2" opacity="0.45" />
              <circle fill="#F7F2F6" cx="115" cy="48" r="2.8" opacity="0.55" />
              <circle fill="#F7F2F6" cx="57" cy="108" r="2.0" opacity="0.40" />
              <circle fill="#7484FE" cx="138" cy="125" r="2.6" opacity="0.50" />
              <circle fill="#33FF67" cx="88" cy="18" r="2.2" opacity="0.45" />
              <circle fill="#F7F2F6" cx="14" cy="70" r="2.4" opacity="0.45" />
              <circle fill="#F7F2F6" cx="155" cy="78" r="2.5" opacity="0.50" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#static-stars)" />
          </svg>

          {/* Prominent twinkling stars layer */}
          <div className="absolute inset-0">
            {TWINKLE_STARS.map((star, i) => {
              if (star.type === "sparkle") {
                return (
                  <div
                    key={i}
                    className="star-anim-sparkle absolute pointer-events-none"
                    style={{
                      left: `${star.x}%`,
                      top: `${star.y}%`,
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      animationDuration: `${star.duration}s`,
                      animationDelay: `${star.delay}s`,
                      filter: `drop-shadow(0 0 6px ${star.color}) drop-shadow(0 0 12px ${star.color}99)`,
                    }}
                  >
                    <svg viewBox="0 0 10 10" width={star.size} height={star.size} fill="none">
                      <path
                        d="M 5 0 Q 5 5 10 5 Q 5 5 5 10 Q 5 5 0 5 Q 5 5 5 0 Z"
                        fill={star.color}
                        opacity="0.95"
                      />
                    </svg>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={i % 2 === 0 ? "star-anim-twinkle absolute pointer-events-none" : "star-anim-subtle absolute pointer-events-none"}
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    backgroundColor: star.color,
                    borderRadius: "50%",
                    boxShadow: `0 0 ${Math.round(star.size * 1.5)}px ${star.color}, 0 0 ${Math.round(star.size * 3)}px ${star.color}aa`,
                    animationDuration: `${star.duration}s`,
                    animationDelay: `${star.delay}s`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* ================================================================
            INSTITUTIONAL HEADER (NavBar area) — sticky to journey section
            ================================================================ */}
        <div
          ref={navbarWrapperRef}
          className="absolute top-0 left-0 hidden w-full px-4 pt-4 sm:block sm:px-8 sm:pt-6 pointer-events-auto"
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
            /* Phones get a smaller disc: at min(72vh, 88vw) the globe is almost
               the whole screen and the wordmark lands on top of it. */
            className="absolute flex h-[min(46vh,62vw)] w-[min(46vh,62vw)] items-center justify-center will-change-transform pointer-events-none md:h-[min(72vh,88vw)] md:w-[min(72vh,88vw)]"
            style={{
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
            className="absolute flex items-center justify-center select-none pointer-events-none"
            style={{ zIndex: 3 }}
          >
            <GlitchWordmark className="h-[22vh] w-[min(88vw,1100px)] will-change-transform md:h-[34vh] md:w-[min(92vw,1100px)]" />
          </div>
        </div>

        {/* ================================================================
            HERO BLOCK (Eyebrow, Subtitle)
            Fades away on scroll.
            ================================================================ */}
        <div
          ref={heroBlockRef}
          className="absolute inset-0 flex flex-col items-center justify-end pb-8 sm:pb-12 pointer-events-none"
          style={{ zIndex: 45 }}
        >
          {/* Subtitle & hanging tag */}
          <div
            ref={heroSubtitleRef}
            className="relative flex flex-col items-center gap-4 pointer-events-none"
            style={{ zIndex: 2 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/tagline-lockup.png"
              alt="# Where Passion Meets Perseverance"
              className="h-auto w-[min(94vw,880px)] object-contain"
              draggable={false}
            />
          </div>
        </div>

        {/* ================================================================
            JOURNEY LAYER — 2D Horizontal Space World
            Appears as hero fades; moves LEFT as user scrolls down.
            ================================================================ */}
        <div
          ref={journeyLayerRef}
          className="absolute left-0 right-0 bottom-0 pointer-events-none hidden md:block"
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
                  {/* Rocket Thruster Plasma Gradients */}
                  <linearGradient id="rocket-flame-core" x1="0" y1="0" x2="-85" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                    <stop offset="25%" stopColor="#33FF67" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="#7484FE" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7484FE" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="rocket-flame-plume" x1="0" y1="0" x2="-110" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#33FF67" stopOpacity="0.9" />
                    <stop offset="35%" stopColor="#00F0FF" stopOpacity="0.7" />
                    <stop offset="70%" stopColor="#7484FE" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#7484FE" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="rocket-flame-glow" cx="0" cy="0" r="50" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#33FF67" stopOpacity="0.85" />
                    <stop offset="40%" stopColor="#7484FE" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#7484FE" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="flame-glow" cx="0%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#33FF67" stopOpacity="1" />
                    <stop offset="60%" stopColor="#33FF67" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#33FF67" stopOpacity="0" />
                  </radialGradient>
                  <clipPath id="earth-launch-clip">
                    <circle cx="0" cy="0" r="190" />
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
                  {/* Moon Gradients */}
                  <radialGradient id="moon-surface" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#E2E8F0" />
                    <stop offset="70%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#475569" />
                  </radialGradient>
                  <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="50%" stopColor="#F7F2F6" stopOpacity="0" />
                    <stop offset="80%" stopColor="#F7F2F6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#7484FE" stopOpacity="0" />
                  </radialGradient>
                  {/* Death Star Easter Egg Gradients */}
                  <radialGradient id="death-star-body" cx="32%" cy="28%" r="72%">
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="30%" stopColor="#64748B" />
                    <stop offset="65%" stopColor="#334155" />
                    <stop offset="85%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0B0F17" />
                  </radialGradient>
                  <radialGradient id="death-star-dish" cx="42%" cy="42%" r="58%">
                    <stop offset="0%" stopColor="#0F172A" />
                    <stop offset="65%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#334155" />
                  </radialGradient>
                  <radialGradient id="superlaser-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                    <stop offset="40%" stopColor="#33FF67" stopOpacity="0.85" />
                    <stop offset="75%" stopColor="#33FF67" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#33FF67" stopOpacity="0" />
                  </radialGradient>
                  <PlanetGradients />
                </defs>

                {/* Ambient stars */}
                <g opacity="0.65">
                  {Array.from({ length: 85 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={(i * 240 + 180) % TOTAL_WORLD_WIDTH}
                      cy={(i * 143 + 110) % 960}
                      r={i % 4 === 0 ? 4.0 : i % 2 === 0 ? 3.0 : 2.2}
                      fill={i % 4 === 0 ? "#7484FE" : i % 5 === 0 ? "#33FF67" : "#F7F2F6"}
                    />
                  ))}
                </g>

                {/* Everything that must stay on screen. The star field sits outside this
                    group: it is decoration and may run off the edges. */}
                <g id="journey-content">
                  {/* Earth launch site */}
                  <g transform="translate(320, 727)">
                    {/* Moon orbital track */}
                    <circle
                      cx="0"
                      cy="0"
                      r="275"
                      fill="none"
                      stroke="#F7F2F6"
                      strokeWidth="1.2"
                      strokeDasharray="4 8"
                      opacity="0.28"
                    />

                    <circle cx="0" cy="0" r="225" fill="none" stroke="#7484FE" strokeWidth="1.2" strokeDasharray="4 6" opacity="0.4" />
                    <ellipse cx="0" cy="0" rx="230" ry="65" fill="none" stroke="#7484FE" strokeWidth="1.5" opacity="0.6" transform="rotate(-15)" />

                    <circle cx="0" cy="0" r="260" fill="url(#earth-halo)" />
                    <g>
                      <circle cx="0" cy="0" r="190" fill="url(#earth-launch-backing)" />
                      <image
                        href="/planets/Earth.svg"
                        x="-210"
                        y="-210"
                        width="420"
                        height="420"
                        clipPath="url(#earth-launch-clip)"
                        preserveAspectRatio="xMidYMid slice"
                      />
                      <circle cx="0" cy="0" r="190" fill="none" stroke="#7484FE" strokeWidth="2.5" opacity="0.85" />
                    </g>

                    {/* Moon orbiting around Earth */}
                    <g id="moon-orbit-group">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0"
                        to="360"
                        dur="26s"
                        repeatCount="indefinite"
                      />
                      <g transform="translate(275, 0)">
                        {/* Lunar subtle glow */}
                        <circle cx="0" cy="0" r="28" fill="url(#moon-glow)" />
                        {/* Moon body */}
                        <circle cx="0" cy="0" r="17" fill="url(#moon-surface)" />
                        {/* Minimal Moon Craters */}
                        <circle cx="-5" cy="-4" r="3.2" fill="#64748B" opacity="0.4" />
                        <circle cx="-6" cy="-4" r="2.8" fill="#475569" opacity="0.25" />
                        <circle cx="4" cy="5" r="2.6" fill="#64748B" opacity="0.35" />
                        <circle cx="5" cy="-2" r="1.9" fill="#64748B" opacity="0.3" />
                        <circle cx="-2" cy="6" r="2.1" fill="#64748B" opacity="0.25" />
                        <circle cx="1" cy="-5" r="1.5" fill="#64748B" opacity="0.25" />
                        {/* Crisp rim ring */}
                        <circle cx="0" cy="0" r="17" fill="none" stroke="#F7F2F6" strokeWidth="1" opacity="0.6" />
                      </g>
                    </g>

                    {/* Editorial Pill Tag Under Earth */}
                    <g transform="translate(0, 225)">
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

                  {/* ── EASTER EGG: DS-1 Orbital Battle Station (Death Star) ────────── */}
                  <g
                    transform="translate(5120, 175)"
                    className="death-star-easter-egg group pointer-events-auto cursor-help"
                    id="death-star-easter-egg"
                  >
                    {/* Ambient targeting reticle on hover */}
                    <circle
                      cx="0"
                      cy="0"
                      r="58"
                      fill="none"
                      stroke="#33FF67"
                      strokeWidth="0.8"
                      strokeDasharray="4 8"
                      className="opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="72"
                      fill="none"
                      stroke="#7484FE"
                      strokeWidth="0.5"
                      strokeDasharray="2 12"
                      className="opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                    />

                    {/* Death Star Sphere */}
                    <g className="transition-transform duration-500 ease-out group-hover:scale-110" style={{ transformOrigin: "0 0" }}>
                      {/* Shadow halo */}
                      <circle cx="0" cy="0" r="48" fill="none" stroke="#000000" strokeWidth="6" opacity="0.35" />
                      {/* Main hull */}
                      <circle cx="0" cy="0" r="44" fill="url(#death-star-body)" />

                      {/* Latitude panel grooves */}
                      <ellipse cx="0" cy="-24" rx="36" ry="7" fill="none" stroke="#64748B" strokeWidth="0.6" opacity="0.4" strokeDasharray="5 3" />
                      <ellipse cx="0" cy="-12" rx="42" ry="7.5" fill="none" stroke="#475569" strokeWidth="0.5" opacity="0.35" strokeDasharray="7 4" />
                      <ellipse cx="0" cy="14" rx="42" ry="7.5" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.4" strokeDasharray="6 3" />
                      <ellipse cx="0" cy="28" rx="34" ry="6.5" fill="none" stroke="#1E293B" strokeWidth="0.6" opacity="0.45" strokeDasharray="4 3" />

                      {/* Meridian panel seams */}
                      <line x1="-24" y1="-37" x2="-24" y2="-1.5" stroke="#475569" strokeWidth="0.5" opacity="0.35" />
                      <line x1="-8" y1="-43" x2="-8" y2="-1.5" stroke="#64748B" strokeWidth="0.5" opacity="0.3" />
                      <line x1="32" y1="-29" x2="32" y2="-1.5" stroke="#475569" strokeWidth="0.5" opacity="0.35" />
                      <line x1="-28" y1="1.5" x2="-28" y2="34" stroke="#334155" strokeWidth="0.5" opacity="0.35" />
                      <line x1="-10" y1="1.5" x2="-10" y2="43" stroke="#1E293B" strokeWidth="0.5" opacity="0.3" />
                      <line x1="16" y1="1.5" x2="16" y2="41" stroke="#334155" strokeWidth="0.5" opacity="0.35" />
                      <line x1="30" y1="1.5" x2="30" y2="32" stroke="#1E293B" strokeWidth="0.5" opacity="0.3" />

                      {/* Equatorial Trench */}
                      <rect x="-44" y="-2" width="88" height="4" fill="#070A10" />
                      <line x1="-44" y1="-2" x2="44" y2="-2" stroke="#334155" strokeWidth="0.8" opacity="0.8" />
                      <line x1="-44" y1="2" x2="44" y2="2" stroke="#1E293B" strokeWidth="0.8" opacity="0.9" />

                      {/* Trench city/hangar lights */}
                      <circle cx="-32" cy="0" r="0.9" fill="#33FF67" opacity="0.8" />
                      <circle cx="-18" cy="0" r="0.8" fill="#F7F2F6" opacity="0.7" />
                      <circle cx="-4" cy="0" r="0.9" fill="#7484FE" opacity="0.75" />
                      <circle cx="12" cy="0" r="1.0" fill="#33FF67" opacity="0.85" />
                      <circle cx="26" cy="0" r="0.8" fill="#F7F2F6" opacity="0.7" />
                      <circle cx="38" cy="0" r="0.9" fill="#7484FE" opacity="0.8" />

                      {/* Concave Superlaser Focus Dish (Northern Hemisphere) */}
                      <g transform="translate(14, -18)">
                        <circle cx="0" cy="0" r="14.5" fill="url(#death-star-dish)" stroke="#475569" strokeWidth="0.9" />
                        <circle cx="0" cy="0" r="11" fill="none" stroke="#334155" strokeWidth="0.6" opacity="0.7" />
                        <circle cx="0" cy="0" r="7.5" fill="none" stroke="#1E293B" strokeWidth="0.5" opacity="0.8" />

                        {/* Tributary beam channels converging on center */}
                        <line x1="-12" y1="-5" x2="-2" y2="-1" stroke="#33FF67" strokeWidth="0.7" opacity="0.75" />
                        <line x1="-8" y1="-10" x2="-1" y2="-2" stroke="#33FF67" strokeWidth="0.7" opacity="0.75" />
                        <line x1="0" y1="-13" x2="0" y2="-2" stroke="#33FF67" strokeWidth="0.7" opacity="0.75" />
                        <line x1="8" y1="-10" x2="1" y2="-2" stroke="#33FF67" strokeWidth="0.7" opacity="0.75" />
                        <line x1="12" y1="-5" x2="2" y2="-1" stroke="#33FF67" strokeWidth="0.7" opacity="0.75" />
                        <line x1="10" y1="6" x2="2" y2="1" stroke="#33FF67" strokeWidth="0.7" opacity="0.75" />
                        <line x1="0" y1="12" x2="0" y2="2" stroke="#33FF67" strokeWidth="0.7" opacity="0.75" />
                        <line x1="-10" y1="6" x2="-2" y2="1" stroke="#33FF67" strokeWidth="0.7" opacity="0.75" />

                        {/* Central Superlaser Emitter Core */}
                        <circle cx="0" cy="0" r="3.2" fill="#0D131D" stroke="#64748B" strokeWidth="0.8" />
                        <circle cx="0" cy="0" r="2.0" fill="#33FF67" className="death-star-laser-pulse" />
                        <circle
                          cx="0"
                          cy="0"
                          r="6"
                          fill="url(#superlaser-glow)"
                          className="opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </g>

                      {/* Outer rim highlight */}
                      <circle cx="0" cy="0" r="44" fill="none" stroke="#94A3B8" strokeWidth="0.8" opacity="0.45" />
                    </g>

                    {/* Easter Egg Monospace HUD Tag (Visible on Hover) */}
                    <g
                      transform="translate(0, 62)"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    >
                      <rect
                        x="-115"
                        y="-13"
                        width="230"
                        height="26"
                        rx="13"
                        fill="#141414"
                        stroke="#33FF67"
                        strokeWidth="1.2"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#33FF67"
                        fontFamily="monospace"
                        fontSize="9.5"
                        fontWeight="bold"
                        letterSpacing="1.4"
                      >
                        DS-1 · &ldquo;THAT&apos;S NO MOON&rdquo;
                      </text>
                    </g>
                  </g>

                  {/* 10 planets */}
                  {PLANET_LAYOUTS.map((layout, idx) => {
                    const ev = subEvents[idx];
                    if (!ev) return null;
                    return <PlanetSVG key={ev.id} index={idx} event={ev} x={layout.x} y={layout.y} badge={layout.badge} />;
                  })}

                  {/* Summit gateway (Black Hole) */}
                  <g transform="translate(15800, 540)">
                    {/* Gravitational event horizon & gravitational lensing orbital rings */}
                    <circle cx="0" cy="0" r="260" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 8" opacity="0.25" />
                    <circle cx="0" cy="0" r="200" fill="none" stroke="#7484FE" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />

                    {/* Black hole SVG */}
                    <image
                      href="/blackhole.svg"
                      x="-360"
                      y="-202.5"
                      width="720"
                      height="405"
                      preserveAspectRatio="xMidYMid meet"
                    />

                    {/* Summit Gateway HUD badge */}
                    <g transform="translate(0, 165)">
                      <rect x="-85" y="-13" width="170" height="26" rx="13" fill="#0E0E0E" stroke="#38BDF8" strokeWidth="1" opacity="0.85" />
                      <text x="0" y="4" textAnchor="middle" fill="#F7F2F6" fontFamily="monospace" fontSize="10" fontWeight="bold" letterSpacing="2">
                        SUMMIT GATEWAY
                      </text>
                    </g>
                  </g>

                  {/* Journey path (invisible guide path for rocket navigation) */}
                  <path ref={pathRef} d={JOURNEY_SQUIGGLY_PATH} fill="none" stroke="none" opacity="0" pointerEvents="none" />

                  {/* Rocket */}
                  <g ref={rocketRef} style={{ willChange: "transform" }}>
                    <g transform="scale(1.35)">
                      {/* Velocity-activated ignition flame trail */}
                      <g transform="translate(-22, 0)">
                        <g ref={flameTrailRef} style={{ willChange: "transform, opacity", opacity: 0 }}>
                          {/* Soft plasma exhaust aura */}
                          <ellipse cx="-45" cy="0" rx="45" ry="16" fill="url(#rocket-flame-glow)" opacity="0.65" />

                          {/* Outer supersonic plume */}
                          <path
                            d="M 0,-8 C -25,-12 -65,-7 -110,0 C -65,7 -25,12 0,8 Z"
                            fill="url(#rocket-flame-plume)"
                          />

                          {/* Inner energetic plasma flame */}
                          <path
                            d="M 0,-5 C -20,-7 -50,-4 -85,0 C -50,4 -20,7 0,5 Z"
                            fill="url(#rocket-flame-core)"
                          />

                          {/* White-hot thrust core */}
                          <path
                            d="M 0,-2.5 C -15,-3.5 -35,-2 -60,0 C -35,2 -15,3.5 0,2.5 Z"
                            fill="#FFFFFF"
                            opacity="0.95"
                          />

                          {/* Shock / Mach diamonds */}
                          <polygon points="-16,0 -22,-3 -28,0 -22,3" fill="#FFFFFF" opacity="0.9" />
                          <polygon points="-34,0 -39,-2.4 -44,0 -39,2.4" fill="#33FF67" opacity="0.85" />
                          <polygon points="-52,0 -56,-1.8 -60,0 -56,1.8" fill="#7484FE" opacity="0.75" />
                          <polygon points="-70,0 -73,-1.2 -76,0 -73,1.2" fill="#7484FE" opacity="0.6" />

                          {/* Wake trail sparks */}
                          <circle cx="-92" cy="-2.5" r="1.6" fill="#33FF67" opacity="0.75" />
                          <circle cx="-105" cy="2" r="1.3" fill="#7484FE" opacity="0.7" />
                          <circle cx="-120" cy="-1" r="1.1" fill="#FFFFFF" opacity="0.6" />
                          <circle cx="-135" cy="1.5" r="0.8" fill="#33FF67" opacity="0.5" />
                        </g>
                      </g>

                      {/* Idle pilot flame (at low / resting speed) */}
                      <g ref={idleFlameRef} transform="translate(-22, 0)">
                        <path d="M 0,-4 L -16,0 L 0,4 Z" fill="url(#flame-glow)" className="animate-pulse" />
                        <path d="M 0,-2.5 L -10,0 L 0,2.5 Z" fill="#33FF67" opacity="0.85" />
                      </g>

                      {/* Luke Spaceship (X-Wing) */}
                      <g transform="translate(4.7, 0) rotate(90)">
                        <image
                          href="/LukeSpaceship.svg"
                          x="-32"
                          y="-32"
                          width="64"
                          height="64"
                          preserveAspectRatio="xMidYMid meet"
                        />
                      </g>
                    </g>
                  </g>
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
                        <div className={`mt-4 mb-2 relative w-full flex items-center justify-start border-b border-white/[0.06] pb-3 ${ev.slug === "crossroads" ? "h-32" : "h-24"
                          }`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/logos/${ev.slug}.png`}
                            alt={ev.name}
                            className={`h-full w-auto object-contain object-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${ev.slug === "crossroads" ? "scale-125 origin-left" : ""
                              }`}
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

        {/* Opening sequence: MLR CIE mark, glitch, EQUINOX lockup */}
        {showLoader && <SpiderIntro onDone={handleIntroDone} />}
      </div>
    </div>
    <MobileJourney />
    </>
  );
}
