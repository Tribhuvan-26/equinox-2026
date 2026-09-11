// app/overlay-animations/animations/events/IplAuction/IplAuctionAnimation.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import { IplAuctionScene } from "./IplAuctionScene";
import {
  createIplAuctionTimeline,
  type IplAuctionTimelineTargets,
} from "./iplAuctionTimeline";
import styles from "./IplAuctionAnimation.module.css";

gsap.registerPlugin(useGSAP);

export type IPLAuctionAnimationProps = AnimationComponentProps & {
  onComplete?: () => void;
  className?: string;
};

export const IPLAuctionAnimation: React.FC<IPLAuctionAnimationProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageFrameRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  const masterTlRef = useRef<gsap.core.Timeline | null>(null);
  const [isUnmounted, setIsUnmounted] = useState(false);

  // Initialize master GSAP timeline for stage lifecycle
  useGSAP(
    () => {
      const container = containerRef.current;
      const stageFrame = stageFrameRef.current;
      if (!container || !stageFrame) return;

      const targets: IplAuctionTimelineTargets = {
        container,
        stageFrame,
        skipButton: skipButtonRef.current,
      };

      const tl = createIplAuctionTimeline(targets, {
        onComplete: () => {
          setIsUnmounted(true);
          onComplete?.();
        },
      });

      masterTlRef.current = tl;

      if (typeof window !== "undefined") {
        (
          window as unknown as { __iplAuctionTl?: gsap.core.Timeline }
        ).__iplAuctionTl = tl;
      }
    },
    { scope: containerRef }
  );

  // User manual dismiss / skip handler
  const handleUserDismiss = React.useCallback(() => {
    if (!masterTlRef.current) {
      setIsUnmounted(true);
      onDismiss?.();
      onComplete?.();
      return;
    }

    masterTlRef.current.kill();

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          setIsUnmounted(true);
          onDismiss?.();
          onComplete?.();
        },
      });
    } else {
      setIsUnmounted(true);
      onDismiss?.();
      onComplete?.();
    }
  }, [onDismiss, onComplete]);

  // Skip prop listener
  useEffect(() => {
    if (skip || isDismissed) {
      handleUserDismiss();
    }
  }, [skip, isDismissed, handleUserDismiss]);

  if (isUnmounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-modal="true"
      aria-label="IPL Auction Event Animation"
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
        <X size={13} />
      </button>

      {/* 16:9 Responsive Stage Frame */}
      <div ref={stageFrameRef} className={styles.stageFrame}>
        <IplAuctionScene ref={svgRef} />
      </div>
    </div>
  );
};

export { IPLAuctionAnimation as IplAuctionAnimation };
export default IPLAuctionAnimation;
