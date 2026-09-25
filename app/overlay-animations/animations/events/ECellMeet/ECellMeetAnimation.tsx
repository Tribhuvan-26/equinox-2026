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

      {/* SVG Stage (1024x546 true aspect ratio matching Reference Image) */}
      <svg
        ref={svgRef}
        id="ecell-scene"
        className={styles.stageSvg}
        viewBox="0 0 1024 546"
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
            <feDropShadow dx="0" dy="4" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.85" />
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
        <rect width="1024" height="546" fill="#2A2A2A" />

        {/* 2. Floating Ambient Background Dots */}
        <g id="ecell-ambient-dots">
          <circle id="amb-dot-1" cx="195" cy="35" r="3.5" fill="#7484FE" opacity="0.75" />
          <circle id="amb-dot-2" cx="835" cy="18" r="3" fill="#33FF67" opacity="0.8" />
          <circle id="amb-dot-3" cx="60" cy="44" r="2.5" fill="#33FF67" opacity="0.7" />
          <circle id="amb-dot-4" cx="970" cy="250" r="3" fill="#33FF67" opacity="0.6" />
          <circle id="amb-dot-5" cx="110" cy="495" r="2.5" fill="#7484FE" opacity="0.7" />
          <circle id="amb-dot-6" cx="920" cy="495" r="2.5" fill="#33FF67" opacity="0.7" />
          <circle id="amb-dot-7" cx="70" cy="240" r="3.5" fill="#33FF67" opacity="0.5" />
          <circle id="amb-dot-8" cx="960" cy="450" r="3" fill="#7484FE" opacity="0.6" />
        </g>

        {/* 3. Corner Geometric Chevrons */}
        <g id="ecell-chevrons-bl" style={{ transformOrigin: "0px 546px" }}>
          <polygon
            id="bl-chevron-blue"
            points="0,410 185,505 85,546 0,546"
            fill="url(#chevron-blue-grad)"
          />
          <polygon
            id="bl-chevron-green"
            points="0,480 85,525 0,546"
            fill="url(#chevron-green-grad)"
          />
        </g>

        <g id="ecell-chevrons-br" style={{ transformOrigin: "1024px 546px" }}>
          <polygon
            id="br-chevron-blue"
            points="1024,410 839,505 939,546 1024,546"
            fill="url(#chevron-blue-grad)"
          />
          <polygon
            id="br-chevron-green"
            points="1024,480 939,525 1024,546"
            fill="url(#chevron-green-grad)"
          />
        </g>

        {/* 4. Floating Clouds */}
        <g id="ecell-clouds">
          <path
            id="cloud-left"
            d="M 30 384 L 125 384 A 12 12 0 0 0 115 370 A 16 16 0 0 0 90 360 A 20 20 0 0 0 55 350 A 18 18 0 0 0 40 367 A 14 14 0 0 0 30 384 Z"
            fill="#F7F2F6"
            opacity="0.95"
          />
          <path
            id="cloud-right"
            d="M 712 198 L 822 198 A 12 12 0 0 0 812 184 A 16 16 0 0 0 787 174 A 20 20 0 0 0 752 164 A 18 18 0 0 0 727 181 A 14 14 0 0 0 712 198 Z"
            fill="#F7F2F6"
            opacity="0.95"
          />
        </g>

        {/* 5. Floating Small Geometric Triangles */}
        <g id="ecell-triangles-inner">
          <polygon id="tri-inner-1" points="335,76 348,96 324,96" fill="#7484FE" />
          <polygon id="tri-inner-2" points="675,60 687,80 663,80" fill="#33FF67" />
          <polygon id="tri-inner-3" points="360,490 372,510 348,510" fill="#33FF67" />
          <polygon id="tri-inner-4" points="650,490 662,510 638,510" fill="#7484FE" />
        </g>

        <g id="ecell-triangles-outer">
          <polygon id="tri-outer-1" points="135,445 147,465 123,465" fill="#33FF67" />
          <polygon id="tri-outer-2" points="905,395 917,415 893,415" fill="#33FF67" />
        </g>

        {/* 6. Network Connecting Lines & Junction Dots */}
        <g id="ecell-network-lines">
          {/* Upper Circular Arc framing the People Group */}
          <path
            id="upper-arc-path"
            d="M 371 163 A 142 99 0 0 1 648 163"
            fill="none"
            stroke="#7484FE"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Dots positioned precisely along the Upper Arc */}
          {/* 1. Base-left: Blue dot */}
          <circle id="arc-dot-left" cx="371" cy="163" r="5" fill="#7484FE" />
          {/* 2. Mid-left: Green dot with Blue outer ring */}
          <circle id="arc-dot-mid-left" cx="409" cy="111" r="5.5" fill="#33FF67" stroke="#7484FE" strokeWidth="2.5" />
          {/* 3. Top Apex: Blue dot */}
          <circle id="arc-dot-top" cx="509" cy="64" r="5.5" fill="#7484FE" />
          {/* 4. Mid-right: Green dot with Blue outer ring */}
          <circle id="arc-dot-mid-right" cx="615" cy="117" r="5.5" fill="#33FF67" stroke="#7484FE" strokeWidth="2.5" />
          {/* 5. Base-right: Blue dot */}
          <circle id="arc-dot-right" cx="648" cy="163" r="5" fill="#7484FE" />

          {/* Line 1: Node 1 to Arc Base-Left via Junction */}
          <path
            id="net-line-1"
            d="M 265 164 L 311.5 170 L 371 163"
            fill="none"
            stroke="#7484FE"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle id="net-dot-1" cx="311.5" cy="170" r="4.5" fill="#7484FE" />

          {/* Dotted Line 1: Node 1 (TL) down-right towards green dot (317.5, 262) */}
          <g transform="translate(254, 196) rotate(46.2)" clipPath="url(#clip-dotted-1)">
            <line
              id="net-dotted-1"
              x1="0"
              y1="0"
              x2="92"
              y2="0"
              stroke="#7484FE"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </g>

          {/* Line 5: Node 5 to Arc Base-Right via Junction */}
          <path
            id="net-line-5"
            d="M 735 165 L 692 172 L 648 163"
            fill="none"
            stroke="#33FF67"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle id="net-dot-5" cx="692" cy="172" r="4.5" fill="#33FF67" />

          {/* Dotted Line 3: Node 5 (TR) down-left towards blue dot (703, 277) */}
          <g transform="translate(746, 196) rotate(118)" clipPath="url(#clip-dotted-3)">
            <line
              id="net-dotted-3"
              x1="0"
              y1="0"
              x2="92"
              y2="0"
              stroke="#33FF67"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </g>

          {/* Line 2: Node 2 (ML) to Title Left */}
          <line
            id="net-line-2"
            x1="210"
            y1="311"
            x2="317.5"
            y2="262"
            stroke="#33FF67"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle id="net-dot-2" cx="317.5" cy="262" r="5" fill="#33FF67" />

          {/* Dotted Line 2: Node 2 (ML) down-right towards blue dot (308.5, 387.5) */}
          <g transform="translate(204, 332) rotate(28)" clipPath="url(#clip-dotted-2)">
            <line
              id="net-dotted-2"
              x1="0"
              y1="0"
              x2="118"
              y2="0"
              stroke="#33FF67"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </g>

          {/* Line 6: Node 6 (MR) to Title Right */}
          <line
            id="net-line-6"
            x1="814"
            y1="287"
            x2="703"
            y2="277"
            stroke="#7484FE"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle id="net-dot-6" cx="703" cy="277" r="5" fill="#7484FE" />

          {/* Dotted Line 4: Node 6 (MR) down-left towards green dot (717.5, 381) */}
          <g transform="translate(820, 310) rotate(145.3)" clipPath="url(#clip-dotted-4)">
            <line
              id="net-dotted-4"
              x1="0"
              y1="0"
              x2="125"
              y2="0"
              stroke="#7484FE"
              strokeWidth="2.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
          </g>

          {/* Line 3: Node 3 (BL) to MEET Left */}
          <line
            id="net-line-3"
            x1="257"
            y1="428"
            x2="308.5"
            y2="387.5"
            stroke="#7484FE"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle id="net-dot-3" cx="308.5" cy="387.5" r="5" fill="#7484FE" />

          {/* Line 7: Node 7 (BR) to MEET Right */}
          <line
            id="net-line-7"
            x1="761"
            y1="424"
            x2="717.5"
            y2="381"
            stroke="#33FF67"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle id="net-dot-7" cx="717.5" cy="381" r="5" fill="#33FF67" />
          <line
            id="net-link-7"
            x1="717.5"
            y1="381"
            x2="685"
            y2="395"
            stroke="#7484FE"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* 7. Central 3-People Team Asset Layer */}
        <g id="ecell-people-group" style={{ transformOrigin: "506px 114px" }}>
          <image
            id="ecell-people-image"
            href="/assets/events/ecell/network/people_group.png"
            x="436"
            y="65"
            width="140"
            height="98"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* 9. The 7 Institution Nodes (Circles with Centered Icons and Perimeter Dots) */}
        <g id="ecell-college-nodes">
          {/* Node 1: Top-Left (Blue) */}
          <g id="college-node-1" style={{ transformOrigin: "227px 169px" }}>
            <circle
              id="node-circle-1"
              cx="227"
              cy="169"
              r="38"
              fill="#222222"
              stroke="#7484FE"
              strokeWidth="4.5"
              filter="url(#blue-glow)"
            />
            <image
              id="node-icon-1"
              href="/assets/events/ecell/network/building.png"
              x="207"
              y="149"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
            <circle id="node-perim-dot-1" cx="265" cy="164" r="4.5" fill="#7484FE" />
          </g>

          {/* Node 2: Mid-Left (Green) */}
          <g id="college-node-2" style={{ transformOrigin: "172px 311px" }}>
            <circle
              id="node-circle-2"
              cx="172"
              cy="311"
              r="38"
              fill="#222222"
              stroke="#33FF67"
              strokeWidth="4.5"
              filter="url(#green-glow)"
            />
            <image
              id="node-icon-2"
              href="/assets/events/ecell/network/building.png"
              x="152"
              y="291"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
            <circle id="node-perim-dot-2" cx="210" cy="311" r="4.5" fill="#33FF67" />
          </g>

          {/* Node 3: Bottom-Left (Blue) */}
          <g id="college-node-3" style={{ transformOrigin: "223px 460px" }}>
            <circle
              id="node-circle-3"
              cx="223"
              cy="460"
              r="38"
              fill="#222222"
              stroke="#7484FE"
              strokeWidth="4.5"
              filter="url(#blue-glow)"
            />
            <image
              id="node-icon-3"
              href="/assets/events/ecell/network/building.png"
              x="203"
              y="440"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
            <circle id="node-perim-dot-3" cx="257" cy="428" r="4.5" fill="#7484FE" />
          </g>

          {/* Node 4: Bottom-Center (Blue) */}
          <g id="college-node-4" style={{ transformOrigin: "506px 499px" }}>
            <circle
              id="node-circle-4"
              cx="506"
              cy="499"
              r="38"
              fill="#222222"
              stroke="#7484FE"
              strokeWidth="4.5"
              filter="url(#blue-glow)"
            />
            <image
              id="node-icon-4"
              href="/assets/events/ecell/network/building.png"
              x="486"
              y="479"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
            {/* Top perimeter apex dot at 12 o'clock */}
            <circle id="node-perim-dot-4" cx="506" cy="461" r="4.5" fill="#7484FE" />
          </g>

          {/* Node 5: Top-Right (Green) */}
          <g id="college-node-5" style={{ transformOrigin: "773px 170px" }}>
            <circle
              id="node-circle-5"
              cx="773"
              cy="170"
              r="38"
              fill="#222222"
              stroke="#33FF67"
              strokeWidth="4.5"
              filter="url(#green-glow)"
            />
            <image
              id="node-icon-5"
              href="/assets/events/ecell/network/building.png"
              x="753"
              y="150"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
            <circle id="node-perim-dot-5" cx="735" cy="165" r="4.5" fill="#33FF67" />
          </g>

          {/* Node 6: Mid-Right (Blue) */}
          <g id="college-node-6" style={{ transformOrigin: "852px 288px" }}>
            <circle
              id="node-circle-6"
              cx="852"
              cy="288"
              r="38"
              fill="#222222"
              stroke="#7484FE"
              strokeWidth="4.5"
              filter="url(#blue-glow)"
            />
            <image
              id="node-icon-6"
              href="/assets/events/ecell/network/building.png"
              x="832"
              y="268"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
            <circle id="node-perim-dot-6" cx="814" cy="287" r="4.5" fill="#7484FE" />
          </g>

          {/* Node 7: Bottom-Right (Green) */}
          <g id="college-node-7" style={{ transformOrigin: "787px 448px" }}>
            <circle
              id="node-circle-7"
              cx="787"
              cy="448"
              r="38"
              fill="#222222"
              stroke="#33FF67"
              strokeWidth="4.5"
              filter="url(#green-glow)"
            />
            <image
              id="node-icon-7"
              href="/assets/events/ecell/network/building.png"
              x="767"
              y="428"
              width="40"
              height="40"
              filter="url(#white-tint)"
              preserveAspectRatio="xMidYMid meet"
            />
            <circle id="node-perim-dot-7" cx="761" cy="424" r="4.5" fill="#33FF67" />
          </g>
        </g>

        {/* 10. Dominant Center Title Group */}
        <g id="ecell-title-group" style={{ transformOrigin: "509px 330px" }}>
          {/* MEET Title (Rendered behind E-CELL) */}
          <text
            id="title-meet"
            x="509"
            y="395"
            className={styles.titleMeet}
            style={{ transformOrigin: "509px 360px" }}
          >
            MEET
          </text>

          {/* E-CELL Title (Rendered in front with crisp shadow) */}
          <text
            id="title-ecell"
            x="509"
            y="274"
            className={styles.titleECell}
            filter="url(#title-shadow)"
            style={{ transformOrigin: "509px 240px" }}
          >
            E-CELL
          </text>

          {/* Subtitle Bar: CONNECT • COLLABORATE • CREATE */}
          <g id="title-subtitle" style={{ transformOrigin: "509px 429px" }}>
            {/* Left Decorative Line */}
            <line
              id="sub-line-left"
              x1="270"
              y1="429"
              x2="305"
              y2="429"
              stroke="#7484FE"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Word 1: CONNECT */}
            <text
              id="sub-word-connect"
              x="360"
              y="429"
              className={styles.subWord}
              fill="#FFFFFF"
            >
              CONNECT
            </text>

            {/* Bullet 1 */}
            <circle
              id="sub-dot-1"
              cx="424"
              cy="429"
              r="3"
              fill="#33FF67"
            />

            {/* Word 2: COLLABORATE */}
            <text
              id="sub-word-collaborate"
              x="509"
              y="429"
              className={styles.subWord}
              fill="#33FF67"
            >
              COLLABORATE
            </text>

            {/* Bullet 2 */}
            <circle
              id="sub-dot-2"
              cx="594"
              cy="429"
              r="3"
              fill="#33FF67"
            />

            {/* Word 3: CREATE */}
            <text
              id="sub-word-create"
              x="658"
              y="429"
              className={styles.subWord}
              fill="#FFFFFF"
            >
              CREATE
            </text>

            {/* Right Decorative Line */}
            <line
              id="sub-line-right"
              x1="713"
              y1="429"
              x2="748"
              y2="429"
              stroke="#7484FE"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default ECellMeetAnimation;
