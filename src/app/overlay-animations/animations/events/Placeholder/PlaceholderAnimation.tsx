// app/overlay-animations/animations/events/Placeholder/PlaceholderAnimation.tsx
"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import styles from "./PlaceholderAnimation.module.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Generic skeleton overlay for sub-events that don't have a bespoke
 * animation yet — same reveal/dismiss pattern as the custom ones
 * (IplAuction, PitchDeck, ...), just a themed placeholder card.
 */
export function createPlaceholderAnimation(
  title: string,
  slug: string
): React.FC<AnimationComponentProps> {
  const PlaceholderAnimation: React.FC<AnimationComponentProps> = ({
    onComplete,
    isDismissed,
    skip,
    onDismiss,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const exitingRef = useRef(false);

    useIsomorphicLayoutEffect(() => {
      exitingRef.current = false;
      const ctx = gsap.context(() => {
        gsap
          .timeline()
          .to(containerRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" })
          .from(
            cardRef.current,
            { y: 24, opacity: 0, scale: 0.94, duration: 0.5, ease: "back.out(1.6)" },
            "-=0.1"
          )
          .to({}, { duration: 1.4 })
          .call(() => {
            if (exitingRef.current) return;
            exitingRef.current = true;
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
              onComplete: () => onComplete?.(),
            });
          });
      }, containerRef);

      return () => ctx.revert();
    }, [onComplete]);

    useEffect(() => {
      if ((isDismissed || skip) && !exitingRef.current) {
        exitingRef.current = true;
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => onComplete?.(),
        });
      }
    }, [isDismissed, skip, onComplete]);

    const handleManualDismiss = () => {
      if (exitingRef.current) return;
      exitingRef.current = true;
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          onComplete?.();
          onDismiss?.();
        },
      });
    };

    return (
      <div
        ref={containerRef}
        className={styles.overlayContainer}
        role="dialog"
        aria-label={`${title} Event Animation`}
      >
        <button
          type="button"
          className={styles.skipButton}
          onClick={handleManualDismiss}
          aria-label="Skip Animation"
        >
          Skip <X className="h-3 w-3" />
        </button>

        <div ref={cardRef} className={styles.card}>
          {/* eslint-disable-next-line @next/next/no-img-element -- official logo, intrinsic aspect ratio */}
          <img src={`/logos/${slug}.png`} alt={title} className={styles.logo} />
          <span className={styles.badge}>Official Equinox Sub-Event</span>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.sub}>30 &ndash; 31 OCT &middot; MLRIT</span>
        </div>
      </div>
    );
  };

  return PlaceholderAnimation;
}
