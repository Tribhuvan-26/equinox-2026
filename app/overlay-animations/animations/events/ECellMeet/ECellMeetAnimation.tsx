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
import { urlForImage } from "@/sanity/lib/image";
import { sanityAssets } from "@/lib/sanity-assets";

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
      {/* Top Left Branding: Equinox 2K26 */}
      <div id="ecell-top-branding-left" className={styles.topBrandingLeft}>
        <div className={styles.brandThe}>THE</div>
        <div className={styles.brandTitle}>
          <span>EQUINOX</span>
          <span className={styles.brandBadge}>2nd Edition</span>
        </div>
        <div className={styles.brandSub}>E-SUMMIT 2K26</div>
      </div>

      {/* Top Right Date & Venue: 30 & 31 OCTOBER */}
      <div id="ecell-top-branding-right" className={styles.topBrandingRight}>
        <div className={styles.dateText}>30 &amp; 31</div>
        <div className={styles.monthText}>OCTOBER</div>
        <div className={styles.dateUnderline} />
      </div>

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

      {/* SVG Stage (1024x576 true 16:9 ViewBox matching Reference Composition) */}
      <svg
        ref={svgRef}
        id="ecell-scene"
        className={styles.stageSvg}
        viewBox="0 0 1024 576"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          {/* Color Matrix filter: Transforms Blue Building to Crisp Pure White (#FFFFFF) */}
          <filter id="white-tint" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 1 0"
            />
          </filter>

          {/* Node Glow Filters */}
          <filter id="blue-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#7484FE" floodOpacity="0.45" />
          </filter>

          <filter id="green-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#33FF67" floodOpacity="0.45" />
          </filter>

          {/* Linear Gradients for corner geometric chevrons */}
          <linearGradient id="chevron-blue-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7484FE" />
            <stop offset="100%" stopColor="#5568DF" />
          </linearGradient>

          <linearGradient id="chevron-green-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#33FF67" />
            <stop offset="100%" stopColor="#1ED84F" />
          </linearGradient>

          {/* Drop shadow for E-CELL over MEET */}
          <filter id="title-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.75" />
          </filter>

          {/* Progressive unmasking clipPaths for Dotted Lines (reveal along line angle) */}
          <clipPath id="clip-dotted-1">
            <rect id="clip-rect-dot-1" x="0" y="-12" width="0" height="24" />
          </clipPath>
          <clipPath id="clip-dotted-2">
            <rect id="clip-rect-dot-2" x="0" y="-12" width="0" height="24" />
          </clipPath>
          <clipPath id="clip-dotted-3">
            <rect id="clip-rect-dot-3" x="0" y="-12" width="0" height="24" />
          </clipPath>
          <clipPath id="clip-dotted-4">
            <rect id="clip-rect-dot-4" x="0" y="-12" width="0" height="24" />
          </clipPath>
        </defs>

        {/* 1. Canvas Background */}
        <rect width="1024" height="576" fill="#2A2A2A" />

        {/* 2. Floating Ambient Entrance Dots */}
        <g id="ecell-ambient-dots">
          <circle id="amb-dot-1" cx="80" cy="120" r="3" fill="#7484FE" opacity="0.6" />
          <circle id="amb-dot-2" cx="140" cy="70" r="2.5" fill="#33FF67" opacity="0.7" />
          <circle id="amb-dot-3" cx="300" cy="85" r="3" fill="#7484FE" opacity="0.5" />
          <circle id="amb-dot-4" cx="720" cy="75" r="3.5" fill="#33FF67" opacity="0.7" />
          <circle id="amb-dot-5" cx="940" cy="90" r="2.5" fill="#7484FE" opacity="0.6" />
          <circle id="amb-dot-6" cx="970" cy="250" r="3" fill="#33FF67" opacity="0.5" />
          <circle id="amb-dot-7" cx="70" cy="240" r="3.5" fill="#33FF67" opacity="0.7" />
          <circle id="amb-dot-8" cx="110" cy="510" r="2.5" fill="#7484FE" opacity="0.6" />
          <circle id="amb-dot-9" cx="380" cy="535" r="3" fill="#33FF67" opacity="0.7" />
          <circle id="amb-dot-10" cx="640" cy="535" r="3.5" fill="#7484FE" opacity="0.5" />
          <circle id="amb-dot-11" cx="920" cy="510" r="2.5" fill="#33FF67" opacity="0.7" />
          <circle id="amb-dot-12" cx="960" cy="450" r="3" fill="#7484FE" opacity="0.6" />
        </g>

        {/* 3. Corner Geometric Chevrons */}
        <g id="ecell-chevrons-bl" style={{ transformOrigin: "0px 576px" }}>
          <polygon
            id="bl-chevron-blue"
            points="0,440 185,535 85,576 0,576"
            fill="url(#chevron-blue-grad)"
          />
          <polygon
            id="bl-chevron-green"
            points="0,510 85,555 0,576"
            fill="url(#chevron-green-grad)"
          />
        </g>

        <g id="ecell-chevrons-br" style={{ transformOrigin: "1024px 576px" }}>
          <polygon
            id="br-chevron-blue"
            points="1024,440 839,535 939,576 1024,576"
            fill="url(#chevron-blue-grad)"
          />
          <polygon
            id="br-chevron-green"
            points="1024,510 939,555 1024,576"
            fill="url(#chevron-green-grad)"
          />
        </g>

        {/* 4. Floating Clouds */}
        <g id="ecell-clouds">
          <path
            id="cloud-left"
            d="M 35 404 L 130 404 A 12 12 0 0 0 120 390 A 16 16 0 0 0 95 380 A 20 20 0 0 0 60 370 A 18 18 0 0 0 45 387 A 14 14 0 0 0 35 404 Z"
            fill="#F7F2F6"
            opacity="0.95"
          />
          <path
            id="cloud-right"
            d="M 870 178 L 980 178 A 12 12 0 0 0 970 164 A 16 16 0 0 0 945 154 A 20 20 0 0 0 910 144 A 18 18 0 0 0 885 161 A 14 14 0 0 0 870 178 Z"
            fill="#F7F2F6"
            opacity="0.95"
          />
        </g>

        {/* 5. Floating Small Geometric Triangles: Separated into Inner & Outer Groups */}
        <g id="ecell-triangles-inner">
          <polygon id="tri-inner-1" points="340,90 352,110 328,110" fill="#7484FE" />
          <polygon id="tri-inner-2" points="670,70 682,90 658,90" fill="#33FF67" />
          <polygon id="tri-inner-3" points="360,490 372,510 348,510" fill="#33FF67" />
          <polygon id="tri-inner-4" points="650,490 662,510 638,510" fill="#7484FE" />
        </g>

        <g id="ecell-triangles-outer">
          <polygon id="tri-outer-1" points="135,445 147,465 123,465" fill="#33FF67" />
          <polygon id="tri-outer-2" points="905,395 917,415 893,415" fill="#33FF67" />
        </g>

        {/* 6. Network Connecting Lines & Junction Dots */}
        {/* All lines connect precisely from circle outer boundaries (R=38) to target points */}
        <g id="ecell-network-lines">
          {/* Upper Circular Arc framing the People Group — Matches Reference Apex */}
          <path
            id="upper-arc-path"
            d="M 365 175 A 147 107 0 0 1 659 175"
            fill="none"
            stroke="#7484FE"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Dots positioned precisely along the Upper Arc */}
          <circle id="arc-dot-left" cx="365" cy="175" r="4.5" fill="#7484FE" />
          <circle id="arc-dot-mid-left" cx="410" cy="104" r="4.5" fill="#7484FE" />
          <circle id="arc-dot-top" cx="512" cy="68" r="5" fill="#33FF67" />
          <circle id="arc-dot-mid-right" cx="614" cy="104" r="4.5" fill="#7484FE" />
          <circle id="arc-dot-right" cx="659" cy="175" r="4.5" fill="#7484FE" />

          {/* Line 1: Node 1 (TL, 230, 155) to Arc Left (365, 175) */}
          <line
            id="net-line-1"
            x1="268"
            y1="161"
            x2="365"
            y2="175"
            stroke="#7484FE"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle id="net-dot-1" cx="320" cy="169" r="4.5" fill="#7484FE" />

          {/* Dotted Line 1: Node 1 (TL) down-right towards E-CELL (Level 1 Left) */}
          <g transform="translate(260, 178) rotate(36.87)" clipPath="url(#clip-dotted-1)">
            <line
              id="net-dotted-1"
              x1="0"
              y1="0"
              x2="85"
              y2="0"
              stroke="#7484FE"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </g>

          {/* Line 5: Node 5 (TR, 794, 155) to Arc Right (659, 175) */}
          <line
            id="net-line-5"
            x1="756"
            y1="161"
            x2="659"
            y2="175"
            stroke="#33FF67"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle id="net-dot-5" cx="704" cy="169" r="5" fill="#33FF67" />

          {/* Dotted Line 3: Node 5 (TR) down-left towards E-CELL (Level 1 Right) */}
          <g transform="translate(764, 178) rotate(143.13)" clipPath="url(#clip-dotted-3)">
            <line
              id="net-dotted-3"
              x1="0"
              y1="0"
              x2="85"
              y2="0"
              stroke="#33FF67"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </g>

          {/* Line 2: Node 2 (ML, 165, 290) to Title Left (298, 275) */}
          <line
            id="net-line-2"
            x1="203"
            y1="286"
            x2="298"
            y2="275"
            stroke="#33FF67"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle id="net-dot-2" cx="298" cy="275" r="5" fill="#33FF67" />

          {/* Dotted Line 2: Node 2 (ML) down-right towards MEET (Level 2 Left) */}
          <g transform="translate(200, 306) rotate(24.4)" clipPath="url(#clip-dotted-2)">
            <line
              id="net-dotted-2"
              x1="0"
              y1="0"
              x2="110"
              y2="0"
              stroke="#33FF67"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </g>

          {/* Line 6: Node 6 (MR, 859, 290) to Title Right (726, 275) */}
          <line
            id="net-line-6"
            x1="821"
            y1="286"
            x2="726"
            y2="275"
            stroke="#7484FE"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle id="net-dot-6" cx="726" cy="275" r="4.5" fill="#7484FE" />

          {/* Dotted Line 4: Node 6 (MR) down-left towards MEET (Level 2 Right) */}
          <g transform="translate(824, 306) rotate(155.6)" clipPath="url(#clip-dotted-4)">
            <line
              id="net-dotted-4"
              x1="0"
              y1="0"
              x2="110"
              y2="0"
              stroke="#7484FE"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </g>

          {/* Line 3: Node 3 (BL, 220, 435) to Title Lower-Left (320, 385) */}
          <line
            id="net-line-3"
            x1="254"
            y1="418"
            x2="320"
            y2="385"
            stroke="#7484FE"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle id="net-dot-3" cx="320" cy="385" r="4.5" fill="#7484FE" />

          {/* Line 7: Node 7 (BR, 804, 435) to Title Lower-Right (704, 385) */}
          <line
            id="net-line-7"
            x1="770"
            y1="418"
            x2="704"
            y2="385"
            stroke="#33FF67"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle id="net-dot-7" cx="704" cy="385" r="5" fill="#33FF67" />
        </g>

        {/* 7. Central 3-People Team Asset Layer — Nestled COMPLETELY Inside Upper Arc Container */}
        <g id="ecell-people-group" style={{ transformOrigin: "512px 126px" }}>
          <image
            id="ecell-people-image"
            href="/assets/events/ecell/network/people_group.png"
            x="449"
            y="82"
            width="126"
            height="88"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* 9. The 7 Institution Nodes (Circles with Perfectly Centered Building Icons) */}
        {/* Radius R=38, consistent stroke=4.5, dark base fill to block lines */}
        <g id="ecell-college-nodes">
          {/* Node 1: Top-Left (Blue) */}
          <g id="college-node-1" style={{ transformOrigin: "230px 155px" }}>
            <circle
              id="node-circle-1"
              cx="230"
              cy="155"
              r="38"
              fill="#222222"
              stroke="#7484FE"
              strokeWidth="4.5"
              filter="url(#blue-glow)"
            />
            <image
              id="node-icon-1"
              href="/assets/events/ecell/network/building.png"
              x="210"
              y="136"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* Node 2: Mid-Left (Green) */}
          <g id="college-node-2" style={{ transformOrigin: "165px 290px" }}>
            <circle
              id="node-circle-2"
              cx="165"
              cy="290"
              r="38"
              fill="#222222"
              stroke="#33FF67"
              strokeWidth="4.5"
              filter="url(#green-glow)"
            />
            <image
              id="node-icon-2"
              href="/assets/events/ecell/network/building.png"
              x="145"
              y="271"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* Node 3: Bottom-Left (Blue) */}
          <g id="college-node-3" style={{ transformOrigin: "220px 435px" }}>
            <circle
              id="node-circle-3"
              cx="220"
              cy="435"
              r="38"
              fill="#222222"
              stroke="#7484FE"
              strokeWidth="4.5"
              filter="url(#blue-glow)"
            />
            <image
              id="node-icon-3"
              href="/assets/events/ecell/network/building.png"
              x="200"
              y="416"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* Node 4: Bottom-Center (Blue) */}
          <g id="college-node-4" style={{ transformOrigin: "512px 495px" }}>
            <circle
              id="node-circle-4"
              cx="512"
              cy="495"
              r="38"
              fill="#222222"
              stroke="#7484FE"
              strokeWidth="4.5"
              filter="url(#blue-glow)"
            />
            <image
              id="node-icon-4"
              href="/assets/events/ecell/network/building.png"
              x="492"
              y="476"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* Node 5: Top-Right (Green) */}
          <g id="college-node-5" style={{ transformOrigin: "794px 155px" }}>
            <circle
              id="node-circle-5"
              cx="794"
              cy="155"
              r="38"
              fill="#222222"
              stroke="#33FF67"
              strokeWidth="4.5"
              filter="url(#green-glow)"
            />
            <image
              id="node-icon-5"
              href="/assets/events/ecell/network/building.png"
              x="774"
              y="136"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* Node 6: Mid-Right (Blue) */}
          <g id="college-node-6" style={{ transformOrigin: "859px 290px" }}>
            <circle
              id="node-circle-6"
              cx="859"
              cy="290"
              r="38"
              fill="#222222"
              stroke="#7484FE"
              strokeWidth="4.5"
              filter="url(#blue-glow)"
            />
            <image
              id="node-icon-6"
              href="/assets/events/ecell/network/building.png"
              x="839"
              y="271"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* Node 7: Bottom-Right (Green) */}
          <g id="college-node-7" style={{ transformOrigin: "804px 435px" }}>
            <circle
              id="node-circle-7"
              cx="804"
              cy="435"
              r="38"
              fill="#222222"
              stroke="#33FF67"
              strokeWidth="4.5"
              filter="url(#green-glow)"
            />
            <image
              id="node-icon-7"
              href="/assets/events/ecell/network/building.png"
              x="784"
              y="416"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>

        {/* 10. Dominant Center Title Group */}
        <g id="ecell-title-group" style={{ transformOrigin: "512px 330px" }}>
          {/* MEET Title (Rendered behind E-CELL) */}
          <text
            id="title-meet"
            x="512"
            y="398"
            className={styles.titleMeet}
            style={{ transformOrigin: "512px 355px" }}
          >
            MEET
          </text>

          {/* E-CELL Title (Rendered in front with crisp shadow) */}
          <text
            id="title-ecell"
            x="512"
            y="278"
            className={styles.titleECell}
            filter="url(#title-shadow)"
            style={{ transformOrigin: "512px 240px" }}
          >
            E-CELL
          </text>

          {/* Subtitle Bar: CONNECT • COLLABORATE • CREATE — Clean Separate Elements */}
          <g id="title-subtitle" style={{ transformOrigin: "512px 431px" }}>
            {/* Left Decorative Line (stops cleanly before CONNECT with uniform ~25px gap) */}
            <line
              id="sub-line-left"
              x1="283"
              y1="431"
              x2="315"
              y2="431"
              stroke="#7484FE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Word 1: CONNECT */}
            <text
              id="sub-word-connect"
              x="374"
              y="431"
              className={styles.subWord}
              fill="#F7F2F6"
            >
              CONNECT
            </text>

            {/* Bullet 1 */}
            <circle
              id="sub-dot-1"
              cx="433"
              cy="431"
              r="2.5"
              fill="#33FF67"
            />

            {/* Word 2: COLLABORATE */}
            <text
              id="sub-word-collaborate"
              x="512"
              y="431"
              className={styles.subWord}
              fill="#33FF67"
            >
              COLLABORATE
            </text>

            {/* Bullet 2 */}
            <circle
              id="sub-dot-2"
              cx="591"
              cy="431"
              r="2.5"
              fill="#33FF67"
            />

            {/* Word 3: CREATE */}
            <text
              id="sub-word-create"
              x="645"
              y="431"
              className={styles.subWord}
              fill="#F7F2F6"
            >
              CREATE
            </text>

            {/* Right Decorative Line (starts cleanly after CREATE with uniform ~25px gap) */}
            <line
              id="sub-line-right"
              x1="699"
              y1="431"
              x2="731"
              y2="431"
              stroke="#7484FE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default ECellMeetAnimation;
