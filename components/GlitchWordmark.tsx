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
    const ctx = gsap.context(() => {
      const slices = sliceRefs.current.filter(Boolean) as HTMLDivElement[];
      const swaps = swapRefs.current.filter(Boolean) as HTMLDivElement[];
      const step = "steps(1)";

      const burst = () => {
        const tl = gsap.timeline({
          onComplete: () => {
            // next burst lands somewhere between a beat and a long hold
            gsap.delayedCall(gsap.utils.random(1.4, 4.2), burst);
          },
        });

        const hard = Math.random() < 0.35; // occasional bigger tear
        const reach = hard ? 60 : 26;

        tl.to(blueRef.current, { opacity: 0.9, x: -reach, y: gsap.utils.random(-4, 4), duration: 0.05, ease: step })
          .to(greenRef.current, { opacity: 0.9, x: reach, y: gsap.utils.random(-4, 4), duration: 0.05, ease: step }, "<")
          .to(paperRef.current, { opacity: hard ? 0.5 : 0, x: gsap.utils.random(-9, 9), y: gsap.utils.random(-6, 6), duration: 0.05, ease: step }, "<")
          .to(artRef.current, { x: gsap.utils.random(-4, 4), duration: 0.05, ease: step }, "<");

        slices.forEach((slice, i) => {
          tl.to(
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
          tl.to(swaps[0], { opacity: 1, duration: 0.04, ease: step })
            .to(swaps[0], { opacity: 0, duration: 0.04, ease: step })
            .to(swaps[1], { opacity: 1, duration: 0.04, ease: step })
            .to(swaps[1], { opacity: 0, duration: 0.04, ease: step })
            .to([blueRef.current, greenRef.current], { x: 0, duration: 0.04, ease: step })
            .to(blueRef.current, { x: reach * 0.6, duration: 0.04, ease: step })
            .to(greenRef.current, { x: -reach * 0.6, duration: 0.04, ease: step }, "<");
        }

        tl.to([blueRef.current, greenRef.current, paperRef.current], { opacity: 0, x: 0, y: 0, duration: 0.06, ease: step })
          .to(artRef.current, { x: 0, duration: 0.06, ease: step }, "<")
          .to(slices, { opacity: 0, x: 0, duration: 0.06, ease: step }, "<");
      };

      gsap.delayedCall(0.8, burst);
    }, rootRef);

    return () => ctx.revert();
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
