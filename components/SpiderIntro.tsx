"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { sanityAssets } from "@/lib/sanity-assets";
import { urlForImage } from "@/sanity/lib/image";

const cieMarkUrl = "/logos/cie-mark-white.png";

const BLUE = "#7484FE";
const GREEN = "#33FF67";
const PAPER = "#F7F2F6";

// /logos/cie-mark-white.png glyph right-edges (px), measured on the source
// asset (1532x652 — see CIE_IMAGE_WIDTH below). These are percentages of the
// IMAGE's own width, not the viewport or the rendered CSS width, so the
// reveal is correct no matter how large/small the logo is drawn on screen.
const CIE_IMAGE_WIDTH = 1532;
const CIE_GLYPH_END_X = { c: 620, i: 905, e: 1530 };
// Fraction of the mark's width still covered once this glyph is revealed.
const coverFraction = (endX: number) => 1 - endX / CIE_IMAGE_WIDTH;

const MOBILE_BREAKPOINT = 640;

const filterValid = (arr: (Element | null | undefined)[]) =>
  arr.filter((el): el is Element => Boolean(el));

/**
 * Spider-Verse style opener: CIE reads clean, letter by letter, holds, then
 * tears into the EQUINOX lockup.
 *
 * Perf/responsiveness rules this file follows:
 *  - Only transform, opacity and clip-path are animated (GPU-composited,
 *    never trigger layout).
 *  - The glitch is a fixed, small number of discrete GSAP tweens (3 steps on
 *    desktop, 2 on narrow screens) — not a loop generating many tweens.
 *  - Displacement distance is read from the rendered logo width ONCE before
 *    the timeline is built, then reused — no per-frame measurement, no
 *    per-frame randomness.
 *  - Logo sizing is done with clamp()/aspect-ratio in the JSX below, so the
 *    same timeline works unchanged from a 320px phone to a 4K desktop.
 */
