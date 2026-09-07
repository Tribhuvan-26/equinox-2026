// app/overlay-animations/animations/events/Spotlight/spotlightTimeline.ts
import gsap from "gsap";

export interface SpotlightTimelineTargets {
  container: HTMLElement | null;
  vignette: HTMLElement | null;
  grain: HTMLElement | null;
  flash: HTMLElement | null;
  skipButton: HTMLElement | null;
  leftFixtureGroup: SVGElement | null;
  rightFixtureGroup: SVGElement | null;
  leftBeam: SVGElement | null;
  rightBeam: SVGElement | null;
  floorGlow: SVGElement | null;
  titleClip?: SVGElement | null;
  titleText?: SVGElement | null;
  titleTargetWidth?: number | (() => number);
  titleSpotClip?: SVGElement | null;
  titleLightClip?: SVGElement | null;
  titleSpotText?: SVGElement | null;
  titleLightText?: SVGElement | null;
  titleStreaks: SVGElement[] | SVGElement | null;
  ambientAccents: SVGElement | null;
}

export interface SpotlightTimelineOptions {
  onComplete?: () => void;
}

/**
 * Creates and returns the master GSAP timeline for the Spotlight event overlay.
 *
 * Sequence:
 * 1. ENTRANCE (0 -> ~0.4s)
 * 2. DIVERGE (~0.4s -> ~1.1s)
 * 3. CONVERGE (~1.1s -> ~1.9s)
 * 4. TITLE REVEAL (~1.9s -> ~2.6s)
 * 5. HOLD (~2.6s -> ~3.4s)
 * 6. EXIT (~3.4s -> ~4.0s)
 */
