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
 * Master GSAP timeline for the Internship Drive splash-screen animation.
 *
 * Requirements:
 * 1. BOTTOM BAR:
 *    - Animate horizontal expansion / slide-in reveal.
 *    - Reveal text ("50+ Companies · 500+ Students") with subtle fade + upward motion.
 *    - Glowing circle on the right with a subtle pulse.
 *
 * 2. PEOPLE — HANDSHAKE:
 *    - LEFT person enters from the LEFT side.
 *    - RIGHT person enters from the RIGHT side.
 *    - Both move simultaneously with smooth cinematic ease-out.
 *    - Meet precisely at existing handshake position (x: 0) and remain there.
 *    - No body part animation, no hand separation.
 *
 * 3. CONNECT / INTERN / GROW:
 *    - Animate individually: CONNECT -> INTERN -> GROW.
 *    - Fade-in + slight upward movement + subtle scale-in.
 *    - After appearing, subtle floating/pulse effect.
 *
 * 4. CONNECTION LINES:
 *    - Animate sequentially: CONNECT -> first line -> INTERN -> second line -> GROW.
 *    - Moving glow/highlight traveling along each line, base lines remain visible.
 *
 * 5. BACKGROUND GLOBE:
 *    - Slowly and continuously revolves/orbits in background with gentle rotation.
 *
 * 6. TITLE + OLD EDITS:
 *    - "INTERNSHIP" and "DRIVE" entrance + one-time light/glow sweep preserved.
 *    - Header, background elements, Skip button preserved.
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

  const q = gsap.utils.selector(container);

  const elTopBrandingLeft = q("#idrive-top-branding-left");
  const elTopBrandingRight = q("#idrive-top-branding-right");
  const elTopBrandVersion = q("#idrive-top-branding-left [class*='brandVersion']");
  const elTopBrandDots = q("#idrive-top-branding-left [class*='brandDotPair'] span");
  const elTopDateDot = q("#idrive-top-branding-right [class*='dateDot']");

  if (prefersReducedMotion) {
    gsap.set(container, { opacity: 1 });
    if (skipButton) gsap.set(skipButton, { opacity: 1, pointerEvents: "auto" });
    gsap.set([elTopBrandingLeft, elTopBrandingRight], { opacity: 1, y: 0 });
    gsap.set(
      [
        q("#ambientBall1"),
        q("#ambientBall2"),
        q("#ambientBall3"),
        q("#ambientBall4"),
        q("#ambientBall5"),
      ],
      { opacity: 0.8, scale: 1 }
    );
    gsap.set(q("#headlineInternship"), { opacity: 1, y: 0 });
    gsap.set(q("#headlineDrive"), { opacity: 1, y: 0 });
    gsap.set(q("#headlineTagline"), { opacity: 1, y: 0 });
    gsap.set(q("#leftGlobe"), { x: 0, y: 0, rotation: 0 });
    gsap.set(q("#businessman-animation"), { x: 0, y: 0, opacity: 1 });
    gsap.set(q("#student-animation"), { x: 0, y: 0, opacity: 1 });
    gsap.set(q("#iconGroupConnect"), { opacity: 1, y: 0, scale: 1 });
    gsap.set(q("#labelConnect"), { opacity: 1, y: 0 });
    gsap.set(q("#iconGroupIntern"), { opacity: 1, y: 0, scale: 1 });
    gsap.set(q("#labelIntern"), { opacity: 1, y: 0 });
    gsap.set(q("#iconGroupGrow"), { opacity: 1, y: 0, scale: 1 });
    gsap.set(q("#labelGrow"), { opacity: 1, y: 0 });
    gsap.set([q("#connectorLine1"), q("#connectorLine2")], { opacity: 0.95, scaleX: 1 });
    gsap.set(q("#statsBarGroup rect"), { scaleX: 1, opacity: 1 });
    gsap.set(q("#statsBarContent"), { opacity: 1, y: 0 });
    gsap.set(q("#statsDotPink"), { opacity: 1, attr: { r: 14 } });
    tl.to(container, { opacity: 1, duration: 0.2 }, 0);
    tl.addLabel("exit", 4.0);
    tl.to(container, { opacity: 0, duration: 0.35, ease: "power1.in" }, "exit");
    return tl;
  }

  // --------------------------------------------------------------------------
  // 1. Initial State Setup
  // --------------------------------------------------------------------------
  gsap.set(container, { opacity: 0 });
  if (skipButton) gsap.set(skipButton, { opacity: 1, pointerEvents: "auto" });

  // Top branding headers initial state
  gsap.set([elTopBrandingLeft, elTopBrandingRight], { opacity: 0, y: -16 });
  gsap.set(
    [
      q("#ambientBall1"),
      q("#ambientBall2"),
      q("#ambientBall3"),
      q("#ambientBall4"),
      q("#ambientBall5"),
    ],
    { opacity: 0, scale: 0.75, transformOrigin: "center center" }
  );
  gsap.set(q("#groundLine"), { opacity: 0, scaleX: 0, transformOrigin: "760px 738px" });
  gsap.set(q("#headlineTagline"), { opacity: 0, y: 15 });

  // People: Initial positions on opposite sides
  gsap.set(q("#businessman-animation"), { x: -380, y: 0, opacity: 0 });
  gsap.set(q("#student-animation"), { x: 380, y: 0, opacity: 0 });

  // Main Title: initial state for entrance reveal
  gsap.set(q("#headlineInternship"), { opacity: 0, y: 24 });
  gsap.set(q("#headlineDrive"), { opacity: 0, y: 24 });
  gsap.set(q("#titleShineSweep"), { x: -260, skewX: -20, opacity: 0 });

  // Icons & Labels: Initial states for sequential reveal
  gsap.set(q("#iconGroupConnect"), { opacity: 0, y: 18, scale: 0.85, transformOrigin: "145px 625px" });
  gsap.set(q("#labelConnect"), { opacity: 0, y: 10 });
  gsap.set(q("#iconGroupIntern"), { opacity: 0, y: 18, scale: 0.85, transformOrigin: "365px 625px" });
  gsap.set(q("#labelIntern"), { opacity: 0, y: 10 });
  gsap.set(q("#iconGroupGrow"), { opacity: 0, y: 18, scale: 0.85, transformOrigin: "585px 625px" });
  gsap.set(q("#labelGrow"), { opacity: 0, y: 10 });

  // Base connector lines & glowing energy pulses
  gsap.set(q("#connectorLine1"), { opacity: 0, scaleX: 0, transformOrigin: "200px 625px" });
  gsap.set(q("#connectorLine2"), { opacity: 0, scaleX: 0, transformOrigin: "420px 625px" });
  gsap.set([q("#energyPulse1"), q("#energyPulse2")], {
    strokeDasharray: "36 110",
    strokeDashoffset: 36,
    opacity: 0,
  });

  // Bottom Information Bar: Initial states for expansion & text reveal
  gsap.set(q("#statsBarGroup rect"), { scaleX: 0, opacity: 0, transformOrigin: "800px 820px" });
  gsap.set(q("#statsBarContent"), { opacity: 0, y: 14 });
  gsap.set(q("#statsDotPink"), { opacity: 0, attr: { r: 0 } });

  // Background Globe: initial local origin
  gsap.set(q("#leftGlobe"), {
    x: 0,
    y: 0,
    rotation: 0,
    transformOrigin: "0px 0px",
  });

  // --------------------------------------------------------------------------
  // 2. Master Sequence
  // --------------------------------------------------------------------------

  // 0.00 – 0.25s: Full-screen splash screen establishes cleanly
  tl.to(container, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0.0);

  // Top branding headers reveal (Equinox 2.0 on top left, Oct 30-31 MLRIT on top right)
  tl.to(
    [elTopBrandingLeft, elTopBrandingRight],
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.1,
      ease: "power2.out",
    },
    0.10
  );

  // Atmospheric blurred balls reveal softly
  tl.to(
    [
      q("#ambientBall1"),
      q("#ambientBall2"),
      q("#ambientBall3"),
      q("#ambientBall4"),
      q("#ambientBall5"),
    ],
    {
      opacity: 1,
      scale: 1,
      duration: 0.90,
      stagger: 0.08,
      ease: "power2.out",
    },
    0.04
  );

  // Ground line expands early
  tl.to(q("#groundLine"), { opacity: 1, scaleX: 1, duration: 0.50, ease: "power2.out" }, 0.15);

  // ==========================================================================
  // REQUIREMENT 5: BACKGROUND GLOBE (Continuous Orbital Revolve + Parallax Rotation)
  // ==========================================================================
  const globeLoop = gsap.timeline({ repeat: -1 });
  globeLoop
    .to(q("#leftGlobe"), {
      x: 7,
      y: -9,
      rotation: 12,
      duration: 3.5,
      ease: "sine.inOut",
    })
    .to(q("#leftGlobe"), {
      x: -4,
      y: -14,
      rotation: 24,
      duration: 3.5,
      ease: "sine.inOut",
    })
    .to(q("#leftGlobe"), {
      x: -7,
      y: 6,
      rotation: 14,
      duration: 3.5,
      ease: "sine.inOut",
    })
    .to(q("#leftGlobe"), {
      x: 4,
      y: 10,
      rotation: -8,
      duration: 3.5,
      ease: "sine.inOut",
    })
    .to(q("#leftGlobe"), {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 3.5,
      ease: "sine.inOut",
    });

  // ==========================================================================
  // REQUIREMENT 6: MAIN TITLE ENTRANCE ANIMATION & ONE-TIME LIGHT SWEEP
  // ==========================================================================
  // "INTERNSHIP" appears with a punchy upward/fade-in reveal
  tl.fromTo(
    q("#headlineInternship"),
    { opacity: 0, y: 28, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      ease: "back.out(1.2)",
    },
    0.08
  );

  // "DRIVE" follows immediately with a smooth fade + slight upward motion
  tl.to(
    q("#headlineDrive"),
    {
      opacity: 1,
      y: 0,
      duration: 0.60,
      ease: "power2.out",
    },
    0.24
  );

  // Tagline "Interlinked networks, exponential growth" enters smoothly
  tl.fromTo(
    q("#headlineTagline"),
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: "power2.out",
    },
    0.42
  );

  // Subtle light/glow sweep across the title once during entrance
  tl.fromTo(
    q("#titleShineSweep"),
    { x: -260, skewX: -20, opacity: 0 },
    {
      x: 1050,
      skewX: -20,
      opacity: 0.95,
      duration: 0.80,
      ease: "power1.inOut",
    },
    0.65
  );
  tl.to(
    q("#titleShineSweep"),
    {
      opacity: 0,
      duration: 0.15,
      ease: "power1.out",
    },
    1.45
  );

  // ==========================================================================
  // REQUIREMENT 2: PEOPLE — HANDSHAKE ENTRANCE
  // ==========================================================================
  // Left person enters from left, Right person enters from right simultaneously.
  // Both meet precisely at the handshake position (x: 0) and remain there.
  tl.to(
    q("#businessman-animation"),
    {
      x: 0,
      opacity: 1,
      duration: 1.40,
      ease: "power2.out",
    },
    0.20
  );
  tl.to(
    q("#student-animation"),
    {
      x: 0,
      opacity: 1,
      duration: 1.40,
      ease: "power2.out",
    },
    0.20
  );

  // ==========================================================================
  // REQUIREMENTS 3 & 4: CONNECT -> FIRST LINE -> INTERN -> SECOND LINE -> GROW
  // ==========================================================================
  // Step 1: CONNECT appears first (fade-in + slight upward + subtle scale-in)
  tl.to(
    q("#iconGroupConnect"),
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: "power2.out",
    },
    0.75
  );
  tl.to(
    q("#labelConnect"),
    {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    },
    0.85
  );

  // Step 2: First line animates (base line reveals + glow pulse travels CONNECT -> INTERN)
  tl.to(
    q("#connectorLine1"),
    {
      opacity: 0.95,
      scaleX: 1,
      duration: 0.35,
      ease: "power2.out",
    },
    1.05
  );
  tl.set(q("#energyPulse1"), { opacity: 1, strokeDashoffset: 36 }, 1.05);
  tl.to(
    q("#energyPulse1"),
    {
      strokeDashoffset: -110,
      duration: 0.45,
      ease: "power1.inOut",
    },
    1.05
  );
  tl.set(q("#energyPulse1"), { opacity: 0 }, 1.50);

  // Step 3: INTERN appears next (fade-in + slight upward + subtle scale-in)
  tl.to(
    q("#iconGroupIntern"),
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: "power2.out",
    },
    1.45
  );
  tl.to(
    q("#labelIntern"),
    {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    },
    1.55
  );

  // Step 4: Second line animates (base line reveals + glow pulse travels INTERN -> GROW)
  tl.to(
    q("#connectorLine2"),
    {
      opacity: 0.95,
      scaleX: 1,
      duration: 0.35,
      ease: "power2.out",
    },
    1.75
  );
  tl.set(q("#energyPulse2"), { opacity: 1, strokeDashoffset: 36 }, 1.75);
  tl.to(
    q("#energyPulse2"),
    {
      strokeDashoffset: -110,
      duration: 0.45,
      ease: "power1.inOut",
    },
    1.75
  );
  tl.set(q("#energyPulse2"), { opacity: 0 }, 2.20);

  // Step 5: GROW appears last (fade-in + slight upward + subtle scale-in)
  tl.to(
    q("#iconGroupGrow"),
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: "power2.out",
    },
    2.15
  );
  tl.to(
    q("#labelGrow"),
    {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    },
    2.25
  );

  // ==========================================================================
  // REQUIREMENT 1: BOTTOM BAR REVEAL (Horizontal Expansion + Text Fade-Up + Pulse)
  // ==========================================================================
  // Smooth horizontal expansion of the bottom pill
  tl.to(
    q("#statsBarGroup rect"),
    {
      scaleX: 1,
      opacity: 1,
      duration: 0.60,
      ease: "power2.out",
    },
    2.40
  );

  // Text "50+ Companies · 500+ Students" reveals with subtle fade + upward motion
  tl.to(
    q("#statsBarContent"),
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out",
    },
    2.80
  );

  // Green accent dot appears inside the bottom banner strictly AFTER info in the bar reveals
  tl.to(
    q("#statsDotPink"),
    {
      opacity: 1,
      attr: { r: 14 },
      duration: 0.35,
      ease: "back.out(2)",
    },
    3.30
  );

  // ==========================================================================
  // CONTINUOUS POST-ENTRANCE LOOPS: ICON FLOATING, PULSE, AND FLOW CYCLES
  // ==========================================================================
  // Living pulse & continuous glow on Top Branding accents (Equinox 2.0 & Date Dot)
  if (elTopBrandVersion.length > 0) {
    gsap.to(elTopBrandVersion, {
      scale: 1.05,
      filter: "drop-shadow(0 0 16px rgba(56, 189, 248, 0.85))",
      duration: 1.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "center center",
    });
  }
  if (elTopBrandDots.length > 0) {
    gsap.to(elTopBrandDots, {
      scale: 1.3,
      opacity: 0.7,
      duration: 1.3,
      stagger: 0.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }
  if (elTopDateDot.length > 0) {
    gsap.to(elTopDateDot, {
      scale: 1.35,
      opacity: 0.6,
      duration: 1.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  // Living breathing & glow on the INTERNSHIP title
  gsap.to(q("#headlineInternship"), {
    filter: "drop-shadow(0 0 20px rgba(116, 132, 254, 0.48))",
    duration: 2.2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: 1.8,
  });

  // Living pulse on the tagline "Interlinked networks, exponential growth"
  gsap.to(q("#headlineTagline"), {
    opacity: 0.72,
    duration: 2.0,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: 2.2,
  });

  // Continuous periodic title shine sweep across INTERNSHIP & DRIVE
  const titleSweepLoop = gsap.timeline({
    delay: 3.5,
    repeat: -1,
    repeatDelay: 3.0,
  });
  titleSweepLoop
    .set(q("#titleShineSweep"), { x: -260, opacity: 0 })
    .to(q("#titleShineSweep"), {
      x: 1050,
      opacity: 0.95,
      duration: 0.85,
      ease: "power1.inOut",
    })
    .to(q("#titleShineSweep"), { opacity: 0, duration: 0.15 }, "-=0.15");

  // ==========================================================================
  // 5 Atmospheric Blurred Balls: Subtle Floating & Breathing Loops (Green & Blue)
  // ==========================================================================
  gsap.to(q("#ambientBall1"), {
    x: 10,
    y: -12,
    scale: 1.12,
    opacity: 0.65,
    duration: 3.8,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    transformOrigin: "center center",
  });

  gsap.to(q("#ambientBall2"), {
    x: -12,
    y: 10,
    scale: 1.15,
    opacity: 0.62,
    duration: 4.2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: 0.4,
    transformOrigin: "center center",
  });

  gsap.to(q("#ambientBall3"), {
    x: -8,
    y: -14,
    scale: 1.1,
    opacity: 0.58,
    duration: 3.4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: 0.2,
    transformOrigin: "center center",
  });

  gsap.to(q("#ambientBall4"), {
    x: 12,
    y: -10,
    scale: 1.14,
    opacity: 0.64,
    duration: 4.5,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: 0.6,
    transformOrigin: "center center",
  });

  gsap.to(q("#ambientBall5"), {
    x: 14,
    y: 10,
    scale: 1.12,
    opacity: 0.6,
    duration: 3.6,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: 0.3,
    transformOrigin: "center center",
  });

  // Subtle floating/pulse on CONNECT, INTERN, GROW icons after appearing
  gsap.to([q("#iconGroupConnect"), q("#iconGroupIntern"), q("#iconGroupGrow")], {
    y: -3.5,
    duration: 2.2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    stagger: 0.3,
    delay: 2.5,
  });

  // Glowing green circle subtle stationary breathing pulse inside bottom banner (no translation / strictly stationary)
  gsap.to(q("#statsDotPink"), {
    opacity: 0.70,
    attr: { r: 16 },
    duration: 1.1,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: 3.65,
  });

  // Sequential energy flow loop: CONNECT -> INTERN -> GROW -> repeat
  const energyFlowLoop = gsap.timeline({
    delay: 2.60,
    repeat: -1,
    repeatDelay: 0.45,
  });

  energyFlowLoop.set(q("#energyPulse1"), { opacity: 1, strokeDashoffset: 36 });
  energyFlowLoop.to(q("#energyPulse1"), {
    strokeDashoffset: -110,
    duration: 0.50,
    ease: "power1.inOut",
  });
  energyFlowLoop.set(q("#energyPulse1"), { opacity: 0 });

  energyFlowLoop.set(q("#energyPulse2"), { opacity: 1, strokeDashoffset: 36 });
  energyFlowLoop.to(q("#energyPulse2"), {
    strokeDashoffset: -110,
    duration: 0.50,
    ease: "power1.inOut",
  });
  energyFlowLoop.set(q("#energyPulse2"), { opacity: 0 });

  // ==========================================================================
  // Splash Screen Hold & Clean Exit Lifecycle
  // ==========================================================================
  tl.addLabel("settled", 3.30);
  tl.addLabel("exit", 5.50);

  // Smooth exit transition: overlay fades out cleanly to reveal event page
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
