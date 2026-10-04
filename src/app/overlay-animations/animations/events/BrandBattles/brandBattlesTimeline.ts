// app/overlay-animations/animations/events/BrandBattles/brandBattlesTimeline.ts
import gsap from "gsap";

export interface BrandBattlesTimelineTargets {
  container: HTMLElement;
  sceneBase?: SVGElement | null;
  bannerLeft?: SVGElement | null;
  bannerRight?: SVGElement | null;
  bannerTextLeft?: SVGElement | null;
  bannerTextRight?: SVGElement | null;
  lightningVs?: SVGElement | null;
  titleBrand?: SVGElement | null;
  titleBattles?: SVGElement | null;
  tagline?: SVGElement | null;
  metaLeft?: SVGElement | null;
  metaRight?: SVGElement | null;
  statsGraphs?: SVGElement | null;
}

export interface BrandBattlesTimelineOptions {
  onComplete?: () => void;
}

/**
 * Creates the Brand Battles sequential GSAP timeline.
 * Supports both signatures:
 * 1. createBrandBattlesTimeline(containerRef, onComplete)
 * 2. createBrandBattlesTimeline(targets, options)
 */
export function createBrandBattlesTimeline(
  targetOrContainer: HTMLElement | BrandBattlesTimelineTargets,
  onCompleteOrOptions?: (() => void) | BrandBattlesTimelineOptions
): gsap.core.Timeline {
  let targets: BrandBattlesTimelineTargets;
  let onComplete: (() => void) | undefined;

  if (targetOrContainer instanceof HTMLElement) {
    const container = targetOrContainer;
    targets = {
      container,
      sceneBase: container.querySelector<SVGElement>("#scene-base"),
      bannerLeft: container.querySelector<SVGElement>("#banner-left"),
      bannerRight: container.querySelector<SVGElement>("#banner-right"),
      bannerTextLeft: container.querySelector<SVGElement>("#banner-text-left"),
      bannerTextRight: container.querySelector<SVGElement>("#banner-text-right"),
      lightningVs: container.querySelector<SVGElement>("#lightning-vs"),
      titleBrand: container.querySelector<SVGElement>("#title-brand"),
      titleBattles: container.querySelector<SVGElement>("#title-battles"),
      tagline: container.querySelector<SVGElement>("#tagline"),
      metaLeft: container.querySelector<SVGElement>("#meta-left"),
      metaRight: container.querySelector<SVGElement>("#meta-right"),
      statsGraphs: container.querySelector<SVGElement>("#stats-graphs"),
    };
    if (typeof onCompleteOrOptions === "function") {
      onComplete = onCompleteOrOptions;
    } else if (onCompleteOrOptions && typeof onCompleteOrOptions === "object") {
      onComplete = onCompleteOrOptions.onComplete;
    }
  } else {
    targets = targetOrContainer;
    if (typeof onCompleteOrOptions === "function") {
      onComplete = onCompleteOrOptions;
    } else if (onCompleteOrOptions && typeof onCompleteOrOptions === "object") {
      onComplete = onCompleteOrOptions.onComplete;
    }
  }

  const {
    container,
    bannerLeft,
    bannerRight,
    bannerTextLeft,
    bannerTextRight,
    lightningVs,
    titleBrand,
    titleBattles,
    tagline,
    metaLeft,
    metaRight,
    statsGraphs,
  } = targets;

  const leftLines = bannerTextLeft
    ? Array.from(bannerTextLeft.querySelectorAll<SVGElement>(".bannerLine, text, line"))
    : [];
  const rightLines = bannerTextRight
    ? Array.from(bannerTextRight.querySelectorAll<SVGElement>(".bannerLine, text, line"))
    : [];

  // Master GSAP Timeline
  const tl = gsap.timeline({
    paused: false,
    defaults: { ease: "power2.out" },
  });

  // ── Initial State Setup ──────────────────────────────────────────────────
  gsap.set(container, { opacity: 0, scale: 0.96 });

  // #scene-base remains completely static (speakers, podiums, plants, lamps)
  if (bannerLeft) {
    gsap.set(bannerLeft, { scaleY: 0, transformOrigin: "top center" });
  }
  if (bannerRight) {
    gsap.set(bannerRight, { scaleY: 0, transformOrigin: "top center" });
  }
  if (leftLines.length) {
    gsap.set(leftLines, { opacity: 0, y: -8 });
  }
  if (rightLines.length) {
    gsap.set(rightLines, { opacity: 0, y: -8 });
  }
  if (lightningVs) {
    gsap.set(lightningVs, { scale: 0, opacity: 0, transformOrigin: "center center" });
  }
  if (titleBrand) {
    gsap.set(titleBrand, { opacity: 0, y: 16 });
  }
  if (titleBattles) {
    gsap.set(titleBattles, { opacity: 0, y: 16 });
  }
  if (tagline) {
    gsap.set(tagline, { opacity: 0, y: 10, scale: 0.96, transformOrigin: "center center" });
  }
  if (metaLeft) {
    gsap.set(metaLeft, { opacity: 0, scale: 0.9, transformOrigin: "center center" });
  }
  if (metaRight) {
    gsap.set(metaRight, { opacity: 0, scale: 0.9, transformOrigin: "center center" });
  }
  if (statsGraphs) {
    gsap.set(statsGraphs, { opacity: 0, scale: 0.9, transformOrigin: "center center" });
  }

  // ── Phase 1: Entrance (0.4s) ─────────────────────────────────────────────
  // Fade and slightly scale the scene container (scale: 0.96 -> 1, opacity: 0 -> 1).
  // #scene-base remains completely static.
  tl.to(
    container,
    {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    },
    0
  );

  // ── Phase 2: Banner Unfold (0.45s + 0.1s stagger) ────────────────────────
  // Set transformOrigin: "top center" on #banner-left and #banner-right.
  // Unfold vertically via scaleY: 0 -> 1 with slight bounce settle (back.out(1.4)).
  // Stagger Left then Right by 0.1s.
  const banners = [bannerLeft, bannerRight].filter(Boolean) as SVGElement[];
  if (banners.length > 0) {
    tl.to(
      banners,
      {
        scaleY: 1,
        duration: 0.45,
        ease: "back.out(1.4)",
        stagger: 0.1,
        transformOrigin: "top center",
      },
      ">"
    );
  }

  // ── Phase 3: Text Reveal (Strictly after banner settles) ─────────────────
  // Do not overlap with the banner unfold.
  // Stagger-reveal banner lines top-to-bottom (opacity: 0 -> 1, y: -8 -> 0, stagger: 0.08s, ease: "power2.out").
  if (leftLines.length > 0 || rightLines.length > 0) {
    if (leftLines.length > 0) {
      tl.to(
        leftLines,
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          stagger: 0.08,
          ease: "power2.out",
        },
        ">"
      );
    }
    if (rightLines.length > 0) {
      tl.to(
        rightLines,
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          stagger: 0.08,
          ease: "power2.out",
        },
        leftLines.length > 0 ? "<" : ">"
      );
    }
  }

  // ── Phase 4: Lightning + VS Pop (0.35s) ──────────────────────────────────
  // Starts only after banner text finishes revealing.
  // Animate #lightning-vs from center (scale: 0 -> 1.15 -> 1 via back.out(2), duration: 0.35s).
  // Pop in surrounding impact lines simultaneously.
  if (lightningVs) {
    tl.to(
      lightningVs,
      {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "back.out(2)",
        transformOrigin: "center center",
      },
      ">"
    );
  }

  // ── Phase 5: Title & Meta Pop ────────────────────────────────────────────
  // Reveal #title-brand (black) followed immediately by #title-battles (blue) with an upward punch (y: 16 -> 0, opacity: 0 -> 1, ease: "power3.out").
  if (titleBrand) {
    tl.to(
      titleBrand,
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      },
      ">"
    );
  }

  if (titleBattles) {
    tl.to(
      titleBattles,
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      },
      titleBrand ? "-=0.18" : ">"
    );
  }

  // Pop corner stamps (#meta-left, #meta-right), mini graphs (#stats-graphs), and #tagline.
  const metaElements = [metaLeft, metaRight, statsGraphs, tagline].filter(Boolean) as SVGElement[];
  if (metaElements.length > 0) {
    tl.to(
      metaElements,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.5)",
        stagger: 0.06,
      },
      "<+=0.06"
    );
  }

  // ── Phase 6: Hold & Exit ─────────────────────────────────────────────────
  // Hold the completed visual for 0.8s.
  tl.to({}, { duration: 0.8 });

  // Fast fade out entire scene (opacity: 0, duration: 0.3s).
  tl.to(container, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      onComplete?.();
    },
  });

  return tl;
}
