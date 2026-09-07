// app/overlay-animations/animations/events/HustleMania/HustleManiaAnimation.tsx
"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import {
  createHustleManiaMasterTl,
  startHustleManiaIdleLoops,
  runHustleManiaExit,
} from "./hustleManiaTimeline";
import styles from "./HustleManiaAnimation.module.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const HustleManiaAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageFrameRef = useRef<HTMLDivElement>(null);
  const baseImageRef = useRef<HTMLImageElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  // Header & branding
  const brandingLeftRef = useRef<SVGGElement>(null);
  const brandingRightRef = useRef<SVGGElement>(null);
  const topTaglineRef = useRef<SVGTextElement>(null);

  // Scene accents
  const signBoardRef = useRef<SVGGElement>(null);
  const hangingTagGroupRef = useRef<SVGGElement>(null);
  const hangingTagRef = useRef<SVGGElement>(null);
  const dealBubbleGroupRef = useRef<SVGGElement>(null);

  // Title elements
  const titleBlockRef = useRef<SVGGElement>(null);
  const titleHustleRef = useRef<SVGTextElement>(null);
  const titleManiaRef = useRef<SVGGElement>(null);
  const motionLinesLeftRef = useRef<SVGGElement>(null);
  const motionLinesRightRef = useRef<SVGGElement>(null);

  // Slanted callout
  const sameGameDreamsRef = useRef<SVGGElement>(null);

  // Runtime animation refs
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);
  const idleLoopsRef = useRef<gsap.core.Tween[]>([]);
  const exitingRef = useRef(false);

  // ── Lifecycle & GSAP initialization ────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    exitingRef.current = false;
    const ctx = gsap.context(() => {
      // Title safe width guard via getBBox
      if (titleHustleRef.current && titleBlockRef.current) {
        try {
          const bbox = titleHustleRef.current.getBBox();
          const maxAllowedWidth = 440;
          if (bbox.width > maxAllowedWidth) {
            const scale = maxAllowedWidth / bbox.width;
            gsap.set(titleBlockRef.current, {
              scaleX: scale,
              scaleY: scale,
              transformOrigin: "505px 145px",
            });
          }
        } catch {
          // getBBox SSR guard
        }
      }

      const tl = createHustleManiaMasterTl(
        {
          container: containerRef.current,
          stageFrame: stageFrameRef.current,
          baseImage: baseImageRef.current,
          skipButton: skipButtonRef.current,
          brandingLeft: brandingLeftRef.current,
          brandingRight: brandingRightRef.current,
          topTagline: topTaglineRef.current,
          signBoard: signBoardRef.current,
          hangingTagGroup: hangingTagGroupRef.current,
          hangingTag: hangingTagRef.current,
          dealBubbleGroup: dealBubbleGroupRef.current,
          titleBlock: titleBlockRef.current,
          titleHustle: titleHustleRef.current,
          titleMania: titleManiaRef.current,
          motionLinesLeft: motionLinesLeftRef.current,
          motionLinesRight: motionLinesRightRef.current,
          sameGameDreams: sameGameDreamsRef.current,
        },
        {
          onEntranceComplete: () => {
            if (exitingRef.current) return;
            const loops = startHustleManiaIdleLoops({
              hangingTag: hangingTagRef.current,
            });
            idleLoopsRef.current = loops;
          },
          onComplete: () => {
            if (exitingRef.current) return;
            exitingRef.current = true;
            idleLoopsRef.current.forEach((tw) => tw.kill());
            idleLoopsRef.current = [];
            onComplete?.();
          },
        }
      );

      masterTlRef.current = tl;
      tl.play();
    }, containerRef);

    return () => {
      idleLoopsRef.current.forEach((tw) => tw.kill());
      idleLoopsRef.current = [];
      ctx.revert();
    };
  }, [onComplete]);

  // ── Dismiss / Skip Handling ────────────────────────────────────────────────
  const handleUserDismiss = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    onDismiss?.();
    runHustleManiaExit(containerRef.current, idleLoopsRef.current, onComplete);
  };

  useEffect(() => {
    if (isDismissed || skip) {
      handleUserDismiss();
    }
  }, [isDismissed, skip]);

  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-label="Hustle Mania Event Animation"
    >
      {/* Skip Button */}
      <button
        ref={skipButtonRef}
        className={styles.skipButton}
        onClick={handleUserDismiss}
        aria-label="Skip animation"
      >
        <span>SKIP</span>
        <X size={14} />
      </button>

      {/* 16:9 Responsive Stage Frame */}
      <div ref={stageFrameRef} className={styles.stageFrame}>
        {/* Base Layer: Stall + figures + plant + boxes from reference */}
        <img
          ref={baseImageRef}
          src="/overlay-animations/hustle-mania-base.png"
          alt="Hustle Mania Scene"
          className={styles.baseImage}
        />

        {/* Dynamic SVG Layer (ViewBox: 1024 × 576, maps 1:1 to base image) */}
        <svg
          className={styles.stageSvg}
          viewBox="0 0 1024 576"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── 1. TOP-LEFT BRANDING: THE EQUINOX 2.0 ───────────────────── */}
          <g ref={brandingLeftRef}>
            <text
              x="36"
              y="26"
              fontFamily="var(--font-mono), monospace"
              fontSize="7.5"
              fontWeight="800"
              letterSpacing="0.14em"
              fill="#11161d"
            >
              THE
            </text>
            <text
              x="36"
              y="42"
              fontFamily="var(--font-syne), 'Arial Black', sans-serif"
              fontSize="14"
              fontWeight="900"
              letterSpacing="0.04em"
              fill="#11161d"
            >
              EQUINOX
            </text>
            {/* 2.0 badge positioned beneath the 'OX' of EQUINOX */}
            <rect x="96" y="47" width="22" height="13" rx="2" fill="#11161d" />
            <text
              x="107"
              y="57"
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="var(--font-mono), monospace"
              fontSize="8"
              fontWeight="900"
            >
              2.0
            </text>
            {/* Left Category Column */}
            <text
              x="44"
              y="80"
              fill="#475569"
              fontSize="7"
              fontWeight="700"
              fontFamily="var(--font-mono), monospace"
              letterSpacing="0.16em"
            >
              IDEAS
            </text>
            <text
              x="44"
              y="91"
              fill="#475569"
              fontSize="7"
              fontWeight="700"
              fontFamily="var(--font-mono), monospace"
              letterSpacing="0.16em"
            >
              PEOPLE
            </text>
            <text
              x="44"
              y="102"
              fill="#475569"
              fontSize="7"
              fontWeight="700"
              fontFamily="var(--font-mono), monospace"
              letterSpacing="0.16em"
            >
              MARKETS
            </text>
            <text
              x="44"
              y="113"
              fill="#475569"
              fontSize="7"
              fontWeight="700"
              fontFamily="var(--font-mono), monospace"
              letterSpacing="0.16em"
            >
              OPPORTUNITIES
            </text>
          </g>

          {/* ── 2. TOP-RIGHT BRANDING: 30 - 31 OCT / MLRIT ─────────────── */}
          <g ref={brandingRightRef} textAnchor="end">
            <text
              x="988"
              y="38"
              fill="#11161d"
              fontSize="9.5"
              fontWeight="900"
              letterSpacing="0.14em"
            >
              30 - 31 OCT
            </text>
            <line x1="935" y1="46" x2="988" y2="46" stroke="#11161d" strokeWidth="1.2" />
            <text
              x="988"
              y="58"
              fill="#64748b"
              fontSize="8"
              fontWeight="700"
              fontFamily="var(--font-mono), monospace"
              letterSpacing="0.16em"
            >
              MLRIT
            </text>
          </g>

          {/* ── 3. TOP TAGLINE ─────────────────────────────────────────── */}
          <text
            ref={topTaglineRef}
            x="512"
            y="20"
            textAnchor="middle"
            className={styles.taglineText}
            fontSize="8"
          >
            BUY   SELL   NEGOTIATE   GROW
          </text>

          {/* ── 4. SLANTED CALLOUT (Top Right) ─────────────────────────── */}
          <g
            ref={sameGameDreamsRef}
            transform="translate(900, 180) rotate(-14)"
            textAnchor="middle"
          >
            <text y="-32" className={styles.dreamsText} fontSize="17">
              SAME
            </text>
            <text y="-14" className={styles.dreamsText} fontSize="17">
              GAME
            </text>
            <text y="5" className={styles.dreamsText} fontSize="17">
              BIGGER
            </text>
            <text y="24" className={styles.dreamsText} fontSize="17">
              DREAMS
            </text>
            <line x1="-36" y1="31" x2="36" y2="31" stroke="#11161d" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* ── 5. TITLE BLOCK: HUSTLE MANIA + MOTION ACCENTS (Above stall) ── */}
          <g ref={titleBlockRef}>
            {/* "HUSTLE" (black bold condensed distressed) */}
            <text
              ref={titleHustleRef}
              x="512"
              y="60"
              textAnchor="middle"
              className={styles.hustleText}
              fontSize="50"
            >
              HUSTLE
            </text>

            {/* "MANIA" (blue bold brush with underline) */}
            <g ref={titleManiaRef}>
              <text
                x="512"
                y="108"
                textAnchor="middle"
                className={styles.maniaText}
                fontSize="56"
              >
                MANIA
              </text>
              {/* Dynamic brush underline stroke beneath MANIA */}
              <path
                d="M 472,116 C 498,112 536,113 602,107"
                fill="none"
                stroke="#0058ff"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
            </g>

            {/* Left motion-line accents */}
            <g ref={motionLinesLeftRef}>
              <polygon points="355,53 372,66 369,69 352,56" fill="#0058ff" />
              <polygon points="362,77 384,86 381,90 359,81" fill="#0058ff" />
              <polygon points="338,111 362,99 360,95 336,107" fill="#11161d" />
            </g>

            {/* Right motion-line accents */}
            <g ref={motionLinesRightRef}>
              <polygon points="655,50 676,38 678,42 657,54" fill="#11161d" />
              <polygon points="662,75 690,73 690,78 662,80" fill="#11161d" />
              <polygon points="664,96 685,111 682,114 661,99" fill="#0058ff" />
            </g>
          </g>

          {/* ── 6. "DEAL?" SPEECH BUBBLE ───────────────────────────────── */}
          <g ref={dealBubbleGroupRef}>
            {/* Rounded comic speech bubble */}
            <path
              d="M 494,342 C 494,324 511,318 534,318 C 557,318 574,324 574,342 C 574,360 557,366 534,366 C 522,366 515,364 507,369 L 493,378 L 499,365 C 495,359 494,351 494,342 Z"
              fill="#11161d"
            />
            <text
              x="533"
              y="346"
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="Impact, 'Arial Black', var(--font-syne), sans-serif"
              fontStyle="italic"
              fontWeight="900"
              fontSize="12.5"
              letterSpacing="0.06em"
            >
              DEAL?
            </text>
            {/* Conversation action ticks radiating below bubble */}
            <line x1="522" y1="384" x2="520" y2="394" stroke="#11161d" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="535" y1="387" x2="536" y2="398" stroke="#11161d" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="548" y1="385" x2="552" y2="394" stroke="#11161d" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* ── 7. A-FRAME SIGN BOARD (Left of stall) ──────────────────── */}
          <g ref={signBoardRef}>
            {/* Outer A-frame easel structure */}
            {/* Rear kickstand leg */}
            <polygon points="252,352 260,352 349,548 339,548" fill="#11161d" />
            {/* Front left leg */}
            <polygon points="178,355 188,355 167,548 157,548" fill="#11161d" />
            {/* Front right leg */}
            <polygon points="328,355 338,355 322,548 312,548" fill="#11161d" />
            {/* Bottom crossbar brace */}
            <rect x="172" y="475" width="154" height="5" fill="#11161d" />
            {/* Main board face frame */}
            <polygon points="182,360 334,360 322,534 168,534" fill="#11161d" />
            {/* Inner blue chalkboard face */}
            <polygon points="198,375 320,375 310,518 186,518" fill="#0058ff" />
            {/* Chalkboard lettering: IDEAS / PRODUCTS / PEOPLE */}
            <text
              x="253"
              y="418"
              textAnchor="middle"
              className={styles.signBoardText}
              fontFamily="Impact, 'Arial Black', var(--font-syne), sans-serif"
              fontSize="11.5"
              letterSpacing="0.05em"
            >
              IDEAS
            </text>
            <text
              x="251"
              y="450"
              textAnchor="middle"
              className={styles.signBoardText}
              fontFamily="Impact, 'Arial Black', var(--font-syne), sans-serif"
              fontSize="11.5"
              letterSpacing="0.05em"
            >
              PRODUCTS
            </text>
            <text
              x="249"
              y="482"
              textAnchor="middle"
              className={styles.signBoardText}
              fontFamily="Impact, 'Arial Black', var(--font-syne), sans-serif"
              fontSize="11.5"
              letterSpacing="0.05em"
            >
              PEOPLE
            </text>
            <line x1="226" y1="498" x2="272" y2="498" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* ── 8. HANGING PRICE TAG + SUPPORT ARM (Right of stall) ────── */}
          <g ref={hangingTagGroupRef}>
            {/* Support pole & arm extending from stall counter */}
            <line x1="685" y1="440" x2="685" y2="280" stroke="#11161d" strokeWidth="3" strokeLinecap="round" />
            <line x1="685" y1="280" x2="765" y2="245" stroke="#11161d" strokeWidth="3" strokeLinecap="round" />
            <circle cx="765" cy="245" r="3.5" fill="none" stroke="#11161d" strokeWidth="2" />
            {/* String dropping to tag hole */}
            <line x1="765" y1="248" x2="765" y2="282" stroke="#11161d" strokeWidth="1.6" />

            {/* Inner tag group animated for gentle swing loop around pivot (765, 282) */}
            <g ref={hangingTagRef}>
              {/* Tag body polygon (tilted price tag) */}
              <polygon
                points="745,282 785,282 824,324 824,448 706,448 706,324"
                fill="#11161d"
              />
              {/* Eyelet hole */}
              <circle cx="765" cy="296" r="3.5" fill="#ffffff" />
              {/* Price Tag Text: BUY / SELL / NEGOTIATE / GROW */}
              <text
                x="765"
                y="336"
                textAnchor="middle"
                className={styles.priceTagText}
                fontSize="10.5"
                letterSpacing="0.12em"
              >
                BUY
              </text>
              <text
                x="765"
                y="358"
                textAnchor="middle"
                className={styles.priceTagText}
                fontSize="10.5"
                letterSpacing="0.12em"
              >
                SELL
              </text>
              <text
                x="765"
                y="380"
                textAnchor="middle"
                className={styles.priceTagText}
                fontSize="8.5"
                letterSpacing="0.08em"
              >
                NEGOTIATE
              </text>
              <text
                x="765"
                y="402"
                textAnchor="middle"
                className={styles.priceTagText}
                fontSize="10.5"
                letterSpacing="0.12em"
              >
                GROW
              </text>
              <line x1="740" y1="418" x2="790" y2="418" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Action ticks to the right of the tag */}
            <line x1="838" y1="338" x2="854" y2="330" stroke="#11161d" strokeWidth="2" strokeLinecap="round" />
            <line x1="845" y1="358" x2="860" y2="358" stroke="#11161d" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default HustleManiaAnimation;
