// app/overlay-animations/animations/events/StartupExpo/StartupExpoAnimation.tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import { StartupExpoSceneSvg } from "./StartupExpoSceneSvg";
import {
  createStartupExpoTimeline,
  type StartupExpoTimelineTargets,
} from "./startupExpoTimeline";
import styles from "./StartupExpoAnimation.module.css";

gsap.registerPlugin(useGSAP);

export const StartupExpoAnimation: React.FC<AnimationComponentProps> = ({
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
      if (!svg || !containerRef.current) return;

      const targets: StartupExpoTimelineTargets = {
        container: containerRef.current,
        skipButton: skipButtonRef.current,
        backgroundBase: svg.querySelector<SVGElement>("#background-base"),
        sideBanners: svg.querySelector<SVGElement>("#side-banners"),
        crackDebris: svg.querySelector<SVGElement>("#crack-debris"),
        plantLeft: svg.querySelector<SVGElement>("#plant-left"),
        plantRight: svg.querySelector<SVGElement>("#plant-right"),
        logoBadge: svg.querySelector<SVGElement>("#logo-badge"),
        dateTag: svg.querySelector<SVGElement>("#date-tag"),
        step1: svg.querySelector<SVGElement>("#step-1"),
        step2: svg.querySelector<SVGElement>("#step-2"),
        step3: svg.querySelector<SVGElement>("#step-3"),
        step4: svg.querySelector<SVGElement>("#step-4"),
        step5: svg.querySelector<SVGElement>("#step-5"),
        banner1: svg.querySelector<SVGElement>("#banner-1"),
        banner2: svg.querySelector<SVGElement>("#banner-2"),
        banner3: svg.querySelector<SVGElement>("#banner-3"),
        banner4: svg.querySelector<SVGElement>("#banner-4"),
        banner5: svg.querySelector<SVGElement>("#banner-5"),
        bannerText1: svg.querySelector<SVGElement>("#banner-text-1"),
        bannerText2: svg.querySelector<SVGElement>("#banner-text-2"),
        bannerText3: svg.querySelector<SVGElement>("#banner-text-3"),
        bannerText4: svg.querySelector<SVGElement>("#banner-text-4"),
        bannerText5: svg.querySelector<SVGElement>("#banner-text-5"),
        lampFixture: svg.querySelector<SVGElement>("#lamp-fixture"),
        lampBulbGlow: svg.querySelector<SVGElement>("#lamp-bulb-glow"),
        lampBulbCore: svg.querySelector<SVGElement>("#lamp-bulb-core"),
        lightCone: svg.querySelector<SVGElement>("#light-cone"),
        personFlagGroup: svg.querySelector<SVGElement>("#person-flag-group"),
        titleClipRect: svg.querySelector<SVGRectElement>("#titleClipRect"),
        titleText: svg.querySelector<SVGElement>("#title-text"),
        taglineText: svg.querySelector<SVGElement>("#tagline-text"),
      };

      const tl = createStartupExpoTimeline(targets, {
        onComplete: () => {
          onComplete?.();
        },
      });

      masterTlRef.current = tl;
      if (typeof window !== "undefined") {
        (window as any).__startupExpoTl = tl;
        const pauseTarget = (window as any).__startupExpoPauseAt;
        if (pauseTarget !== undefined && pauseTarget !== null) {
          const pauseSec = typeof pauseTarget === "number" ? pauseTarget : 3.0;
          tl.seek(pauseSec);
          tl.pause();
          return;
        }
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
      aria-label="Startup Expo Animation"
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
        <StartupExpoSceneSvg ref={svgRef} />
      </div>
    </div>
  );
};
