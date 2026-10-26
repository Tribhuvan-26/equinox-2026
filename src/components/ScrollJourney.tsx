"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { InstitutionalHeader } from "../app/EventGraphics";
import { subEvents } from "@/lib/content";
import SpiderIntro from "./SpiderIntro";
import GlitchWordmark from "./GlitchWordmark";
import NebulaBackground from "./NebulaBackground";
import ContinuousComet from "./ContinuousComet";
import MobileJourney from "./MobileJourney";

import {
  PLANET_LAYOUTS,
  JOURNEY_SQUIGGLY_PATH,
  TOTAL_WORLD_WIDTH,
  PlanetSVG,
  PlanetGradients,
} from "./JourneyPlanets";

/* three + d3-geo (~1.5MB) stay out of the initial bundle. The chunk is
   prefetched on mount (see ScrollJourney) so it loads during the intro loader,
   before the globe is first rendered. */
const loadGlobe = () => import("./Globe");
const Globe = dynamic(loadGlobe, { ssr: false });

gsap.registerPlugin(ScrollTrigger);

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
  const amongUsRef = useRef<SVGGElement>(null);
  const hasTriggeredAmongUs = useRef(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const indicatorEventRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const journeyScaleRef = useRef(0.65);
  const targetScreenXRef = useRef(420);

  const [isGlobeReady, setIsGlobeReady] = useState(false);
  useEffect(() => {
    void loadGlobe();
  }, []);
  // Globe keeps rendering every frame while it spins; it is a few pixels wide once
  // the journey starts, so pause it there and give those frames to the scroll.
  const [isGlobePaused, setIsGlobePaused] = useState(false);
  const globePausedRef = useRef(false);

  // Initialize showLoader based on whether this is the first time the component mounts in this JS context.
  // A hard refresh resets the JS context (isFirstSessionMount = true) so it plays the intro.
  // A client-side navigation preserves the context, so returning home skips the intro if done.
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window !== "undefined") {
      if ((window as any).__equinox_first_mount_done && sessionStorage.getItem("equinox_intro_done") === "true") {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__equinox_first_mount_done = true;
      if (!showLoader) {
        window.dispatchEvent(new Event("equinox:intro-done"));
      }
    }
  }, [showLoader]);

  // Below 768px the 19300px horizontal world is unusable, so the journey phases
  // are skipped and <MobileJourney /> renders the same 12 events as a vertical spine.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const handleGlobeReady = useCallback(() => setIsGlobeReady(true), []);

  // ── INSTANT SCROLL RESTORATION ───────────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    if (!showLoader && typeof window !== "undefined") {
      const savedY = sessionStorage.getItem("equinox_scroll_y");
      if (savedY) {
        window.scrollTo({ top: parseInt(savedY, 10), left: 0, behavior: "instant" });
      }
    }
  }, [showLoader]);

  // ── LENIS + GSAP ─────────────────────────────────────────────────────────────
  // Scroll is blocked (body overflow: hidden) for the entire SpiderIntro, so
  // there is nothing for Lenis or the journey ScrollTrigger to do until it
  // finishes — building them earlier just competes with the intro's own GSAP
  // timeline for the main thread during the first frames, which is what made
  // the intro's opening beats stutter.
  useEffect(() => {
    if (showLoader) return;
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as any).__lenis = lenis;
      const savedY = sessionStorage.getItem("equinox_scroll_y");
      if (savedY) lenis.scrollTo(parseInt(savedY, 10), { immediate: true });
    }
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
  }, [showLoader]);

  // ── VELOCITY-REACTIVE ROCKET IGNITION ───────────────────────────────────────
  useEffect(() => {
    if (showLoader) return;
    let currentIntensity = 0;

    const flameTick = () => {
      const lenisVelocity = Math.abs(lenisRef.current?.velocity || 0);
      const effectiveSpeed = lenisVelocity;

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

      // Optimization: Only update DOM if not idle
      if (currentIntensity === 0 && targetIntensity === 0 && (flameTrailRef.current?.style.opacity === "0" || !flameTrailRef.current)) {
        return;
      }

      if (flameTrailRef.current) {
        if (currentIntensity > 0) {
          // Dynamic flame flare with natural high-speed plasma jitter
          const jitterX = 1 + (Math.random() - 0.5) * 0.16 * currentIntensity;
          const jitterY = 1 + (Math.random() - 0.5) * 0.12 * currentIntensity;
          const scaleX = (0.25 + currentIntensity * 1.35) * jitterX;
          const scaleY = (0.35 + currentIntensity * 0.85) * jitterY;
          const opacity = Math.min(1, currentIntensity * 1.3);

          flameTrailRef.current.style.transform = `scale3d(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)}, 1)`;
          flameTrailRef.current.style.opacity = opacity.toFixed(3);
        } else if (flameTrailRef.current.style.opacity !== "0") {
          flameTrailRef.current.style.opacity = "0";
        }
      }

      if (idleFlameRef.current) {
        // Idle pilot flame is subtle at rest and gently yields when the main afterburner ignites
        const idleOpacity = Math.max(0, 0.75 - currentIntensity * 1.5);
        if (idleFlameRef.current.style.opacity !== idleOpacity.toFixed(3)) {
          idleFlameRef.current.style.opacity = idleOpacity.toFixed(3);
        }
      }
    };

    gsap.ticker.add(flameTick);
    return () => {
      gsap.ticker.remove(flameTick);
    };
  }, [showLoader]);

  useEffect(() => {
    const t = setTimeout(() => setIsGlobeReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // The opener plays for a fixed beat; it calls back when its last frame lands.
  // The globe keeps loading underneath, so the two never wait on each other.
  const handleIntroDone = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("equinox_intro_done", "true");
    }
    setShowLoader(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showLoader ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showLoader]);

  // ── JOURNEY PROGRESS ─────────────────────────────────────────────────────────
  // Same reasoning as the Lenis effect above: this builds the entire
  // scroll-scrubbed timeline (dozens of tweens) and forces a synchronous
  // layout read (getBBox in updateHeaderSpace) — deferred until the intro is
  // done since scrolling is blocked until then anyway.
  useEffect(() => {
    if (showLoader) return;
    if (!pathRef.current || !rocketRef.current || !worldRef.current) return;
    const path = pathRef.current;
    const totalPathLen = path.getTotalLength();

    // Rocket directional state & smooth 180° rotation when scrolling in the opposite direction
    let lastProgress = 0;
    let rocketDirection: 1 | -1 = 1;
    const turnRotation = { value: 0 };
    let currentRocketState = { x: 360, y: 690, baseAngle: 0, scale: 1, opacity: 1 };

    // Cache for DOM reads/writes to prevent thrashing
    const pointerEventsCache = new Map<number, string>();
    let lastHUDTitle = "";

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

      // Easter Egg Trigger: Among Us character drifting into black hole
      if (pt.x > 17150 && !hasTriggeredAmongUs.current && amongUsRef.current) {
        hasTriggeredAmongUs.current = true;

        // Start from the right side of Planet 12 (Musical Night is at x=17000, y=670)
        const startX = 17150;
        const startY = 670;
        const endX = 18600;
        const endY = 540;

        amongUsRef.current.style.visibility = "visible";

        gsap.fromTo(
          amongUsRef.current,
          {
            x: startX,
            y: startY,
            rotation: -45,
            scale: 0.8,
            opacity: 1
          },
          {
            x: endX,
            y: endY,
            rotation: 315, // slow rotation
            duration: 18,
            ease: "none",
            onUpdate: function () {
              if (!amongUsRef.current) return;
              const progress = this.progress();
              if (progress > 0.8) {
                const shrinkP = (progress - 0.8) / 0.2; // 0 to 1
                gsap.set(amongUsRef.current, {
                  scale: 0.8 * (1 - shrinkP),
                  opacity: 1 - shrinkP
                });
              }
            }
          }
        );
      }

      // Smooth black hole event horizon entry: progressively scale down and fade
      const blackHoleX = 18600;
      const blackHoleY = 540;
      const distToBlackHole = Math.hypot(pt.x - blackHoleX, pt.y - blackHoleY);

      let blackHoleScale = 1;
      let blackHoleOpacity = 1;

      if (pt.x > 18100) {
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

      // Scale is recomputed only on resize (updateHeaderSpace); reading it from a ref
      // keeps this scroll callback write-only, so it never forces a style flush per frame.
      const currentScale = journeyScaleRef.current;
      const inverseScale = 1 / currentScale;

      const unscaledTargetScreenX = targetScreenXRef.current / currentScale;
      const worldX = pt.x > unscaledTargetScreenX ? -(pt.x - unscaledTargetScreenX) : 0;

      let currentEventTitle = "";

      // Read Phase: Calculate all target states without mutating DOM
      const cardUpdates = PLANET_LAYOUTS.map((layout, idx) => {
        const cardEl = cardRefs.current[idx];
        if (!cardEl) return null;
        const dist = Math.abs(pt.x - layout.x);

        let opacity = "0";
        let transformY = 20;
        let pointerEvents = "none";

        if (dist < 480) {
          const t = Math.max(0, 1 - dist / 420);
          opacity = `${t}`;
          transformY = (1 - t) * 20;
          pointerEvents = t > 0.4 ? "auto" : "none";
          if (t > 0.3) currentEventTitle = `${layout.badge} · ${subEvents[idx]?.name || ""}`;
        }

        return {
          cardEl,
          idx,
          opacity,
          transformY,
          pointerEvents,
          visibility: dist < 1200 ? "visible" : "hidden",
          isActive: dist < 480
        };
      });

      // Write Phase: Apply all mutations at once
      applyRocketTransform();
      worldRef.current.style.transform = `translate3d(${worldX}px, 0, 0)`;

      cardUpdates.forEach((update) => {
        if (!update) return;
        const { cardEl, idx, opacity, transformY, pointerEvents, visibility, isActive } = update;

        if (isActive || cardEl.style.opacity !== "0") {
          cardEl.style.opacity = opacity;
          cardEl.style.transform = `translate3d(0, ${transformY}px, 0) scale3d(${inverseScale}, ${inverseScale}, 1)`;
        }

        if (pointerEventsCache.get(idx) !== pointerEvents) {
          cardEl.style.pointerEvents = pointerEvents;
          pointerEventsCache.set(idx, pointerEvents);
        }

        // Apply visibility for performance optimization
        if (cardEl.style.visibility !== visibility) {
          cardEl.style.visibility = visibility;
        }
      });

      if (indicatorEventRef.current && currentEventTitle !== lastHUDTitle) {
        indicatorEventRef.current.textContent = currentEventTitle;
        lastHUDTitle = currentEventTitle;
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

      if (isMobile) {
        // --- MOBILE SCROLL BEHAVIOR ---
        // 0% - 40%: Tagline fades out and scales up; globe shrinks & fades
        mainTl.fromTo(
          heroSubtitleRef.current,
          { scale: 1, opacity: 1 },
          { opacity: 0, y: -24, scale: 1.25, duration: 0.4, ease: "power1.in" },
          0
        );
        mainTl.to(
          globeHeroRef.current,
          { scale: 0.25, autoAlpha: 0, duration: 0.4, ease: "power1.in" },
          0
        );

        // 35% - 85%: EQUINOX wordmark scales down to a sleek docked size and slides to top of screen
        mainTl.to(
          persistentHeaderRef.current,
          {
            y: () => {
              if (!heroWordmarkRef.current) return -window.innerHeight * 0.35;
              const unscaledWordmarkHeight = heroWordmarkRef.current.offsetHeight || 100;
              const targetScale = 0.28;
              const scaledWordmarkHeight = unscaledWordmarkHeight * targetScale;
              // Dock comfortably near top with 24px clearance for mobile status bar / header
              const targetTop = 24;
              const wordmarkCenterY = window.innerHeight / 2;
              const scaledWordmarkTopBeforeTranslate = wordmarkCenterY - scaledWordmarkHeight / 2;
              return targetTop - scaledWordmarkTopBeforeTranslate;
            },
            scale: 0.28,
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          0.35
        );

        // 80% - 100%: Smoothly blend wordmark as mobile user scrolls directly into MobileJourney
        mainTl.to(
          persistentHeaderRef.current,
          {
            autoAlpha: 0,
            y: "-=30",
            duration: 0.2,
            ease: "power2.in",
          },
          0.85
        );
      } else {
        // --- DESKTOP SCROLL BEHAVIOR ---
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
            const targetScale = window.innerWidth < 1280 ? 0.28 : 0.35;
            const scaledWordmarkHeight = unscaledWordmarkHeight * targetScale;
            const targetWordmarkTop = navBottom + 16;
            const wordmarkCenterY = window.innerHeight / 2;
            const scaledWordmarkTopBeforeTranslate = wordmarkCenterY - (scaledWordmarkHeight / 2);

            return targetWordmarkTop - scaledWordmarkTopBeforeTranslate;
          },
          scale: () => window.innerWidth < 1280 ? 0.28 : 0.35,
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
      }

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
        // Use pre-calculated known bounds instead of synchronous getBBox()
        // The highest element is Death Star/Space Station (~50px), the lowest is Earth Launch (~980px).
        // Using these static known bounds completely avoids a costly synchronous layout thrash on resize.
        let contentTop = 50;
        let activeHeight = 1000;
        const journeyScale = Math.max(0.3, Math.min(availableHeight / activeHeight, 1));
        document.documentElement.style.setProperty('--journey-scale', `${journeyScale}`);
        journeyScaleRef.current = journeyScale;

        targetScreenXRef.current = Math.min(window.innerWidth * 0.28, 420);

        // Centre the measured content in that free height instead of pinning the
        // world box (whose empty top band is not content) to the top.
        const offsetY =
          Math.max(0, (availableHeight - activeHeight * journeyScale) / 2) - contentTop * journeyScale;
        document.documentElement.style.setProperty('--journey-offset-y', `${offsetY}px`);
      };
      let lastWidth = window.innerWidth;
      const handleResize = () => {
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          updateHeaderSpace();
        }
      };
      updateHeaderSpace();
      window.addEventListener('resize', handleResize);

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
        window.removeEventListener("resize", handleResize);
        if (typeof window !== "undefined") {
          delete (window as any).__resetScrollJourney;
        }
      };
    }, containerRef);

    // Save scroll position ONLY on intentional navigation clicks 
    // This prevents Next.js from overwriting it with 0 when it forces a scroll-to-top during route transitions
    const savePositionOnClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (link && link.href && !link.href.includes("#top")) {
        sessionStorage.setItem("equinox_scroll_y", window.scrollY.toString());
      }
    };
    document.addEventListener("click", savePositionOnClick, { capture: true });

    return () => {
      ctx.revert();
      document.removeEventListener("click", savePositionOnClick, { capture: true });
    };
  }, [subEvents, isMobile, showLoader]);

  // Force a ScrollTrigger refresh after a short delay to handle font loading
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div ref={containerRef} className="relative w-full" style={{ height: isMobile ? "115vh" : "1750vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          <div className="absolute inset-0 pointer-events-none z-[-10]">
            <NebulaBackground />
          </div>
          <div className="hidden md:block">
            <ContinuousComet />
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
              className="absolute flex h-[min(58vh,80vw)] w-[min(58vh,80vw)] items-center justify-center will-change-transform pointer-events-none md:h-[min(72vh,88vw)] md:w-[min(72vh,88vw)]"
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
              <GlitchWordmark className="h-[26vh] w-[min(96vw,1100px)] will-change-transform md:h-[34vh] md:w-[min(92vw,1100px)]" />
            </div>
          </div>

          {/* ================================================================
            HERO BLOCK (Eyebrow, Subtitle)
            Fades away on scroll.
            ================================================================ */}
          <div
            ref={heroBlockRef}
            className="absolute inset-0 flex flex-col items-center justify-end pb-24 sm:pb-12 pointer-events-none"
            style={{ zIndex: 45 }}
          >
            {/* Subtitle & hanging tag */}
            <div
              ref={heroSubtitleRef}
              className="relative flex flex-col items-center gap-4 pointer-events-none"
              style={{ zIndex: 2 }}
            >
              <h2 className="max-w-full px-4 text-center font-sans text-[5vw] font-bold tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl drop-shadow-md">
                #Where<span className="text-[#7484FE]">Passion</span>Meets<span className="text-[#33FF67]">Perseverance</span>
              </h2>
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
                    {/* Space Station and Portal Gradients */}
                    <radialGradient id="station-docking-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#7484FE" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#33FF67" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0B0F17" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="portal-cosmic-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#33DF5A" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="#29CE53" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#020904" stopOpacity="0" />
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
                      <g transform="translate(0, 242)">
                        <rect
                          x="-150"
                          y="-24"
                          width="300"
                          height="48"
                          rx="24"
                          fill="#1F2028"
                          stroke="#7484FE"
                          strokeWidth="2"
                          opacity="0.95"
                        />
                        <text
                          x="0"
                          y="7"
                          textAnchor="middle"
                          fill="#7484FE"
                          fontFamily="monospace"
                          fontSize="18"
                          fontWeight="bold"
                          letterSpacing="3"
                        >
                          EARTH · MLRIT
                        </text>
                      </g>
                    </g>

                    {/* ── EASTER EGG: Deep Space Orbital Station ────────── */}
                    <g
                      transform="translate(5120, 175)"
                      className="spacestation-easter-egg group pointer-events-auto cursor-help"
                      id="spacestation-easter-egg"
                    >
                      {/* Ambient docking reticle on hover */}
                      <circle
                        cx="0"
                        cy="0"
                        r="105"
                        fill="none"
                        stroke="#33FF67"
                        strokeWidth="0.8"
                        strokeDasharray="4 8"
                        className="opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="130"
                        fill="none"
                        stroke="#7484FE"
                        strokeWidth="0.5"
                        strokeDasharray="2 12"
                        className="opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                      />

                      {/* Space Station Asset */}
                      <g className="transition-transform duration-500 ease-out group-hover:scale-110" style={{ transformOrigin: "0 0" }}>
                        <image
                          href="/spacestation.svg"
                          x="-135"
                          y="-90"
                          width="270"
                          height="180"
                          preserveAspectRatio="xMidYMid meet"
                        />
                      </g>

                      {/* Easter Egg Monospace HUD Tag (Visible on Hover) */}
                      <g
                        transform="translate(0, 105)"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      >
                        <rect
                          x="-135"
                          y="-13"
                          width="270"
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
                          EQUINOX · DEEP SPACE STATION
                        </text>
                      </g>
                    </g>

                    {/* ── Interdimensional Portal Easter Egg near Planet 6 ────────── */}
                    <g
                      transform="translate(8480, 140)"
                      className="portal-gateway-easter-egg group pointer-events-auto cursor-pointer"
                      id="portal-gateway-planet6"
                    >
                      {/* Portal SVG asset */}
                      <g className="transition-transform duration-500 ease-out group-hover:scale-110" style={{ transformOrigin: "0 0" }}>
                        <image
                          href="/portol.svg"
                          x="-175"
                          y="-80"
                          width="350"
                          height="160"
                          preserveAspectRatio="xMidYMid meet"
                        />
                      </g>

                      {/* Monospace HUD Tag (Visible on Hover) */}
                      <g
                        transform="translate(0, 95)"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      >
                        <rect
                          x="-115"
                          y="-13"
                          width="230"
                          height="26"
                          rx="13"
                          fill="#141414"
                          stroke="#29CE53"
                          strokeWidth="1.2"
                          opacity="0.95"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill="#33DF5A"
                          fontFamily="monospace"
                          fontSize="9.5"
                          fontWeight="bold"
                          letterSpacing="1.4"
                        >
                          INTERDIMENSIONAL RIFT · 06
                        </text>
                      </g>
                    </g>

                    {/* ── EASTER EGG: DS-1 Orbital Battle Station (Death Star) above Planet 8 ────────── */}
                    <g
                      transform="translate(11400, 140)"
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

                    {/* 12 planets */}
                    {PLANET_LAYOUTS.map((layout, idx) => {
                      const ev = subEvents[idx];
                      if (!ev) return null;
                      return <PlanetSVG key={ev.id} index={idx} event={ev} x={layout.x} y={layout.y} badge={layout.badge} />;
                    })}

                    {/* Summit gateway (Black Hole) */}
                    <g transform="translate(18600, 540)">
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

                        {/* Spaceship */}
                        <g transform="translate(4.7, 0) rotate(90)">
                          <image
                            href="/spaceship.svg"
                            x="-34"
                            y="-34"
                            width="68"
                            height="68"
                            preserveAspectRatio="xMidYMid meet"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                  {/* Among Us Easter Egg */}
                  <g ref={amongUsRef} style={{ willChange: "transform, opacity", opacity: 0, visibility: "hidden" }}>
                    <image
                      href="/among-us.png"
                      x="-30"
                      y="-30"
                      width="60"
                      height="60"
                      preserveAspectRatio="xMidYMid meet"
                      className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    />
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
                      className="absolute opacity-0 rounded-[28px] p-1.5 bg-[#0E0E0E] border border-white/[0.10] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] pointer-events-none will-change-transform"
                      style={{
                        left: `${layout.x + 220}px`,
                        top: `${layout.cardTop}px`,
                        width: "430px",
                        transform: "scale(calc(1 / var(--journey-scale, 0.65)))",
                        transformOrigin: "left center",
                        contain: "paint layout"
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
                              <span>{String(idx + 1).padStart(2, "0")} / {subEvents.length} · {ev.category}</span>
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
