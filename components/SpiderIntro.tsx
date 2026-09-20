"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

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

    // The C reveal is the first animated frame, so it's the one exposed to
    // every "first time" cost: image decode, the browser's first paint of
    // this whole overlay, and (if opened in a background tab) GSAP's ticker
    // not having run yet. Three gates before the timeline is built:
    //  1. wait for the CIE mark to finish decoding (no-op if cached/preloaded)
    //  2. wait for the tab to actually be visible — opening a link in a new
    //     background tab (ctrl/cmd-click, target=_blank) leaves
    //     document.hidden true and starves requestAnimationFrame, which is
    //     what GSAP's ticker runs on; building/playing a timeline while
    //     hidden either never advances or, once the tab is later focused,
    //     can jump by the whole elapsed background time — either way the
    //     user never actually sees the intro play.
    //  3. promote the plates that will animate to their own compositing
    //     layers, then wait a double-rAF before the first tween runs.
    //     Layer promotion (willChange on mask-image elements) forces the
    //     browser to rasterize a GPU texture for each one — that allocation
    //     is what was still stuttering the C reveal even after gates 1-2,
    //     because it was previously done in the same synchronous tick as
    //     building and starting the timeline, so the layer-creation cost
    //     landed on the first animated frame instead of before it.
    let cancelled = false;
    let ctx: gsap.Context | null = null;
    let activeTl: gsap.core.Timeline | null = null;
    let finished = false;
    const img = cieArtRef.current;

    // Whatever finishes the intro — the timeline's own onComplete, or this
    // failsafe — runs through here exactly once, so the site can never be
    // left permanently stuck behind the overlay (a dev hot-reload
    // interrupting the timeline mid-tween, a decode/visibility gate that
    // never resolves, or any other stall all recover the same way).
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(failsafe);
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

        // Promote ONLY the elements active during Act 1 (the CIE reveal).
        // The chromatic glitch plates (cieBlue, cieGreen, wordBlue, wordGreen)
        // use heavy CSS mask-image and mix-blend-mode; allocating all 6 GPU textures
        // simultaneously on mobile GPUs right at mount causes a massive frame drop
        // exactly when the "C" begins revealing. They are promoted at Act 2 instead.
        gsap.set([cieRef.current, cieArtRef.current], { willChange: "transform", force3D: true });
        gsap.set([coverRef.current, flashRef.current], {
          willChange: "transform, opacity",
          force3D: true,
        });

        // Measured once, up front — never re-measured mid-timeline. The glitch
        // displacement scales with the logo's actual rendered width so it reads
        // the same proportionally on a phone and a laptop, and small enough on
        // narrow screens that it never throws the mark off-screen.
        const cieWidth = cieRef.current.getBoundingClientRect().width || 300;

        // Double-rAF ensures the browser compositor has finished rasterizing
        // the initial layers and painting the cover before the timeline begins.
        const startIntro = () => {
          if (cancelled || !rootRef.current) return;
          ctx = buildTimeline(cieWidth);
        };

        requestAnimationFrame(() => requestAnimationFrame(startIntro));
      });
    };

    if (img && !img.complete && typeof img.decode === "function") {
      // Race image decode with a fast 150ms timeout so a slow decode on mobile doesn't stall startup
      Promise.race([
        img.decode(),
        new Promise((resolve) => setTimeout(resolve, 150)),
      ]).catch(() => {}).then(begin);
    } else {
      begin();
    }

    function buildTimeline(cieWidth: number) {
      return gsap.context(() => {
      const ciePlates = ciePlatesRef.current.filter(Boolean) as HTMLDivElement[];
      const wordPlates = wordPlatesRef.current.filter(Boolean) as HTMLDivElement[];
      const [ciePaper, cieBlue, cieGreen] = ciePlates;
      const [wordPaper, wordBlue, wordGreen] = wordPlates;

      const unit = Math.min(26, Math.max(5, cieWidth * 0.035));
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

      const tl = gsap.timeline({ onComplete: finish });
      activeTl = tl;

      // Act 1 — CIE reads clean, one letter at a time.
      // On mobile, give a clean settling delay so the first
      // frame never hits mid-paint, and pace the letters faster.
      const startDelay = isMobile ? 0.05 : 0.15;
      const cDur = isMobile ? 0.25 : 0.55;
      const iStart = isMobile ? 0.35 : 0.90;
      const iDur = isMobile ? 0.20 : 0.40;
      const eStart = isMobile ? 0.60 : 1.50;
      const eDur = isMobile ? 0.20 : 0.45;
      const glitchTime = isMobile ? 0.90 : 2.55;

      tl.set([cieBlue, cieGreen, wordRef.current], { opacity: 0 })
        .set(ciePaper, { opacity: 0 })
        .set(cieRef.current, { opacity: 1 }, 0)
        .set(coverRef.current, { scaleX: 1 }, 0)
        .to(coverRef.current, { scaleX: coverFraction(CIE_GLYPH_END_X.c), duration: cDur, ease: "power2.out" }, startDelay) // C
        .to(coverRef.current, { scaleX: coverFraction(CIE_GLYPH_END_X.i), duration: iDur, ease: "power2.out" }, iStart) // I
        .to(coverRef.current, { scaleX: coverFraction(CIE_GLYPH_END_X.e), duration: eDur, ease: "power2.out" }, eStart); // E.

      // Act 2 — the tear.
      const jitter = () => gsap.utils.random(-2, 2, 1);
      const steps = isMobile
        ? [{ reach: unit * 0.8, opacity: 0.65 }, { reach: unit * 1.6, opacity: 0.95 }]
        : [{ reach: unit * 0.4, opacity: 0.4 }, { reach: unit * 0.9, opacity: 0.7 }, { reach: unit * 1.6, opacity: 0.95 }];

      tl.addLabel("glitch", glitchTime);
      // Promote chromatic glitch plates now right before the glitch runs
      tl.call(() => {
        gsap.set([cieBlue, cieGreen, wordBlue, wordGreen], { willChange: "transform, opacity", force3D: true });
      }, undefined, "glitch-=0.1");
      tl.to(gridRef.current, { opacity: 1, duration: isMobile ? 0.25 : 0.35, ease: "power1.out" }, "glitch");
      let t = 0;
      steps.forEach((step, i) => {
        const jx = jitter();
        const jy = jitter();
        tl.to(cieBlue, { opacity: step.opacity, x: -step.reach + jx, y: jy, duration: 0.05, ease: "steps(1)" }, `glitch+=${t}`)
          .to(cieGreen, { opacity: step.opacity, x: step.reach - jx, y: -jy, duration: 0.05, ease: "steps(1)" }, `glitch+=${t}`);
        const isLast = i === steps.length - 1;
        if (!isLast) {
          tl.to([cieBlue, cieGreen], { opacity: 0, x: 0, y: 0, duration: 0.05, ease: "steps(1)" }, `glitch+=${t + (isMobile ? 0.08 : 0.1)}`);
        }
        t += isMobile ? 0.12 : 0.18;
      });

      // the tear
      tl.addLabel("tear", `glitch+=${t + 0.05}`)
        .to(ciePaper, { opacity: 1, duration: 0.03 }, "tear")
        .to(cieArtRef.current, { opacity: 0, duration: 0.03 }, "tear")
        .to(cieRef.current, { scale: 1.04, duration: 0.08, ease: "steps(2)" }, "tear")
        .to(flashRef.current, { opacity: 0.85, duration: 0.05 }, "tear+=0.08")
        .to(flashRef.current, { opacity: 0, duration: 0.12 }, "tear+=0.14")
        .set(cieRef.current, { opacity: 0 }, "tear+=0.13")
        .set(wordRef.current, { opacity: 1 }, "tear+=0.13");

      // Act 3 — EQUINOX settles clean and stable, then lifts
      const settleDur = isMobile ? 0.15 : 0.32;
      const liftHold = isMobile ? 0.15 : 0.45;
      const liftFade = isMobile ? 0.25 : 0.5;

      tl.fromTo(
        wordPaper,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: settleDur, ease: "power4.out" },
        "tear+=0.13",
      )
        .fromTo(
          wordBlue,
          { x: -unit * 1.8, y: unit * 0.5, opacity: 0.9 },
          { x: 0, y: 0, opacity: 0, duration: settleDur + 0.06, ease: "power3.out" },
          "tear+=0.13",
        )
        .fromTo(
          wordGreen,
          { x: unit * 1.8, y: -unit * 0.5, opacity: 0.9 },
          { x: 0, y: 0, opacity: 0, duration: settleDur + 0.06, ease: "power3.out" },
          "tear+=0.13",
        )
        .to(wordArtRef.current, { opacity: 1, duration: 0.25, ease: "power2.out" }, "tear+=0.18")
        .to(wordPaper, { opacity: 0, duration: 0.25, ease: "power2.out" }, "tear+=0.18")
        .to({}, { duration: liftHold })
        .to(rootRef.current, { opacity: 0, duration: liftFade, ease: "power2.inOut" });
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
            src="/logos/cie-mark-white.png"
            alt="MLR Centre for Innovation and Entrepreneurship"
            className="absolute inset-0 h-full w-full object-contain"
            style={{ transform: "translateZ(0)" }}
          />
          {plate("/logos/cie-mark-white.png", null, (el) => { ciePlatesRef.current[0] = el; })}
          {plate("/logos/cie-mark-white.png", BLUE, (el) => { ciePlatesRef.current[1] = el; })}
          {plate("/logos/cie-mark-white.png", GREEN, (el) => { ciePlatesRef.current[2] = el; })}
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
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-ratio brand asset */}
          <img
            ref={wordArtRef}
            src="/equinox-logo.svg"
            alt="The Equinox 2.0 E-Summit 2K26"
            className="absolute inset-0 h-full w-full object-contain opacity-0"
          />
          {plate("/equinox-logo.svg", null, (el) => { wordPlatesRef.current[0] = el; })}
          {plate("/equinox-logo.svg", BLUE, (el) => { wordPlatesRef.current[1] = el; })}
          {plate("/equinox-logo.svg", GREEN, (el) => { wordPlatesRef.current[2] = el; })}
        </div>
      </div>

      {/* single frame blowout at the tear */}
      <div ref={flashRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" style={{ backgroundColor: PAPER }} />
    </div>,
    document.body,
  );
}
