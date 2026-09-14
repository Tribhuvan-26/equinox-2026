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
 * Controls container backdrop fade, stage entrance, exact 5.00s choreographed
 * vector animation sequence, clean freeze-frame hold through 5.00s, and outro transition.
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
    if (targets.stageFrame) gsap.set(targets.stageFrame, { opacity: 1 });
    tl.to({}, { duration: 2.0 });
    return tl;
  }

  // Initial setup
  if (targets.container) {
    gsap.set(targets.container, { opacity: 0 });
  }

  if (targets.stageFrame) {
    gsap.set(targets.stageFrame, { opacity: 0 });
  }

  if (targets.skipButton) {
    gsap.set(targets.skipButton, { opacity: 0, y: -8 });
  }

  // Container & Stage Entrance (0.0s)
  if (targets.container) {
    tl.to(targets.container, { opacity: 1, duration: 0.25, ease: "power2.out" }, 0.0);
  }

  if (targets.stageFrame) {
    tl.to(
      targets.stageFrame,
      { opacity: 1, duration: 0.35, ease: "power3.out" },
      0.0
    );
  }

  if (targets.skipButton) {
    tl.to(
      targets.skipButton,
      { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
      0.15
    );
  }

  // 4.6s - 5.00s: Clean completely static hold on the completed poster
  // Outro initiates at 5.05s to allow the full 5.00s animation to complete
  if (targets.stageFrame) {
    tl.to(
      targets.stageFrame,
      { opacity: 0, duration: 0.35, ease: "power2.in" },
      5.05
    );
  }

  if (targets.container) {
    tl.to(targets.container, { opacity: 0, duration: 0.25, ease: "power2.in" }, 5.2);
  }

  tl.set({}, {}, 5.45);

  return tl;
}
