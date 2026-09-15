// app/overlay-animations/animations/events/ECellMeet/eCellMeetTimeline.ts
import gsap from "gsap";

export interface ECellMeetTimelineTargets {
  container: HTMLElement | null;
  skipButton: HTMLElement | null;
}

export interface ECellMeetTimelineOptions {
  onComplete?: () => void;
}

/**
 * Master GSAP timeline for the cohesive E-Cell Meet event fullscreen intro.
 * Rebuilt strictly as a unified, professional motion-design scene:
 * - Macro-grouped choreography: scene -> branding -> environment -> people -> handshake -> accents -> settle -> hold -> exit.
 * - Shared timing, shared easing (power2.out), and coordinated movement.
 * - No patchwork popping, no fake walk cycles, no random rotations or bounces.
 * - Exact 4.2-second timeline with clean settle, silent hold, and smooth exit.
 */
export function createECellMeetTimeline(
  targets: ECellMeetTimelineTargets,
  options: ECellMeetTimelineOptions = {}
): gsap.core.Timeline {
  const { onComplete } = options;
  const { container, skipButton } = targets;

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      onComplete?.();
    },
  });

  if (!container) return tl;

  // Check prefers-reduced-motion for accessibility
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    gsap.set(container, { opacity: 0 });
    if (skipButton) gsap.set(skipButton, { opacity: 1, pointerEvents: "auto" });

    tl.to(container, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
    tl.addLabel("settled", 0.35);
    tl.addLabel("exit", 3.5);
    tl.to(container, { opacity: 0, duration: 0.35, ease: "power1.in" }, "exit");
    return tl;
  }

  // Scoped selector function for all SVG IDs
  const q = gsap.utils.selector(container);

  // =========================================================================
  // 1. INITIAL ANIMATION STATES (t = 0.0s)
  // All elements start cleanly grouped with subtle, controlled offsets
  // =========================================================================
  gsap.set(container, { opacity: 0 });
  if (skipButton) gsap.set(skipButton, { opacity: 0, pointerEvents: "none" });

  // Scene & backdrop
  gsap.set(q("#background"), { opacity: 1 });

  // 1. Main Branding (#branding)
  gsap.set(q("#branding"), {
    opacity: 0,
    y: 12,
    scale: 0.96,
    transformOrigin: "512px 110px",
  });

  // 2. Left Environment Group (#environment-left)
  gsap.set(q("#environment-left"), {
    opacity: 0,
    x: -18,
    y: 10,
    transformOrigin: "180px 380px",
  });

  // 3. Right Environment Group (#environment-right)
  gsap.set(q("#environment-right"), {
    opacity: 0,
    x: 18,
    y: 10,
    transformOrigin: "870px 380px",
  });

  // 4. Hero People Interaction (#people and students)
  gsap.set(q("#people"), {
    y: 0,
    transformOrigin: "512px 420px",
  });
  gsap.set(q("#student-left"), {
    opacity: 0,
    x: -65,
    y: 0,
    transformOrigin: "390px 576px",
  });
  gsap.set(q("#student-right"), {
    opacity: 0,
    x: 65,
    y: 0,
    transformOrigin: "640px 576px",
  });
  gsap.set(q("#card-interaction"), {
    opacity: 0,
    scale: 0.9,
    transformOrigin: "530px 390px",
  });

  // 5. Visual Accents Group (#accents)
  gsap.set(q("#accents"), {
    opacity: 0,
    scale: 0.97,
    transformOrigin: "512px 350px",
  });

  // =========================================================================
  // 2. MASTER CHOREOGRAPHED TIMELINE (~4.2s TOTAL)
  // =========================================================================

  // --- PHASE 1: ESTABLISH THE SCENE (0.00s – 0.35s) ---
  tl.addLabel("sceneReveal", 0);
  tl.to(
    container,
    {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    },
    "sceneReveal"
  );

  if (skipButton) {
    tl.to(
      skipButton,
      {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.25,
        ease: "power2.out",
      },
      0.1
    );
  }

  // --- PHASE 2: MAIN E-CELL BRANDING (0.25s – 0.90s) ---
  // The E-CELL logo/title is the primary visual anchor
  tl.addLabel("brandingReveal", 0.25);
  tl.to(
    q("#branding"),
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      ease: "power2.out",
    },
    "brandingReveal"
  );

  // --- PHASE 3: SUPPORTING EVENT ELEMENTS (0.45s – 1.20s) ---
  // Left Group (0.45s – 1.10s)
  tl.addLabel("environmentReveal", 0.45);
  tl.to(
    q("#environment-left"),
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.65,
      ease: "power2.out",
    },
    0.45
  );

  // Right Group (0.60s – 1.20s)
  tl.to(
    q("#environment-right"),
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    },
    0.6
  );

  // --- PHASE 4: PEOPLE ARE THE HERO MOMENT (0.65s – 1.65s) ---
  // Natural approach without walking cycles or bobbing
  tl.addLabel("peopleApproach", 0.65);
  tl.to(
    q("#student-left"),
    {
      opacity: 1,
      x: -3,
      duration: 0.9,
      ease: "power2.out",
    },
    0.65
  );

  tl.to(
    q("#student-right"),
    {
      opacity: 1,
      x: 3,
      duration: 0.9,
      ease: "power2.out",
    },
    0.75
  );

  // --- PHASE 5: HAND INTERACTION & SHAKE (1.45s – 2.60s) ---
  // 1. Hands meet cleanly at center contact point (1.85s – 2.05s)
  tl.addLabel("handshake", 1.85);
  tl.to(
    q("#student-left"),
    {
      x: 0,
      duration: 0.2,
      ease: "power1.out",
    },
    1.85
  );
  tl.to(
    q("#student-right"),
    {
      x: 0,
      duration: 0.2,
      ease: "power1.out",
    },
    1.85
  );
  tl.to(
    q("#card-interaction"),
    {
      opacity: 1,
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    },
    1.85
  );

  // 2. Subtle synchronized vertical handshake motion (2.05s – 2.35s)
  tl.to(
    q("#people"),
    {
      y: -1.6,
      duration: 0.08,
      ease: "sine.inOut",
    },
    2.05
  );
  tl.to(
    q("#people"),
    {
      y: 1.6,
      duration: 0.1,
      ease: "sine.inOut",
    },
    2.13
  );
  tl.to(
    q("#people"),
    {
      y: -0.8,
      duration: 0.07,
      ease: "sine.inOut",
    },
    2.23
  );
  tl.to(
    q("#people"),
    {
      y: 0,
      duration: 0.07,
      ease: "sine.out",
    },
    2.3
  );

  // --- PHASE 6: CONNECTING VISUAL ACCENTS (2.20s – 2.70s) ---
  // Accent group gently reveals together as one cohesive accent layer
  tl.addLabel("accentReveal", 2.2);
  tl.to(
    q("#accents"),
    {
      opacity: 1,
      scale: 1,
      duration: 0.45,
      ease: "power2.out",
    },
    2.2
  );

  // --- PHASE 7 & 8: FINAL COMPOSITION SETTLE & CLEAN HOLD (2.70s – 4.20s) ---
  // Complete composition settles cleanly by 3.20s, then holds totally still
  tl.addLabel("settled", 2.7);
  tl.addLabel("hold", 3.2);

  // --- EXIT TRANSITION (4.20s) ---
  // Smoothly fades out to reveal the event page underneath
  tl.addLabel("exit", 4.2);
  tl.to(
    container,
    {
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
    },
    "exit"
  );

  return tl;
}

/**
 * Fast-forwards the timeline directly to the exit phase on user skip / dismiss.
 */
export function skipECellMeetTimelineToExit(
  tl: gsap.core.Timeline | null
): void {
  if (!tl) return;
  const exitTime = tl.labels["exit"];
  if (exitTime !== undefined) {
    if (tl.time() < exitTime) {
      tl.tweenTo("exit", {
        duration: 0.35,
        ease: "power2.in",
        overwrite: "auto",
      });
    } else {
      tl.progress(1);
    }
  } else {
    tl.progress(1);
  }
}
