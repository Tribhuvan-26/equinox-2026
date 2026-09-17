"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const BLUE = "#7484FE";
const GREEN = "#33FF67";
const PAPER = "#F7F2F6";

const plateStyle = (color: string): React.CSSProperties => ({
  backgroundColor: color,
  maskImage: "url(/equinox-logo.svg)",
  WebkitMaskImage: "url(/equinox-logo.svg)",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
  maskSize: "contain",
  WebkitMaskSize: "contain",
});

/**
 * The official lockup, glitching on a loop.
 *
 * The artwork sits on top in its own colours. Behind it are three colour plates
 * masked by the same file, which jump out of register in short bursts, the way
 * a mis-printed comic frame does. Bursts fire on a random interval so the loop
 * never reads as a fixed cycle, with two slice bands cutting across the top.
 */
export default function GlitchWordmark({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const greenRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLImageElement>(null);
  const swapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let activeTl: gsap.core.Timeline | null = null;
    let delayedCall: gsap.core.Tween | null = null;
    let isStationary = true;
    let stationaryTimer: ReturnType<typeof setTimeout> | null = null;

    const slices = () => sliceRefs.current.filter(Boolean) as HTMLDivElement[];
    const swaps = () => swapRefs.current.filter(Boolean) as HTMLDivElement[];
    const step = "steps(1)";

    // Clean reset: instantly kills active animation and snaps all plates back to rest
    const stopGlitch = () => {
      if (activeTl) {
        activeTl.kill();
        activeTl = null;
      }
      if (delayedCall) {
        delayedCall.kill();
        delayedCall = null;
      }
      if (blueRef.current) gsap.set(blueRef.current, { opacity: 0, x: 0, y: 0 });
      if (greenRef.current) gsap.set(greenRef.current, { opacity: 0, x: 0, y: 0 });
      if (paperRef.current) gsap.set(paperRef.current, { opacity: 0, x: 0, y: 0 });
      if (artRef.current) gsap.set(artRef.current, { x: 0 });
      slices().forEach((s) => gsap.set(s, { opacity: 0, x: 0 }));
      swaps().forEach((sw) => gsap.set(sw, { opacity: 0 }));
    };

    const scheduleNext = () => {
      if (!isStationary || typeof window === "undefined") return;
      // Only glitch if the lockup is visible near the top / stationary hero
      if (window.scrollY > 120) return;
      delayedCall = gsap.delayedCall(gsap.utils.random(1.6, 4.0), burst);
    };

    const burst = () => {
      if (!isStationary || (typeof window !== "undefined" && window.scrollY > 120)) {
        stopGlitch();
        return;
      }

      const activeSlices = slices();
      const activeSwaps = swaps();
      const hard = Math.random() < 0.35; // occasional bigger tear
      const reach = hard ? 60 : 26;

      activeTl = gsap.timeline({
        onComplete: () => {
          activeTl = null;
          scheduleNext();
        },
      });

      activeTl
        .to(blueRef.current, { opacity: 0.9, x: -reach, y: gsap.utils.random(-4, 4), duration: 0.05, ease: step })
        .to(greenRef.current, { opacity: 0.9, x: reach, y: gsap.utils.random(-4, 4), duration: 0.05, ease: step }, "<")
        .to(paperRef.current, { opacity: hard ? 0.5 : 0, x: gsap.utils.random(-9, 9), y: gsap.utils.random(-6, 6), duration: 0.05, ease: step }, "<")
        .to(artRef.current, { x: gsap.utils.random(-4, 4), duration: 0.05, ease: step }, "<");

      activeSlices.forEach((slice, i) => {
        activeTl?.to(
          slice,
          {
            opacity: 1,
            x: (i % 2 === 0 ? 1 : -1) * gsap.utils.random(14, hard ? 60 : 30),
            duration: 0.05,
            ease: step,
          },
          i * 0.05,
        );
      });

      if (hard) {
        activeTl
          .to(activeSwaps[0], { opacity: 1, duration: 0.04, ease: step })
          .to(activeSwaps[0], { opacity: 0, duration: 0.04, ease: step })
          .to(activeSwaps[1], { opacity: 1, duration: 0.04, ease: step })
          .to(activeSwaps[1], { opacity: 0, duration: 0.04, ease: step })
          .to([blueRef.current, greenRef.current], { x: 0, duration: 0.04, ease: step })
          .to(blueRef.current, { x: reach * 0.6, duration: 0.04, ease: step })
          .to(greenRef.current, { x: -reach * 0.6, duration: 0.04, ease: step }, "<");
      }

      activeTl
        .to([blueRef.current, greenRef.current, paperRef.current], { opacity: 0, x: 0, y: 0, duration: 0.06, ease: step })
        .to(artRef.current, { x: 0, duration: 0.06, ease: step }, "<")
        .to(activeSlices, { opacity: 0, x: 0, duration: 0.06, ease: step }, "<");
    };

    // Scroll listener: kills/disables glitch animation immediately upon scroll
    const onScrollStart = () => {
      isStationary = false;
      stopGlitch();

      if (stationaryTimer) clearTimeout(stationaryTimer);
      stationaryTimer = setTimeout(() => {
        // Once scrolling has stopped for 800ms and user is at stationary hero position
        if (typeof window !== "undefined" && window.scrollY <= 60) {
          isStationary = true;
          scheduleNext();
        }
      }, 800);
    };

    window.addEventListener("scroll", onScrollStart, { passive: true });
    window.addEventListener("wheel", onScrollStart, { passive: true });
    window.addEventListener("touchmove", onScrollStart, { passive: true });

    // Initial delayed start when page loads stationary
    delayedCall = gsap.delayedCall(0.8, burst);

    return () => {
      stopGlitch();
      if (stationaryTimer) clearTimeout(stationaryTimer);
      window.removeEventListener("scroll", onScrollStart);
      window.removeEventListener("wheel", onScrollStart);
      window.removeEventListener("touchmove", onScrollStart);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {/* colour plates sit behind the artwork, so only the part they are pushed
          out by shows: the fringe. They are invisible between bursts. */}
      <div ref={blueRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" style={plateStyle(BLUE)} />
      <div ref={greenRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" style={plateStyle(GREEN)} />
      <div ref={paperRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" style={plateStyle(PAPER)} />

      {/* the artwork itself */}
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed-ratio brand asset */}
      <img
        ref={artRef}
        src="/equinox-logo.svg"
        alt="The Equinox 2.0 E-Summit 2K26"
        className="relative h-full w-full object-contain"
        draggable={false}
      />

      {/* whole-lockup colour swaps, one frame each during a hard burst */}
      {[GREEN, BLUE].map((color, i) => (
        <div
          key={color}
          ref={(el) => { swapRefs.current[i] = el; }}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
          style={plateStyle(color)}
        />
      ))}

      {/* slice bands: thin horizontal cuts of the lockup that shift on their own */}
      {[0, 1].map((i) => (
        <div
          key={i}
          ref={(el) => { sliceRefs.current[i] = el; }}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            ...plateStyle(PAPER),
            clipPath: i === 0 ? "inset(28% 0 58% 0)" : "inset(64% 0 22% 0)",
          }}
        />
      ))}
    </div>
  );
}