export default function SpiderIntro({ onDone }: { onDone?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cieRef = useRef<HTMLDivElement>(null);
  const cieArtRef = useRef<HTMLImageElement>(null);
  const ciePlatesRef = useRef<(HTMLDivElement | null)[]>([]);
  const wordRef = useRef<HTMLDivElement>(null);
  const wordArtRef = useRef<HTMLImageElement>(null);
  const wordPlatesRef = useRef<(HTMLDivElement | null)[]>([]);
  const coverRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  // Rendered into <body>: inside the journey tree, transformed ancestors trap a
  // fixed overlay in their own stacking context and the nav paints over it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // The portal renders on the second pass, so the refs only exist once mounted.
    if (!mounted || !rootRef.current || !cieRef.current) return;

    let cancelled = false;
    let ctx: gsap.Context | null = null;
    let activeTl: gsap.core.Timeline | null = null;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(failsafe);
      try {
        sessionStorage.setItem("equinox_intro_done", "true");
      } catch (e) {}
      onDone?.();
      window.dispatchEvent(new Event("equinox:intro-done"));
    };
    const failsafe = setTimeout(finish, 7000);

    const onVisibilityChange = () => {
      if (!activeTl) return;
      if (document.hidden) activeTl.pause();
      else activeTl.resume();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const whenVisible = (fn: () => void) => {
      if (!document.hidden) { fn(); return; }
      const onVisible = () => {
        if (document.hidden) return;
        document.removeEventListener("visibilitychange", onVisible);
        fn();
      };
      document.addEventListener("visibilitychange", onVisible);
    };

    const begin = () => {
      if (cancelled) return;
      whenVisible(() => {
        if (cancelled || !rootRef.current || !cieRef.current) return;

        // Configure GSAP ticker so it never skips initial frames even if mobile frame drops
        gsap.ticker.lagSmoothing(500, 33);

        const activeTargets = filterValid([cieRef.current, cieArtRef.current]);
        if (activeTargets.length > 0) {
          gsap.set(activeTargets, { willChange: "transform", force3D: true });
        }
        const coverTargets = filterValid([coverRef.current, flashRef.current]);
        if (coverTargets.length > 0) {
          gsap.set(coverTargets, {
            willChange: "transform, opacity",
            force3D: true,
          });
        }

        const cieWidth = cieRef.current.getBoundingClientRect().width || 300;

        const startIntro = () => {
          if (cancelled || !rootRef.current) return;
          ctx = buildTimeline(cieWidth);
        };

        requestAnimationFrame(() => requestAnimationFrame(startIntro));
      });
    };

    const cieImg = cieArtRef.current;
    const wordImg = wordArtRef.current;
    const decodePromises: Promise<unknown>[] = [];
    if (cieImg && !cieImg.complete && typeof cieImg.decode === "function") {
      decodePromises.push(cieImg.decode());
    }
    if (wordImg && !wordImg.complete && typeof wordImg.decode === "function") {
      decodePromises.push(wordImg.decode());
    }

    if (decodePromises.length > 0) {
      Promise.race([
        Promise.all(decodePromises),
        new Promise((resolve) => setTimeout(resolve, 150)),
      ]).catch(() => {}).then(begin);
    } else {
      begin();
    }

    function buildTimeline(cieWidth: number) {
      return gsap.context(() => {
        const ciePlates = ciePlatesRef.current.filter((el): el is HTMLDivElement => Boolean(el));
        const wordPlates = wordPlatesRef.current.filter((el): el is HTMLDivElement => Boolean(el));
        const [ciePaper, cieBlue, cieGreen] = ciePlates;
        const [wordBlue, wordGreen] = wordPlates;

        if (
          !rootRef.current ||
          !cieRef.current ||
          !coverRef.current ||
          !wordRef.current ||
          !wordArtRef.current ||
          !ciePaper ||
          !cieBlue ||
          !cieGreen ||
          !wordBlue ||
          !wordGreen
        ) {
          finish();
          return;
        }

        const unit = Math.min(26, Math.max(5, cieWidth * 0.035));
        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

        const tl = gsap.timeline({ onComplete: finish });
        activeTl = tl;

        const startDelay = isMobile ? 0.05 : 0.15;
        const cDur = isMobile ? 0.25 : 0.55;
        const iStart = isMobile ? 0.35 : 0.90;
        const iDur = isMobile ? 0.20 : 0.40;
        const eStart = isMobile ? 0.60 : 1.50;
        const eDur = isMobile ? 0.20 : 0.45;
        const glitchTime = isMobile ? 0.90 : 2.55;

        tl.set(filterValid([cieBlue, cieGreen, wordRef.current]), { opacity: 0 })
          .set(ciePaper, { opacity: 0 })
          .set(cieRef.current, { opacity: 1 }, 0)
          .set(coverRef.current, { scaleX: 1 }, 0)
          .set(filterValid([wordBlue, wordGreen]), { opacity: 0 }, 0)
          .set(wordArtRef.current, { opacity: 0 }, 0)
          .to(coverRef.current, { scaleX: coverFraction(CIE_GLYPH_END_X.c), duration: cDur, ease: "power2.out" }, startDelay)
          .to(coverRef.current, { scaleX: coverFraction(CIE_GLYPH_END_X.i), duration: iDur, ease: "power2.out" }, iStart)
          .to(coverRef.current, { scaleX: coverFraction(CIE_GLYPH_END_X.e), duration: eDur, ease: "power2.out" }, eStart);

        const jitter = () => gsap.utils.random(-2, 2, 1);
        const steps = isMobile
          ? [{ reach: unit * 0.8, opacity: 0.65 }, { reach: unit * 1.6, opacity: 0.95 }]
          : [{ reach: unit * 0.4, opacity: 0.4 }, { reach: unit * 0.9, opacity: 0.7 }, { reach: unit * 1.6, opacity: 0.95 }];

        tl.addLabel("glitch", glitchTime);
        tl.call(() => {
          const promoTargets = filterValid([cieBlue, cieGreen, wordBlue, wordGreen, wordArtRef.current]);
          if (promoTargets.length > 0) {
            gsap.set(promoTargets, { willChange: "transform, opacity", force3D: true });
          }
        }, undefined, "glitch-=0.1");

        if (gridRef.current) {
          tl.to(gridRef.current, { opacity: 1, duration: isMobile ? 0.25 : 0.35, ease: "power1.out" }, "glitch");
        }

        let t = 0;
        steps.forEach((step, i) => {
          const jx = jitter();
          const jy = jitter();
          tl.to(cieBlue, { opacity: step.opacity, x: -step.reach + jx, y: jy, duration: 0.05, ease: "steps(1)" }, `glitch+=${t}`)
            .to(cieGreen, { opacity: step.opacity, x: step.reach - jx, y: -jy, duration: 0.05, ease: "steps(1)" }, `glitch+=${t}`);
          const isLast = i === steps.length - 1;
          if (!isLast) {
            tl.to(filterValid([cieBlue, cieGreen]), { opacity: 0, x: 0, y: 0, duration: 0.05, ease: "steps(1)" }, `glitch+=${t + (isMobile ? 0.08 : 0.1)}`);
          }
          t += isMobile ? 0.12 : 0.18;
        });

        tl.addLabel("tear", `glitch+=${t + 0.05}`)
          .to(ciePaper, { opacity: 1, duration: 0.03 }, "tear");
        if (cieArtRef.current) {
          tl.to(cieArtRef.current, { opacity: 0, duration: 0.03 }, "tear");
        }
        tl.to(cieRef.current, { scale: 1.04, duration: 0.08, ease: "steps(2)" }, "tear");

        if (flashRef.current) {
          tl.to(flashRef.current, { opacity: 0.85, duration: 0.05 }, "tear+=0.08")
            .to(flashRef.current, { opacity: 0, duration: 0.12 }, "tear+=0.14");
        }

        tl.set(cieRef.current, { opacity: 0 }, "tear+=0.13")
          .set(wordRef.current, { opacity: 1 }, "tear+=0.13");

        const settleDur = isMobile ? 0.15 : 0.32;
        const liftHold = isMobile ? 0.15 : 0.45;
        const liftFade = isMobile ? 0.25 : 0.5;

        tl.fromTo(
          wordArtRef.current,
          { scale: 1.15, opacity: 0 },
          { scale: 1, opacity: 1, duration: settleDur, ease: "power4.out" },
          "tear+=0.13",
        )
          .fromTo(
            wordBlue,
            { x: -unit * 1.8, y: unit * 0.5, opacity: 0.9, scale: 1.15 },
            { x: 0, y: 0, opacity: 0, scale: 1, duration: settleDur + 0.06, ease: "power3.out" },
            "tear+=0.13",
          )
          .fromTo(
            wordGreen,
            { x: unit * 1.8, y: -unit * 0.5, opacity: 0.9, scale: 1.15 },
            { x: 0, y: 0, opacity: 0, scale: 1, duration: settleDur + 0.06, ease: "power3.out" },
            "tear+=0.13",
          )
          .to({}, { duration: liftHold });

        if (rootRef.current) {
          tl.to(rootRef.current, { opacity: 0, duration: liftFade, ease: "power2.inOut" });
        }
      }, rootRef);
    }

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      ctx?.revert();
    };
  }, [mounted, onDone]);

  const plate = (src: string, color: string | null, ref: (el: HTMLDivElement | null) => void) => (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0"
      style={
        color
          ? {
              backgroundColor: color,
              maskImage: `url(${src})`,
              WebkitMaskImage: `url(${src})`,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              mixBlendMode: "screen",
            }
          : {
              backgroundColor: PAPER,
              maskImage: `url(${src})`,
              WebkitMaskImage: `url(${src})`,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskSize: "contain",
              WebkitMaskSize: "contain",
            }
      }
    />
  );

  if (!mounted) return null;

  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-[2147483647] overflow-hidden bg-[#2A2A2A]">
      {/* Backdrop fades from plain (matching CIE's own clean, flat mark — it
          has no loader effect of its own to borrow) into this site's grid
          texture as the glitch transition kicks in. */}
      <div ref={gridRef} aria-hidden className="riso-texture brochure-grid pointer-events-none absolute inset-0 opacity-0" />

      {/* stage. Both logos are sized with clamp() + aspect-ratio (matching
          each asset's native ratio, ~2.35:1) instead of fixed vh/px, so the
          same markup and timeline are correct from a 320px phone to a 4K
          desktop — no separate mobile/desktop layout branch. */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        {/* CIE mark */}
        <div
          ref={cieRef}
          className="relative"
          style={{ width: "clamp(220px, 60vw, 620px)", aspectRatio: "1532 / 652" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-ratio brand asset */}
          <img
            ref={cieArtRef}
            src={cieMarkUrl}
            alt="MLR Centre for Innovation and Entrepreneurship"
            className="absolute inset-0 h-full w-full object-contain"
            style={{ transform: "translateZ(0)" }}
          />
          {plate(cieMarkUrl, null, (el) => { ciePlatesRef.current[0] = el; })}
          {plate(cieMarkUrl, BLUE, (el) => { ciePlatesRef.current[1] = el; })}
          {plate(cieMarkUrl, GREEN, (el) => { ciePlatesRef.current[2] = el; })}
          {/* opaque cover, retreats left-to-right via scaleX (GPU-only —
              never clip-path) to reveal C, then I, then E. */}
          <div
            ref={coverRef}
            aria-hidden
            className="absolute inset-0 bg-[#2A2A2A]"
            style={{ transformOrigin: "100% 50%", transform: "translateZ(0)" }}
          />
        </div>

        {/* EQUINOX lockup, official artwork. Hidden by plain CSS (not just the
            GSAP tl.set below) so it can never flash on top of the CIE mark
            during the decode/rAF gap before the timeline builds. */}
        <div
          ref={wordRef}
          className="absolute opacity-0"
          style={{ width: "clamp(260px, 78vw, 900px)", aspectRatio: "2824 / 1187" }}
        >
          {/* Chromatic aberration plates sit BEHIND the artwork */}
          {plate("/equinox-logo.svg", BLUE, (el) => { wordPlatesRef.current[0] = el; })}
          {plate("/equinox-logo.svg", GREEN, (el) => { wordPlatesRef.current[1] = el; })}
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-ratio brand asset */}
          <img
            ref={wordArtRef}
            src="/equinox-logo.svg"
            alt="The Equinox 2.0 E-Summit 2K26"
            className="absolute inset-0 h-full w-full object-contain opacity-0"
            style={{ transform: "translateZ(0)" }}
          />
        </div>
      </div>

      {/* single frame blowout at the tear */}
      <div ref={flashRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" style={{ backgroundColor: PAPER }} />
    </div>,
    document.body,
  );
}
