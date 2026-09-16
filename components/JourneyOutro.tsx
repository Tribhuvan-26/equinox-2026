"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Seam between the horizontal journey and the summit chapters.
 *
 * Two scrubbed moves, both driven by this element's own scroll position so they
 * stay in sync with Lenis without a second timeline:
 *   1. Warp exit — the starfield stretches into light-speed streaks and washes out
 *      as the last sub-event leaves the screen.
 *   2. Word reveal — the line below scrubs from 0.12 to full opacity, word by word.
 */
export default function JourneyOutro({ line }: { line: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const streaksRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      })
        .fromTo(
          streaksRef.current,
          { scaleX: 0.12, opacity: 0 },
          { scaleX: 1, opacity: 0.9, ease: "power2.in", duration: 0.5 },
          0,
        )
        .to(streaksRef.current, { opacity: 0, scaleX: 2.4, ease: "power2.out", duration: 0.5 }, 0.5)
        .fromTo(
          washRef.current,
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 0.35 },
          0.15,
        )
        .to(washRef.current, { opacity: 0, ease: "none", duration: 0.4 }, 0.55);

      gsap.fromTo(
        wordsRef.current.filter(Boolean),
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 1,
          },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative isolate overflow-hidden py-32 md:py-48">
      {/* light-speed streaks */}
      <div
        ref={streaksRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 origin-center will-change-transform"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(247,242,246,0.55) 0px, rgba(247,242,246,0) 2px, rgba(247,242,246,0) 90px), repeating-linear-gradient(90deg, rgba(116,132,254,0.5) 0px, rgba(116,132,254,0) 3px, rgba(116,132,254,0) 220px)",
          maskImage: "radial-gradient(120% 60% at 50% 50%, #000 15%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(120% 60% at 50% 50%, #000 15%, transparent 78%)",
        }}
      />
      {/* colour wash that carries the eye out of the void */}
      <div
        ref={washRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 50%, rgba(51,255,103,0.16) 0%, rgba(116,132,254,0.12) 45%, transparent 75%)",
        }}
      />

      <p
        className="mx-auto max-w-[76rem] px-4 text-center font-display-title leading-[1.06] tracking-tight text-[#F7F2F6] sm:px-8"
        style={{ fontSize: "clamp(1.9rem, 3.5vw, 3.6rem)" }}
      >
        {line.split(" ").map((word, i) => (
          <span
            key={`${word}-${i}`}
            ref={(el) => {
              wordsRef.current[i] = el;
            }}
            className="inline-block opacity-[0.12]"
          >
            {word}
            {i < line.split(" ").length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </div>
  );
}