export function createSpotlightTimeline(
  targets: SpotlightTimelineTargets,
  options: SpotlightTimelineOptions = {}
): gsap.core.Timeline {
  const { onComplete } = options;

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      onComplete?.();
    },
  });

  const {
    container,
    vignette,
    grain,
    flash,
    skipButton,
    leftFixtureGroup,
    rightFixtureGroup,
    leftBeam,
    rightBeam,
    floorGlow,
    titleClip,
    titleText,
    titleTargetWidth,
    titleSpotClip,
    titleLightClip,
    titleSpotText,
    titleLightText,
    titleStreaks,
    ambientAccents,
  } = targets;

  // Initial State Setup
  if (container) gsap.set(container, { opacity: 0 });
  if (vignette) gsap.set(vignette, { opacity: 0 });
  if (grain) gsap.set(grain, { opacity: 0 });
  if (flash) gsap.set(flash, { opacity: 0 });
  if (skipButton) gsap.set(skipButton, { opacity: 0, pointerEvents: "none" });

  if (leftFixtureGroup) {
    gsap.set(leftFixtureGroup, {
      opacity: 0,
      scale: 0.85,
      rotation: 0,
      svgOrigin: "240 140",
      transformOrigin: "240px 140px",
    });
  }
  if (rightFixtureGroup) {
    gsap.set(rightFixtureGroup, {
      opacity: 0,
      scale: 0.85,
      rotation: 0,
      svgOrigin: "1680 140",
      transformOrigin: "1680px 140px",
    });
  }

  if (leftBeam) {
    gsap.set(leftBeam, {
      opacity: 0,
      scaleY: 0,
      svgOrigin: "240 140",
      transformOrigin: "240px 140px",
    });
  }
  if (rightBeam) {
    gsap.set(rightBeam, {
      opacity: 0,
      scaleY: 0,
      svgOrigin: "1680 140",
      transformOrigin: "1680px 140px",
    });
  }

  if (floorGlow) {
    gsap.set(floorGlow, {
      opacity: 0,
      scale: 0.7,
      svgOrigin: "960 920",
      transformOrigin: "960px 920px",
    });
  }

  if (titleClip) {
    gsap.set(titleClip, { attr: { width: 0 } });
  }
  if (titleSpotClip) {
    gsap.set(titleSpotClip, { attr: { width: 0 } });
  }
  if (titleLightClip) {
    gsap.set(titleLightClip, { attr: { width: 0 } });
  }
  if (titleText) {
    gsap.set(titleText, { opacity: 1 });
  }
  if (titleSpotText) {
    gsap.set(titleSpotText, { opacity: 1 });
  }
  if (titleLightText) {
    gsap.set(titleLightText, { opacity: 1 });
  }

  if (titleStreaks) {
    gsap.set(titleStreaks, {
      strokeDasharray: 200,
      strokeDashoffset: 200,
      opacity: 0,
    });
  }

  if (ambientAccents) {
    gsap.set(ambientAccents, { opacity: 0 });
  }

  // ==========================================
  // 1. ENTRANCE (0 -> ~0.4s)
  // ==========================================
  tl.addLabel("entrance", 0);

  if (container) {
    tl.to(container, { opacity: 1, duration: 0.35, ease: "power1.out" }, "entrance");
  }
  if (vignette) {
    tl.to(vignette, { opacity: 1, duration: 0.4, ease: "power1.out" }, "entrance");
  }
  if (grain) {
    tl.to(grain, { opacity: 0.22, duration: 0.4, ease: "power1.out" }, "entrance");
  }
  if (skipButton) {
    tl.to(skipButton, { opacity: 1, pointerEvents: "auto", duration: 0.3, ease: "power1.out" }, "entrance+=0.15");
  }

  if (leftFixtureGroup) {
    tl.to(
      leftFixtureGroup,
      { opacity: 0.85, scale: 1, duration: 0.38, ease: "back.out(1.2)" },
      "entrance+=0.05"
    );
  }
  if (rightFixtureGroup) {
    tl.to(
      rightFixtureGroup,
      { opacity: 0.85, scale: 1, duration: 0.38, ease: "back.out(1.2)" },
      "entrance+=0.08"
    );
  }

  // ==========================================
  // 2. DIVERGE (~0.4s -> ~1.1s)
  // Cones expand outward & rotate AWAY from center (searching)
  // ==========================================
  tl.addLabel("diverge", 0.4);

  if (leftBeam && leftFixtureGroup) {
    // Left beam sweeps left/outward (positive angle)
    tl.to(
      leftBeam,
      { scaleY: 1, opacity: 0.88, duration: 0.65, ease: "power2.out" },
      "diverge"
    ).to(
      leftFixtureGroup,
      { rotation: 22, duration: 0.68, ease: "power2.out" },
      "diverge"
    );
  }

  if (rightBeam && rightFixtureGroup) {
    // Right beam sweeps right/outward (negative angle), offset by 0.08s for natural asymmetry
    tl.to(
      rightBeam,
      { scaleY: 1, opacity: 0.88, duration: 0.65, ease: "power2.out" },
      "diverge+=0.08"
    ).to(
      rightFixtureGroup,
      { rotation: -22, duration: 0.68, ease: "power2.out" },
      "diverge+=0.08"
    );
  }

  // ==========================================
  // 3. CONVERGE (~1.1s -> ~1.9s)
  // Both beams rotate back inward into iconic V overlap
  // ==========================================
  tl.addLabel("converge", 1.1);

  if (leftFixtureGroup) {
    // Left sweeps inward toward center (negative angle: -38 deg)
    tl.to(
      leftFixtureGroup,
      { rotation: -38, duration: 0.78, ease: "power3.inOut" },
      "converge"
    );
  }

  if (rightFixtureGroup) {
    // Right sweeps inward toward center (positive angle: +38 deg)
    tl.to(
      rightFixtureGroup,
      { rotation: 38, duration: 0.78, ease: "power3.inOut" },
      "converge"
    );
  }

  // Floor light-pool glow begins fading in during the last 30% of converge (~1.65s)
  if (floorGlow) {
    tl.to(
      floorGlow,
      { opacity: 1, scale: 1, duration: 0.28, ease: "power2.out" },
      1.65
    );
  }

  // Moment of full overlap (~1.9s): Convergence Hit Flash
  tl.addLabel("convergenceHit", 1.9);

  if (flash) {
    tl.to(
      flash,
      { opacity: 0.35, duration: 0.07, ease: "power1.in" },
      "convergenceHit"
    ).to(
      flash,
      { opacity: 0, duration: 0.12, ease: "power2.out" }
    );
  }

  // ==========================================
  // 4. TITLE REVEAL (~1.9s -> ~2.6s)
  // Illuminated wipe reveal right at convergence hit
  // ==========================================
  tl.addLabel("titleReveal", 1.92);

  if (titleClip) {
    const getWipeWidth = () => {
      if (typeof titleTargetWidth === "function") {
        return titleTargetWidth();
      }
      if (typeof titleTargetWidth === "number" && titleTargetWidth > 0) {
        return titleTargetWidth;
      }
      return 1650;
    };

    tl.to(
      titleClip,
      {
        attr: { width: () => getWipeWidth() },
        duration: 0.52,
        ease: "power2.out",
      },
      "titleReveal"
    );
  } else {
    if (titleSpotClip) {
      tl.to(
        titleSpotClip,
        { attr: { width: 750 }, duration: 0.42, ease: "power2.out" },
        "titleReveal"
      );
    }

    if (titleLightClip) {
      tl.to(
        titleLightClip,
        { attr: { width: 850 }, duration: 0.42, ease: "power2.out" },
        "titleReveal+=0.1"
      );
    }
  }

  // Blue diagonal streak draw-on immediately after words are in
  if (titleStreaks) {
    tl.to(
      titleStreaks,
      {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 0.22,
        ease: "power2.out",
      },
      "titleReveal+=0.38"
    );
  }

  // Ambient swoosh paths and star sparkles fade in softly
  if (ambientAccents) {
    tl.to(
      ambientAccents,
      { opacity: 0.65, duration: 0.5, ease: "power1.out" },
      "titleReveal+=0.15"
    );
  }

  // ==========================================
  // 5. HOLD (~2.6s -> ~3.4s)
  // Subtle idle breathing motion
  // ==========================================
  tl.addLabel("hold", 2.6);

  if (floorGlow) {
    tl.to(
      floorGlow,
      {
        scale: 1.03,
        opacity: 0.95,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      },
      "hold"
    );
  }

  if (leftBeam && rightBeam) {
    tl.to(
      [leftBeam, rightBeam],
      {
        opacity: 0.9,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      },
      "hold"
    );
  }

  // ==========================================
  // 6. EXIT (~3.4s -> ~4.0s)
  // Reverse-feeling exit uncovering the website
  // ==========================================
  tl.addLabel("exitPhase", 3.4);

  // Fast title & accent fade out
  const textTargets = [titleText, titleSpotText, titleLightText].filter(Boolean) as SVGElement[];
  if (textTargets.length > 0) {
    tl.to(
      textTargets,
      { opacity: 0, duration: 0.15, ease: "power2.in" },
      "exitPhase"
    );
  }
  if (titleStreaks) {
    tl.to(titleStreaks, { opacity: 0, duration: 0.12, ease: "power2.in" }, "exitPhase");
  }
  if (ambientAccents) {
    tl.to(ambientAccents, { opacity: 0, duration: 0.15, ease: "power2.in" }, "exitPhase");
  }
  if (skipButton) {
    tl.to(skipButton, { opacity: 0, duration: 0.12, ease: "power2.in" }, "exitPhase");
  }

  // Cones swing outward and shrink toward fixtures
  if (leftBeam && leftFixtureGroup) {
    tl.to(
      leftBeam,
      { scaleY: 0, opacity: 0, duration: 0.32, ease: "power2.in" },
      "exitPhase+=0.1"
    ).to(
      leftFixtureGroup,
      { rotation: 15, opacity: 0, duration: 0.35, ease: "power2.in" },
      "exitPhase+=0.1"
    );
  }

  if (rightBeam && rightFixtureGroup) {
    tl.to(
      rightBeam,
      { scaleY: 0, opacity: 0, duration: 0.32, ease: "power2.in" },
      "exitPhase+=0.1"
    ).to(
      rightFixtureGroup,
      { rotation: -15, opacity: 0, duration: 0.35, ease: "power2.in" },
      "exitPhase+=0.1"
    );
  }

  if (floorGlow) {
    tl.to(
      floorGlow,
      { opacity: 0, scale: 0.8, duration: 0.25, ease: "power2.in" },
      "exitPhase+=0.1"
    );
  }

  // Background overlay and vignette fade out last
  if (vignette) {
    tl.to(vignette, { opacity: 0, duration: 0.25, ease: "power2.in" }, "exitPhase+=0.2");
  }
  if (grain) {
    tl.to(grain, { opacity: 0, duration: 0.25, ease: "power2.in" }, "exitPhase+=0.2");
  }
  if (container) {
    tl.to(
      container,
      { opacity: 0, duration: 0.28, ease: "power2.in" },
      "exitPhase+=0.22"
    );
  }

  return tl;
}

/**
 * Triggers clean jump to exit phase if dismiss/skip is signaled.
 */
export function skipSpotlightTimelineToExit(tl: gsap.core.Timeline | null) {
  if (!tl) return;
  // If not already in or past the exit phase, seek to exitPhase and play out smoothly
  if (tl.time() < tl.labels.exitPhase) {
    tl.seek("exitPhase");
  }
}
