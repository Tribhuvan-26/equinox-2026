// app/overlay-animations/animations/events/HustleMania/HustleManiaAnimation.tsx
"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import { HustleManiaSceneSvg } from "./HustleManiaSceneSvg";
import { createHustleManiaTimeline } from "./hustleManiaTimeline";
import styles from "./HustleManiaAnimation.module.css";

// Register useGSAP plugin
gsap.registerPlugin(useGSAP);

export const HustleManiaAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  // SVG element refs
  const backgroundSceneRef = useRef<SVGGElement>(null);
  const sideBannersRef = useRef<SVGGElement>(null);
  const bannerLeftBodyRef = useRef<SVGGElement>(null);
  const bannerLeftLineRef = useRef<SVGLineElement>(null);
  const bannerLeftTextRef = useRef<SVGGElement>(null);
  const bannerRightBodyRef = useRef<SVGGElement>(null);
  const bannerRightLineRef = useRef<SVGLineElement>(null);
  const bannerRightTextRef = useRef<SVGGElement>(null);
  const signPanelRef = useRef<SVGGElement>(null);
  const boothGlowLeftRef = useRef<SVGGElement>(null);
  const boothGlowCenterRef = useRef<SVGGElement>(null);
  const boothGlowRightRef = useRef<SVGGElement>(null);
  const speechBubbleLeftRef = useRef<SVGGElement>(null);
  const speechBubbleCenterRef = useRef<SVGGElement>(null);
  const speechBubbleRightRef = useRef<SVGGElement>(null);
  const titleClipStartupRef = useRef<SVGRectElement>(null);
  const titleClipExpoRef = useRef<SVGRectElement>(null);
  const titleStartupTextRef = useRef<SVGTextElement>(null);
  const titleExpoTextRef = useRef<SVGTextElement>(null);
  const titleCaptionRef = useRef<SVGGElement>(null);
  const titleUnderlineRef = useRef<SVGLineElement>(null);

  // Timeline ref for cancelation/skip
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const tl = createHustleManiaTimeline(
        {
          container: containerRef.current,
          backgroundScene: backgroundSceneRef.current,
          sideBanners: sideBannersRef.current,
          bannerLeftBody: bannerLeftBodyRef.current,
          bannerLeftLine: bannerLeftLineRef.current,
          bannerLeftText: bannerLeftTextRef.current,
          bannerRightBody: bannerRightBodyRef.current,
          bannerRightLine: bannerRightLineRef.current,
          bannerRightText: bannerRightTextRef.current,
          signPanel: signPanelRef.current,
          boothGlowLeft: boothGlowLeftRef.current,
          boothGlowCenter: boothGlowCenterRef.current,
          boothGlowRight: boothGlowRightRef.current,
          speechBubbleLeft: speechBubbleLeftRef.current,
          speechBubbleCenter: speechBubbleCenterRef.current,
          speechBubbleRight: speechBubbleRightRef.current,
          titleClipStartup: titleClipStartupRef.current,
          titleClipExpo: titleClipExpoRef.current,
          titleStartupText: titleStartupTextRef.current,
          titleExpoText: titleExpoTextRef.current,
          titleCaption: titleCaptionRef.current,
          titleUnderline: titleUnderlineRef.current,
          skipButton: skipButtonRef.current,
        },
        {
          onComplete: () => {
            onComplete?.();
          },
        }
      );

      masterTlRef.current = tl;
      if (typeof window !== "undefined") {
        (window as unknown as { __hustleManiaTl?: gsap.core.Timeline }).__hustleManiaTl = tl;
      }
    },
    { scope: containerRef }
  );

  // ── Dismiss / Skip Handling (tween to exit, not seek) ──────────────────────
  const handleUserDismiss = () => {
    if (!masterTlRef.current) {
      onDismiss?.();
      onComplete?.();
      return;
    }

    // Fast exit animation
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        masterTlRef.current?.kill();
        onDismiss?.();
        onComplete?.();
      },
    });
  };

  useEffect(() => {
    if (isDismissed || skip) {
      handleUserDismiss();
    }
  }, [isDismissed, skip]);

  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-label="Hustle Mania Event Animation"
    >
      {/* Skip Button */}
      <button
        ref={skipButtonRef}
        type="button"
        className={styles.skipButton}
        onClick={handleUserDismiss}
        aria-label="Skip animation"
      >
        <span>SKIP</span>
        <X size={13} strokeWidth={2.5} />
      </button>

      {/* 1536:1024 Responsive Stage Frame */}
      <div className={styles.stageFrame}>
        <HustleManiaSceneSvg
          backgroundSceneRef={backgroundSceneRef}
          sideBannersRef={sideBannersRef}
          bannerLeftBodyRef={bannerLeftBodyRef}
          bannerLeftLineRef={bannerLeftLineRef}
          bannerLeftTextRef={bannerLeftTextRef}
          bannerRightBodyRef={bannerRightBodyRef}
          bannerRightLineRef={bannerRightLineRef}
          bannerRightTextRef={bannerRightTextRef}
          signPanelRef={signPanelRef}
          boothGlowLeftRef={boothGlowLeftRef}
          boothGlowCenterRef={boothGlowCenterRef}
          boothGlowRightRef={boothGlowRightRef}
          speechBubbleLeftRef={speechBubbleLeftRef}
          speechBubbleCenterRef={speechBubbleCenterRef}
          speechBubbleRightRef={speechBubbleRightRef}
          titleClipStartupRef={titleClipStartupRef}
          titleClipExpoRef={titleClipExpoRef}
          titleStartupTextRef={titleStartupTextRef}
          titleExpoTextRef={titleExpoTextRef}
          titleCaptionRef={titleCaptionRef}
          titleUnderlineRef={titleUnderlineRef}
        />
      </div>
    </div>
  );
};

export default HustleManiaAnimation;
