// app/overlay-animations/animations/events/InternshipDrive/internshipDriveTimeline.ts
import gsap from "gsap";

export interface InternshipDriveTimelineTargets {
  container: HTMLElement | null;
  skipButton?: HTMLElement | null;
}

export interface InternshipDriveTimelineOptions {
  onComplete?: () => void;
}

/**
 * Master GSAP timeline for the Internship Drive intro overlay.
 * High-precision 4.2-second choreographed sequence strictly matching user specifications:
 * - Independent multi-stage character walking motion (separate timing, realistic vertical foot-lift steps).
 * - Precise handshake alignment, extension, clasp pulse, and natural settling.
 * - Sequential entrance of CONNECT, INTERN, GROW icons, labels, and dashed connectors.
 * - Full-screen viewport presentation holding through 4.20s before smooth exit.
 */
export function createInternshipDriveTimeline(
  targets: InternshipDriveTimelineTargets,
  options: InternshipDriveTimelineOptions = {}
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

  const q = gsap.utils.selector(container);

  // --------------------------------------------------------------------------
  // 1. Initial State Setup (Reset All Elements Before Animation Begins)
  // --------------------------------------------------------------------------
  gsap.set(container, { opacity: 0 });
  if (skipButton) gsap.set(skipButton, { opacity: 0, pointerEvents: "none" });

  // Ground line
  gsap.set(q("#groundLine"), { opacity: 0, scaleX: 0, transformOrigin: "760px 738px" });

  // Top metadata
  gsap.set(q("#topMetadata"), { opacity: 0, y: -18 });

  // Hero headlines
  gsap.set(q("#headlineInternship"), { opacity: 0, y: 25 });
  gsap.set(q("#headlineDrive"), { opacity: 0, y: 25 });
  gsap.set(q("#headlineTagline"), { opacity: 0, y: 15 });

  // Process icons & labels (sequential entrances)
  gsap.set(q("#iconGroupConnect"), { opacity: 0, scale: 0.85, y: 12, transformOrigin: "145px 625px" });
  gsap.set(q("#labelConnect"), { opacity: 0, y: 8 });
  gsap.set(q("#connectorLine1"), { opacity: 0, strokeDasharray: 110, strokeDashoffset: 110 });

  gsap.set(q("#iconGroupIntern"), { opacity: 0, scale: 0.85, y: 12, transformOrigin: "365px 625px" });
  gsap.set(q("#labelIntern"), { opacity: 0, y: 8 });
  gsap.set(q("#connectorLine2"), { opacity: 0, strokeDasharray: 110, strokeDashoffset: 110 });

  gsap.set(q("#iconGroupGrow"), { opacity: 0, scale: 0.85, y: 12, transformOrigin: "585px 625px" });
  gsap.set(q("#labelGrow"), { opacity: 0, y: 8 });

  // Characters — Independent animation wrappers:
  // Position group: (762, 131) and (1104, 149) in SVG markup
  // Animation wrapper: handles smooth horizontal approach, subtle living ease, and handshake
  gsap.set(q("#businessman-animation"), { x: -280, y: 0, opacity: 0 });
  gsap.set(q("#student-animation"), { x: 280, y: 0, opacity: 0 });

  // Bottom stats bar
  gsap.set(q("#statsBarGroup"), { opacity: 0, y: 60 });
  gsap.set(q("#statsBarContent"), { opacity: 0 });

  // --------------------------------------------------------------------------
  // 2. Coordinated Master Timeline Sequence
  // --------------------------------------------------------------------------

  // === 0.00 – 0.35: Full-screen cream background establishes ===
  tl.to(container, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0.0);

  if (skipButton) {
    tl.to(skipButton, { opacity: 1, pointerEvents: "auto", duration: 0.3 }, 0.25);
  }

  // Ground line reveals early
  tl.to(q("#groundLine"), { opacity: 1, scaleX: 1, duration: 0.45, ease: "power2.out" }, 0.10);

  // === 0.10 – 0.60: Top metadata enters ===
  tl.to(
    q("#topMetadata"),
    {
      opacity: 1,
      y: 0,
      duration: 0.50,
      ease: "power2.out",
    },
    0.10
  );

  // === 0.15 – 0.80: INTERNSHIP enters (fade + slight upward movement) ===
  tl.to(
    q("#headlineInternship"),
    {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: "power2.out",
    },
    0.15
  );

  // === 0.30 – 0.95: DRIVE enters (fade + slight upward movement) ===
  tl.to(
    q("#headlineDrive"),
    {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: "power2.out",
    },
    0.30
  );

  // === 0.60 – 1.15: Connect. Intern. Grow. tagline enters ===
  tl.to(
    q("#headlineTagline"),
    {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: "power2.out",
    },
    0.60
  );

  // === 0.70 – 1.75: CONNECT, INTERN, and GROW Animate Sequentially ===
  // Stage 1: 0.70 – 1.00: CONNECT circle enters with small scale-up and fade
  tl.to(
    q("#iconGroupConnect"),
    {
      opacity: 1,
      scale: 1.0,
      y: 0,
      duration: 0.30,
      ease: "power2.out",
    },
    0.70
  );

  // Stage 2: 0.90 – 1.15: CONNECT label enters below it
  tl.to(
    q("#labelConnect"),
    {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    },
    0.90
  );

  // Stage 3: 0.95 – 1.25: INTERN circle enters with small scale-up and fade
  tl.to(
    q("#iconGroupIntern"),
    {
      opacity: 1,
      scale: 1.0,
      y: 0,
      duration: 0.30,
      ease: "power2.out",
    },
    0.95
  );

  // Stage 4: 1.10 – 1.35: INTERN label enters below it
  tl.to(
    q("#labelIntern"),
    {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    },
    1.10
  );

  // Stage 5: 1.20 – 1.50: GROW circle enters with small scale-up and fade
  tl.to(
    q("#iconGroupGrow"),
    {
      opacity: 1,
      scale: 1.0,
      y: 0,
      duration: 0.30,
      ease: "power2.out",
    },
    1.20
  );

  // Stage 6: 1.35 – 1.60: GROW label enters below it
  tl.to(
    q("#labelGrow"),
    {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    },
    1.35
  );

  // Stage 7: 1.40 – 1.75: Dashed connector lines reveal from left to right
  tl.to(
    q("#connectorLine1"),
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.20,
      ease: "power1.inOut",
    },
    1.40
  );
  tl.to(
    q("#connectorLine2"),
    {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.20,
      ease: "power1.inOut",
    },
    1.55
  );

  // ==========================================================================
  // 3. INDEPENDENT CHARACTER APPROACH & FOCUSED HANDSHAKE
  // ==========================================================================

  // --- BUSINESSMAN APPROACH (0.25s → 1.80s: LEFT → CENTER) ---
  // Entrance fade-in: starts clearly on the left side (-280px offset)
  tl.to(
    q("#businessman-animation"),
    {
      opacity: 1,
      duration: 0.30,
      ease: "power1.out",
    },
    0.25
  );

  // Smooth horizontal translation toward center with natural ease-out deceleration (0.25s – 1.80s)
  tl.to(
    q("#businessman-animation"),
    {
      x: -3,
      duration: 1.55,
      ease: "power2.out",
    },
    0.25
  );

  // Very subtle natural vertical ease during approach (keeps motion alive without fake walking cycle)
  tl.to(
    q("#businessman-animation"),
    {
      y: -1.8,
      duration: 0.65,
      ease: "sine.inOut",
    },
    0.40
  );
  tl.to(
    q("#businessman-animation"),
    {
      y: 0,
      duration: 0.65,
      ease: "sine.inOut",
    },
    1.05
  );

  // --- STUDENT APPROACH (0.35s → 1.85s: RIGHT → CENTER) ---
  // Entrance fade-in: starts clearly on the right side (+280px offset)
  tl.to(
    q("#student-animation"),
    {
      opacity: 1,
      duration: 0.30,
      ease: "power1.out",
    },
    0.35
  );

  // Smooth horizontal translation toward center, arriving slightly staggered (0.35s – 1.85s)
  tl.to(
    q("#student-animation"),
    {
      x: 3,
      duration: 1.50,
      ease: "power2.out",
    },
    0.35
  );

  // Very subtle natural vertical ease during approach (staggered phase)
  tl.to(
    q("#student-animation"),
    {
      y: -1.8,
      duration: 0.65,
      ease: "sine.inOut",
    },
    0.50
  );
  tl.to(
    q("#student-animation"),
    {
      y: 0,
      duration: 0.65,
      ease: "sine.inOut",
    },
    1.15
  );

  // --- HANDS MOVE TOWARD EACH OTHER / MAKE CONTACT (1.80s – 2.05s) ---
  // Businessman finishes approach to center
  tl.to(
    q("#businessman-animation"),
    {
      x: 0,
      duration: 0.25,
      ease: "power1.out",
    },
    1.80
  );

  // Student finishes approach to center, interlocking hands in natural handshake clasp
  tl.to(
    q("#student-animation"),
    {
      x: 0,
      duration: 0.25,
      ease: "power1.out",
    },
    1.85
  );

  // --- SUBTLE HANDSHAKE MOVEMENTS (2.05s – 2.45s) ---
  // Two small, natural synchronized vertical handshake movements
  // Shake 1: down-stroke then up-stroke
  tl.to(
    [q("#businessman-animation"), q("#student-animation")],
    {
      y: 2.0,
      duration: 0.10,
      ease: "sine.inOut",
    },
    2.05
  );
  tl.to(
    [q("#businessman-animation"), q("#student-animation")],
    {
      y: -1.6,
      duration: 0.10,
      ease: "sine.inOut",
    },
    2.15
  );

  // Shake 2: smaller down-stroke then return to baseline
  tl.to(
    [q("#businessman-animation"), q("#student-animation")],
    {
      y: 1.2,
      duration: 0.10,
      ease: "sine.inOut",
    },
    2.25
  );
  tl.to(
    [q("#businessman-animation"), q("#student-animation")],
    {
      y: 0,
      duration: 0.10,
      ease: "sine.inOut",
    },
    2.35
  );

  // --- RETURN TO STABLE HANDSHAKE POSE (2.45s – 2.75s) ---
  tl.to(
    [q("#businessman-animation"), q("#student-animation")],
    {
      x: 0,
      y: 0,
      duration: 0.30,
      ease: "power2.out",
    },
    2.45
  );
  // 2.75s onward: Hold the final stable handshake pose through the rest of the intro

  // ==========================================================================
  // 4. BOTTOM INFORMATION BAR & FINAL POLISH
  // ==========================================================================

  // 2.70 – 3.25: Bottom information bar enters cleanly
  tl.to(
    q("#statsBarGroup"),
    {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: "power2.out",
    },
    2.70
  );

  // 3.00 – 3.60: Bottom text appears with clear spacing
  tl.to(
    q("#statsBarContent"),
    {
      opacity: 1,
      duration: 0.60,
      ease: "power1.out",
    },
    3.00
  );

  // 4.00 – 4.20: Final complete composition holds
  tl.addLabel("settled", 4.0);
  tl.addLabel("exit", 4.2);

  // Smooth exit transition: overlay container fades out cleanly to reveal event page
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
export function skipInternshipDriveTimelineToExit(
  tl: gsap.core.Timeline | null
): void {
  if (!tl) return;
  const exitTime = tl.labels["exit"];
  if (exitTime !== undefined) {
    if (tl.time() < exitTime) {
      tl.tweenTo("exit", {
        duration: 0.25,
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


