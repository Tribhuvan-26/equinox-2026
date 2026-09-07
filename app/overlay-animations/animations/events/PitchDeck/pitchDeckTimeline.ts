// app/overlay-animations/animations/events/PitchDeck/pitchDeckTimeline.ts
import gsap from "gsap";

export interface PitchDeckSceneTargets {
  container: HTMLElement | null;
  stageFrame: HTMLElement | null;
  skipButton: HTMLElement | null;

  // Header & Venue branding
  headerText: SVGElement | null;
  dateVenueText: SVGElement | null;

  // Ceiling lamps & beams
  lampLeftGroup: SVGElement | null;
  lampRightGroup: SVGElement | null;
  lightBeamLeft: SVGElement | null;
  lightBeamRight: SVGElement | null;

  // Side Banners
  leftBanner: SVGElement | null;
  rightBanner: SVGElement | null;

  // Potted plants
  plantLeft: SVGElement | null;
  plantRight: SVGElement | null;

  // Podium text
  podiumText: SVGElement | null;

  // Projector screen structure
  screenFrameGroup: SVGElement | null;
  screenWeightBar: SVGElement | null;
  screenSurface: SVGElement | null;
  screenContentGroup: SVGElement | null;

  // PPT elements (left side)
  dividerLine: SVGLineElement | null;
  pitchTitle: SVGTextElement | null;
  deckTitle: SVGTextElement | null;
  taglineBlock: SVGElement | null;

  // Bar chart (right side top)
  chartAxis: SVGLineElement | null;
  chartBars: SVGElement[];
  chartArrow: SVGPathElement | null;
  chartArrowHead: SVGPolygonElement | null;
  chartBadge: SVGElement | null;

  // Icon rows (right side bottom)
  iconRow1: SVGElement | null;
  iconRow2: SVGElement | null;
  iconRow3: SVGElement | null;
}

export interface PitchDeckTimelineOptions {
  onEntranceComplete?: () => void;
  onComplete?: () => void;
}

