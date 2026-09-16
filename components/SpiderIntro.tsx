"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const BLUE = "#7484FE";
const GREEN = "#33FF67";
const PAPER = "#F7F2F6";

/**
 * Spider-Verse style opener.
 *
 * Act 1  the MLR CIE mark rises in clean, the way mlritcie.in presents it.
 * Act 2  it tears: the mark is drawn three times (paper, blue, green) as masked
 *        colour plates that pull apart, horizontal bands slip sideways, and the
 *        ben-day dot screen and scanlines flicker over the top.
 * Act 3  the plates snap back onto the official EQUINOX lockup, which lands in
 *        the summit palette, then the whole sheet lifts.
 *
 * Colour plates are solid divs masked by the artwork, so each copy can take any
 * palette colour without a second asset.
 */
export default function SpiderIntro({ onDone }: { onDone?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cieRef = useRef<HTMLDivElement>(null);
  const cieArtRef = useRef<HTMLImageElement>(null);
  const ciePlatesRef = useRef<(HTMLDivElement | null)[]>([]);
  const wordRef = useRef<HTMLDivElement>(null);
  const wordArtRef = useRef<HTMLImageElement>(null);
  const wordPlatesRef = useRef<(HTMLDivElement | null)[]>([]);
  const bandsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  // Rendered into <body>: inside the journey tree, transformed ancestors trap a
  // fixed overlay in their own stacking context and the nav paints over it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // The portal renders on the second pass, so the refs only exist once mounted.
    if (!mounted || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const ciePlates = ciePlatesRef.current.filter(Boolean) as HTMLDivElement[];
      const wordPlates = wordPlatesRef.current.filter(Boolean) as HTMLDivElement[];
      const bands = bandsRef.current.filter(Boolean) as HTMLDivElement[];
      const [ciePaper, cieBlue, cieGreen] = ciePlates;
      const [wordPaper, wordBlue, wordGreen] = wordPlates;

      const tl = gsap.timeline({ onComplete: () => onDone?.() });

      // Act 1 — the mark arrives clean, in its own colours
      tl.set([cieBlue, cieGreen, wordRef.current], { opacity: 0 })
        .set(ciePaper, { opacity: 0 })
        .fromTo(
          cieRef.current,
          { opacity: 0, scale: 0.86, filter: "blur(14px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
        )
        .to({}, { duration: 0.35 });

      // Act 2 — the tear
      tl.to([cieBlue, cieGreen], { opacity: 0.95, duration: 0.05 }, "glitch")
        .to(ciePaper, { opacity: 1, duration: 0.04 }, "glitch")
        .to(cieArtRef.current, { opacity: 0, duration: 0.04 }, "glitch")
        .to(cieBlue, { x: -18, y: 4, duration: 0.06, ease: "steps(2)" }, "glitch")
        .to(cieGreen, { x: 16, y: -5, duration: 0.06, ease: "steps(2)" }, "glitch")
        .to(dotsRef.current, { opacity: 0.55, duration: 0.05 }, "glitch")
        .to(scanRef.current, { opacity: 0.4, duration: 0.05 }, "glitch");

      // bands slip sideways in stepped jumps, like a mis-registered print
      bands.forEach((band, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        tl.to(
          band,
          { x: dir * gsap.utils.random(24, 74), duration: 0.07, ease: "steps(1)" },
          `glitch+=${0.06 + i * 0.045}`,
        ).to(band, { x: 0, duration: 0.07, ease: "steps(1)" }, `glitch+=${0.13 + i * 0.045}`);
      });

      tl.to(cieRef.current, { scale: 1.04, duration: 0.09, ease: "steps(2)" }, "glitch+=0.1")
        .to(flashRef.current, { opacity: 0.85, duration: 0.05 }, "glitch+=0.34")
        .to(flashRef.current, { opacity: 0, duration: 0.12 }, "glitch+=0.4");

      // Act 3 — the lockup takes its place
      tl.set(cieRef.current, { opacity: 0 }, "swap")
        .set(wordRef.current, { opacity: 1 }, "swap")
        .fromTo(
          wordPaper,
          { scale: 1.18, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "power4.out" },
          "swap",
        )
        .fromTo(
          wordBlue,
          { x: -46, y: 12, opacity: 0.9 },
          { x: 0, y: 0, opacity: 0, duration: 0.6, ease: "power3.out" },
          "swap",
        )
        .fromTo(
          wordGreen,
          { x: 44, y: -14, opacity: 0.9 },
          { x: 0, y: 0, opacity: 0, duration: 0.6, ease: "power3.out" },
          "swap",
        )
        .to(wordArtRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" }, "swap+=0.22")
        .to(wordPaper, { opacity: 0, duration: 0.35, ease: "power2.out" }, "swap+=0.22")
        .to([dotsRef.current, scanRef.current], { opacity: 0, duration: 0.5 }, "swap+=0.1")
        .to({}, { duration: 0.55 })
        .to(rootRef.current, { opacity: 0, duration: 0.5, ease: "power2.inOut" });
    }, rootRef);

    return () => ctx.revert();
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
      {/* stage */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        {/* CIE mark */}
        <div ref={cieRef} className="relative h-28 w-[min(78vw,680px)] sm:h-36">
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
        </div>

        {/* EQUINOX lockup, official artwork */}
        <div ref={wordRef} className="absolute h-[42vh] w-[min(88vw,980px)]">
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

      {/* slipping bands: each shows a horizontal slice of the stage and moves on its own */}
      <div className="pointer-events-none absolute inset-0">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            ref={(el) => { bandsRef.current[i] = el; }}
            className="absolute inset-x-0"
            style={{
              top: `${18 + i * 13}%`,
              height: "7%",
              backdropFilter: "hue-rotate(35deg) saturate(1.6)",
              WebkitBackdropFilter: "hue-rotate(35deg) saturate(1.6)",
              opacity: 0.55,
            }}
          />
        ))}
      </div>

      {/* ben-day dot screen */}
      <div
        ref={dotsRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          backgroundImage: `radial-gradient(${PAPER} 1px, transparent 1.6px)`,
          backgroundSize: "6px 6px",
          mixBlendMode: "overlay",
        }}
      />

      {/* scanlines */}
      <div
        ref={scanRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* single frame blowout between the acts */}
      <div ref={flashRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" style={{ backgroundColor: PAPER }} />
    </div>,
    document.body,
  );
}
