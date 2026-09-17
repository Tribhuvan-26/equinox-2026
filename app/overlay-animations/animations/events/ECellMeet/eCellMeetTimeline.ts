// app/overlay-animations/animations/events/ECellMeet/eCellMeetTimeline.ts
import gsap from "gsap";

export interface ECellMeetTimelineTargets {
  container: HTMLElement | null;
  skipButton?: HTMLElement | null;
  svg?: SVGSVGElement | null;
}

export interface ECellMeetTimelineOptions {
  onComplete?: () => void;
  loop?: boolean;
}

/**
 * Master GSAP timeline for "The E-CELL Meet" Animation.
 *
 * Requirements & Constraints:
 * 1. Title ("THE E-CELL MEET" & Rocket):
 *    - Clean, authentic artwork with smooth entrance and elegant hover motion.
 *    - NO artificial rays, speed lines, or flame glowing blobs behind the title.
 * 2. Top-Left Hanging Banner ("DIFFERENT COLLEGES / SAME VISION"):
 *    - Physical pendulum sway swinging naturally from suspension string hooks (transformOrigin: 192.5px 0px).
 *    - Clean animated text reveal and synchronized subtle text dynamics inside it.
 * 3. Booth/Stall Desk Signage ("IDEAS / NETWORK / GROW"):
 *    - All 3 words animated cleanly in text with sequential reveal.
 *    - NO blurry drop-shadow filter or scale distortion on GROW.
 * 4. Right-Side Banner ("E-CELL" + 4 circular icons):
 *    - E-CELL heading reveals and green underline draws in.
 *    - 4 circular icon badges pop in sequentially with an elastic bounce, then sit still.
 * 5. 100% Static & Frozen:
 *    - Foreground characters (students exchanging card): 100% static.
 *    - Corner foliage and plants: 100% static.
 *    - Booth structure, seamless canopy roof, laptop, background: 100% static.
 */
