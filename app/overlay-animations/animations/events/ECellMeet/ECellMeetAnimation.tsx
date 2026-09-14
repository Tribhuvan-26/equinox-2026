// app/overlay-animations/animations/events/ECellMeet/ECellMeetAnimation.tsx
"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import {
  createECellMeetTimeline,
  skipECellMeetTimelineToExit,
} from "./eCellMeetTimeline";
import styles from "./ECellMeetAnimation.module.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const ECellMeetAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = createECellMeetTimeline(
        {
          container: containerRef.current,
          skipButton: skipButtonRef.current,
          svg: svgRef.current,
        },
        {
          onComplete: () => {
            onComplete?.();
          },
        }
      );

      timelineRef.current = tl;
      if (typeof window !== "undefined") {
        (window as unknown as { __ecellMeetTl?: gsap.core.Timeline }).__ecellMeetTl = tl;
      }
      tl.play();
    }, containerRef);

    return () => {
      ctx.revert();
      timelineRef.current = null;
    };
  }, [onComplete]);

  // React to external dismiss / skip signal
  useEffect(() => {
    if (isDismissed || skip) {
      skipECellMeetTimelineToExit(timelineRef.current);
    }
  }, [isDismissed, skip]);

  // Handle escape key dismiss for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        skipECellMeetTimelineToExit(timelineRef.current);
        onDismiss?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);

  const handleManualDismiss = () => {
    skipECellMeetTimelineToExit(timelineRef.current);
    onDismiss?.();
  };

  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-label="The E-CELL Meet Event Animation"
    >
      {/* Skip / Dismiss Button */}
      <button
        ref={skipButtonRef}
        type="button"
        className={styles.skipButton}
        onClick={handleManualDismiss}
        aria-label="Skip Animation"
      >
        Skip <X className="h-3.5 w-3.5" />
      </button>

      {/* SVG Stage (1670x942 ViewBox) */}
      <svg
        ref={svgRef}
        id="ecell-scene"
        className={styles.stageSvg}
        viewBox="0 0 1670 942"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          {/* Rocket Thruster Glow & Flame Gradients */}
          <radialGradient id="rocket-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#33FF67" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#00E5FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="rocket-flame" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#33FF67" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#00E5FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </linearGradient>

          <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ============================================================ */}
        {/* BASE SCENE: 100% UNIFIED, COMPREHENSIVE STATIC LAYER         */}
        {/* Contains: Entire environment, background, booth & canopy,    */}
        {/* floor, laptop, two students holding card (100% untouched),   */}
        {/* left & right plants (100% untouched), and standing board base */}
        {/* ============================================================ */}
        <g id="layer-base-scene">
          <image
            href="/assets/events/ecell/1_base_scene.png"
            x="0"
            y="0"
            width="1670"
            height="942"
            preserveAspectRatio="none"
          />
        </g>

        {/* ============================================================ */}
        {/* ANIMATED ELEMENT 1: LEFT TOP BANNER & THE INFO IN THAT       */}
        {/* "animate the left top banner and the info in that"          */}
        {/* ============================================================ */}
        <g id="left-hanging-banner" style={{ transformOrigin: "192.5px 0px" }}>
          {/* Banner structure with hanging suspension strings and rings */}
          <image
            id="banner-board-base"
            href="/assets/events/ecell/sign_board_clean.png"
            x="55"
            y="0"
            width="275"
            height="390"
            preserveAspectRatio="none"
          />
          {/* Info Lines (Pure SVG Vector Typography) */}
          <g id="hanging-info-different-colleges">
            <text
              x="110"
              y="140"
              fill="#FFFFFF"
              fontFamily="'Outfit', 'Inter', 'Montserrat', sans-serif"
              fontWeight="900"
              fontSize="26"
              letterSpacing="1px"
            >
              DIFFERENT
            </text>
            <text
              x="110"
              y="180"
              fill="#FFFFFF"
              fontFamily="'Outfit', 'Inter', 'Montserrat', sans-serif"
              fontWeight="900"
              fontSize="26"
              letterSpacing="1px"
            >
              COLLEGES
            </text>
          </g>
          <g id="hanging-info-same-vision">
            <text
              x="110"
              y="235"
              fill="#33FF67"
              fontFamily="'Outfit', 'Inter', 'Montserrat', sans-serif"
              fontWeight="900"
              fontSize="32"
              letterSpacing="1px"
            >
              SAME
            </text>
            <text
              x="110"
              y="280"
              fill="#33FF67"
              fontFamily="'Outfit', 'Inter', 'Montserrat', sans-serif"
              fontWeight="900"
              fontSize="32"
              letterSpacing="1px"
            >
              VISION
            </text>
          </g>
          <g id="hanging-info-line">
            <line
              x1="110"
              y1="305"
              x2="200"
              y2="305"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
        </g>

        {/* ============================================================ */}
        {/* ANIMATED ELEMENT 2: RIGHT BANNER INFORMATION                 */}
        {/* "animate information the banner which is on right side"     */}
        {/* Pure SVG Vector Header, Underline, Circular Badges & Icons   */}
        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* ANIMATED ELEMENT 2: RIGHT BANNER INFORMATION                 */}
        {/* Matches user reference image: Blue vertical panel with       */}
        {/* E-CELL heading, green underline, and 4 rows (IDEAS, NETWORK, */}
        {/* COLLABORATE, GROW) with crisp matching circular icon badges   */}
        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* ANIMATED ELEMENT 2: RIGHT BANNER INFORMATION                 */}
        {/* Matches user reference image: Blue vertical panel with       */}
        {/* E-CELL heading, green underline, and 4 rows:                 */}
        {/* IDEAS, NETWORK, COLLABORATE, GROW with matching white icons  */}
        {/* ============================================================ */}
        <g id="right-banner-information">
          {/* Row 1: IDEAS (Badge + Clean Bulb Icon matching reference + Text) */}
          <g id="board-info-ideas">
            <circle cx="1340" cy="425" r="31" fill="#FFFFFF" filter="url(#badge-shadow)" />
            {/* SVG Lightbulb Icon matching reference image */}
            <circle cx="1340" cy="419" r="11" fill="none" stroke="#4361EE" strokeWidth="3.6" />
            <path d="M 1334 429 L 1346 429 L 1344 433 L 1336 433 Z" fill="#4361EE" stroke="#4361EE" strokeWidth="1" strokeLinejoin="round" />
            <line x1="1336" y1="431" x2="1344" y2="431" stroke="#FFFFFF" strokeWidth="1.5" />
            <text
              x="1395"
              y="433"
              fill="#FFFFFF"
              fontFamily="'Outfit', 'Montserrat', 'Inter', sans-serif"
              fontWeight="900"
              fontSize="26"
              letterSpacing="1.5px"
            >
              IDEAS
            </text>
          </g>

          {/* Row 2: NETWORK (Badge + Two Users Outline matching reference + Text) */}
          <g id="board-info-network">
            <circle cx="1340" cy="510" r="31" fill="#FFFFFF" filter="url(#badge-shadow)" />
            {/* SVG Two Users Icon matching reference image */}
            <circle cx="1336" cy="503" r="6.5" fill="none" stroke="#4361EE" strokeWidth="3.6" />
            <path d="M 1327 521 C 1327 514 1331 511 1336 511 C 1341 511 1345 514 1345 521" fill="none" stroke="#4361EE" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M 1344 499 C 1347 499 1350 502 1350 506 C 1350 508 1349 510 1347 511" fill="none" stroke="#4361EE" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M 1347 511 C 1350 511 1353 513 1354 521" fill="none" stroke="#4361EE" strokeWidth="3.2" strokeLinecap="round" />
            <text
              x="1395"
              y="518"
              fill="#FFFFFF"
              fontFamily="'Outfit', 'Montserrat', 'Inter', sans-serif"
              fontWeight="900"
              fontSize="26"
              letterSpacing="1.5px"
            >
              NETWORK
            </text>
          </g>

          {/* Row 3: COLLABORATE (Badge + Hands Clasp / Mountain chevron matching reference + Text) */}
          <g id="board-info-collaborate">
            <circle cx="1340" cy="595" r="31" fill="#FFFFFF" filter="url(#badge-shadow)" />
            {/* SVG Handshake Chevron clasp matching reference image */}
            <path d="M 1326 596 L 1334 588 L 1340 593 L 1346 588 L 1354 596" fill="none" stroke="#4361EE" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 1334 597 L 1339 602 L 1346 595" fill="none" stroke="#4361EE" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
            <text
              x="1395"
              y="603"
              fill="#FFFFFF"
              fontFamily="'Outfit', 'Montserrat', 'Inter', sans-serif"
              fontWeight="900"
              fontSize="23"
              letterSpacing="1px"
            >
              COLLABORATE
            </text>
          </g>

          {/* Row 4: GROW (Badge + Chart Axes & Upward Trend Arrow matching reference + Text) */}
          <g id="board-info-grow">
            <circle cx="1340" cy="680" r="31" fill="#FFFFFF" filter="url(#badge-shadow)" />
            {/* SVG Chart Axes and Arrow matching reference image */}
            <path d="M 1327 668 L 1327 689 L 1353 689" fill="none" stroke="#4361EE" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 1332 684 L 1338 676 L 1344 681 L 1352 671" fill="none" stroke="#4361EE" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 1346 671 L 1352 671 L 1352 677" fill="none" stroke="#4361EE" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
            <text
              x="1395"
              y="688"
              fill="#FFFFFF"
              fontFamily="'Outfit', 'Montserrat', 'Inter', sans-serif"
              fontWeight="900"
              fontSize="26"
              letterSpacing="1.5px"
            >
              GROW
            </text>
          </g>
        </g>

        {/* ============================================================ */}
        {/* ANIMATED ELEMENT: STALL LAPTOP (OPEN AND CLOSE)              */}
        {/* "and also make the animation of the laptop in side the stall, */}
        {/* just make it open and close"                                 */}
        {/* ============================================================ */}
        <g id="stall-laptop-group" transform="translate(244, 661)">
          {/* Laptop keyboard base sitting on the counter */}
          <polygon
            points="-52,0 52,0 48,5 -50,5"
            fill="#FFFFFF"
          />
          <line
            x1="-42"
            y1="2"
            x2="42"
            y2="2"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          {/* Laptop Screen / Lid (hinges at base y=0, folds down flat, pops open) */}
          <g id="stall-laptop-screen">
            <polygon
              points="-40,-52 38,-52 48,0 -50,0"
              fill="#FFFFFF"
            />
            {/* Dark camera dot / Apple logo circle */}
            <circle cx="-1" cy="-24" r="5.5" fill="#1E293B" />
          </g>
        </g>

        {/* ============================================================ */}
        {/* ANIMATED ELEMENT 3: STALL INFO (IDEAS, NETWORK, GROW)        */}
        {/* "and animate theinfo on the stall saying grow, network, idea"*/}
        {/* Pure SVG Vector Typography & Underline                       */}
        {/* ============================================================ */}
        <g id="stall-information">
          {/* Word 1: IDEAS */}
          <g id="stall-info-ideas">
            <text
              x="265"
              y="732"
              fill="#FFFFFF"
              fontFamily="'Outfit', 'Inter', 'Montserrat', sans-serif"
              fontWeight="900"
              fontSize="23"
              letterSpacing="1.5px"
            >
              IDEAS
            </text>
          </g>
          {/* Word 2: NETWORK */}
          <g id="stall-info-network">
            <text
              x="265"
              y="762"
              fill="#FFFFFF"
              fontFamily="'Outfit', 'Inter', 'Montserrat', sans-serif"
              fontWeight="900"
              fontSize="23"
              letterSpacing="1.5px"
            >
              NETWORK
            </text>
          </g>
          {/* Word 3: GROW + green accent line */}
          <g id="stall-info-grow">
            <text
              x="265"
              y="796"
              fill="#33FF67"
              fontFamily="'Outfit', 'Inter', 'Montserrat', sans-serif"
              fontWeight="900"
              fontSize="27"
              letterSpacing="1.5px"
            >
              GROW
            </text>
            <line
              x1="265"
              y1="808"
              x2="352"
              y2="808"
              stroke="#33FF67"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* ============================================================ */}
        {/* ANIMATED ELEMENT: GIRL ID BADGE / TAG (SWAY MOMENT)          */}
        {/* "and make amoment for her id tag which the green dressed girl*/}
        {/* wored"                                                       */}
        {/* ============================================================ */}
        <g id="girl-id-tag-pivot" transform="translate(1011, 712)">
          <g id="girl-id-tag">
            {/* Top connection ring / clip at lanyard apex */}
            <circle cx="0" cy="1" r="3" fill="#A5B4FC" />
            <rect x="-2" y="1" width="4" height="4" fill="#475569" rx="1" />
            {/* Blue ID badge card holder */}
            <rect
              x="-14"
              y="5"
              width="28"
              height="44"
              rx="4"
              fill="#4361EE"
              filter="url(#badge-shadow)"
            />
            {/* White ID card inserts matching artwork */}
            <rect x="-9" y="10" width="18" height="8" rx="2" fill="#FFFFFF" />
            <rect x="-9" y="22" width="18" height="22" rx="2" fill="#FFFFFF" />
          </g>
        </g>

        {/* ============================================================ */}
        {/* ANIMATED ELEMENT 4: MAIN TITLE & EYE-GRABBING ROCKET         */}
        {/* "animate the title", "use the rocket the title for grabbing  */}
        {/* the eyes, use rocket for good outlook"                       */}
        {/* ============================================================ */}
        <g id="ecell-title-wrapper">
          {/* Title Artwork: "THE E-CELL MEET" */}
          <g id="ecell-title-main" style={{ transformOrigin: "822.5px 247.5px" }}>
            <image
              href="/assets/events/ecell/layer_title_main.png"
              x="380"
              y="55"
              width="885"
              height="385"
              preserveAspectRatio="none"
            />
          </g>

          {/* Eye-Grabbing Hero Rocket with Dynamic Thrust Flame & FX */}
          <g id="ecell-rocket-container" style={{ transformOrigin: "1150px 175px" }}>
            {/* Dynamic Thruster Jet Aura / Glow */}
            <ellipse
              id="rocket-thrust-glow"
              cx="1100"
              cy="235"
              rx="45"
              ry="25"
              transform="rotate(-42 1100 235)"
              fill="url(#rocket-glow)"
              opacity="0"
            />

            {/* Jet Exhaust Flame Stream */}
            <path
              id="rocket-thrust-flame"
              d="M 1115 210 Q 1075 255 1045 285 Q 1070 245 1100 225 Z"
              fill="url(#rocket-flame)"
              opacity="0"
            />

            {/* Launch Trail Speed Streaks */}
            <g id="rocket-speed-lines" opacity="0">
              <line x1="1080" y1="240" x2="1020" y2="305" stroke="#33FF67" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
              <line x1="1105" y1="255" x2="1055" y2="310" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
              <line x1="1120" y1="230" x2="1070" y2="285" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </g>

            {/* Rocket Hull & Artwork */}
            <image
              id="rocket-artwork"
              href="/assets/events/ecell/layer_rocket.png"
              x="380"
              y="55"
              width="885"
              height="385"
              preserveAspectRatio="none"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default ECellMeetAnimation;
