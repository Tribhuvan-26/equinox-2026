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
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = createECellMeetTimeline(
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
        (window as unknown as { __eCellMeetTl?: gsap.core.Timeline }).__eCellMeetTl = tl;
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
      aria-label="E-Cell Meet Event Animation"
    >
      {/* Repeating SVG Paper Grain Texture */}
      <div className={styles.paperNoise}>
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <filter id="ecellPaperNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.1   0 0 0 0 0.1   0 0 0 0 0.1  0 0 0 0.15 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#ecellPaperNoise)" />
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
        Skip <X className="h-3.5 w-3.5" />
      </button>

      {/* 16:9 Aspect-Ratio Stage Frame */}
      <div className={styles.stageFrame}>
        {/* Responsive Layered SVG Stage with Exact 16:9 ViewBox matching Approved Artwork Asset */}
        <svg
          id="ecell-scene"
          className={styles.stageSvg}
          viewBox="0 0 1024 576"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            {/* Base Master Artwork Asset */}
            <image
              id="ecell-master-img"
              href="/assets/events/ecell/ecell-master.png?v=2"
              width="1024"
              height="576"
              x="0"
              y="0"
            />

            {/* ========================================================== */}
            {/* PRECISE SVG CLIPPING MASKS FOR SEMANTIC COMPONENT GROUPS   */}
            {/* ========================================================== */}

            {/* 1. Main Hero E-CELL Title Unit (E-CELL + Tagline + Accents, Y: 10-215) */}
            <clipPath id="clip-hero-title">
              <polygon points="270,10 770,10 770,215 270,215" />
            </clipPath>

            {/* 2. Top-Left Hanging Banner Stand & Banner (ONE Complete Unit) */}
            <clipPath id="clip-left-banner">
              <polygon points="35,10 220,10 220,385 35,385" />
            </clipPath>

            {/* 3. Top-Right Hanging Lanyard Badge (ONE Complete Unit) */}
            <clipPath id="clip-right-badge">
              <polygon points="865,0 1010,0 1010,185 865,185" />
            </clipPath>

            {/* 4. Left Midground Booth / Canopy Tent (ONE Complete Unit) */}
            <clipPath id="clip-booth">
              <polygon points="75,210 385,210 385,576 75,576" />
            </clipPath>

            {/* 5. Left Foreground Megaphone Stand (ONE Complete Unit) */}
            <clipPath id="clip-megaphone">
              <polygon points="0,340 148,340 148,576 0,576" />
            </clipPath>

            {/* 6. Megaphone Radiating Sound Lines (Subtle Accent) */}
            <clipPath id="clip-megaphone-sound-lines">
              <polygon points="135,340 205,340 205,465 135,465" />
            </clipPath>

            {/* 7. Right Information Monolith Board (ONE Complete Unit) */}
            <clipPath id="clip-right-board">
              <polygon points="745,138 955,138 955,488 745,488" />
            </clipPath>

            {/* 8. Left Student (Complete Character: Head, Body, Clothes, Legs, Arms & Left Hand) */}
            <clipPath id="clip-left-student">
              <polygon points="280,225 530,225 530,365 540,365 540,425 480,425 480,576 280,576" />
            </clipPath>

            {/* 9. Right Student (Complete Character: Head, Body, Jacket, Tote, Legs, Arms & Right Hand) */}
            <clipPath id="clip-right-student">
              <polygon points="510,240 785,240 785,576 480,576 480,425 510,425" />
            </clipPath>

            {/* 10. Exchanged Blue Networking Card */}
            <clipPath id="clip-card">
              <polygon points="504,370 556,370 556,415 504,415" />
            </clipPath>

            {/* 11. Card Connection Focus Sparks */}
            <clipPath id="clip-card-sparks">
              <polygon points="490,338 565,338 565,382 490,382" />
            </clipPath>

            {/* 12. Bottom-Right Mini Chalkboard Easel (ONE Complete Unit) */}
            <clipPath id="clip-mini-board">
              <polygon points="815,398 1005,398 1005,565 815,565" />
            </clipPath>

            {/* 13. Foliage & Decorations */}
            <clipPath id="clip-left-plants">
              <polygon points="0,250 88,250 88,545 0,545" />
            </clipPath>
            <clipPath id="clip-right-plants">
              <polygon points="945,285 1024,285 1024,550 945,550" />
            </clipPath>
          </defs>

          {/* ============================================================ */}
          {/* 1. CLEAN BACKDROP LAYER                                      */}
          {/* ============================================================ */}
          <g id="background">
            <rect width="1024" height="576" fill="none" />
            <polygon points="0,440 1024,450 1024,576 0,576" fill="rgba(247, 242, 246, 0.03)" />
            <line x1="0" y1="440" x2="1024" y2="450" stroke="rgba(247, 242, 246, 0.15)" strokeWidth="1.5" />
            <line x1="160" y1="442" x2="80" y2="576" stroke="rgba(247, 242, 246, 0.1)" strokeWidth="1" />
            <line x1="380" y1="444" x2="330" y2="576" stroke="rgba(247, 242, 246, 0.1)" strokeWidth="1" />
            <line x1="670" y1="447" x2="730" y2="576" stroke="rgba(247, 242, 246, 0.1)" strokeWidth="1" />
          </g>

          {/* ============================================================ */}
          {/* 2. MAIN E-CELL BRANDING GROUP                                */}
          {/* ============================================================ */}
          <g id="branding">
            <g id="hero-title" className={styles.mainTitleGroup}>
              <use xlinkHref="#ecell-master-img" clipPath="url(#clip-hero-title)" />
            </g>
          </g>

          {/* ============================================================ */}
          {/* 3. ENVIRONMENT LEFT GROUP                                    */}
          {/* ============================================================ */}
          <g id="environment-left">
            <g id="left-banner" className={styles.leftBannerStand}>
              <use xlinkHref="#ecell-master-img" clipPath="url(#clip-left-banner)" />
            </g>
            <g id="booth" className={styles.boothGroup}>
              <use xlinkHref="#ecell-master-img" clipPath="url(#clip-booth)" />
            </g>
            <g id="megaphone" className={styles.megaphoneGroup}>
              <use xlinkHref="#ecell-master-img" clipPath="url(#clip-megaphone)" />
            </g>
          </g>

          {/* ============================================================ */}
          {/* 4. ENVIRONMENT RIGHT GROUP                                   */}
          {/* ============================================================ */}
          <g id="environment-right">
            <g id="right-badge" className={styles.rightIdBadge}>
              <use xlinkHref="#ecell-master-img" clipPath="url(#clip-right-badge)" />
            </g>
            <g id="right-board" className={styles.rightBoardGroup}>
              <use xlinkHref="#ecell-master-img" clipPath="url(#clip-right-board)" />
            </g>
            <g id="mini-board" className={styles.miniBoardGroup}>
              <use xlinkHref="#ecell-master-img" clipPath="url(#clip-mini-board)" />
            </g>
          </g>

          {/* ============================================================ */}
          {/* 5. PEOPLE INTERACTION GROUP                                  */}
          {/* ============================================================ */}
          <g id="people">
            <g id="student-left" className={styles.studentLeftGroup}>
              <use xlinkHref="#ecell-master-img" clipPath="url(#clip-left-student)" />
            </g>
            <g id="student-right" className={styles.studentRightGroup}>
              <use xlinkHref="#ecell-master-img" clipPath="url(#clip-right-student)" />
            </g>
            <g id="card-interaction" className={styles.cardInteractionGroup}>
              <use xlinkHref="#ecell-master-img" clipPath="url(#clip-card)" />
            </g>
          </g>

          {/* ============================================================ */}
          {/* 6. CONNECTING VISUAL ACCENTS GROUP                           */}
          {/* ============================================================ */}
          <g id="accents" className={styles.decorationsGroup}>
            <use xlinkHref="#ecell-master-img" clipPath="url(#clip-left-plants)" />
            <use xlinkHref="#ecell-master-img" clipPath="url(#clip-right-plants)" />
            <use xlinkHref="#ecell-master-img" clipPath="url(#clip-megaphone-sound-lines)" />
            <use xlinkHref="#ecell-master-img" clipPath="url(#clip-card-sparks)" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ECellMeetAnimation;
