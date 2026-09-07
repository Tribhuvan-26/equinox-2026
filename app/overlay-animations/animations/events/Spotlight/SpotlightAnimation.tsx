// app/overlay-animations/animations/events/Spotlight/SpotlightAnimation.tsx
"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import type { AnimationComponentProps } from "../../core/animationTypes";
import {
  createSpotlightTimeline,
  skipSpotlightTimelineToExit,
} from "./spotlightTimeline";
import styles from "./SpotlightAnimation.module.css";

// Fallback to useEffect for SSR hydration safety
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const SpotlightAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  const leftFixtureGroupRef = useRef<SVGGElement>(null);
  const rightFixtureGroupRef = useRef<SVGGElement>(null);
  const leftBeamRef = useRef<SVGPolygonElement>(null);
  const rightBeamRef = useRef<SVGPolygonElement>(null);
  const floorGlowRef = useRef<SVGGElement>(null);

  const titleClipRef = useRef<SVGRectElement>(null);
  const titleTextRef = useRef<SVGTextElement>(null);
  const starGroupRef = useRef<SVGGElement>(null);
  const streaksGroupRef = useRef<SVGGElement>(null);
  const titleStreak1Ref = useRef<SVGPathElement>(null);
  const titleStreak2Ref = useRef<SVGPathElement>(null);
  const ambientAccentsRef = useRef<SVGGElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Initialize GSAP Timeline inside scoped context with dynamic title measurement
  useIsomorphicLayoutEffect(() => {
    let measuredWidth = 1650;
    const PADDING = 50;

    const measureAndSetupClip = () => {
      if (!titleTextRef.current || typeof titleTextRef.current.getBBox !== "function") {
        return;
      }
      try {
        const bbox = titleTextRef.current.getBBox();
        if (bbox && bbox.width > 0) {
          const clipX = bbox.x - PADDING;
          const clipY = bbox.y - PADDING;
          const clipW = bbox.width + PADDING * 2;
          const clipH = bbox.height + PADDING * 2;

          measuredWidth = clipW;

          if (titleClipRef.current) {
            titleClipRef.current.setAttribute("x", String(clipX));
            titleClipRef.current.setAttribute("y", String(clipY));
            titleClipRef.current.setAttribute("height", String(clipH));
            titleClipRef.current.setAttribute("width", "0");
          }

          // Dynamically center the star in the letter 'O'
          let starX = bbox.x + bbox.width * 0.28;
          let starY = bbox.y + bbox.height * 0.52;
          if (typeof titleTextRef.current.getExtentOfChar === "function") {
            try {
              const oExtent = titleTextRef.current.getExtentOfChar(2);
              if (oExtent && oExtent.width > 0) {
                starX = oExtent.x + oExtent.width / 2;
                starY = oExtent.y + oExtent.height / 2;
              }
            } catch {
              // fallback to ratio
            }
          }
          if (starGroupRef.current) {
            starGroupRef.current.setAttribute(
              "transform",
              `translate(${starX}, ${starY})`
            );
          }

          // Dynamically position speed streaks at the tail end of "LIGHT"
          if (streaksGroupRef.current) {
            const sx = bbox.x + bbox.width - 90;
            const sy = bbox.y + bbox.height + 15;
            streaksGroupRef.current.setAttribute(
              "transform",
              `translate(${sx}, ${sy})`
            );
          }
        }
      } catch (err) {
        console.warn("Unable to measure title bbox:", err);
      }
    };

    // Immediate initial measurement
    measureAndSetupClip();

    // Re-verify after web fonts are completely loaded
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        measureAndSetupClip();
      });
    }

    const ctx = gsap.context(() => {
      const streaks: SVGElement[] = [];
      if (titleStreak1Ref.current) streaks.push(titleStreak1Ref.current);
      if (titleStreak2Ref.current) streaks.push(titleStreak2Ref.current);

      const tl = createSpotlightTimeline(
        {
          container: containerRef.current,
          vignette: vignetteRef.current,
          grain: grainRef.current,
          flash: flashRef.current,
          skipButton: skipButtonRef.current,
          leftFixtureGroup: leftFixtureGroupRef.current,
          rightFixtureGroup: rightFixtureGroupRef.current,
          leftBeam: leftBeamRef.current,
          rightBeam: rightBeamRef.current,
          floorGlow: floorGlowRef.current,
          titleClip: titleClipRef.current,
          titleText: titleTextRef.current,
          titleTargetWidth: () => measuredWidth,
          titleStreaks: streaks,
          ambientAccents: ambientAccentsRef.current,
        },
        {
          onComplete: () => {
            onComplete?.();
          },
        }
      );

      timelineRef.current = tl;
      tl.play();
    }, containerRef);

    return () => {
      // Revert kills timeline and cleans up all tweens
      ctx.revert();
      timelineRef.current = null;
    };
  }, [onComplete]);

  // Handle external dismiss/skip signal
  useEffect(() => {
    if (isDismissed || skip) {
      skipSpotlightTimelineToExit(timelineRef.current);
    }
  }, [isDismissed, skip]);

  const handleManualDismiss = () => {
    skipSpotlightTimelineToExit(timelineRef.current);
    onDismiss?.();
  };

  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-label="Spotlight Event Animation"
    >
      {/* Background Vignette */}
      <div ref={vignetteRef} className={styles.vignette} />

      {/* Repeating SVG Turbulence Noise Overlay */}
      <div ref={grainRef} className={styles.grainOverlay}>
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <filter id="spotlightGrainFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.12 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#spotlightGrainFilter)" />
        </svg>
      </div>

      {/* Convergence Hit Fullscreen Radial Flash */}
      <div ref={flashRef} className={styles.flashOverlay} />

      {/* Skip / Dismiss Button */}
      <button
        ref={skipButtonRef}
        type="button"
        className={styles.skipButton}
        onClick={handleManualDismiss}
        aria-label="Skip Animation"
      >
        Skip ✕
      </button>

      {/* Responsive Scalable SVG Stage Canvas */}
      <svg
        className={styles.stageSvg}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Universal Spotlight Beam Linear Gradient */}
          <linearGradient
            id="spotlightBeamGrad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="8%" stopColor="#fff8db" stopOpacity="0.88" />
            <stop offset="35%" stopColor="#fef08a" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#eab308" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </linearGradient>

          {/* Floor Light Pool Radial Gradient */}
          <radialGradient
            id="spotlightFloorPoolGrad"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="45%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="20%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#eab308" stopOpacity="0.5" />
            <stop offset="78%" stopColor="#ca8a04" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </radialGradient>

          {/* Soft Floor Glow Filter */}
          <filter id="spotlightFloorBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="32" />
          </filter>

          {/* Wipe Reveal Clip Paths for Title */}
          {/* Illuminated wipe reveal clipPath */}
          <clipPath id="spotlightTitleClip">
            <rect
              ref={titleClipRef}
              x="160"
              y="380"
              width="0"
              height="360"
            />
          </clipPath>
        </defs>

        {/* Stage Perspective Floor Lines (subtle backdrop) */}
        <g opacity="0.18" stroke="#ffffff" strokeWidth="1">
          <line x1="160" y1="1080" x2="680" y2="760" />
          <line x1="560" y1="1080" x2="820" y2="760" />
          <line x1="960" y1="1080" x2="960" y2="760" />
          <line x1="1360" y1="1080" x2="1100" y2="760" />
          <line x1="1760" y1="1080" x2="1240" y2="760" />
          <line x1="380" y1="840" x2="1540" y2="840" strokeDasharray="6 8" />
          <line x1="260" y1="940" x2="1660" y2="940" strokeDasharray="6 8" />
        </g>

        {/* Floor Light Pool Glow (Centered at bottom third, x:960, y:920) */}
        <g ref={floorGlowRef} className={styles.floorGlow}>
          {/* Intense core */}
          <ellipse
            cx="960"
            cy="920"
            rx="480"
            ry="96"
            fill="url(#spotlightFloorPoolGrad)"
            filter="url(#spotlightFloorBlur)"
          />
          {/* Secondary bright center disc */}
          <ellipse
            cx="960"
            cy="920"
            rx="340"
            ry="58"
            fill="#fffde7"
            opacity="0.8"
            filter="blur(18px)"
          />
        </g>

        {/* Left Spotlight Fixture & Beam */}
        <g
          ref={leftFixtureGroupRef}
          className={styles.fixtureLeft}
        >
          {/* Light Cone (originating from housing lens at 240, 140) */}
          <g className={styles.lightConesGroup}>
            <polygon
              ref={leftBeamRef}
              points="215,140 265,140 520,1080 -40,1080"
              fill="url(#spotlightBeamGrad)"
            />
          </g>

          {/* Left Fixture 2D Housing Geometry */}
          <g>
            {/* Mounting Arm / Yoke */}
            <path
              d="M170,90 C170,120 200,140 240,140 C280,140 310,120 310,90"
              fill="none"
              stroke="#262626"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line x1="240" y1="50" x2="240" y2="90" stroke="#1f1f1f" strokeWidth="12" />
            <circle cx="240" cy="50" r="14" fill="#0d0d0d" stroke="#333" strokeWidth="3" />

            {/* Cylinder Housing Body */}
            <path
              d="M205,100 L275,100 L265,150 L215,150 Z"
              fill="#171717"
              stroke="#333333"
              strokeWidth="3"
            />
            {/* Cooling Fins / Ridges */}
            <line x1="208" y1="114" x2="272" y2="114" stroke="#262626" strokeWidth="2" />
            <line x1="211" y1="128" x2="269" y2="128" stroke="#262626" strokeWidth="2" />

            {/* Barndoor Flaps */}
            <polygon points="215,150 185,190 205,195 225,150" fill="#0a0a0a" />
            <polygon points="265,150 295,190 275,195 255,150" fill="#0a0a0a" />

            {/* Emitting Lens Rim */}
            <ellipse cx="240" cy="148" rx="25" ry="8" fill="#fff9c4" opacity="0.95" />
          </g>
        </g>

        {/* Right Spotlight Fixture & Beam */}
        <g
          ref={rightFixtureGroupRef}
          className={styles.fixtureRight}
        >
          {/* Light Cone (originating from housing lens at 1680, 140) */}
          <g className={styles.lightConesGroup}>
            <polygon
              ref={rightBeamRef}
              points="1655,140 1705,140 1960,1080 1400,1080"
              fill="url(#spotlightBeamGrad)"
            />
          </g>

          {/* Right Fixture 2D Housing Geometry */}
          <g>
            {/* Mounting Arm / Yoke */}
            <path
              d="M1610,90 C1610,120 1640,140 1680,140 C1720,140 1750,120 1750,90"
              fill="none"
              stroke="#262626"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line x1="1680" y1="50" x2="1680" y2="90" stroke="#1f1f1f" strokeWidth="12" />
            <circle cx="1680" cy="50" r="14" fill="#0d0d0d" stroke="#333" strokeWidth="3" />

            {/* Cylinder Housing Body */}
            <path
              d="M1645,100 L1715,100 L1705,150 L1655,150 Z"
              fill="#171717"
              stroke="#333333"
              strokeWidth="3"
            />
            {/* Cooling Fins / Ridges */}
            <line x1="1648" y1="114" x2="1712" y2="114" stroke="#262626" strokeWidth="2" />
            <line x1="1651" y1="128" x2="1709" y2="128" stroke="#262626" strokeWidth="2" />

            {/* Barndoor Flaps */}
            <polygon points="1655,150 1625,190 1645,195 1665,150" fill="#0a0a0a" />
            <polygon points="1705,150 1735,190 1715,195 1695,150" fill="#0a0a0a" />

            {/* Emitting Lens Rim */}
            <ellipse cx="1680" cy="148" rx="25" ry="8" fill="#fff9c4" opacity="0.95" />
          </g>
        </g>

        {/* Ambient Accents (curved swoosh lines & 4-point star sparkles) */}
        <g ref={ambientAccentsRef} className={styles.ambientAccents}>
          {/* Subtle curved blue swoosh line near top right */}
          <path
            d="M1420,160 C1560,120 1680,220 1720,320"
            fill="none"
            stroke="#3b6cfa"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.45"
          />
          {/* Subtle curved blue swoosh line near bottom left */}
          <path
            d="M260,780 C360,840 440,790 520,720"
            fill="none"
            stroke="#3b6cfa"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* 4-Point Star Sparkle 1 (Near Right Fixture) */}
          <path
            d="M1740,340 Q1740,360 1760,360 Q1740,360 1740,380 Q1740,360 1720,360 Q1740,360 1740,340 Z"
            fill="#60a5fa"
            opacity="0.85"
          />
          {/* 4-Point Star Sparkle 2 (Left Lower Stage) */}
          <path
            d="M380,720 Q380,735 395,735 Q380,735 380,750 Q380,735 365,735 Q380,735 380,720 Z"
            fill="#ffffff"
            opacity="0.7"
          />
          {/* 4-Point Star Sparkle 3 (Top Left Background) */}
          <path
            d="M480,240 Q480,250 490,250 Q480,250 480,260 Q480,250 470,250 Q480,250 480,240 Z"
            fill="#60a5fa"
            opacity="0.6"
          />
        </g>

        {/* Title Group ("SPOT" + "LIGHT") with Slanted Condensed Poster Typography */}
        <g className={styles.titleGroup}>
          {/* Compound title word "SPOTLIGHT" with color-separated tspans, clipped for illuminated wipe */}
          <g clipPath="url(#spotlightTitleClip)">
            <text
              ref={titleTextRef}
              x="960"
              y="590"
              textAnchor="middle"
              fontSize="180"
              className={styles.titleText}
            >
              <tspan fill="#f5f1e6" className={styles.titleSpot}>SPOT</tspan>
              <tspan fill="#3b6cfa" className={styles.titleLight}>LIGHT</tspan>
            </text>

            {/* Iconic 4-point star inside the letter 'O' of SPOT matching the reference */}
            <g ref={starGroupRef}>
              <path
                d="M0,-38 Q0,0 30,0 Q0,0 0,38 Q0,0 -30,0 Q0,0 0,-38 Z"
                fill="#0a0a0a"
                opacity="0.95"
              />
              <path
                d="M0,-30 Q0,0 22,0 Q0,0 0,30 Q0,0 -22,0 Q0,0 0,-30 Z"
                fill="#f5f1e6"
                opacity="0.9"
              />
            </g>
          </g>

          {/* Double diagonal electric blue speed streaks under/right of "LIGHT" */}
          <g ref={streaksGroupRef}>
            <path
              ref={titleStreak1Ref}
              d="M0,0 L90,-26"
              className={styles.titleStreak}
            />
            <path
              ref={titleStreak2Ref}
              d="M25,25 L115,-1"
              className={styles.titleStreak}
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default SpotlightAnimation;
