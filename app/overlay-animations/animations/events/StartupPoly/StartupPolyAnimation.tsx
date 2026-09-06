// app/overlay-animations/animations/events/StartupPoly/StartupPolyAnimation.tsx
"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import {
  createStartupPolyTimeline,
  skipStartupPolyTimelineToExit,
} from "./startupPolyTimeline";
import styles from "./StartupPolyAnimation.module.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const StartupPolyAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  const boardGroupRef = useRef<SVGGElement>(null);
  const centerPanelRef = useRef<SVGGElement>(null);
  const titleStartupRef = useRef<SVGTextElement>(null);
  const titlePolyBadgeRef = useRef<SVGRectElement>(null);
  const titlePolyTextRef = useRef<SVGGElement>(null);
  const taglineRef = useRef<SVGTextElement>(null);
  const dieRef = useRef<SVGGElement>(null);
  const leftDeckRef = useRef<SVGGElement>(null);
  const rightDeckRef = useRef<SVGGElement>(null);
  const ambientAccentsRef = useRef<SVGGElement>(null);

  // 12 Tile element refs in clockwise ring sequence
  const tile0Ref = useRef<SVGGElement>(null);
  const tile1Ref = useRef<SVGGElement>(null);
  const tile2Ref = useRef<SVGGElement>(null);
  const tile3Ref = useRef<SVGGElement>(null);
  const tile4Ref = useRef<SVGGElement>(null);
  const tile5Ref = useRef<SVGGElement>(null);
  const tile6Ref = useRef<SVGGElement>(null);
  const tile7Ref = useRef<SVGGElement>(null);
  const tile8Ref = useRef<SVGGElement>(null);
  const tile9Ref = useRef<SVGGElement>(null);
  const tile10Ref = useRef<SVGGElement>(null);
  const tile11Ref = useRef<SVGGElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Initialize GSAP Timeline inside scoped context
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tileElements: SVGElement[] = [];
      const rawTiles = [
        tile0Ref.current,
        tile1Ref.current,
        tile2Ref.current,
        tile3Ref.current,
        tile4Ref.current,
        tile5Ref.current,
        tile6Ref.current,
        tile7Ref.current,
        tile8Ref.current,
        tile9Ref.current,
        tile10Ref.current,
        tile11Ref.current,
      ];
      rawTiles.forEach((el) => {
        if (el) tileElements.push(el);
      });

      const tl = createStartupPolyTimeline(
        {
          container: containerRef.current,
          boardGroup: boardGroupRef.current,
          tiles: tileElements,
          centerPanel: centerPanelRef.current,
          titleStartup: titleStartupRef.current,
          titlePolyBadge: titlePolyBadgeRef.current,
          titlePolyText: titlePolyTextRef.current,
          tagline: taglineRef.current,
          die: dieRef.current,
          leftDeck: leftDeckRef.current,
          rightDeck: rightDeckRef.current,
          ambientAccents: ambientAccentsRef.current,
          skipButton: skipButtonRef.current,
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
      ctx.revert();
      timelineRef.current = null;
    };
  }, [onComplete]);

  // Handle external dismiss/skip signal
  useEffect(() => {
    if (isDismissed || skip) {
      skipStartupPolyTimelineToExit(timelineRef.current);
    }
  }, [isDismissed, skip]);

  const handleManualDismiss = () => {
    skipStartupPolyTimelineToExit(timelineRef.current);
    onDismiss?.();
  };

  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-label="Startup Poly Event Animation"
    >
      {/* Background paper texture filter */}
      <div className={styles.paperNoise}>
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <filter id="polyPaperFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.1   0 0 0 0 0.1   0 0 0 0 0.1  0 0 0 0.08 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#polyPaperFilter)" />
        </svg>
      </div>

      {/* Skip / Dismiss Button */}
      <button
        ref={skipButtonRef}
        type="button"
        className={styles.skipButton}
        onClick={handleManualDismiss}
        aria-label="Skip Animation"
      >
        Skip <X className="h-3 w-3" />
      </button>

      {/* Scalable SVG Canvas */}
      <svg
        className={styles.stageSvg}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Clouds matching reference poster */}
        <g opacity="0.85" fill="#fcf9f2">
          {/* Cloud 1 (Top Left) */}
          <path d="M300,160 C300,140 320,125 345,125 C360,110 390,110 410,125 C430,115 460,125 470,145 C490,145 505,160 505,175 C505,190 490,200 470,200 L325,200 C305,200 300,185 300,160 Z" />
          {/* Cloud 2 (Top Right) */}
          <path d="M1520,290 C1520,270 1540,255 1565,255 C1580,240 1610,240 1630,255 C1650,245 1680,255 1690,275 C1710,275 1725,290 1725,305 C1725,320 1710,330 1690,330 L1545,330 C1525,330 1520,315 1520,290 Z" />
          {/* Cloud 3 (Bottom Left) */}
          <path d="M80,720 C80,705 95,695 115,695 C125,685 150,685 165,695 C180,685 205,695 215,710 C230,710 240,720 240,735 C240,750 230,760 215,760 L100,760 C85,760 80,745 80,720 Z" />
        </g>

        {/* Poster Corner Annotations (Verbatim from reference) */}
        <g fill="#111111">
          {/* Top Left */}
          <text
            x="80"
            y="95"
            fontFamily="var(--font-syne), 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="32"
            letterSpacing="-0.02em"
          >
            THE EQUINOX <tspan fill="#1856f3">2.0</tspan>
          </text>
          <text
            x="82"
            y="135"
            fontFamily="var(--font-mono), monospace"
            fontWeight="700"
            fontSize="12"
            letterSpacing="0.22em"
            opacity="0.8"
          >
            IDEAS  STRATEGY  PEOPLE  GROWTH
          </text>

          {/* Top Right */}
          <text
            x="1840"
            y="95"
            textAnchor="end"
            fontFamily="var(--font-mono), monospace"
            fontWeight="800"
            fontSize="24"
            letterSpacing="0.1em"
          >
            30 - 31 OCT
          </text>
          <line
            x1="1680"
            y1="112"
            x2="1840"
            y2="112"
            stroke="#111111"
            strokeWidth="2.5"
          />

          {/* Bottom Left */}
          <text
            x="80"
            y="995"
            fontFamily="var(--font-syne), 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="34"
            fill="#1856f3"
          >
            #
          </text>
          <text
            x="115"
            y="985"
            fontFamily="var(--font-mono), monospace"
            fontWeight="700"
            fontSize="12"
            letterSpacing="0.16em"
          >
            WHERE PASSION
          </text>
          <text
            x="115"
            y="1005"
            fontFamily="var(--font-mono), monospace"
            fontWeight="700"
            fontSize="12"
            letterSpacing="0.16em"
          >
            MEETS PERSEVERANCE
          </text>
          <line
            x1="80"
            y1="1025"
            x2="175"
            y2="1025"
            stroke="#111111"
            strokeWidth="2"
          />

          {/* Bottom Right */}
          <text
            x="1840"
            y="970"
            textAnchor="end"
            fontFamily="var(--font-mono), monospace"
            fontWeight="700"
            fontSize="12"
            letterSpacing="0.16em"
          >
            SAME GAME
          </text>
          <text
            x="1840"
            y="990"
            textAnchor="end"
            fontFamily="var(--font-mono), monospace"
            fontWeight="700"
            fontSize="12"
            letterSpacing="0.16em"
          >
            BIGGER DREAMS
          </text>
          <line
            x1="1740"
            y1="1010"
            x2="1840"
            y2="1010"
            stroke="#111111"
            strokeWidth="2"
          />
        </g>

        {/* Ambient Sparkles */}
        <g ref={ambientAccentsRef}>
          {/* Sparkle 1 (Near Top Left Board) */}
          <path
            d="M480,180 Q480,195 495,195 Q480,195 480,210 Q480,195 465,195 Q480,195 480,180 Z"
            fill="#111111"
            opacity="0.85"
          />
          {/* Sparkle 2 (Near Bottom Right Board) */}
          <path
            d="M1480,820 Q1480,838 1498,838 Q1480,838 1480,856 Q1480,838 1462,838 Q1480,838 1480,820 Z"
            fill="#111111"
            opacity="0.85"
          />
          {/* Sparkle 3 (Near Right Deck) */}
          <path
            d="M1740,430 Q1740,442 1752,442 Q1740,442 1740,454 Q1740,442 1728,442 Q1740,442 1740,430 Z"
            fill="#1856f3"
            opacity="0.75"
          />
        </g>

        {/* Left Card Deck Stack: "BIG IDEAS" */}
        <g ref={leftDeckRef} transform="translate(260, 520)">
          {/* Stack shadow & underlying cards */}
          <rect
            x="-110"
            y="-70"
            width="220"
            height="140"
            rx="14"
            fill="#0b2c8c"
          />
          <rect
            x="-106"
            y="-76"
            width="220"
            height="140"
            rx="14"
            fill="#1142c7"
          />
          {/* Top card */}
          <rect
            x="-100"
            y="-82"
            width="220"
            height="140"
            rx="14"
            fill="#1856f3"
            stroke="#ffffff"
            strokeWidth="3.5"
          />
          <text
            x="10"
            y="-4"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="var(--font-syne), 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="26"
            letterSpacing="-0.01em"
          >
            BIG
            <tspan x="10" y="28">
              IDEAS
            </tspan>
          </text>
        </g>

        {/* Right Card Deck Stack: "BIGGER MOVES" */}
        <g ref={rightDeckRef} transform="translate(1660, 520)">
          {/* Stack shadow & underlying cards */}
          <rect
            x="-110"
            y="-70"
            width="220"
            height="140"
            rx="14"
            fill="#0b2c8c"
          />
          <rect
            x="-106"
            y="-76"
            width="220"
            height="140"
            rx="14"
            fill="#1142c7"
          />
          {/* Top card */}
          <rect
            x="-100"
            y="-82"
            width="220"
            height="140"
            rx="14"
            fill="#1856f3"
            stroke="#ffffff"
            strokeWidth="3.5"
          />
          <text
            x="10"
            y="-4"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="var(--font-syne), 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="24"
            letterSpacing="-0.01em"
          >
            BIGGER
            <tspan x="10" y="28">
              MOVES
            </tspan>
          </text>
        </g>

        {/* ============================================================== */}
        {/* Flat Monopoly Ring Grid Board: 12 Tiles surrounding Center    */}
        {/* ============================================================== */}
        <g ref={boardGroupRef} className={styles.boardGroup}>
          {/* Board outer drop-shadow boundary */}
          <rect
            x="526"
            y="86"
            width="868"
            height="868"
            rx="8"
            fill="#111111"
            opacity="0.12"
          />
          <rect
            x="530"
            y="90"
            width="860"
            height="860"
            rx="6"
            fill="#111111"
          />

          {/* 12 Tiles (Clockwise sequence starting from Top-Left corner) */}

          {/* Tile 0: Top-Left Corner -> EXPLORE */}
          <g ref={tile0Ref} className={styles.tile}>
            <rect
              x="530"
              y="90"
              width="180"
              height="180"
              className={styles.tileBase}
            />
            {/* Flag Icon */}
            <path
              d="M595,145 L595,195 M595,145 L645,160 L595,175 Z"
              fill="#111111"
              stroke="#111111"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <text
              x="620"
              y="235"
              textAnchor="middle"
              className={styles.tileLabel}
              fontSize="14"
            >
              EXPLORE
            </text>
          </g>

          {/* Tile 1: Top Mid 1 -> LAUNCH */}
          <g ref={tile1Ref} className={styles.tile}>
            <rect
              x="710"
              y="90"
              width="250"
              height="180"
              className={styles.tileBase}
            />
            <rect
              x="710"
              y="90"
              width="250"
              height="28"
              className={styles.tileStripeBlue}
            />
            {/* Rocket Icon */}
            <path
              d="M835,135 C835,135 848,145 848,165 L844,175 L826,175 L822,165 C822,145 835,135 835,135 Z M818,175 L814,185 L824,182 Z M852,175 L856,185 L846,182 Z"
              fill="#111111"
              stroke="#111111"
              strokeWidth="2"
            />
            <text
              x="835"
              y="235"
              textAnchor="middle"
              className={styles.tileLabel}
              fontSize="14"
            >
              LAUNCH
            </text>
          </g>

          {/* Tile 2: Top Mid 2 -> INNOVATE */}
          <g ref={tile2Ref} className={styles.tile}>
            <rect
              x="960"
              y="90"
              width="250"
              height="180"
              className={styles.tileBase}
            />
            <rect
              x="960"
              y="90"
              width="250"
              height="28"
              className={styles.tileStripeBlue}
            />
            {/* Lightbulb Icon */}
            <path
              d="M1085,138 C1074,138 1066,146 1066,157 C1066,165 1072,170 1076,175 L1094,175 C1098,170 1104,165 1104,157 C1104,146 1096,138 1085,138 Z M1078,180 L1092,180 M1080,185 L1090,185"
              fill="none"
              stroke="#111111"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text
              x="1085"
              y="235"
              textAnchor="middle"
              className={styles.tileLabel}
              fontSize="14"
            >
              INNOVATE
            </text>
          </g>

          {/* Tile 3: Top-Right Corner -> SCALE (Vibrant blue tile) */}
          <g ref={tile3Ref} className={styles.tile}>
            <rect
              x="1210"
              y="90"
              width="180"
              height="180"
              className={styles.tileBlue}
            />
            {/* Bar Chart Icon */}
            <rect x="1272" y="165" width="10" height="25" fill="#ffffff" />
            <rect x="1288" y="150" width="10" height="40" fill="#ffffff" />
            <rect x="1304" y="135" width="10" height="55" fill="#ffffff" />
            <text
              x="1295"
              y="235"
              textAnchor="middle"
              className={styles.tileLabelWhite}
              fontSize="15"
            >
              SCALE
            </text>
          </g>

          {/* Tile 4: Right Mid 1 -> OPPORTUNITY */}
          <g ref={tile4Ref} className={styles.tile}>
            <rect
              x="1210"
              y="270"
              width="180"
              height="250"
              className={styles.tileBase}
            />
            <rect
              x="1362"
              y="270"
              width="28"
              height="250"
              className={styles.tileStripeBlue}
            />
            {/* Bold Question Mark Icon */}
            <text
              x="1285"
              y="385"
              textAnchor="middle"
              fontFamily="var(--font-syne), 'Arial Black', Impact, sans-serif"
              fontWeight="900"
              fontSize="48"
              fill="#111111"
            >
              ?
            </text>
            <text
              x="1285"
              y="445"
              textAnchor="middle"
              className={styles.tileLabel}
              fontSize="13"
            >
              OPPORTUNITY
            </text>
          </g>

          {/* Tile 5: Right Mid 2 -> GO GLOBAL */}
          <g ref={tile5Ref} className={styles.tile}>
            <rect
              x="1210"
              y="520"
              width="180"
              height="250"
              className={styles.tileBase}
            />
            <rect
              x="1362"
              y="520"
              width="28"
              height="250"
              className={styles.tileStripeBlue}
            />
            {/* Globe Grid Icon */}
            <circle
              cx="1285"
              cy="625"
              r="22"
              fill="none"
              stroke="#111111"
              strokeWidth="2.5"
            />
            <ellipse
              cx="1285"
              cy="625"
              rx="11"
              ry="22"
              fill="none"
              stroke="#111111"
              strokeWidth="2"
            />
            <line
              x1="1263"
              y1="625"
              x2="1307"
              y2="625"
              stroke="#111111"
              strokeWidth="2"
            />
            <text
              x="1285"
              y="700"
              textAnchor="middle"
              className={styles.tileLabel}
              fontSize="13"
            >
              GO GLOBAL
            </text>
          </g>

          {/* Tile 6: Bottom-Right Corner -> Blue Accent Block */}
          <g ref={tile6Ref} className={styles.tile}>
            <rect
              x="1210"
              y="770"
              width="180"
              height="180"
              className={styles.tileBlue}
            />
            <circle
              cx="1300"
              cy="850"
              r="24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
            />
            <circle cx="1300" cy="850" r="10" fill="#ffffff" />
            <text
              x="1300"
              y="915"
              textAnchor="middle"
              className={styles.tileLabelWhite}
              fontSize="13"
            >
              EXPAND
            </text>
          </g>

          {/* Tile 7: Bottom Mid 1 -> COMPETE */}
          <g ref={tile7Ref} className={styles.tile}>
            <rect
              x="960"
              y="770"
              width="250"
              height="180"
              className={styles.tileBase}
            />
            <rect
              x="960"
              y="922"
              width="250"
              height="28"
              className={styles.tileStripeBlue}
            />
            {/* Trophy Icon */}
            <path
              d="M1070,815 L1100,815 L1096,838 C1094,848 1088,852 1085,852 C1082,852 1076,848 1074,838 Z M1085,852 L1085,862 M1076,862 L1094,862"
              fill="none"
              stroke="#111111"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <text
              x="1085"
              y="895"
              textAnchor="middle"
              className={styles.tileLabel}
              fontSize="14"
            >
              COMPETE
            </text>
          </g>

          {/* Tile 8: Bottom Mid 2 -> GROW */}
          <g ref={tile8Ref} className={styles.tile}>
            <rect
              x="710"
              y="770"
              width="250"
              height="180"
              className={styles.tileBase}
            />
            <rect
              x="710"
              y="922"
              width="250"
              height="28"
              className={styles.tileStripeBlue}
            />
            {/* Seedling Sprout Icon */}
            <path
              d="M835,860 L835,835 C835,835 848,832 850,820 C838,820 835,832 835,832 C835,832 832,820 820,820 C822,832 835,835 835,835"
              fill="#111111"
              stroke="#111111"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <text
              x="835"
              y="895"
              textAnchor="middle"
              className={styles.tileLabel}
              fontSize="14"
            >
              GROW
            </text>
          </g>

          {/* Tile 9: Bottom-Left Corner -> INVEST */}
          <g ref={tile9Ref} className={styles.tile}>
            <rect
              x="530"
              y="770"
              width="180"
              height="180"
              className={styles.tileBase}
            />
            <circle
              cx="620"
              cy="835"
              r="22"
              fill="#111111"
            />
            <text
              x="620"
              y="844"
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="var(--font-mono), monospace"
              fontWeight="900"
              fontSize="24"
            >
              $
            </text>
            <text
              x="620"
              y="895"
              textAnchor="middle"
              className={styles.tileLabel}
              fontSize="14"
            >
              INVEST
            </text>
          </g>

          {/* Tile 10: Left Mid 1 -> PARTNER */}
          <g ref={tile10Ref} className={styles.tile}>
            <rect
              x="530"
              y="520"
              width="180"
              height="250"
              className={styles.tileBase}
            />
            <rect
              x="530"
              y="520"
              width="28"
              height="250"
              className={styles.tileStripeBlue}
            />
            {/* Handshake Icon */}
            <path
              d="M595,625 L610,610 L625,622 L640,610 L650,622 L635,635 L622,625 L610,637 Z"
              fill="#111111"
              stroke="#111111"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <text
              x="635"
              y="680"
              textAnchor="middle"
              className={styles.tileLabel}
              fontSize="14"
            >
              PARTNER
            </text>
          </g>

          {/* Tile 11: Left Mid 2 -> ACQUIRE */}
          <g ref={tile11Ref} className={styles.tile}>
            <rect
              x="530"
              y="270"
              width="180"
              height="250"
              className={styles.tileBase}
            />
            <rect
              x="530"
              y="270"
              width="28"
              height="250"
              className={styles.tileStripeBlue}
            />
            {/* City Skyscrapers Icon */}
            <rect x="608" y="380" width="22" height="42" fill="#111111" />
            <rect x="635" y="360" width="26" height="62" fill="#111111" />
            <text
              x="635"
              y="450"
              textAnchor="middle"
              className={styles.tileLabel}
              fontSize="14"
            >
              ACQUIRE
            </text>
          </g>

          {/* ============================================================== */}
          {/* Center Panel (Board Core)                                      */}
          {/* ============================================================== */}
          <g ref={centerPanelRef}>
            {/* Center Panel Background */}
            <rect
              x="710"
              y="270"
              width="500"
              height="500"
              fill="#ffffff"
              stroke="#111111"
              strokeWidth="3.5"
            />
            {/* Inner blueprint dashed frame */}
            <rect
              x="724"
              y="284"
              width="472"
              height="472"
              fill="none"
              stroke="#1856f3"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.35"
            />

            {/* Title: "STARTUP" (Black, bold condensed) */}
            <text
              ref={titleStartupRef}
              x="960"
              y="442"
              textAnchor="middle"
              className={styles.titleStartup}
              fontSize="58"
            >
              STARTUP
            </text>

            {/* Title: "POLY" Blue Background Badge */}
            <rect
              ref={titlePolyBadgeRef}
              x="770"
              y="465"
              width="380"
              height="110"
              rx="12"
              fill="#1856f3"
            />

            {/* Title: "P" and "LY" Text surrounding the Die slot */}
            <g ref={titlePolyTextRef} className={styles.titlePolyText}>
              <text x="830" y="550" fontSize="82">
                P
              </text>
              <text x="996" y="550" fontSize="82">
                LY
              </text>
            </g>

            {/* Tagline: "A GAME OF BIGGER POSSIBILITIES" */}
            <text
              ref={taglineRef}
              x="960"
              y="628"
              textAnchor="middle"
              className={styles.taglineText}
              fontSize="16"
            >
              A GAME OF BIGGER POSSIBILITIES
            </text>
          </g>

          {/* ============================================================== */}
          {/* Reused Die Element (rolls, bounces, and lands in "O" of POLY) */}
          {/* Positioned at "O" center: (944, 520)                           */}
          {/* ============================================================== */}
          <g ref={dieRef} transform="translate(944, 520)">
            {/* Die Body Face */}
            <rect
              x="-35"
              y="-35"
              width="70"
              height="70"
              rx="12"
              fill="#1856f3"
              stroke="#ffffff"
              strokeWidth="3.5"
            />
            {/* 5 White Dot-Pips */}
            <circle cx="-18" cy="-18" r="5.5" fill="#ffffff" />
            <circle cx="18" cy="-18" r="5.5" fill="#ffffff" />
            <circle cx="0" cy="0" r="5.5" fill="#ffffff" />
            <circle cx="-18" cy="18" r="5.5" fill="#ffffff" />
            <circle cx="18" cy="18" r="5.5" fill="#ffffff" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default StartupPolyAnimation;
