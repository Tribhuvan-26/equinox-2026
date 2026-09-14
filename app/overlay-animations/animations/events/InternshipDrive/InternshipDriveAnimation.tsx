// app/overlay-animations/animations/events/InternshipDrive/InternshipDriveAnimation.tsx
"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import {
  createInternshipDriveTimeline,
  skipInternshipDriveTimelineToExit,
} from "./internshipDriveTimeline";
import styles from "./InternshipDriveAnimation.module.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const InternshipDriveAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Prevent background scrolling while intro is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = createInternshipDriveTimeline(
        {
          container: containerRef.current,
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

  // React to external dismiss / skip signal
  useEffect(() => {
    if (isDismissed || skip) {
      skipInternshipDriveTimelineToExit(timelineRef.current);
    }
  }, [isDismissed, skip]);

  // Handle escape key dismiss for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        skipInternshipDriveTimelineToExit(timelineRef.current);
        onDismiss?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);

  const handleManualDismiss = () => {
    skipInternshipDriveTimelineToExit(timelineRef.current);
    onDismiss?.();
  };

  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-label="Internship Drive Event Animation"
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

      {/* Responsive Full-Screen SVG Stage (1600x900, 16:9 Aspect Ratio) */}
      <svg
        id="internship-drive-scene"
        className={styles.stageSvg}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`
            .font-display {
              font-family: var(--font-syne), 'Arial Black', Impact, sans-serif;
              text-transform: uppercase;
            }
            .font-mono-bold {
              font-family: var(--font-mono), 'Space Grotesk', monospace;
              text-transform: uppercase;
            }
            .font-sans-bold {
              font-family: var(--font-display), -apple-system, BlinkMacSystemFont, sans-serif;
            }
          `}</style>

          {/* Equinox 2K26 Reference Theme Gradients */}
          <linearGradient id="driveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7484FE" />
            <stop offset="100%" stopColor="#33FF67" />
          </linearGradient>

          <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7484FE" />
            <stop offset="100%" stopColor="#33FF67" />
          </linearGradient>

          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7484FE" />
            <stop offset="70%" stopColor="#33FF67" />
            <stop offset="100%" stopColor="#33FF67" />
          </linearGradient>

          <linearGradient id="barBorderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7484FE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#33FF67" stopOpacity="0.9" />
          </linearGradient>

          <radialGradient id="sphereViolet" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#A8B4FF" />
            <stop offset="50%" stopColor="#7484FE" />
            <stop offset="100%" stopColor="#1E2356" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="sphereCyan" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#A6FFC7" />
            <stop offset="45%" stopColor="#33FF67" />
            <stop offset="100%" stopColor="#0B3D18" stopOpacity="0" />
          </radialGradient>

          {/* Subtle Futuristic Glow Filters */}
          <filter id="driveGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#7484FE" floodOpacity="0.35" />
            <feDropShadow dx="0" dy="0" stdDeviation="24" floodColor="#33FF67" floodOpacity="0.2" />
          </filter>

          <filter id="groundGlow" x="-10%" y="-100%" width="120%" height="300%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#33FF67" floodOpacity="0.45" />
          </filter>

          <filter id="barGlow" x="-5%" y="-30%" width="110%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#7484FE" floodOpacity="0.2" />
          </filter>

          <filter id="greenDotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#33FF67" floodOpacity="0.8" />
          </filter>

          <filter id="businessmanRimLight" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-3" dy="0" stdDeviation="4" floodColor="#33FF67" floodOpacity="0.3" />
          </filter>

          <filter id="studentRimLight" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="0" stdDeviation="5" floodColor="#7484FE" floodOpacity="0.3" />
          </filter>

          {/* Connector Base Gradients (userSpaceOnUse for zero-height horizontal lines) */}
          <linearGradient id="connectorGrad1" gradientUnits="userSpaceOnUse" x1="200" y1="625" x2="310" y2="625">
            <stop offset="0%" stopColor="#7484FE" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          <linearGradient id="connectorGrad2" gradientUnits="userSpaceOnUse" x1="420" y1="625" x2="530" y2="625">
            <stop offset="0%" stopColor="#33FF67" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          <filter id="connectorGlow" filterUnits="userSpaceOnUse" x="180" y="605" width="160" height="40">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#7484FE" floodOpacity="0.8" />
          </filter>

          <filter id="connectorGlowGreen" filterUnits="userSpaceOnUse" x="400" y="605" width="160" height="40">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#33FF67" floodOpacity="0.8" />
          </filter>

          {/* Flowing Energy Pulse Gradients & Glow */}
          <linearGradient id="pulseGrad1" gradientUnits="userSpaceOnUse" x1="200" y1="625" x2="310" y2="625">
            <stop offset="0%" stopColor="#7484FE" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="pulseGrad2" gradientUnits="userSpaceOnUse" x1="420" y1="625" x2="530" y2="625">
            <stop offset="0%" stopColor="#33FF67" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          <filter id="pulseGlow1" filterUnits="userSpaceOnUse" x="180" y="600" width="160" height="50">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#38BDF8" floodOpacity="1" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#7484FE" floodOpacity="0.8" />
          </filter>

          <filter id="pulseGlow2" filterUnits="userSpaceOnUse" x="400" y="600" width="160" height="50">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#33FF67" floodOpacity="1" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#38BDF8" floodOpacity="0.8" />
          </filter>

          <filter id="leftGlobeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#7484FE" floodOpacity="0.4" />
          </filter>

          {/* Title Shine Sweep Linear Gradient & ClipPath */}
          <linearGradient id="titleShineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="35%" stopColor="#7484FE" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#33FF67" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <clipPath id="titleSweepClip">
            <text
              x="90"
              y="275"
              className="font-display"
              fontWeight="900"
              fontSize="160"
              letterSpacing="-0.03em"
              textLength="730"
              lengthAdjust="spacingAndGlyphs"
            >
              INTERNSHIP
            </text>
            <text
              x="90"
              y="445"
              className="font-display"
              fontWeight="900"
              fontSize="165"
              letterSpacing="-0.03em"
              textLength="420"
              lengthAdjust="spacingAndGlyphs"
            >
              DRIVE
            </text>
          </clipPath>
        </defs>

        {/* 1. Deep Black Background (#000000) */}
        <rect width="1600" height="900" fill="#000000" />

        {/* Subtle Perspective Floor Grid */}
        <g opacity="0.12" stroke="#7484FE" strokeWidth="1">
          <line x1="0" y1="740" x2="1600" y2="740" />
          <line x1="0" y1="785" x2="1600" y2="785" />
          <line x1="0" y1="835" x2="1600" y2="835" />
          <line x1="0" y1="890" x2="1600" y2="890" />
          <line x1="300" y1="740" x2="200" y2="900" />
          <line x1="500" y1="740" x2="440" y2="900" />
          <line x1="700" y1="740" x2="680" y2="900" />
          <line x1="900" y1="740" x2="920" y2="900" />
          <line x1="1100" y1="740" x2="1160" y2="900" />
          <line x1="1300" y1="740" x2="1400" y2="900" />
          <line x1="1500" y1="740" x2="1640" y2="900" />
        </g>

        {/* Subtle Right Wireframe Globe Lines */}
        <g opacity="0.16" stroke="#7484FE" strokeWidth="1" fill="none" transform="translate(1520, 360)">
          <circle cx="0" cy="0" r="160" />
          <ellipse cx="0" cy="0" rx="160" ry="60" />
          <ellipse cx="0" cy="0" rx="160" ry="115" />
          <ellipse cx="0" cy="0" rx="60" ry="160" />
          <ellipse cx="0" cy="0" rx="115" ry="160" />
          <line x1="-160" y1="0" x2="160" y2="0" />
          <line x1="0" y1="-160" x2="0" y2="160" />
        </g>

        {/* Atmospheric Glowing Spheres & Left-Side Partially Visible Globe */}
        <g pointerEvents="none">
          <circle cx="1360" cy="68" r="16" fill="url(#sphereCyan)" opacity="0.9" />
          <circle cx="1425" cy="510" r="18" fill="url(#sphereCyan)" opacity="0.75" />

          {/* Left-Side Partially Visible Globe (Subtle Orbital Floating & Parallax Rotation) */}
          <g id="leftGlobe" transform="translate(6, 620)">
            <circle cx="0" cy="0" r="42" fill="url(#sphereViolet)" opacity="0.85" filter="url(#leftGlobeGlow)" />
          </g>
        </g>

        <g id="animatedRoot">
          {/* Top Decorative Double Dot Accent */}
          <g transform="translate(42, 50)">
            <circle cx="0" cy="-10" r="14" fill="#33FF67" opacity="0.95" />
            <circle cx="0" cy="14" r="14" fill="#7484FE" opacity="0.95" />
          </g>

          {/* ========================================================= */}
          {/* 1. TOP METADATA                                           */}
          {/* ========================================================= */}
          <g id="topMetadata">
            <text
              x="92"
              y="58"
              className="font-mono-bold"
              fontWeight="900"
              fontSize="16"
              letterSpacing="0.14em"
              fill="#F7F2F6"
            >
              THE EQUINOX 2.0 &#183; 30-31 OCT &#183; MLRIT
            </text>
          </g>

          {/* ========================================================= */}
          {/* 2. HERO HEADLINE & TAGLINE                                */}
          {/* ========================================================= */}
          <g id="headlineGroup">
            <text
              id="headlineInternship"
              x="90"
              y="275"
              className="font-display"
              fontWeight="900"
              fontSize="160"
              letterSpacing="-0.03em"
              textLength="730"
              lengthAdjust="spacingAndGlyphs"
              fill="#F7F2F6"
            >
              INTERNSHIP
            </text>

            <text
              id="headlineDrive"
              x="90"
              y="445"
              className="font-display"
              fontWeight="900"
              fontSize="165"
              letterSpacing="-0.03em"
              textLength="420"
              lengthAdjust="spacingAndGlyphs"
              fill="url(#driveGradient)"
              filter="url(#driveGlow)"
            >
              DRIVE
            </text>

            {/* Light / Glow Sweep Across Title (Clipped to Exact Letterforms) */}
            <g clipPath="url(#titleSweepClip)" pointerEvents="none">
              <rect
                id="titleShineSweep"
                x="0"
                y="120"
                width="240"
                height="380"
                fill="url(#titleShineGradient)"
                opacity="0"
              />
            </g>

            <text
              id="headlineTagline"
              x="90"
              y="525"
              className="font-sans-bold"
              fontWeight="800"
              fontSize="36"
              letterSpacing="0.01em"
              fill="#F7F2F6"
            >
              Connect. Intern. Grow.
            </text>
          </g>

          {/* ========================================================= */}
          {/* 3. THREE CIRCULAR PROCESS ICONS & DASHED CONNECTORS       */}
          {/* ========================================================= */}
          <g id="iconProcessSequence">
            {/* Base Connection Lines (behind the circles - remain visible) */}
            <line
              id="connectorLine1"
              x1="200"
              y1="625"
              x2="310"
              y2="625"
              stroke="url(#connectorGrad1)"
              strokeWidth="3.5"
              filter="url(#connectorGlow)"
              opacity="0.95"
            />
            <line
              id="connectorLine2"
              x1="420"
              y1="625"
              x2="530"
              y2="625"
              stroke="url(#connectorGrad2)"
              strokeWidth="3.5"
              filter="url(#connectorGlowGreen)"
              opacity="0.95"
            />

            {/* Flowing Energy Pulses: Sequential Flow from CONNECT -> INTERN -> GROW */}
            <line
              id="energyPulse1"
              x1="200"
              y1="625"
              x2="310"
              y2="625"
              stroke="url(#pulseGrad1)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="36 110"
              strokeDashoffset="36"
              filter="url(#pulseGlow1)"
              pointerEvents="none"
              opacity="0"
            />
            <line
              id="energyPulse2"
              x1="420"
              y1="625"
              x2="530"
              y2="625"
              stroke="url(#pulseGrad2)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="36 110"
              strokeDashoffset="36"
              filter="url(#pulseGlow2)"
              pointerEvents="none"
              opacity="0"
            />

            {/* Icon 1: Connect Circle & Separate Label */}
            <g id="iconGroupConnect">
              <image
                href="/internship-drive/icon_connect.png"
                x="90"
                y="570"
                width="110"
                height="110"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
            <text
              id="labelConnect"
              x="145"
              y="712"
              textAnchor="middle"
              className="font-mono-bold"
              fontWeight="900"
              fontSize="18"
              letterSpacing="0.08em"
              fill="#F7F2F6"
            >
              CONNECT
            </text>

            {/* Icon 2: Intern Circle & Separate Label */}
            <g id="iconGroupIntern">
              <image
                href="/internship-drive/icon_intern.png"
                x="310"
                y="570"
                width="110"
                height="110"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
            <text
              id="labelIntern"
              x="365"
              y="712"
              textAnchor="middle"
              className="font-mono-bold"
              fontWeight="900"
              fontSize="18"
              letterSpacing="0.08em"
              fill="#F7F2F6"
            >
              INTERN
            </text>

            {/* Icon 3: Grow Circle & Separate Label */}
            <g id="iconGroupGrow">
              <image
                href="/internship-drive/icon_grow.png"
                x="530"
                y="570"
                width="110"
                height="110"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
            <text
              id="labelGrow"
              x="585"
              y="712"
              textAnchor="middle"
              className="font-mono-bold"
              fontWeight="900"
              fontSize="18"
              letterSpacing="0.08em"
              fill="#F7F2F6"
            >
              GROW
            </text>
          </g>

          {/* ========================================================= */}
          {/* 4. RIGHT SECTION: GROUND LINE & CHARACTERS                */}
          {/* ========================================================= */}
          <line
            id="groundLine"
            x1="760"
            y1="738"
            x2="1540"
            y2="738"
            stroke="url(#groundGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#groundGlow)"
          />

          {/* Businessman: Position Group -> Animation Group -> Image */}
          <g id="businessman-position" transform="translate(762, 131) scale(0.94)">
            <g id="businessman-animation">
              <image
                id="businessman-image"
                href="/internship-drive/businessman.png"
                width="437"
                height="669"
                preserveAspectRatio="xMidYMid meet"
                filter="url(#businessmanRimLight)"
              />
            </g>
          </g>

          {/* Student: Position Group -> Animation Group -> Image */}
          <g id="student-position" transform="translate(1104, 149) scale(0.94)">
            <g id="student-animation">
              <image
                id="student-image"
                href="/internship-drive/student.png"
                width="456"
                height="650"
                preserveAspectRatio="xMidYMid meet"
                filter="url(#studentRimLight)"
              />
            </g>
          </g>

          {/* ========================================================= */}
          {/* 5. BOTTOM INFORMATION BAR                                 */}
          {/* ========================================================= */}
          <g id="statsBarGroup">
            <rect
              x="40"
              y="775"
              width="1520"
              height="90"
              rx="45"
              fill="#0A0A0E"
              stroke="url(#barBorderGradient)"
              strokeWidth="2.5"
              filter="url(#barGlow)"
            />
            <g
              id="statsBarContent"
              className="font-sans-bold"
              fill="#F7F2F6"
              fontSize="28"
              fontWeight="800"
              letterSpacing="0.04em"
            >
              <text x="800" y="830" textAnchor="middle">
                50+ Companies &nbsp;·&nbsp; 500+ Students
              </text>
            </g>
            <circle id="statsDotPink" cx="1490" cy="820" r="0" opacity="0" fill="#33FF67" filter="url(#greenDotGlow)" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default InternshipDriveAnimation;
