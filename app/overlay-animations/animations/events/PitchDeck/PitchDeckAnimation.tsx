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
import { PitchDeckSceneSvg } from "./PitchDeckSceneSvg";
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

  // Scene target refs
  const baseLayerRef = useRef<SVGGElement>(null);
  const topLeftHeaderRef = useRef<SVGGElement>(null);
  const topRightHeaderRef = useRef<SVGGElement>(null);
  const lampLeftRef = useRef<SVGGElement>(null);
  const lampRightRef = useRef<SVGGElement>(null);
  const lightBeamLeftRef = useRef<SVGPolygonElement>(null);
  const lightBeamRightRef = useRef<SVGPolygonElement>(null);
  const leftBannerRef = useRef<SVGGElement>(null);
  const rightBannerRef = useRef<SVGGElement>(null);

  // Projector screen assembly
  const screenFrameRef = useRef<SVGGElement>(null);
  const screenCanvasRef = useRef<SVGPathElement>(null);
  const screenContentRef = useRef<SVGGElement>(null);

  // Presentation contents
  const heroTitleRef = useRef<SVGTextElement>(null);
  const subtitleRef = useRef<SVGGElement>(null);
  const chartBarsRef = useRef<(SVGPathElement | null)[]>([]);
  const chartArrowRef = useRef<SVGGElement>(null);
  const iconRow1Ref = useRef<SVGGElement>(null);
  const iconRow2Ref = useRef<SVGGElement>(null);
  const iconRow3Ref = useRef<SVGGElement>(null);
  const calloutBubbleRef = useRef<SVGGElement>(null);

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
          baseLayer: baseLayerRef.current,
          topLeftHeader: topLeftHeaderRef.current,
          topRightHeader: topRightHeaderRef.current,
          lampLeft: lampLeftRef.current,
          lampRight: lampRightRef.current,
          lightBeamLeft: lightBeamLeftRef.current,
          lightBeamRight: lightBeamRightRef.current,
          leftBanner: leftBannerRef.current,
          rightBanner: rightBannerRef.current,
          screenFrame: screenFrameRef.current,
          screenCanvas: screenCanvasRef.current,
          screenContent: screenContentRef.current,
          heroTitle: heroTitleRef.current,
          subtitle: subtitleRef.current,
          chartBars: chartBarsRef.current,
          chartArrow: chartArrowRef.current,
          iconRow1: iconRow1Ref.current,
          iconRow2: iconRow2Ref.current,
          iconRow3: iconRow3Ref.current,
          calloutBubble: calloutBubbleRef.current,
        },
        {
          onEntranceComplete: () => {
            if (exitingRef.current) return;
            const loops = startPitchDeckIdleLoops({
              lampLeft: lampLeftRef.current,
              lampRight: lampRightRef.current,
              lightBeamLeft: lightBeamLeftRef.current,
              lightBeamRight: lightBeamRightRef.current,
              calloutBubble: calloutBubbleRef.current,
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

      {/* 16:9 Aspect-Ratio Responsive Stage Frame */}
      <div ref={stageFrameRef} className={styles.stageFrame}>
        <PitchDeckSceneSvg
          className={styles.stageSvg}
          baseLayerRef={baseLayerRef}
          topLeftHeaderRef={topLeftHeaderRef}
          topRightHeaderRef={topRightHeaderRef}
          lampLeftRef={lampLeftRef}
          lampRightRef={lampRightRef}
          lightBeamLeftRef={lightBeamLeftRef}
          lightBeamRightRef={lightBeamRightRef}
          leftBannerRef={leftBannerRef}
          rightBannerRef={rightBannerRef}
          screenFrameRef={screenFrameRef}
          screenCanvasRef={screenCanvasRef}
          screenContentRef={screenContentRef}
          heroTitleRef={heroTitleRef}
          chartBarsRef={chartBarsRef}
          chartArrowRef={chartArrowRef}
          subtitleRef={subtitleRef}
          iconRow1Ref={iconRow1Ref}
          iconRow2Ref={iconRow2Ref}
          iconRow3Ref={iconRow3Ref}
          calloutBubbleRef={calloutBubbleRef}
        />
      </div>
    </div>
  );
};
