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
 * User Specifications & Constraints:
 * 1. Base Scene: Single unified static illustration (people 100% untouched,
 *    card 100% untouched, plants 100% untouched, booth and background 100% static).
 * 2. Animated Elements ONLY:
 *    - Title: "THE E-CELL MEET" dynamic entrance.
 *    - Rocket: Eye-grabbing launch trajectory, flame thrust FX, settling at summit.
 *    - Left Top Banner: Physical pendulum swing & info inside it reveals.
 *    - Right Banner: Information rows (E-CELL header, Ideas, Network, Collaborate, Grow) cascade in.
 *    - Stall Info: "IDEAS, NETWORK, GROW" reveals on the booth desk.
 * 3. NO OTHER ANIMATIONS. Components are not divided into separate cutout photos.
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
  const elRocketGlow = q("#rocket-thrust-glow");
  const elRocketFlame = q("#rocket-thrust-flame");
  const elRocketSpeedLines = q("#rocket-speed-lines");

  const elLeftBanner = q("#left-hanging-banner");
  const elHangingDiffColleges = q("#hanging-info-different-colleges");
  const elHangingSameVision = q("#hanging-info-same-vision");
  const elHangingLine = q("#hanging-info-line");

  const elBoardIdeas = q("#board-info-ideas");
  const elBoardNetwork = q("#board-info-network");
  const elBoardCollaborate = q("#board-info-collaborate");
  const elBoardGrow = q("#board-info-grow");

  const elStallIdeas = q("#stall-info-ideas");
  const elStallNetwork = q("#stall-info-network");
  const elStallGrow = q("#stall-info-grow");

  const elLaptopScreen = q("#stall-laptop-screen");
  const elGirlIdTag = q("#girl-id-tag");

  // =========================================================================
  // 1. INITIAL RESTING / HIDDEN STATES (t = 0.0s)
  // =========================================================================

  // Container is instantly visible from frame 0
  gsap.set(container, { opacity: 1 });

  // Base scene (people, plants, booth, background) is strictly 100% static
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

  // 1. Hero Rocket: Starts with launch offset down & left along -45deg axis
  gsap.set(elRocketContainer, {
    opacity: 0,
    x: -95,
    y: 85,
    scale: 0.75,
    transformOrigin: "1150px 175px",
  });
  gsap.set(elRocketGlow, { opacity: 0 });
  gsap.set(elRocketFlame, { opacity: 0, scale: 0.3, transformOrigin: "1115px 210px" });
  gsap.set(elRocketSpeedLines, { opacity: 0 });

  // 2. Main Title Artwork: Starts slightly lower, scaled to 95%, transparent
  gsap.set(elTitleMain, {
    opacity: 0,
    y: 24,
    scale: 0.95,
    transformOrigin: "822.5px 247.5px",
  });

  // 3. Left Hanging Banner: starts tilted at suspension point
  gsap.set(elLeftBanner, {
    opacity: 0,
    y: -30,
    rotation: -4.5,
    transformOrigin: "192.5px 0px",
  });
  gsap.set(elHangingDiffColleges, { opacity: 0, y: -10 });
  gsap.set(elHangingSameVision, { opacity: 0, scale: 0.85, transformOrigin: "120px 250px" });
  gsap.set(elHangingLine, { opacity: 0, scaleX: 0, transformOrigin: "120px 305px" });

  // 4. Right Banner Information: starts slid to right with opacity 0
  gsap.set(elBoardIdeas, { opacity: 0, x: 40, transformOrigin: "1350px 445px" });
  gsap.set(elBoardNetwork, { opacity: 0, x: 40, transformOrigin: "1350px 535px" });
  gsap.set(elBoardCollaborate, { opacity: 0, x: 40, transformOrigin: "1350px 625px" });
  gsap.set(elBoardGrow, { opacity: 0, x: 40, transformOrigin: "1350px 715px" });

  // 5. Stall Info: starts slightly lowered
  gsap.set(elStallIdeas, { opacity: 0, y: 12 });
  gsap.set(elStallNetwork, { opacity: 0, y: 12 });
  gsap.set(elStallGrow, { opacity: 0, y: 10, scale: 0.88, transformOrigin: "265px 796px" });

  // 6. Stall Laptop screen starts open with hinge at bottom
  gsap.set(elLaptopScreen, { scaleY: 1, opacity: 1, transformOrigin: "center bottom" });

  // 7. Girl ID badge starts at resting equilibrium with hinge at top clip
  gsap.set(elGirlIdTag, { rotation: 0, transformOrigin: "center top" });

  // =========================================================================
  // 2. CHOREOGRAPHED TIMELINE (0.0s – 4.5s)
  // Timeline duration reduced by 0.5s per user request
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
  // PHASE 1: EYE-GRABBING HERO ROCKET LAUNCH & MAIN TITLE ENTRANCE (0.05s – 0.70s)
  // -------------------------------------------------------------------------
  // Rocket thruster flash ignition
  tl.to(
    elRocketContainer,
    {
      opacity: 1,
      duration: 0.14,
      ease: "power1.out",
    },
    0.05
  );

  tl.to(
    [elRocketGlow, elRocketFlame, elRocketSpeedLines],
    {
      opacity: 1,
      scale: 1.15,
      duration: 0.18,
      ease: "power2.out",
    },
    0.08
  );

  // Rocket soars up along launch vector with dynamic acceleration curve
  tl.to(
    elRocketContainer,
    {
      x: 0,
      y: 0,
      scale: 1.0,
      duration: 0.52,
      ease: "power3.out",
    },
    0.10
  );

  // Rocket arrives at summit with impactful micro-overshoot and settle
  tl.to(
    elRocketContainer,
    {
      y: -4,
      duration: 0.15,
      ease: "sine.out",
    },
    0.62
  );

  tl.to(
    elRocketContainer,
    {
      y: 0,
      duration: 0.16,
      ease: "sine.inOut",
    },
    0.77
  );

  // Thruster launch flame recedes into ambient running jet
  tl.to(
    elRocketFlame,
    {
      opacity: 0.85,
      scale: 0.85,
      duration: 0.28,
      ease: "power2.inOut",
    },
    0.62
  );

  tl.to(
    elRocketSpeedLines,
    {
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    },
    0.65
  );

  // Main Title Artwork emerges with high impact synchronized to rocket blast
  tl.to(
    elTitleMain,
    {
      opacity: 1,
      y: 0,
      scale: 1.0,
      duration: 0.55,
      ease: "power2.out",
    },
    0.12
  );

  // -------------------------------------------------------------------------
  // PHASE 2: LEFT TOP BANNER PHYSICAL PENDULUM & INFO REVEAL (0.20s – 1.10s)
  // -------------------------------------------------------------------------
  tl.to(
    elLeftBanner,
    {
      opacity: 1,
      y: 0,
      rotation: 3.2,
      duration: 0.50,
      ease: "power2.out",
    },
    0.20
  );

  // Pendulum natural swing back & settle
  tl.to(
    elLeftBanner,
    {
      rotation: -1.5,
      duration: 0.38,
      ease: "sine.inOut",
    },
    0.70
  );

  tl.to(
    elLeftBanner,
    {
      rotation: 0,
      duration: 0.28,
      ease: "sine.out",
    },
    1.08
  );

  // Information inside the left banner reveals
  tl.to(
    elHangingDiffColleges,
    {
      opacity: 1,
      y: 0,
      duration: 0.32,
      ease: "power2.out",
    },
    0.42
  );

  tl.to(
    elHangingSameVision,
    {
      opacity: 1,
      scale: 1.0,
      duration: 0.35,
      ease: "back.out(1.4)",
    },
    0.60
  );

  tl.to(
    elHangingLine,
    {
      opacity: 1,
      scaleX: 1.0,
      duration: 0.28,
      ease: "power2.out",
    },
    0.80
  );

  // -------------------------------------------------------------------------
  // PHASE 3: GIRL ID BADGE SWAY MOMENT (0.35s – 1.20s)
  // "and make amoment for her id tag which the green dressed girl wored"
  // -------------------------------------------------------------------------
  tl.to(
    elGirlIdTag,
    {
      rotation: 12,
      duration: 0.22,
      ease: "sine.out",
    },
    0.35
  );

  tl.to(
    elGirlIdTag,
    {
      rotation: -8,
      duration: 0.25,
      ease: "sine.inOut",
    },
    0.57
  );

  tl.to(
    elGirlIdTag,
    {
      rotation: 5,
      duration: 0.22,
      ease: "sine.inOut",
    },
    0.82
  );

  tl.to(
    elGirlIdTag,
    {
      rotation: -2,
      duration: 0.18,
      ease: "sine.inOut",
    },
    1.04
  );

  tl.to(
    elGirlIdTag,
    {
      rotation: 0,
      duration: 0.16,
      ease: "sine.out",
    },
    1.22
  );

  // -------------------------------------------------------------------------
  // PHASE 4: STALL LAPTOP OPEN / CLOSE (0.38s – 1.35s)
  // "and also make the animation of the laptop in side the stall,
  // just make it open and close"
  // -------------------------------------------------------------------------
  // Laptop lid smoothly folds down closed onto keyboard base
  tl.to(
    elLaptopScreen,
    {
      scaleY: 0.02,
      opacity: 0.8,
      duration: 0.25,
      ease: "power2.in",
    },
    0.38
  );

  // Laptop stays closed until 0.98s, then springs open with crisp vitality
  tl.to(
    elLaptopScreen,
    {
      scaleY: 1.0,
      opacity: 1.0,
      duration: 0.36,
      ease: "back.out(1.4)",
    },
    0.98
  );

  // -------------------------------------------------------------------------
  // PHASE 5: RIGHT SIDE BANNER INFORMATION STAGGER (0.52s – 1.35s)
  // 4 Feature Rows cascade in sequentially (IDEAS, NETWORK, COLLABORATE, GROW)
  // -------------------------------------------------------------------------
  tl.to(
    elBoardIdeas,
    {
      opacity: 1,
      x: 0,
      duration: 0.32,
      ease: "power2.out",
    },
    0.52
  );

  tl.to(
    elBoardNetwork,
    {
      opacity: 1,
      x: 0,
      duration: 0.32,
      ease: "power2.out",
    },
    0.70
  );

  tl.to(
    elBoardCollaborate,
    {
      opacity: 1,
      x: 0,
      duration: 0.32,
      ease: "power2.out",
    },
    0.88
  );

  tl.to(
    elBoardGrow,
    {
      opacity: 1,
      x: 0,
      duration: 0.32,
      ease: "power2.out",
    },
    1.06
  );

  // -------------------------------------------------------------------------
  // PHASE 6: STALL DESK INFO (0.75s – 1.40s)
  // Stall Words Reveal: IDEAS, NETWORK, GROW
  // -------------------------------------------------------------------------
  tl.to(
    elStallIdeas,
    {
      opacity: 1,
      y: 0,
      duration: 0.28,
      ease: "power2.out",
    },
    0.75
  );

  tl.to(
    elStallNetwork,
    {
      opacity: 1,
      y: 0,
      duration: 0.28,
      ease: "power2.out",
    },
    0.92
  );

  tl.to(
    elStallGrow,
    {
      opacity: 1,
      y: 0,
      scale: 1.0,
      duration: 0.35,
      ease: "back.out(1.5)",
    },
    1.10
  );

  // -------------------------------------------------------------------------
  // PHASE 7: HARMONIOUS SETTLED STATE & LIVING AMBIANCE (1.60s – 3.50s)
  // Overall timeline reduced by 0.5s (settled milestone at 3.50s, exit at 4.50s)
  // -------------------------------------------------------------------------
  tl.addLabel("loop-start", 1.60);

  // Left banner gentle ambient sway
  tl.to(
    elLeftBanner,
    {
      rotation: 1.2,
      duration: 0.85,
      ease: "sine.inOut",
    },
    1.60
  );

  tl.to(
    elLeftBanner,
    {
      rotation: -1.2,
      duration: 0.85,
      ease: "sine.inOut",
    },
    2.45
  );

  tl.to(
    elLeftBanner,
    {
      rotation: 0,
      duration: 0.28,
      ease: "sine.out",
    },
    3.30
  );

  // Girl ID tag subtle ambient breath
  tl.to(
    elGirlIdTag,
    {
      rotation: 1.2,
      duration: 0.85,
      ease: "sine.inOut",
    },
    1.60
  );

  tl.to(
    elGirlIdTag,
    {
      rotation: -1.2,
      duration: 0.85,
      ease: "sine.inOut",
    },
    2.45
  );

  tl.to(
    elGirlIdTag,
    {
      rotation: 0,
      duration: 0.28,
      ease: "sine.out",
    },
    3.30
  );


  // Exact 3.50s milestone: all elements seamlessly resting (reduced by 0.5s)
  tl.addLabel("settled", 3.50);
  tl.addLabel("loop-end", 3.50);

  if (loop) {
    tl.call(() => {
      tl.seek("loop-start");
    }, undefined, 3.50);
  } else {
    tl.addLabel("hold", 3.50);
    tl.addLabel("exit", 4.50);

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
