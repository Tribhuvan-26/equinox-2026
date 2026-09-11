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
      if (typeof window !== "undefined") {
        (window as unknown as { __internshipDriveTl?: gsap.core.Timeline }).__internshipDriveTl = tl;
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
        </defs>

        {/* Transparent Background revealing brochure grid */}
        <rect width="1600" height="900" fill="none" />

        <g id="animatedRoot">
          {/* Subtle Accent Background Dots */}
          <circle cx="95" cy="55" r="14" fill="#EC1E79" />
          <circle cx="1505" cy="75" r="14" fill="#F5A623" />

          {/* ========================================================= */}
          {/* 1. TOP METADATA                                           */}
          {/* ========================================================= */}
          <g id="topMetadata">
            <circle cx="94" cy="80" r="14" fill="#E9B74B" />
            <text
              x="122"
              y="86"
              className="font-mono-bold"
              fontWeight="900"
              fontSize="16"
              letterSpacing="0.12em"
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
              fill="#7484FE"
            >
              DRIVE
            </text>

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
            {/* Dashed Connector Lines (behind the circles) */}
            <line
              id="connectorLine1"
              x1="200"
              y1="625"
              x2="310"
              y2="625"
              stroke="rgba(247, 242, 246, 0.4)"
              strokeWidth="3.5"
              strokeDasharray="8 6"
            />
            <line
              id="connectorLine2"
              x1="420"
              y1="625"
              x2="530"
              y2="625"
              stroke="rgba(247, 242, 246, 0.4)"
              strokeWidth="3.5"
              strokeDasharray="8 6"
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
            stroke="rgba(247, 242, 246, 0.25)"
            strokeWidth="3.5"
            strokeLinecap="round"
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
              />
            </g>
          </g>

          {/* ========================================================= */}
          {/* 5. BOTTOM INFORMATION BAR                                 */}
          {/* ========================================================= */}
          <g id="statsBarGroup">
            <rect x="40" y="775" width="1520" height="90" rx="45" fill="#1A1A1A" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
            <g
              id="statsBarContent"
              className="font-sans-bold"
              fill="#FFFFFF"
              fontSize="28"
              fontWeight="800"
              letterSpacing="0.03em"
            >
              <text x="400" y="830" textAnchor="middle">
                50+ Companies
              </text>
              <circle cx="600" cy="820" r="6" fill="#FFFFFF" />
              <text x="790" y="830" textAnchor="middle">
                500+ Students
              </text>
              <circle cx="980" cy="820" r="6" fill="#FFFFFF" />
              <text x="1180" y="830" textAnchor="middle">
                Free Registration
              </text>
            </g>
            <circle id="statsDotPink" cx="1490" cy="820" r="14" fill="#E8447A" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default InternshipDriveAnimation;

