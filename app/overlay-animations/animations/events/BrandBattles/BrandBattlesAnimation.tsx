// app/overlay-animations/animations/events/BrandBattles/BrandBattlesAnimation.tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import { BrandBattlesSceneSvg } from "./BrandBattlesSceneSvg";
import {
  createBrandBattlesTimeline,
  type BrandBattlesTimelineTargets,
} from "./brandBattlesTimeline";
import styles from "./BrandBattlesAnimation.module.css";

gsap.registerPlugin(useGSAP);

export const BrandBattlesAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const svg = svgRef.current;
      const container = containerRef.current;
      if (!svg || !container) return;

      const targets: BrandBattlesTimelineTargets = {
        container,
        sceneBase: svg.querySelector<SVGElement>("#scene-base"),
        bannerLeft: svg.querySelector<SVGElement>("#banner-left"),
        bannerRight: svg.querySelector<SVGElement>("#banner-right"),
        bannerTextLeft: svg.querySelector<SVGElement>("#banner-text-left"),
        bannerTextRight: svg.querySelector<SVGElement>("#banner-text-right"),
        lightningVs: svg.querySelector<SVGElement>("#lightning-vs"),
        titleBrand: svg.querySelector<SVGElement>("#title-brand"),
        titleBattles: svg.querySelector<SVGElement>("#title-battles"),
        tagline: svg.querySelector<SVGElement>("#tagline"),
        metaLeft: svg.querySelector<SVGElement>("#meta-left"),
        metaRight: svg.querySelector<SVGElement>("#meta-right"),
        statsGraphs: svg.querySelector<SVGElement>("#stats-graphs"),
      };

      const tl = createBrandBattlesTimeline(targets, {
        onComplete: () => {
          onComplete?.();
        },
      });

      masterTlRef.current = tl;

      if (typeof window !== "undefined") {
        (window as unknown as { __brandBattlesTl?: gsap.core.Timeline }).__brandBattlesTl = tl;
      }
    },
    { scope: containerRef }
  );

  // ── Dismiss / Skip Handling ───────────────────────────────────────────────
  const handleUserDismiss = () => {
    if (!masterTlRef.current) {
      onDismiss?.();
      onComplete?.();
      return;
    }

    masterTlRef.current.kill();

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          onDismiss?.();
          onComplete?.();
        },
      });
    } else {
      onDismiss?.();
      onComplete?.();
    }
  };

  // Skip trigger effect
  React.useEffect(() => {
    if (skip || isDismissed) {
      handleUserDismiss();
    }
  }, [skip, isDismissed]);

  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-modal="true"
      aria-label="Brand Battles Animation"
    >
      <button
        ref={skipButtonRef}
        onClick={handleUserDismiss}
        className={styles.skipButton}
        type="button"
        aria-label="Skip animation"
      >
        <span>SKIP</span>
        <X size={14} />
      </button>

      <div className={styles.stageFrame}>
        <BrandBattlesSceneSvg ref={svgRef} />
      </div>
    </div>
  );
};
