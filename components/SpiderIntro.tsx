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
    //  3. one extra double-rAF so the browser gets a full frame to paint the
    //     now-decoded, now-visible overlay BEFORE the first tween runs,
    //     instead of painting and animating in the same frame.
    let cancelled = false;
    let ctx: gsap.Context | null = null;
    let activeTl: gsap.core.Timeline | null = null;
    const img = cieArtRef.current;

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
        if (cancelled) return;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (cancelled || !rootRef.current) return;
          const built = buildTimeline();
          ctx = built;
        }));
      });
    };

    if (img && !img.complete && typeof img.decode === "function") {
      img.decode().catch(() => {}).then(begin);
    } else {
      begin();
    }

    function buildTimeline() {
      return gsap.context(() => {
      const ciePlates = ciePlatesRef.current.filter(Boolean) as HTMLDivElement[];
      const wordPlates = wordPlatesRef.current.filter(Boolean) as HTMLDivElement[];
      const [ciePaper, cieBlue, cieGreen] = ciePlates;
      const [wordPaper, wordBlue, wordGreen] = wordPlates;

      gsap.set(cieRef.current, { willChange: "transform" });
      gsap.set([coverRef.current, cieBlue, cieGreen, wordBlue, wordGreen, flashRef.current], {
        willChange: "transform, opacity",
      });

      // Measured once, up front — never re-measured mid-timeline. The glitch
      // displacement scales with the logo's actual rendered width so it reads
      // the same proportionally on a phone and a laptop, and small enough on
      // narrow screens that it never throws the mark off-screen.
      const cieWidth = cieRef.current!.getBoundingClientRect().width || 300;
      const unit = Math.min(26, Math.max(5, cieWidth * 0.035));
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

      const tl = gsap.timeline({
        onComplete: () => {
          onDone?.();
          window.dispatchEvent(new Event("equinox:intro-done"));
        },
      });
      activeTl = tl;

      // Act 1 — CIE reads clean, one letter at a time. No blur, no scale-in —
      // an opaque cover retreats from left to right, timed to each glyph's
      // real edge, held between letters so the mark is fully legible before
      // anything destabilizes it. This is a `scaleX` on a plain cover div
      // (transform-origin pinned to the right edge) rather than animating
      // clip-path on cieRef: clip-path on a container whose children use
      // mask-image isn't reliably compositor-only, and cost showed up as a
      // stutter on exactly the first tween (the C reveal) where the browser
      // had to establish that paint/compositing layer for the first time.
      tl.set([cieBlue, cieGreen, wordRef.current], { opacity: 0 })
        .set(ciePaper, { opacity: 0 })
        .set(cieRef.current, { opacity: 1 }, 0)
        .set(coverRef.current, { scaleX: 1 }, 0)
        .to(coverRef.current, { scaleX: coverFraction(CIE_GLYPH_END_X.c), duration: 0.55, ease: "power2.out" }, 0) // C
        .to(coverRef.current, { scaleX: coverFraction(CIE_GLYPH_END_X.i), duration: 0.4, ease: "power2.out" }, 0.75) // I
        .to(coverRef.current, { scaleX: coverFraction(CIE_GLYPH_END_X.e), duration: 0.45, ease: "power2.out" }, 1.35); // E.
      // CIE. now holds fully visible, untouched, until "glitch" at 2.4.

      // Act 2 — the tear. A fixed, small set of discrete jumps (deterministic:
      // any randomness is resolved once here, not re-rolled during playback),
      // animating only transform + opacity on the two colour plates, plus one
      // clip-path swap and one flash. Mobile skips the smallest "micro" jump
      // so the whole beat reads faster with less visual noise on small screens.
      const jitter = () => gsap.utils.random(-2, 2, 1);
      const steps = isMobile
        ? [{ reach: unit * 0.8, opacity: 0.65 }, { reach: unit * 1.6, opacity: 0.95 }]
        : [{ reach: unit * 0.4, opacity: 0.4 }, { reach: unit * 0.9, opacity: 0.7 }, { reach: unit * 1.6, opacity: 0.95 }];

      tl.addLabel("glitch", 2.4);
      // Backdrop shifts from the plain CIE-hold background to this site's own
      // grid texture (same pattern as .riso-texture/.brochure-grid — 34px
      // lines, same dark base colour) as the transition kicks off, so by the
      // time EQUINOX lands the backdrop already matches the page underneath.
      tl.to(gridRef.current, { opacity: 1, duration: 0.35, ease: "power1.out" }, "glitch");
      let t = 0;
      steps.forEach((step, i) => {
        const jx = jitter();
        const jy = jitter();
        tl.to(cieBlue, { opacity: step.opacity, x: -step.reach + jx, y: jy, duration: 0.05, ease: "steps(1)" }, `glitch+=${t}`)
          .to(cieGreen, { opacity: step.opacity, x: step.reach - jx, y: -jy, duration: 0.05, ease: "steps(1)" }, `glitch+=${t}`);
        const isLast = i === steps.length - 1;
        if (!isLast) {
          tl.to([cieBlue, cieGreen], { opacity: 0, x: 0, y: 0, duration: 0.05, ease: "steps(1)" }, `glitch+=${t + 0.1}`);
        }
        t += 0.18;
      });

      // the tear: hardest plate separation already applied above, now the
      // paper plate flashes in, the art hides, one flash frame, then CIE
      // breaks apart and EQUINOX lands through the same disturbed position.
      tl.addLabel("tear", `glitch+=${t + 0.05}`)
        .to(ciePaper, { opacity: 1, duration: 0.03 }, "tear")
        .to(cieArtRef.current, { opacity: 0, duration: 0.03 }, "tear")
        .to(cieRef.current, { scale: 1.04, duration: 0.08, ease: "steps(2)" }, "tear")
        .to(flashRef.current, { opacity: 0.85, duration: 0.05 }, "tear+=0.08")
        .to(flashRef.current, { opacity: 0, duration: 0.12 }, "tear+=0.14")
        .set(cieRef.current, { opacity: 0 }, "tear+=0.13")
        .set(wordRef.current, { opacity: 1 }, "tear+=0.13");

      // Act 3 — EQUINOX settles clean and stable, then a brief hold before the
      // whole sheet lifts.
      tl.fromTo(
        wordPaper,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.32, ease: "power4.out" },
        "tear+=0.13",
      )
        .fromTo(
          wordBlue,
          { x: -unit * 1.8, y: unit * 0.5, opacity: 0.9 },
          { x: 0, y: 0, opacity: 0, duration: 0.38, ease: "power3.out" },
          "tear+=0.13",
        )
        .fromTo(
          wordGreen,
          { x: unit * 1.8, y: -unit * 0.5, opacity: 0.9 },
          { x: 0, y: 0, opacity: 0, duration: 0.38, ease: "power3.out" },
          "tear+=0.13",
        )
        .to(wordArtRef.current, { opacity: 1, duration: 0.28, ease: "power2.out" }, "tear+=0.18")
        .to(wordPaper, { opacity: 0, duration: 0.28, ease: "power2.out" }, "tear+=0.18")
        .to({}, { duration: 0.45 })
        .to(rootRef.current, { opacity: 0, duration: 0.5, ease: "power2.inOut" });
      }, rootRef);
    }

    return () => {
      cancelled = true;
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
            style={{ transformOrigin: "100% 50%" }}
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
