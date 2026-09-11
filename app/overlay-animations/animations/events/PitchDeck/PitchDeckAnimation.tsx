// app/overlay-animations/animations/events/PitchDeck/PitchDeckAnimation.tsx
"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import {
  createPitchDeckMasterTl,
  startPitchDeckIdleLoops,
  runPitchDeckExit,
} from "./pitchDeckTimeline";
import styles from "./PitchDeckAnimation.module.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const PitchDeckAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageFrameRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  // Header & Venue branding
  const headerTextRef = useRef<SVGTextElement>(null);
  const dateVenueTextRef = useRef<SVGGElement>(null);

  // Ceiling lamps & light beams
  const lampLeftGroupRef = useRef<SVGGElement>(null);
  const lampRightGroupRef = useRef<SVGGElement>(null);
  const lightBeamLeftRef = useRef<SVGPolygonElement>(null);
  const lightBeamRightRef = useRef<SVGPolygonElement>(null);

  // Side Banners
  const leftBannerRef = useRef<SVGGElement>(null);
  const rightBannerRef = useRef<SVGGElement>(null);

  // Potted plants
  const plantLeftRef = useRef<SVGGElement>(null);
  const plantRightRef = useRef<SVGGElement>(null);

  // Podium text
  const podiumTextRef = useRef<SVGGElement>(null);

  // Screen structure
  const screenFrameGroupRef = useRef<SVGGElement>(null);
  const screenWeightBarRef = useRef<SVGRectElement>(null);
  const screenSurfaceRef = useRef<SVGRectElement>(null);
  const screenContentGroupRef = useRef<SVGGElement>(null);

  // Left PPT content
  const dividerLineRef = useRef<SVGLineElement>(null);
  const pitchTitleRef = useRef<SVGTextElement>(null);
  const deckTitleRef = useRef<SVGTextElement>(null);
  const taglineBlockRef = useRef<SVGGElement>(null);

  // Right PPT content (Bar Chart)
  const chartAxisRef = useRef<SVGLineElement>(null);
  const chartBarsRef = useRef<SVGElement[]>([]);
  const chartArrowRef = useRef<SVGPathElement>(null);
  const chartArrowHeadRef = useRef<SVGPolygonElement>(null);
  const chartBadgeRef = useRef<SVGGElement>(null);

  // Right PPT content (3 Icon Rows)
  const iconRow1Ref = useRef<SVGGElement>(null);
  const iconRow2Ref = useRef<SVGGElement>(null);
  const iconRow3Ref = useRef<SVGGElement>(null);

  // Runtime animation refs
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);
  const idleLoopsRef = useRef<gsap.core.Tween[]>([]);
  const exitingRef = useRef(false);

  // ── Lifecycle & GSAP initialization ────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    exitingRef.current = false;
    const ctx = gsap.context(() => {
      const tl = createPitchDeckMasterTl(
        {
          container: containerRef.current,
          stageFrame: stageFrameRef.current,
          skipButton: skipButtonRef.current,
          headerText: headerTextRef.current,
          dateVenueText: dateVenueTextRef.current,
          lampLeftGroup: lampLeftGroupRef.current,
          lampRightGroup: lampRightGroupRef.current,
          lightBeamLeft: lightBeamLeftRef.current,
          lightBeamRight: lightBeamRightRef.current,
          leftBanner: leftBannerRef.current,
          rightBanner: rightBannerRef.current,
          plantLeft: plantLeftRef.current,
          plantRight: plantRightRef.current,
          podiumText: podiumTextRef.current,
          screenFrameGroup: screenFrameGroupRef.current,
          screenWeightBar: screenWeightBarRef.current,
          screenSurface: screenSurfaceRef.current,
          screenContentGroup: screenContentGroupRef.current,
          dividerLine: dividerLineRef.current,
          pitchTitle: pitchTitleRef.current,
          deckTitle: deckTitleRef.current,
          taglineBlock: taglineBlockRef.current,
          chartAxis: chartAxisRef.current,
          chartBars: chartBarsRef.current,
          chartArrow: chartArrowRef.current,
          chartArrowHead: chartArrowHeadRef.current,
          chartBadge: chartBadgeRef.current,
          iconRow1: iconRow1Ref.current,
          iconRow2: iconRow2Ref.current,
          iconRow3: iconRow3Ref.current,
        },
        {
          onEntranceComplete: () => {
            if (exitingRef.current) return;
            const loops = startPitchDeckIdleLoops({
              lightBeamLeft: lightBeamLeftRef.current,
              lightBeamRight: lightBeamRightRef.current,
              chartArrowHead: chartArrowHeadRef.current,
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
      if (typeof window !== "undefined") {
        (window as unknown as { __pitchDeckTl?: gsap.core.Timeline }).__pitchDeckTl = tl;
      }
      tl.play();
    }, containerRef);

    return () => {
      idleLoopsRef.current.forEach((tw) => tw.kill());
      idleLoopsRef.current = [];
      ctx.revert();
      masterTlRef.current = null;
      if (typeof window !== "undefined") {
        delete (window as unknown as { __pitchDeckTl?: gsap.core.Timeline }).__pitchDeckTl;
      }
    };
  }, [onComplete]);

  // ── Dismiss / Skip handling ────────────────────────────────────────────────
  useEffect(() => {
    if ((isDismissed || skip) && !exitingRef.current) {
      exitingRef.current = true;
      runPitchDeckExit(containerRef.current, idleLoopsRef.current, () => {
        idleLoopsRef.current = [];
        onComplete?.();
      });
    }
  }, [isDismissed, skip, onComplete]);

  const handleManualDismiss = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    runPitchDeckExit(containerRef.current, idleLoopsRef.current, () => {
      idleLoopsRef.current = [];
      onComplete?.();
      onDismiss?.();
    });
  };

  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-label="Pitch Deck Event Animation"
    >
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

      {/* 16:9 Aspect-Ratio Stage Frame */}
      <div ref={stageFrameRef} className={styles.stageFrame}>
        {/* Base Layer: Updated clean minimal scene (presenter + podium + audience + plants) */}
        <img
          src="/overlay-animations/pitch-deck-base.png"
          alt="Pitch Deck Base Scene"
          className={styles.baseImage}
        />

        {/* Dynamic SVG Layer (ViewBox: 1024 × 576, matches image dimensions exactly) */}
        <svg
          className={styles.stageSvg}
          viewBox="0 0 1024 576"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Screen Content Clip: Exact bounds of the screen interior */}
            <clipPath id="pd-screen-clip">
              <rect x="296" y="99" width="431" height="270" rx="1" />
            </clipPath>

            {/* Left Lamp Beam Gradient */}
            <linearGradient id="pd-beam-left-grad" x1="237" y1="75" x2="237" y2="520" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#fffbeb" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#fff7ed" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fff7ed" stopOpacity="0.25" />
            </linearGradient>

            {/* Right Lamp Beam Gradient */}
            <linearGradient id="pd-beam-right-grad" x1="787" y1="75" x2="787" y2="520" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#fffbeb" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#fff7ed" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fff7ed" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* ── 1. HEADER TEXT & DATE/VENUE BRANDING ───────────────────── */}
          <text
            ref={headerTextRef}
            x="38"
            y="42"
            className={styles.headerText}
            fontSize="9"
            fontWeight="800"
            letterSpacing="0.16em"
          >
            IDEAS / PEOPLE / CAPITAL / IMPACT
          </text>

          <g ref={dateVenueTextRef} textAnchor="end">
            <text
              x="986"
              y="38"
              className={styles.headerText}
              fontSize="9.5"
              fontWeight="900"
              letterSpacing="0.12em"
            >
              30-31 OCT
            </text>
            <text
              x="986"
              y="51"
              fill="#64748b"
              fontSize="8"
              fontWeight="700"
              fontFamily="var(--font-mono), monospace"
              letterSpacing="0.14em"
            >
              MLRIT
            </text>
          </g>

          {/* ── 2. SIDE BANNERS ────────────────────────────────────────── */}
          {/* Left banner: TURN IDEAS INTO IMPACT */}
          <g ref={leftBannerRef}>
            <rect x="38" y="180" width="98" height="175" fill="#2074D5" rx="2" />
            <g textAnchor="middle" fill="#ffffff">
              <text x="87" y="240" className={styles.bannerWord} fontSize="14">TURN</text>
              <text x="87" y="266" className={styles.bannerWord} fontSize="14">IDEAS</text>
              <text x="87" y="292" className={styles.bannerWord} fontSize="14">INTO</text>
              <text x="87" y="318" className={styles.bannerWord} fontSize="14">IMPACT</text>
            </g>
          </g>

          {/* Right banner: SAME GAME BIGGER DREAMS */}
          <g ref={rightBannerRef}>
            <rect x="888" y="180" width="98" height="175" fill="#2074D5" rx="2" />
            <g textAnchor="middle" fill="#ffffff">
              <text x="937" y="240" className={styles.bannerWord} fontSize="14">SAME</text>
              <text x="937" y="266" className={styles.bannerWord} fontSize="14">GAME</text>
              <text x="937" y="292" className={styles.bannerWord} fontSize="14">BIGGER</text>
              <text x="937" y="318" className={styles.bannerWord} fontSize="14">DREAMS</text>
            </g>
          </g>

          {/* ── 3. AMBIENT LIGHT CONES (from ceiling pendant lamps) ───── */}
          <polygon
            ref={lightBeamLeftRef}
            points="237,75 135,520 340,520"
            fill="url(#pd-beam-left-grad)"
          />
          <polygon
            ref={lightBeamRightRef}
            points="787,75 685,520 890,520"
            fill="url(#pd-beam-right-grad)"
          />

          {/* ── 4. CEILING PENDANT LAMPS (cord + shade + bulb) ─────────── */}
          {/* Left Lamp (x=237) */}
          <g ref={lampLeftGroupRef}>
            <line x1="237" y1="0" x2="237" y2="52" stroke="#282828" strokeWidth="2.5" />
            <path
              d="M217,74 C217,54 225,50 237,50 C249,50 257,54 257,74 Z"
              fill="#282828"
            />
            <rect x="214" y="73" width="46" height="3" rx="1.5" fill="#282828" />
            <circle cx="237" cy="76" r="3" fill="#ffffff" />
          </g>

          {/* Right Lamp (x=787) */}
          <g ref={lampRightGroupRef}>
            <line x1="787" y1="0" x2="787" y2="52" stroke="#282828" strokeWidth="2.5" />
            <path
              d="M767,74 C767,54 775,50 787,50 C799,50 807,54 807,74 Z"
              fill="#282828"
            />
            <rect x="764" y="73" width="46" height="3" rx="1.5" fill="#282828" />
            <circle cx="787" cy="76" r="3" fill="#ffffff" />
          </g>

          {/* ── 5. POTTED PLANTS (in front of banners) ────────────────── */}
          {/* Left Plant (x=47, y=470) */}
          <g ref={plantLeftRef} transform="translate(47, 470)">
            <path d="M0,0 C-15,-30 -30,-45 -35,-60 C-25,-55 -5,-25 0,0 Z" fill="#2074D5" />
            <path d="M0,0 C-10,-45 -18,-70 -20,-85 C-10,-75 0,-40 0,0 Z" fill="#2074D5" />
            <path d="M0,0 C-5,-50 0,-90 0,-100 C5,-90 10,-50 0,0 Z" fill="#2074D5" />
            <path d="M0,0 C10,-45 18,-70 20,-85 C10,-75 0,-40 0,0 Z" fill="#2074D5" />
            <path d="M0,0 C15,-30 30,-45 35,-60 C25,-55 5,-25 0,0 Z" fill="#2074D5" />
            <polygon points="-18,0 18,0 13,32 -13,32" fill="#282828" />
          </g>

          {/* Right Plant (x=973, y=470) */}
          <g ref={plantRightRef} transform="translate(973, 470)">
            <path d="M0,0 C-15,-30 -30,-45 -35,-60 C-25,-55 -5,-25 0,0 Z" fill="#2074D5" />
            <path d="M0,0 C-10,-45 -18,-70 -20,-85 C-10,-75 0,-40 0,0 Z" fill="#2074D5" />
            <path d="M0,0 C-5,-50 0,-90 0,-100 C5,-90 10,-50 0,0 Z" fill="#2074D5" />
            <path d="M0,0 C10,-45 18,-70 20,-85 C10,-75 0,-40 0,0 Z" fill="#2074D5" />
            <path d="M0,0 C15,-30 30,-45 35,-60 C25,-55 5,-25 0,0 Z" fill="#2074D5" />
            <polygon points="-18,0 18,0 13,32 -13,32" fill="#282828" />
          </g>

          {/* ── 6. PODIUM FRONT TEXT ───────────────────────────────────── */}
          <g ref={podiumTextRef} textAnchor="middle">
            <text x="235.5" y="365" className={styles.podiumWord} fontSize="8.5">PRESENT</text>
            <text x="235.5" y="380" className={styles.podiumWord} fontSize="8.5">PITCH</text>
            <text x="235.5" y="395" className={styles.podiumWord} fontSize="8.5">CONNECT</text>
            <text x="235.5" y="410" className={styles.podiumWord} fontSize="8.5">GROW</text>
            <line x1="223" y1="422" x2="248" y2="422" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* ── 7. PROJECTOR SCREEN STRUCTURE ─────────────────────────── */}
          <g ref={screenFrameGroupRef}>
            {/* Top black roller bar & wall brackets */}
            <rect x="281" y="82" width="6" height="19" rx="1" fill="#282828" />
            <rect x="737" y="82" width="6" height="19" rx="1" fill="#282828" />
            <rect x="285" y="85" width="454" height="14" rx="2" fill="#282828" />
            {/* Side black frame lines */}
            <line x1="295" y1="99" x2="295" y2="369" stroke="#282828" strokeWidth="2" />
            <line x1="728" y1="99" x2="728" y2="369" stroke="#282828" strokeWidth="2" />
          </g>

          {/* White Screen-Surface Rect (Unrolls from top) */}
          <rect
            ref={screenSurfaceRef}
            x="296"
            y="99"
            width="431"
            height="270"
            fill="#ffffff"
            rx="1"
          />

          {/* Bottom Screen Weight Bar (travels down with the screen) */}
          <rect
            ref={screenWeightBarRef}
            x="285"
            y="369"
            width="454"
            height="11"
            rx="2"
            fill="#282828"
          />

          {/* ── 8. SVG-RECREATED PPT CONTENT (Clipped within screen bounds) ── */}
          <g ref={screenContentGroupRef} clipPath="url(#pd-screen-clip)">
            {/* Thin vertical divider line splitting the screen evenly */}
            <line
              ref={dividerLineRef}
              x1="511.5"
              y1="118"
              x2="511.5"
              y2="352"
              stroke="#e2e8f0"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* ── LEFT HALF: TITLE & TAGLINE ─────────────────────────────── */}
            <text
              ref={pitchTitleRef}
              x="316"
              y="176"
              className={styles.pitchText}
              fontSize="44"
            >
              PITCH
            </text>

            <text
              ref={deckTitleRef}
              x="316"
              y="222"
              className={styles.deckText}
              fontSize="44"
            >
              DECK
            </text>

            <g ref={taglineBlockRef}>
              {/* Blue accent bar */}
              <rect x="316" y="238" width="34" height="3" fill="#2074D5" rx="1.5" />
              {/* Tagline */}
              <text x="316" y="260" className={styles.taglineText} fontSize="10.5">
                IDEAS TODAY
              </text>
              <text x="316" y="275" className={`${styles.taglineText} ${styles.taglineBlue}`} fontSize="10.5">
                BIGGER TOMORROW
              </text>
              {/* Sub-label */}
              <text
                x="316"
                y="342"
                fill="#94a3b8"
                fontSize="7.5"
                fontWeight="700"
                fontFamily="var(--font-mono), monospace"
                letterSpacing="0.12em"
              >
                EQUINOX 2.0 · CASE & PITCH
              </text>
            </g>

            {/* ── RIGHT HALF TOP: GROWING BAR CHART ───────────────────────── */}
            {/* Chart baseline */}
            <line
              ref={chartAxisRef}
              x1="528"
              y1="190"
              x2="710"
              y2="190"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />

            {/* 5 Ascending bars */}
            <g>
              {[
                { x: 534, y: 166, h: 24, op: 0.7 },
                { x: 558, y: 152, h: 38, op: 0.8 },
                { x: 582, y: 136, h: 54, op: 0.88 },
                { x: 606, y: 122, h: 68, op: 0.94 },
                { x: 630, y: 108, h: 82, op: 1 },
              ].map((bar, i) => (
                <rect
                  key={i}
                  ref={(el) => {
                    if (el) chartBarsRef.current[i] = el;
                  }}
                  x={bar.x}
                  y={bar.y}
                  width="15"
                  height={bar.h}
                  rx="2"
                  fill="#2074D5"
                  fillOpacity={bar.op}
                />
              ))}
            </g>

            {/* Upward trend line across bars */}
            <path
              ref={chartArrowRef}
              d="M530,172 L558,152 L582,136 L606,122 L636,104 L662,99"
              stroke="#2074D5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Arrowhead */}
            <polygon
              ref={chartArrowHeadRef}
              points="662,99 650,95 655,107"
              fill="#2074D5"
            />

            {/* Growth badge "+84%" */}
            <g ref={chartBadgeRef}>
              <rect x="664" y="106" width="38" height="15" rx="3" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
              <text x="683" y="117" textAnchor="middle" fill="#2074D5" fontSize="8.5" fontWeight="900" fontFamily="var(--font-mono), monospace">
                +84%
              </text>
            </g>

            {/* ── RIGHT HALF BOTTOM: THREE ICON ROWS ─────────────────────── */}
            {/* ROW 1: STARTUPS / INVESTORS */}
            <g ref={iconRow1Ref} transform="translate(528, 206)">
              {/* Icon badge */}
              <rect width="24" height="24" rx="5" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
              {/* People silhouette icon */}
              <circle cx="10" cy="9" r="3" fill="#2074D5" />
              <path d="M5,19 C5,15 8,14 10,14 C12,14 15,15 15,19 Z" fill="#2074D5" />
              <circle cx="16" cy="9.5" r="2.2" fill="#3577EC" />
              <path d="M14,19 C14,16 16,15.5 18,15.5 C19.5,15.5 21,16 21,19 Z" fill="#3577EC" />
              {/* Labels */}
              <text x="32" y="11" className={styles.iconLabelTitle} fontSize="9.5">
                STARTUPS
              </text>
              <text x="32" y="21" className={styles.iconLabelSub} fontSize="7.5">
                INVESTORS
              </text>
            </g>

            {/* ROW 2: MENTORS / OPPORTUNITIES */}
            <g ref={iconRow2Ref} transform="translate(528, 248)">
              {/* Icon badge */}
              <rect width="24" height="24" rx="5" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
              {/* Lightbulb icon */}
              <path
                d="M12,5 C9.5,5 7.5,7 7.5,9.5 C7.5,11.2 8.7,12.6 9.5,13.8 L9.5,15 C9.5,15.5 10,16 10.5,16 L13.5,16 C14,16 14.5,15.5 14.5,15 L14.5,13.8 C15.3,12.6 16.5,11.2 16.5,9.5 C16.5,7 14.5,5 12,5 Z"
                fill="#2074D5"
              />
              <line x1="10.5" y1="18" x2="13.5" y2="18" stroke="#2074D5" strokeWidth="1.2" strokeLinecap="round" />
              {/* Labels */}
              <text x="32" y="11" className={styles.iconLabelTitle} fontSize="9.5">
                MENTORS
              </text>
              <text x="32" y="21" className={styles.iconLabelSub} fontSize="7.5">
                OPPORTUNITIES
              </text>
            </g>

            {/* ROW 3: IDEAS / IMPACT */}
            <g ref={iconRow3Ref} transform="translate(528, 290)">
              {/* Icon badge */}
              <rect width="24" height="24" rx="5" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
              {/* Star / Impact diamond icon */}
              <polygon points="12,5 14,10 19,12 14,14 12,19 10,14 5,12 10,10" fill="#2074D5" />
              <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
              {/* Labels */}
              <text x="32" y="11" className={styles.iconLabelTitle} fontSize="9.5">
                IDEAS
              </text>
              <text x="32" y="21" className={styles.iconLabelSub} fontSize="7.5">
                IMPACT
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default PitchDeckAnimation;
