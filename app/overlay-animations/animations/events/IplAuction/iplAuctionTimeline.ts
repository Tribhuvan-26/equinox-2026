// app/overlay-animations/animations/events/IplAuction/iplAuctionTimeline.ts
"use client";

import gsap from "gsap";

export interface IplAuctionTimelineTargets {
  container: HTMLElement | null;
  stageFrame: HTMLElement | null;
  skipButton: HTMLElement | null;
}

export interface IplAuctionTimelineOptions {
  onComplete?: () => void;
}

/**
 * Creates the master GSAP lifecycle timeline for the IPL Auction overlay.
 * Controls container backdrop blur/fade, stage scale-in, active scene duration,
 * and clean outro transition.
 */
export function createIplAuctionTimeline(
  targets: IplAuctionTimelineTargets,
  options?: IplAuctionTimelineOptions
): gsap.core.Timeline {
  const tl = gsap.timeline({
    defaults: {
      overwrite: "auto",
    },
    onComplete: () => {
      options?.onComplete?.();
    },
  });

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    if (targets.container) gsap.set(targets.container, { opacity: 1 });
    if (targets.stageFrame) gsap.set(targets.stageFrame, { opacity: 1, scale: 1 });
    tl.to({}, { duration: 1.5 });
    return tl;
  }

  // Initial setup
  if (targets.container) {
    gsap.set(targets.container, { opacity: 0 });
  }

  if (targets.stageFrame) {
    gsap.set(targets.stageFrame, { scale: 0.95, opacity: 0 });
  }

  if (targets.skipButton) {
    gsap.set(targets.skipButton, { opacity: 0, y: -8 });
  }

  // Entrance
  if (targets.container) {
    tl.to(targets.container, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0.0);
  }

  if (targets.stageFrame) {
    tl.to(
      targets.stageFrame,
      { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" },
      0.05
    );
  }

  if (targets.skipButton) {
    tl.to(
      targets.skipButton,
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      0.2
    );
  }

  // Hold phase: Allow the full choreographed SVG animation (up to ~3.1s for audience,
  // plus looping gavel tap and paddle float) to be appreciated
  // Outro initiates at 4.8s
  if (targets.stageFrame) {
    tl.to(
      targets.stageFrame,
      { scale: 0.97, opacity: 0, duration: 0.35, ease: "power2.in" },
      4.8
    );
  }

  if (targets.container) {
    tl.to(targets.container, { opacity: 0, duration: 0.25, ease: "power2.in" }, 4.95);
  }

  tl.set({}, {}, 5.2);

  return tl;
}
