// app/overlay-animations/animations/events/Crossroads/CrossroadsAnimation.tsx
"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import {
  createCrossroadsMasterTl,
  startCrossroadsIdleLoops,
  runCrossroadsExit,
} from "./crossroadsTimeline";
import styles from "./CrossroadsAnimation.module.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const CrossroadsAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  // ── Scene refs ─────────────────────────────────────────────────────────────
  const semicircleGlowRef = useRef<SVGPathElement>(null);
  const signpostPoleRef   = useRef<SVGRectElement>(null);
  const arrowsGroupRef    = useRef<SVGGElement>(null);
  const signArrow1Ref     = useRef<SVGGElement>(null);
  const signArrow2Ref     = useRef<SVGGElement>(null);
  const signArrow3Ref     = useRef<SVGGElement>(null);

  // Road A stroked elements (drawn from signpost outward)
  const roadAAsphaltRef      = useRef<SVGPathElement>(null);
  const roadABlue1Ref        = useRef<SVGPathElement>(null);
  const roadABlue2Ref        = useRef<SVGPathElement>(null);
  const roadACenterRef       = useRef<SVGPathElement>(null);
  const roadAUpperAsphaltRef = useRef<SVGPathElement>(null);
  const roadAUpperBlue1Ref   = useRef<SVGPathElement>(null);
  const roadAUpperBlue2Ref   = useRef<SVGPathElement>(null);
  const roadAUpperCenterRef  = useRef<SVGPathElement>(null);

  // Road B stroked elements
  const roadBAsphaltRef      = useRef<SVGPathElement>(null);
  const roadBBlue1Ref        = useRef<SVGPathElement>(null);
  const roadBBlue2Ref        = useRef<SVGPathElement>(null);
  const roadBCenterRef       = useRef<SVGPathElement>(null);
  const roadBUpperAsphaltRef = useRef<SVGPathElement>(null);
  const roadBUpperBlue1Ref   = useRef<SVGPathElement>(null);
  const roadBUpperBlue2Ref   = useRef<SVGPathElement>(null);
  const roadBUpperCenterRef  = useRef<SVGPathElement>(null);

  // Crosswalk X arms
  const crosswalkXArm1Ref = useRef<SVGLineElement>(null);
  const crosswalkXArm2Ref = useRef<SVGLineElement>(null);

  // Title wipe reveal clip rects
  const titleClipLeftRef  = useRef<SVGRectElement>(null);
  const titleClipRightRef = useRef<SVGRectElement>(null);
  const titleGroupRef     = useRef<SVGGElement>(null);
  const titleTextRef      = useRef<SVGTextElement>(null);
  const titleAccentsRef   = useRef<SVGGElement>(null);
  const sideTextRightRef  = useRef<SVGGElement>(null);

  // Ambient & Corner annotations
  const ambientGroupRef      = useRef<SVGGElement>(null);
  const cornerAnnotationsRef = useRef<SVGGElement>(null);

  // ── Runtime refs ───────────────────────────────────────────────────────────
  const masterTlRef  = useRef<gsap.core.Timeline | null>(null);
  const idleLoopsRef = useRef<gsap.core.Tween[]>([]);
  const exitingRef   = useRef(false);

  // ───────────────────────────────────────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    exitingRef.current = false;
    const ctx = gsap.context(() => {
      // ── Dynamic layout computation via getBBox ──────────────────────────────
      const recomputeLayout = () => {
        if (!titleTextRef.current || !titleGroupRef.current) {
          return;
        }

        try {
          // 1. Determine bottom edge of arrow signs
          // Arrow 3 sits at translate(960, 325) rotate(14°), extending to y ≈ 394.
          let arrowsBottom = 394;
          if (arrowsGroupRef.current) {
            try {
              const bbox = arrowsGroupRef.current.getBBox();
              const measuredBottom = bbox.y + bbox.height;
              // Guard against 0 / collapsed box if measured before or during scale:0 animation
              if (measuredBottom >= 350 && measuredBottom <= 430) {
                arrowsBottom = measuredBottom;
              }
            } catch {
              // fallback to 394
            }
          }

          // 2. Measure title text bounding box
          const titleBBox = titleTextRef.current.getBBox();

          // 3. Measure side text right block ("IDEAS PEOPLE OPPORTUNITIES")
          let sideTextWidth = 120;
          if (sideTextRightRef.current) {
            try {
              const sideBBox = sideTextRightRef.current.getBBox();
              if (sideBBox.width > 0) sideTextWidth = sideBBox.width;
            } catch {
              // fallback
            }
          }

          // 4. Horizontal scale check (ensure title fits comfortably between margins)
          const SAFE_HORIZONTAL_MARGIN = 40;
          const maxRightForTitle = 1760 - sideTextWidth - SAFE_HORIZONTAL_MARGIN;
          const maxAllowedWidth = Math.max(880, Math.min(1040, (maxRightForTitle - 960) * 2));

          let scale = 1;
          if (titleBBox.width > 0 && titleBBox.width > maxAllowedWidth) {
            scale = maxAllowedWidth / titleBBox.width;
          }

          // 5. Vertical placement:
          // Title MUST sit strictly BELOW the arrows' bottom edge with a visible gap
          const ARROWS_TITLE_GAP = 28;
          const targetTitleTop = arrowsBottom + ARROWS_TITLE_GAP;
          const dy = targetTitleTop - titleBBox.y;

          // Apply position and scale to title
          gsap.set(titleGroupRef.current, {
            y: dy,
            scaleX: scale,
            scaleY: scale,
            transformOrigin: `960px ${titleBBox.y}px`,
          });

          // Sync title accents & squiggles
          if (titleAccentsRef.current) {
            gsap.set(titleAccentsRef.current, {
              y: dy,
              scaleX: scale,
              scaleY: scale,
              transformOrigin: `960px ${titleBBox.y}px`,
            });
          }

          // 6. Position side text block safely to the right of title with margin
          if (sideTextRightRef.current) {
            const actualTitleRight = 960 + ((titleBBox.x + titleBBox.width - 960) * scale);
            const targetSideX = Math.min(
              1640,
              Math.max(1480, actualTitleRight + SAFE_HORIZONTAL_MARGIN)
            );
            sideTextRightRef.current.setAttribute(
              "transform",
              `translate(${targetSideX}, 240)`
            );
          }
        } catch (e) {
          console.warn("Crossroads layout computation error:", e);
        }
      };

      recomputeLayout();

      if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          recomputeLayout();
        });
      }

      // ── Group road elements ────────────────────────────────────────────────
      const roadAEls = [
        roadAAsphaltRef.current,
        roadABlue1Ref.current,
        roadABlue2Ref.current,
        roadACenterRef.current,
        roadAUpperAsphaltRef.current,
        roadAUpperBlue1Ref.current,
        roadAUpperBlue2Ref.current,
        roadAUpperCenterRef.current,
      ].filter(Boolean) as SVGElement[];

      const roadBEls = [
        roadBAsphaltRef.current,
        roadBBlue1Ref.current,
        roadBBlue2Ref.current,
        roadBCenterRef.current,
        roadBUpperAsphaltRef.current,
        roadBUpperBlue1Ref.current,
        roadBUpperBlue2Ref.current,
        roadBUpperCenterRef.current,
      ].filter(Boolean) as SVGElement[];

      // ── Master timeline build ──────────────────────────────────────────────
      const tl = createCrossroadsMasterTl(
        {
          container: containerRef.current,
          skipButton: skipButtonRef.current,
          semicircleGlow: semicircleGlowRef.current,
          signpostPole: signpostPoleRef.current,
          signArrow1: signArrow1Ref.current,
          signArrow2: signArrow2Ref.current,
          signArrow3: signArrow3Ref.current,
          roadAEls,
          roadBEls,
          crosswalkXArm1: crosswalkXArm1Ref.current,
          crosswalkXArm2: crosswalkXArm2Ref.current,
          titleClipLeft: titleClipLeftRef.current,
          titleClipRight: titleClipRightRef.current,
          titleGroup: titleGroupRef.current,
          ambientGroup: ambientGroupRef.current,
          cornerAnnotations: cornerAnnotationsRef.current,
        },
        {
          onEntranceComplete: () => {
            if (exitingRef.current) return;
            const loops = startCrossroadsIdleLoops({
              signArrow1: signArrow1Ref.current,
              signArrow2: signArrow2Ref.current,
              signArrow3: signArrow3Ref.current,
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
      masterTlRef.current = null;
    };
  }, [onComplete]);

  // ── Dismiss / Skip Handling ────────────────────────────────────────────────
  useEffect(() => {
    if ((isDismissed || skip) && !exitingRef.current) {
      exitingRef.current = true;
      runCrossroadsExit(containerRef.current, idleLoopsRef.current, () => {
        idleLoopsRef.current = [];
        onComplete?.();
      });
    }
  }, [isDismissed, skip, onComplete]);

  const handleManualDismiss = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    runCrossroadsExit(containerRef.current, idleLoopsRef.current, () => {
      idleLoopsRef.current = [];
      onComplete?.();
      onDismiss?.();
    });
  };

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-label="Crossroads Event Animation"
    >
      {/* Paper grain texture */}
      <div className={styles.paperNoise}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="cr-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.09 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cr-grain)" />
        </svg>
      </div>

      {/* Skip button */}
      <button
        ref={skipButtonRef}
        type="button"
        className={styles.skipButton}
        onClick={handleManualDismiss}
        aria-label="Skip Animation"
      >
        Skip <X className="h-3 w-3" />
      </button>

      {/* =======================================================================
          Main SVG Canvas (viewBox 1920×1080)
      ======================================================================= */}
      <svg
        className={styles.stageSvg}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Title wipe reveal clip (outward from x=960) */}
          <clipPath id="cr-title-clip">
            <rect ref={titleClipLeftRef} x="960" y="-500" width="0" height="2000" />
            <rect ref={titleClipRightRef} x="960" y="-500" width="0" height="2000" />
          </clipPath>
        </defs>

        {/* ── 1. PERSPECTIVE FLOOR GRID ───────────────────────────────────── */}
        <g opacity="0.45">
          {[-400, -80, 240, 560, 780, 960, 1140, 1360, 1680, 2000, 2320].map((x, i) => (
            <line
              key={i}
              x1={960}
              y1={650}
              x2={x}
              y2={1140}
              stroke="#111111"
              strokeWidth="1.2"
              strokeOpacity="0.12"
            />
          ))}
          <line x1="0" y1="730" x2="1920" y2="730" stroke="#111111" strokeWidth="1" strokeOpacity="0.08" />
          <line x1="0" y1="840" x2="1920" y2="840" stroke="#111111" strokeWidth="1" strokeOpacity="0.08" />
          <line x1="0" y1="980" x2="1920" y2="980" stroke="#111111" strokeWidth="1" strokeOpacity="0.08" />
        </g>

        {/* ── 2. BLUE SEMICIRCLE GLOW ─────────────────────────────────────── */}
        {/* Flat electric blue semicircle at the horizon behind signpost base */}
        <path
          ref={semicircleGlowRef}
          d="M860,650 A100,100 0 0,1 1060,650 Z"
          fill="#1856f3"
        />

        {/* ── 3. ROADS CROSSING IN X (Built via stroked paths for draw-on) ─── */}
        {/* ROAD A — Upper Branch (toward top-right, angled safely below title) */}
        <g>
          <path
            ref={roadAUpperAsphaltRef}
            d="M960,650 L1950,560"
            stroke="#18181b"
            strokeWidth="105"
            strokeLinecap="butt"
            fill="none"
          />
          <path
            ref={roadAUpperBlue1Ref}
            d="M930,620 L1920,530"
            stroke="#1856f3"
            strokeWidth="9"
            fill="none"
          />
          <path
            ref={roadAUpperBlue2Ref}
            d="M990,680 L1980,590"
            stroke="#1856f3"
            strokeWidth="9"
            fill="none"
          />
          <path
            ref={roadAUpperCenterRef}
            d="M960,650 L1950,560"
            stroke="white"
            strokeWidth="5"
            strokeDasharray="24 18"
            fill="none"
          />
        </g>

        {/* ROAD B — Upper Branch (toward top-left, angled safely below title) */}
        <g>
          <path
            ref={roadBUpperAsphaltRef}
            d="M960,650 L-30,560"
            stroke="#18181b"
            strokeWidth="105"
            strokeLinecap="butt"
            fill="none"
          />
          <path
            ref={roadBUpperBlue1Ref}
            d="M990,620 L0,530"
            stroke="#1856f3"
            strokeWidth="9"
            fill="none"
          />
          <path
            ref={roadBUpperBlue2Ref}
            d="M930,680 L-60,590"
            stroke="#1856f3"
            strokeWidth="9"
            fill="none"
          />
          <path
            ref={roadBUpperCenterRef}
            d="M960,650 L-30,560"
            stroke="white"
            strokeWidth="5"
            strokeDasharray="24 18"
            fill="none"
          />
        </g>

        {/* ROAD A — Lower Branch (toward bottom-left) */}
        <g>
          <path
            ref={roadAAsphaltRef}
            d="M960,650 L40,1050"
            stroke="#18181b"
            strokeWidth="240"
            strokeLinecap="butt"
            fill="none"
          />
          <path
            ref={roadABlue1Ref}
            d="M890,610 L-80,1010"
            stroke="#1856f3"
            strokeWidth="15"
            fill="none"
          />
          <path
            ref={roadABlue2Ref}
            d="M1030,690 L160,1090"
            stroke="#1856f3"
            strokeWidth="15"
            fill="none"
          />
          <path
            ref={roadACenterRef}
            d="M960,650 L40,1050"
            stroke="white"
            strokeWidth="8"
            strokeDasharray="36 26"
            fill="none"
          />
        </g>

        {/* ROAD B — Lower Branch (toward bottom-right) */}
        <g>
          <path
            ref={roadBAsphaltRef}
            d="M960,650 L1880,1050"
            stroke="#18181b"
            strokeWidth="240"
            strokeLinecap="butt"
            fill="none"
          />
          <path
            ref={roadBBlue1Ref}
            d="M1030,610 L2000,1010"
            stroke="#1856f3"
            strokeWidth="15"
            fill="none"
          />
          <path
            ref={roadBBlue2Ref}
            d="M890,690 L1760,1090"
            stroke="#1856f3"
            strokeWidth="15"
            fill="none"
          />
          <path
            ref={roadBCenterRef}
            d="M960,650 L1880,1050"
            stroke="white"
            strokeWidth="8"
            strokeDasharray="36 26"
            fill="none"
          />
        </g>

        {/* Blue decorative curb ribbons on foreground edges (as in reference poster) */}
        <path d="M-60,830 L160,1140" stroke="#1856f3" strokeWidth="24" opacity="0.95" />
        <path d="M1980,830 L1760,1140" stroke="#1856f3" strokeWidth="24" opacity="0.95" />

        {/* Central intersection patch to join all 4 road branches cleanly */}
        <polygon points="860,650 960,590 1060,650 960,710" fill="#18181b" />

        {/* ── 4. CROSSWALK X MARKING AT INTERSECTION ──────────────────────── */}
        <g>
          <line
            ref={crosswalkXArm1Ref}
            x1="830"
            y1="700"
            x2="1090"
            y2="760"
            stroke="white"
            strokeWidth="36"
            strokeLinecap="square"
          />
          <line
            ref={crosswalkXArm2Ref}
            x1="1090"
            y1="700"
            x2="830"
            y2="760"
            stroke="white"
            strokeWidth="36"
            strokeLinecap="square"
          />
        </g>

        {/* ── 5. TITLE: "CROSS" + "ROADS" ─────────────────────────────────── */}
        {/* Rendered cleanly above the horizon in the sky band */}
        <g ref={titleGroupRef} clipPath="url(#cr-title-clip)">
          <text
            ref={titleTextRef}
            x="960"
            y="400"
            textAnchor="middle"
            className={styles.titleText}
            fontSize="175"
          >
            <tspan fill="#111111">CROSS </tspan>
            <tspan fill="#1856f3">ROADS</tspan>
          </text>
        </g>

        {/* ── 6. SIGNPOST (Anchored in exact center) ───────────────────────── */}
        <g>
          {/* Vertical black pole */}
          <rect
            ref={signpostPoleRef}
            x="952"
            y="70"
            width="16"
            height="580"
            rx="3"
            fill="#111111"
          />
          {/* Base collar on asphalt */}
          <rect
            x="942"
            y="630"
            width="36"
            height="32"
            rx="4"
            fill="#111111"
            stroke="#222222"
            strokeWidth="1.5"
          />

          {/* Group of 3 arrow signs for getBBox measurement */}
          <g ref={arrowsGroupRef}>
            {/* SIGN 1 — Top arrow: pointing upper-right (~22° angle) */}
            <g ref={signArrow1Ref}>
              <g transform="translate(960, 185) rotate(22)">
                <polygon points="0,-24 135,-24 165,0 135,24 0,24" fill="#1856f3" />
                <polygon points="0,24 135,24 165,0 165,6 135,30 0,30" fill="#0d3cb3" />
                <rect x="-8" y="-22" width="12" height="44" rx="2" fill="#111111" />
              </g>
            </g>

            {/* SIGN 2 — Middle arrow: pointing left (~-8° angle) */}
            <g ref={signArrow2Ref}>
              <g transform="translate(960, 255) rotate(-8)">
                <polygon points="0,-24 -145,-24 -175,0 -145,24 0,24" fill="#1856f3" />
                <polygon points="0,24 -145,24 -175,0 -175,6 -145,30 0,30" fill="#0d3cb3" />
                <rect x="-4" y="-22" width="12" height="44" rx="2" fill="#111111" />
              </g>
            </g>

            {/* SIGN 3 — Bottom arrow: pointing right (~14° angle) */}
            <g ref={signArrow3Ref}>
              <g transform="translate(960, 325) rotate(14)">
                <polygon points="0,-25 155,-25 185,0 155,25 0,25" fill="#1856f3" />
                <polygon points="0,25 155,25 185,0 185,7 155,32 0,32" fill="#0d3cb3" />
                <rect x="-8" y="-23" width="12" height="46" rx="2" fill="#111111" />
              </g>
            </g>
          </g>
        </g>

        {/* ── 7. AMBIENT DETAILS (Clouds, Squiggles, Side Accents) ─────────── */}
        <g ref={ambientGroupRef}>
          {/* Cloud 1 (top left) */}
          <g transform="translate(360, 160)" fill="white" opacity="0.88">
            <ellipse cx="60" cy="30" rx="60" ry="22" />
            <circle cx="45" cy="18" r="22" />
            <circle cx="75" cy="14" r="26" />
          </g>

          {/* Cloud 2 (top right) */}
          <g transform="translate(1480, 140)" fill="white" opacity="0.88">
            <ellipse cx="60" cy="28" rx="55" ry="20" />
            <circle cx="48" cy="16" r="20" />
            <circle cx="74" cy="14" r="24" />
          </g>

          {/* Cloud 3 (small, mid-left) */}
          <g transform="translate(200, 220)" fill="white" opacity="0.75">
            <ellipse cx="40" cy="20" rx="38" ry="14" />
            <circle cx="34" cy="10" r="14" />
          </g>

          {/* Title accents group (dynamically synchronized with title displacement) */}
          <g ref={titleAccentsRef}>
            {/* Blue speed accents around CROSS */}
            <line x1="390" y1="310" x2="480" y2="335" stroke="#1856f3" strokeWidth="7" strokeLinecap="round" />
            <line x1="360" y1="355" x2="465" y2="377" stroke="#1856f3" strokeWidth="8" strokeLinecap="round" />
            {/* Blue squiggle under CROSS */}
            <path
              d="M520,415 Q580,380 640,420 T760,395"
              stroke="#1856f3"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />

            {/* Blue squiggle under ROADS */}
            <path
              d="M1100,410 Q1130,390 1160,412"
              stroke="#1856f3"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />

            {/* Black motion slashes across ROADS (matching reference poster) */}
            <line x1="1260" y1="370" x2="1490" y2="300" stroke="#111111" strokeWidth="6" strokeLinecap="round" />
            <line x1="1310" y1="400" x2="1510" y2="340" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Side isometric blue cards (matching poster borders) */}
          <polygon points="0,170 120,200 120,410 0,380" fill="#1856f3" opacity="0.9" />
          <polygon points="1920,210 1800,250 1800,520 1920,480" fill="#1856f3" opacity="0.9" />

          {/* Text: "DIFFERENT PERSPECTIVES BIGGER POSSIBILITIES" */}
          <g transform="translate(120, 440)">
            <text y="0" className={styles.annotationText} fontSize="12">DIFFERENT</text>
            <text y="18" className={styles.annotationText} fontSize="12">PERSPECTIVES</text>
            <text y="36" className={styles.annotationText} fontSize="12">BIGGER</text>
            <text y="54" className={styles.annotationText} fontSize="12">POSSIBILITIES</text>
          </g>

          {/* Text: "IDEAS PEOPLE OPPORTUNITIES" */}
          <g ref={sideTextRightRef} transform="translate(1420, 240)">
            <text y="0" className={styles.annotationText} fontSize="12">IDEAS</text>
            <text y="18" className={styles.annotationText} fontSize="12">PEOPLE</text>
            <text y="36" className={styles.annotationText} fontSize="12">OPPORTUNITIES</text>
          </g>

          {/* Text: "CHOOSE EXPLORE CREATE" */}
          <g transform="translate(1720, 720)">
            <text y="0" className={styles.annotationText} fontSize="13">CHOOSE</text>
            <text y="20" className={styles.annotationText} fontSize="13">EXPLORE</text>
            <text y="40" className={styles.annotationText} fontSize="13">CREATE</text>
          </g>
        </g>

        {/* ── 8. CORNER ANNOTATIONS ────────────────────────────────────────── */}
        <g ref={cornerAnnotationsRef}>
          {/* Top-left brand */}
          <text x="80" y="78" className={styles.cornerBrand} fontSize="26">
            THE EQUINOX{" "}
            <tspan className={styles.cornerBrandBlue}>2.0</tspan>
          </text>
          <text x="82" y="108" className={styles.cornerText} fontSize="10" opacity="0.75">
            IDEAS · PEOPLE · MARKETS · OPPORTUNITIES
          </text>

          {/* Top-right date */}
          <text x="1840" y="78" textAnchor="end" className={styles.cornerText} fontSize="20" fontWeight="800">
            30 - 31 OCT
          </text>
          <line x1="1710" y1="92" x2="1840" y2="92" stroke="#111111" strokeWidth="2" />
          <text x="1840" y="112" textAnchor="end" className={styles.cornerText} fontSize="13">
            MLRIT
          </text>

          {/* Bottom-left logo */}
          <text x="80" y="996" className={styles.cornerBrand} fontSize="18">
            MLRIT
          </text>
          <line x1="80" y1="1006" x2="150" y2="1006" stroke="#111111" strokeWidth="2" />

          {/* Bottom-right hashtag */}
          <text x="1650" y="996" fontSize="28" fill="#111111" fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif">
            #
          </text>
          <text x="1680" y="986" className={styles.cornerText} fontSize="10" opacity="0.82">
            WHERE PASSION
          </text>
          <text x="1680" y="1003" className={styles.cornerText} fontSize="10" opacity="0.82">
            MEETS PERSEVERANCE
          </text>
        </g>
      </svg>
    </div>
  );
};

export default CrossroadsAnimation;