export function createPitchDeckMasterTl(
  t: PitchDeckSceneTargets,
  options: PitchDeckTimelineOptions = {}
): gsap.core.Timeline {
  const { onEntranceComplete, onComplete } = options;

  // ── Initial setup ──────────────────────────────────────────────────────────
  if (t.container) gsap.set(t.container, { opacity: 0 });
  if (t.stageFrame) gsap.set(t.stageFrame, { opacity: 0, scale: 0.97 });
  if (t.skipButton) gsap.set(t.skipButton, { opacity: 0, pointerEvents: "none" });

  // Header & Date/Venue
  if (t.headerText) gsap.set(t.headerText, { opacity: 0, y: -8 });
  if (t.dateVenueText) gsap.set(t.dateVenueText, { opacity: 0, y: -8 });

  // Ceiling lamps & light beams
  if (t.lampLeftGroup) gsap.set(t.lampLeftGroup, { opacity: 0, y: -24 });
  if (t.lampRightGroup) gsap.set(t.lampRightGroup, { opacity: 0, y: -24 });
  if (t.lightBeamLeft) gsap.set(t.lightBeamLeft, { opacity: 0 });
  if (t.lightBeamRight) gsap.set(t.lightBeamRight, { opacity: 0 });

  // Side banners & plants
  if (t.leftBanner) gsap.set(t.leftBanner, { opacity: 0, scaleY: 0, transformOrigin: "top center" });
  if (t.rightBanner) gsap.set(t.rightBanner, { opacity: 0, scaleY: 0, transformOrigin: "top center" });
  if (t.plantLeft) gsap.set(t.plantLeft, { opacity: 0, scale: 0.85, transformOrigin: "center bottom" });
  if (t.plantRight) gsap.set(t.plantRight, { opacity: 0, scale: 0.85, transformOrigin: "center bottom" });

  // Podium text
  if (t.podiumText) gsap.set(t.podiumText, { opacity: 0, y: 6 });

  // Screen frame and weight bar
  if (t.screenFrameGroup) gsap.set(t.screenFrameGroup, { opacity: 0, y: -10 });
  if (t.screenWeightBar) {
    // Start retracted at top edge of screen (y = -270px relative to resting y=369px)
    gsap.set(t.screenWeightBar, { y: -270, opacity: 0 });
  }

  // Screen surface starts collapsed at top edge (y = 99px in 1024x576)
  if (t.screenSurface) {
    gsap.set(t.screenSurface, {
      scaleY: 0,
      transformOrigin: "296px 99px",
      opacity: 0,
    });
  }

  // Entire PPT content inside screen starts clipped / hidden
  if (t.screenContentGroup) gsap.set(t.screenContentGroup, { opacity: 1 });

  // Divider line initially hidden via strokeDashoffset
  const dividerLen = 240;
  if (t.dividerLine) {
    gsap.set(t.dividerLine, {
      strokeDasharray: dividerLen,
      strokeDashoffset: dividerLen,
    });
  }

  // Titles & tagline
  if (t.pitchTitle) gsap.set(t.pitchTitle, { opacity: 0, y: -14 });
  if (t.deckTitle) gsap.set(t.deckTitle, { opacity: 0, y: -14 });
  if (t.taglineBlock) gsap.set(t.taglineBlock, { opacity: 0, x: -10 });

  // Chart axis & bars
  const axisLen = 200;
  if (t.chartAxis) {
    gsap.set(t.chartAxis, {
      strokeDasharray: axisLen,
      strokeDashoffset: axisLen,
    });
  }

  t.chartBars.forEach((bar) => {
    if (bar) {
      gsap.set(bar, {
        scaleY: 0,
        transformOrigin: "bottom",
      });
    }
  });

  // Chart arrow & badge
  const arrowLen = 180;
  if (t.chartArrow) {
    gsap.set(t.chartArrow, {
      strokeDasharray: arrowLen,
      strokeDashoffset: arrowLen,
    });
  }
  if (t.chartArrowHead) gsap.set(t.chartArrowHead, { scale: 0, opacity: 0, transformOrigin: "662px 99px" });
  if (t.chartBadge) gsap.set(t.chartBadge, { scale: 0, opacity: 0, transformOrigin: "683px 114px" });

  // 3 Icon rows
  [t.iconRow1, t.iconRow2, t.iconRow3].forEach((row) => {
    if (row) gsap.set(row, { opacity: 0, scale: 0.88, transformOrigin: "528px center" });
  });

  // ── Build Timeline ─────────────────────────────────────────────────────────
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      onComplete?.();
    },
  });

  // 1. ENTRANCE (0 → ~0.6s): Base scene reveals, surroundings build in
  tl.to(t.container, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0);
  tl.to(t.stageFrame, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 0.05);
  tl.to(t.skipButton, { opacity: 1, pointerEvents: "auto", duration: 0.25 }, 0.2);

  // Header and venue branding
  if (t.headerText) tl.to(t.headerText, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.1);
  if (t.dateVenueText) tl.to(t.dateVenueText, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.1);

  // Lamps drop from ceiling
  if (t.lampLeftGroup) tl.to(t.lampLeftGroup, { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" }, 0.08);
  if (t.lampRightGroup) tl.to(t.lampRightGroup, { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" }, 0.12);
  if (t.lightBeamLeft) tl.to(t.lightBeamLeft, { opacity: 0.22, duration: 0.5 }, 0.2);
  if (t.lightBeamRight) tl.to(t.lightBeamRight, { opacity: 0.22, duration: 0.5 }, 0.24);

  // Side banners drop down
  if (t.leftBanner) tl.to(t.leftBanner, { opacity: 1, scaleY: 1, duration: 0.45, ease: "power2.out" }, 0.14);
  if (t.rightBanner) tl.to(t.rightBanner, { opacity: 1, scaleY: 1, duration: 0.45, ease: "power2.out" }, 0.18);

  // Plants & podium text pop in
  if (t.plantLeft) tl.to(t.plantLeft, { opacity: 1, scale: 1, duration: 0.38, ease: "back.out(1.3)" }, 0.22);
  if (t.plantRight) tl.to(t.plantRight, { opacity: 1, scale: 1, duration: 0.38, ease: "back.out(1.3)" }, 0.26);
  if (t.podiumText) tl.to(t.podiumText, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.25);

  // Screen frame drops in
  if (t.screenFrameGroup) tl.to(t.screenFrameGroup, { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" }, 0.2);

  // 2. SCREEN DROPS (~0.6s → ~1.3s)
  // Physical unrolling downward with overshoot and bounce settle
  if (t.screenSurface) {
    tl.to(t.screenSurface, { opacity: 1, duration: 0.05 }, 0.6);
    tl.to(
      t.screenSurface,
      {
        scaleY: 1.025,
        duration: 0.52,
        ease: "power2.out",
      },
      0.6
    );
    tl.to(
      t.screenSurface,
      {
        scaleY: 1.0,
        duration: 0.16,
        ease: "power1.inOut",
      },
      1.12
    );
  }

  // Bottom weight bar travels down in sync with screen surface
  if (t.screenWeightBar) {
    tl.to(t.screenWeightBar, { opacity: 1, duration: 0.05 }, 0.6);
    tl.to(
      t.screenWeightBar,
      {
        y: 6.75, // slight overshoot corresponding to 1.025 * 270 = 276.75
        duration: 0.52,
        ease: "power2.out",
      },
      0.6
    );
    tl.to(
      t.screenWeightBar,
      {
        y: 0,
        duration: 0.16,
        ease: "power1.inOut",
      },
      1.12
    );
  }

  // 3. CONTENT BUILDS IN — PPT STYLE (~1.3s → ~2.6s), strictly staggered
  // a. Divider line draws on
  if (t.dividerLine) {
    tl.to(
      t.dividerLine,
      {
        strokeDashoffset: 0,
        duration: 0.28,
        ease: "power2.out",
      },
      1.32
    );
  }

  // b. "PITCH" drops/wipes in
  if (t.pitchTitle) {
    tl.to(
      t.pitchTitle,
      {
        opacity: 1,
        y: 0,
        duration: 0.24,
        ease: "back.out(1.4)",
      },
      1.42
    );
  }

  // c. "DECK" drops/wipes in (~0.1s after PITCH)
  if (t.deckTitle) {
    tl.to(
      t.deckTitle,
      {
        opacity: 1,
        y: 0,
        duration: 0.24,
        ease: "back.out(1.4)",
      },
      1.52
    );
  }

  // d. Tagline fades/wipes in beneath
  if (t.taglineBlock) {
    tl.to(
      t.taglineBlock,
      {
        opacity: 1,
        x: 0,
        duration: 0.25,
        ease: "power2.out",
      },
      1.64
    );
  }

  // e. Bar chart baseline & bars grow up one at a time (left to right, staggered 0.08s)
  if (t.chartAxis) {
    tl.to(
      t.chartAxis,
      {
        strokeDashoffset: 0,
        duration: 0.2,
        ease: "power2.out",
      },
      1.75
    );
  }

  t.chartBars.forEach((bar, index) => {
    if (bar) {
      tl.to(
        bar,
        {
          scaleY: 1,
          duration: 0.22,
          ease: "back.out(1.2)",
        },
        1.82 + index * 0.08
      );
    }
  });

  // f. Arrow line draws across the top of the bars once they have finished
  const arrowStartTime = 1.82 + t.chartBars.length * 0.08 + 0.04;
  if (t.chartArrow) {
    tl.to(
      t.chartArrow,
      {
        strokeDashoffset: 0,
        duration: 0.28,
        ease: "power2.out",
      },
      arrowStartTime
    );
  }
  if (t.chartArrowHead) {
    tl.to(
      t.chartArrowHead,
      {
        scale: 1,
        opacity: 1,
        duration: 0.16,
        ease: "back.out(1.6)",
      },
      arrowStartTime + 0.22
    );
  }
  if (t.chartBadge) {
    tl.to(
      t.chartBadge,
      {
        scale: 1,
        opacity: 1,
        duration: 0.18,
        ease: "back.out(1.5)",
      },
      arrowStartTime + 0.26
    );
  }

  // g. 3 icon rows pop in one at a time, top to bottom (staggered ~0.1s each)
  const iconStartTime = arrowStartTime + 0.28;
  if (t.iconRow1) {
    tl.to(
      t.iconRow1,
      {
        opacity: 1,
        scale: 1,
        duration: 0.22,
        ease: "back.out(1.4)",
      },
      iconStartTime
    );
  }
  if (t.iconRow2) {
    tl.to(
      t.iconRow2,
      {
        opacity: 1,
        scale: 1,
        duration: 0.22,
        ease: "back.out(1.4)",
      },
      iconStartTime + 0.1
    );
  }
  if (t.iconRow3) {
    tl.to(
      t.iconRow3,
      {
        opacity: 1,
        scale: 1,
        duration: 0.22,
        ease: "back.out(1.4)",
      },
      iconStartTime + 0.2
    );
  }

  // 4. RESOLUTION / HOLD (~2.6s → ~3.6s)
  const entranceEndTime = iconStartTime + 0.28;
  tl.call(() => {
    onEntranceComplete?.();
  }, undefined, entranceEndTime);

  // 5. EXIT (~3.6s → ~4.1s)
  // Simple clean fade out — all SVG content and base image fade together
  tl.to(
    t.container,
    {
      opacity: 0,
      duration: 0.45,
      ease: "power2.in",
    },
    3.6
  );

  return tl;
}

export function startPitchDeckIdleLoops(
  targets: Pick<PitchDeckSceneTargets, "lightBeamLeft" | "lightBeamRight" | "chartArrowHead">
): gsap.core.Tween[] {
  const loops: gsap.core.Tween[] = [];

  if (targets.lightBeamLeft) {
    loops.push(
      gsap.to(targets.lightBeamLeft, {
        opacity: 0.28,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );
  }

  if (targets.lightBeamRight) {
    loops.push(
      gsap.to(targets.lightBeamRight, {
        opacity: 0.28,
        duration: 2.4,
        delay: 0.3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );
  }

  if (targets.chartArrowHead) {
    loops.push(
      gsap.to(targets.chartArrowHead, {
        scale: 1.15,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );
  }

  return loops;
}

export function runPitchDeckExit(
  container: HTMLElement | null,
  idleLoops: gsap.core.Tween[],
  onComplete?: () => void
): void {
  idleLoops.forEach((tw) => tw.kill());

  if (!container) {
    onComplete?.();
    return;
  }

  gsap.to(container, {
    opacity: 0,
    duration: 0.28,
    ease: "power2.in",
    onComplete: () => {
      onComplete?.();
    },
  });
}