export function createECellMeetTimeline(
  targets: ECellMeetTimelineTargets,
  options: ECellMeetTimelineOptions = {}
): gsap.core.Timeline {
  const { onComplete, loop = false } = options;
  const { container, skipButton } = targets;

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      onComplete?.();
    },
  });

  if (!container) return tl;

  // Accessibility: prefers-reduced-motion check
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    gsap.set(container, { opacity: 0 });
    if (skipButton) gsap.set(skipButton, { opacity: 1, pointerEvents: "auto" });

    tl.to(container, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
    tl.addLabel("settled", 0.35);
    tl.addLabel("exit", 3.7);
    tl.to(container, { opacity: 0, duration: 0.35, ease: "power1.in" }, "exit");
    return tl;
  }

  const q = gsap.utils.selector(container);

  // Target element selectors
  const elBase = q("#layer-base-scene");
  const elTitleMain = q("#ecell-title-main");
  const elRocketContainer = q("#ecell-rocket-container");

  const elLeftBanner = q("#left-hanging-banner");
  const elHangingDiffColleges = q("#hanging-info-different-colleges");
  const elHangingSameVision = q("#hanging-info-same-vision");
  const elHangingLine = q("#hanging-info-line");

  const elBoardHeader = q("#board-info-header");
  const elBoardUnderline = q("#board-header-underline");
  const elBoardIdeas = q("#board-info-ideas");
  const elBoardNetwork = q("#board-info-network");
  const elBoardCollaborate = q("#board-info-collaborate");
  const elBoardGrow = q("#board-info-grow");

  const elStallIdeas = q("#stall-info-ideas");
  const elStallNetwork = q("#stall-info-network");
  const elStallGrow = q("#stall-info-grow");
  const elStallGrowLine = q("#stall-info-grow-line");

  // =========================================================================
  // 1. INITIAL RESTING / HIDDEN STATES (t = 0.0s)
  // =========================================================================

  gsap.set(container, { opacity: 1 });

  // Base scene (people, plants, canopy, booth, background) is strictly 100% static
  gsap.set(elBase, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  });

  // Skip button initial state
  if (skipButton) {
    gsap.set(skipButton, { opacity: 0, y: -8, pointerEvents: "none" });
  }

  // 1. Main Title & Rocket: Clean artwork, starts slightly offset
  gsap.set(elTitleMain, {
    opacity: 0,
    y: 22,
    scale: 0.95,
    transformOrigin: "822.5px 247.5px",
  });
  gsap.set(elRocketContainer, {
    opacity: 0,
    y: 26,
    scale: 0.94,
    transformOrigin: "1150px 175px",
  });

  // 2. Left Hanging Banner: Suspended from string hooks
  gsap.set(elLeftBanner, {
    opacity: 0,
    y: -24,
    rotation: -3.5,
    transformOrigin: "192.5px 0px",
  });
  gsap.set(elHangingDiffColleges, { opacity: 0, y: -10 });
  gsap.set(elHangingSameVision, { opacity: 0, scale: 0.88, y: 6, transformOrigin: "150px 250px" });
  gsap.set(elHangingLine, { opacity: 0, scaleX: 0, transformOrigin: "110px 305px" });

  // 3. Right Banner: Header, drawing line, and cascading circular icons
  gsap.set(elBoardHeader, { opacity: 0, y: -12 });
  gsap.set(elBoardUnderline, { scaleX: 0, transformOrigin: "1325px 372px" });
  gsap.set(elBoardIdeas, { opacity: 0, scale: 0.6, x: 25, transformOrigin: "1340px 425px" });
  gsap.set(elBoardNetwork, { opacity: 0, scale: 0.6, x: 25, transformOrigin: "1340px 510px" });
  gsap.set(elBoardCollaborate, { opacity: 0, scale: 0.6, x: 25, transformOrigin: "1340px 595px" });
  gsap.set(elBoardGrow, { opacity: 0, scale: 0.6, x: 25, transformOrigin: "1340px 680px" });

  // 4. Stall Desk Info: Clean 3-word text initial state
  gsap.set(elStallIdeas, { opacity: 0, y: 8 });
  gsap.set(elStallNetwork, { opacity: 0, y: 8 });
  gsap.set(elStallGrow, { opacity: 0, y: 8 });
  if (elStallGrowLine) {
    gsap.set(elStallGrowLine, { scaleX: 0, transformOrigin: "265px 808px" });
  }

  // =========================================================================
  // 2. CHOREOGRAPHED ENTRANCE TIMELINE (0.0s – 1.6s)
  // =========================================================================

  // Skip button reveal
  if (skipButton) {
    tl.to(
      skipButton,
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
        onStart: () => {
          gsap.set(skipButton, { pointerEvents: "auto" });
        },
      },
      0.15
    );
  }

  // -------------------------------------------------------------------------
  // PHASE 1: MAIN TITLE & ROCKET CLEAN ENTRANCE (0.10s – 0.65s)
  // Clean, confident emergence with NO artificial rays behind the letters
  // -------------------------------------------------------------------------
  tl.to(
    elTitleMain,
    {
      opacity: 1,
      y: 0,
      scale: 1.0,
      duration: 0.55,
      ease: "power2.out",
    },
    0.10
  );

  tl.to(
    elRocketContainer,
    {
      opacity: 1,
      y: 0,
      scale: 1.0,
      duration: 0.58,
      ease: "power2.out",
    },
    0.12
  );

  // -------------------------------------------------------------------------
  // PHASE 2: LEFT HANGING BANNER PENDULUM SWAY & TEXT REVEAL (0.18s – 1.15s)
  // Hanging banner sways naturally from string hooks and text animates inside
  // -------------------------------------------------------------------------
  tl.to(
    elLeftBanner,
    {
      opacity: 1,
      y: 0,
      rotation: 3.0,
      duration: 0.55,
      ease: "power2.out",
    },
    0.18
  );

  tl.to(
    elLeftBanner,
    {
      rotation: -1.4,
      duration: 0.42,
      ease: "sine.inOut",
    },
    0.73
  );

  tl.to(
    elLeftBanner,
    {
      rotation: 0,
      duration: 0.32,
      ease: "sine.out",
    },
    1.15
  );

  // Animate text inside the hanging banner
  tl.to(
    elHangingDiffColleges,
    {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: "power2.out",
    },
    0.38
  );

  tl.to(
    elHangingSameVision,
    {
      opacity: 1,
      y: 0,
      scale: 1.0,
      duration: 0.40,
      ease: "back.out(1.5)",
    },
    0.54
  );

  tl.to(
    elHangingLine,
    {
      opacity: 1,
      scaleX: 1.0,
      duration: 0.32,
      ease: "power2.out",
    },
    0.72
  );

  // -------------------------------------------------------------------------
  // PHASE 3: RIGHT SIDE BANNER ("E-CELL" + 4 CIRCULAR ICONS POP IN)
  // -------------------------------------------------------------------------
  tl.to(
    elBoardHeader,
    {
      opacity: 1,
      y: 0,
      duration: 0.30,
      ease: "power2.out",
    },
    0.45
  );

  tl.to(
    elBoardUnderline,
    {
      scaleX: 1.0,
      duration: 0.35,
      ease: "power2.out",
    },
    0.55
  );

  // 4 Circular icon badges pop in one after another with elastic bounce
  tl.to(
    elBoardIdeas,
    {
      opacity: 1,
      scale: 1.0,
      x: 0,
      duration: 0.38,
      ease: "back.out(1.7)",
    },
    0.68
  );

  tl.to(
    elBoardNetwork,
    {
      opacity: 1,
      scale: 1.0,
      x: 0,
      duration: 0.38,
      ease: "back.out(1.7)",
    },
    0.84
  );

  tl.to(
    elBoardCollaborate,
    {
      opacity: 1,
      scale: 1.0,
      x: 0,
      duration: 0.38,
      ease: "back.out(1.7)",
    },
    1.00
  );

  tl.to(
    elBoardGrow,
    {
      opacity: 1,
      scale: 1.0,
      x: 0,
      duration: 0.38,
      ease: "back.out(1.7)",
    },
    1.16
  );

  // -------------------------------------------------------------------------
  // PHASE 4: STALL DESK INFO - 3 WORDS CLEAN TEXT ANIMATION (0.75s – 1.40s)
  // Sequential clean reveal: IDEAS -> NETWORK -> GROW (no drop shadow filter)
  // -------------------------------------------------------------------------
  tl.to(
    elStallIdeas,
    {
      opacity: 1,
      y: 0,
      duration: 0.30,
      ease: "power2.out",
    },
    0.75
  );

  tl.to(
    elStallNetwork,
    {
      opacity: 1,
      y: 0,
      duration: 0.30,
      ease: "power2.out",
    },
    0.95
  );

  tl.to(
    elStallGrow,
    {
      opacity: 1,
      y: 0,
      duration: 0.32,
      ease: "power2.out",
    },
    1.15
  );

  if (elStallGrowLine) {
    tl.to(
      elStallGrowLine,
      {
        scaleX: 1.0,
        duration: 0.30,
        ease: "power2.out",
      },
      1.22
    );
  }

  // =========================================================================
  // 3. CONTINUOUS LIVING LOOPS (At t = 1.45s)
  // - Title: Smooth, subtle hover float (clean, professional, zero rays)
  // - Hanging sign: Gentle physical pendulum sway from string hooks
  // - Hanging text: Subtle breathing illumination synchronized to sway
  // - Stall text: Clean sequential text highlight across all 3 words
  // =========================================================================
  tl.add(() => {
    // 1. Title & Rocket subtle hover float
    gsap.to([elTitleMain, elRocketContainer], {
      y: -5,
      duration: 2.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // 2. Left hanging banner continuous pendulum sway from hooks
    gsap.to(elLeftBanner, {
      rotation: 1.8,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "192.5px 0px",
    });

    // 3. Text inside hanging banner subtle breathing highlight
    gsap.to(elHangingSameVision, {
      opacity: 0.90,
      duration: 1.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // 4. Stall desk 3-word clean text animation loop
    // Staggered subtle luminance wave across IDEAS -> NETWORK -> GROW
    const stallWordsTl = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });
    stallWordsTl
      .to(elStallIdeas, { opacity: 0.65, duration: 0.35, yoyo: true, repeat: 1, ease: "power1.inOut" })
      .to(elStallNetwork, { opacity: 0.65, duration: 0.35, yoyo: true, repeat: 1, ease: "power1.inOut" }, "-=0.1")
      .to(elStallGrow, { opacity: 0.75, duration: 0.35, yoyo: true, repeat: 1, ease: "power1.inOut" }, "-=0.1");
  }, 1.45);

  // Settle milestone
  tl.addLabel("settled", 1.60);

  if (!loop) {
    tl.addLabel("hold", 3.80);
    tl.addLabel("exit", 5.00);

    tl.to(
      container,
      {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      },
      "exit"
    );
  }

  return tl;
}

/**
 * Fast-forwards the timeline directly to exit on user skip / dismiss.
 */
export function skipECellMeetTimelineToExit(
  tl: gsap.core.Timeline | null
): void {
  if (!tl) return;
  const exitTime = tl.labels["exit"] ?? 4.0;
  if (tl.time() < exitTime) {
    tl.tweenTo(exitTime, {
      duration: 0.22,
      ease: "power2.in",
      overwrite: "auto",
    });
  } else {
    tl.progress(1);
  }
}
