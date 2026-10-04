// app/overlay-animations/animations/events/StartupPoly/startupPolyTimeline.ts
import gsap from "gsap";

export interface StartupPolyTimelineTargets {
  container: HTMLElement | null;
  boardGroup: SVGElement | null;
  tiles: SVGElement[];
  centerPanel: SVGElement | null;
  titleStartup: SVGElement | null;
  titlePolyBadge: SVGElement | null;
  titlePolyText: SVGElement | null;
  tagline: SVGElement | null;
  die: SVGElement | null;
  leftDeck: SVGElement | null;
  rightDeck: SVGElement | null;
  ambientAccents: SVGElement | null;
  skipButton: HTMLElement | null;
}

export interface StartupPolyTimelineOptions {
  onComplete?: () => void;
}

/**
 * Creates and returns the master GSAP timeline for the Startup Poly event overlay.
 *
 * Sequence:
 * 1. ENTRANCE (0 -> ~0.6s): Overlay fades in, 12 tiles snap/pop in clockwise stagger
 * 2. DICE ROLL (~0.6s -> ~1.6s): Die pops into its slot (the "O" of POLY) and settles with squash/stretch bounce
 * 3. TITLE REVEAL (~1.6s -> ~2.4s): "STARTUP" + "POLY" revealed
 * 4. RESOLUTION (~2.4s -> ~3.2s): Tagline wipes in, card decks slide in from left/right, sparkles appear
 * 5. HOLD (~3.2s -> ~3.8s): Gentle breathing motion
 * 6. EXIT (~3.8s -> ~4.4s): Elements fade out, tiles disassemble outward in reverse stagger, reveals website
 */
export function createStartupPolyTimeline(
  targets: StartupPolyTimelineTargets,
  options: StartupPolyTimelineOptions = {}
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
    boardGroup,
    tiles,
    centerPanel,
    titleStartup,
    titlePolyBadge,
    titlePolyText,
    tagline,
    die,
    leftDeck,
    rightDeck,
    ambientAccents,
    skipButton,
  } = targets;

  // ------------------------------------------
  // Initial State Setup
  // ------------------------------------------
  if (container) gsap.set(container, { opacity: 0 });
  if (skipButton) gsap.set(skipButton, { opacity: 0, pointerEvents: "none" });

  if (tiles.length > 0) {
    gsap.set(tiles, {
      opacity: 0,
      scale: 0.65,
      transformOrigin: "center center",
    });
  }

  if (centerPanel) {
    gsap.set(centerPanel, {
      opacity: 0,
      scale: 0.88,
      transformOrigin: "center center",
    });
  }

  if (titleStartup) {
    gsap.set(titleStartup, {
      opacity: 0,
      y: -24,
      transformOrigin: "center center",
    });
  }

  if (titlePolyBadge) {
    gsap.set(titlePolyBadge, {
      opacity: 0,
      scale: 0.75,
      transformOrigin: "center center",
    });
  }

  if (titlePolyText) {
    gsap.set(titlePolyText, {
      opacity: 0,
    });
  }

  if (tagline) {
    gsap.set(tagline, {
      opacity: 0,
      y: 16,
      transformOrigin: "center center",
    });
  }

  if (die) {
    // Die stays put at its resting slot (the "O" of POLY) the whole time —
    // only opacity/scale/rotation animate, so it can never land off-position.
    gsap.set(die, {
      opacity: 0,
      scale: 0.3,
      rotation: -45,
      transformOrigin: "center center",
    });
  }

  if (leftDeck) {
    gsap.set(leftDeck, {
      opacity: 0,
      x: -340,
      transformOrigin: "center center",
    });
  }

  if (rightDeck) {
    gsap.set(rightDeck, {
      opacity: 0,
      x: 340,
      transformOrigin: "center center",
    });
  }

  if (ambientAccents) {
    gsap.set(ambientAccents, { opacity: 0 });
  }

  // ==========================================
  // 1. ENTRANCE (0 -> ~0.6s)
  // ==========================================
  tl.addLabel("entrance", 0);

  if (container) {
    tl.to(
      container,
      { opacity: 1, duration: 0.28, ease: "power1.out" },
      "entrance"
    );
  }

  if (skipButton) {
    tl.to(
      skipButton,
      {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.2,
        ease: "power1.out",
      },
      "entrance+=0.15"
    );
  }

  // Board tiles snap/pop into place one at a time around the ring
  if (tiles.length > 0) {
    tl.to(
      tiles,
      {
        opacity: 1,
        scale: 1,
        duration: 0.26,
        stagger: 0.038,
        ease: "back.out(1.5)",
      },
      "entrance+=0.08"
    );
  }

  // Center panel reveals right as tiles complete their assembly
  if (centerPanel) {
    tl.to(
      centerPanel,
      {
        opacity: 1,
        scale: 1,
        duration: 0.32,
        ease: "power2.out",
      },
      "entrance+=0.38"
    );
  }

  // ==========================================
  // 2. DICE ROLL (~0.6s -> ~1.6s)
  // ==========================================
  tl.addLabel("diceRoll", 0.62);

  if (die) {
    // Pop in and tumble in place (rotation + squash/stretch only — the die
    // never leaves its resting slot, so it can't end up mispositioned).
    tl.to(
      die,
      {
        opacity: 1,
        scale: 1.25,
        rotation: 25,
        duration: 0.22,
        ease: "power1.out",
      },
      "diceRoll"
    )
      .to(
        die,
        {
          rotation: -20,
          duration: 0.2,
          ease: "power1.inOut",
        },
        "diceRoll+=0.22"
      )
      // Landing bounce with squash and stretch
      .to(
        die,
        {
          scaleX: 1.35,
          scaleY: 0.72,
          rotation: 0,
          duration: 0.1,
          ease: "power2.out",
        },
        "diceRoll+=0.42"
      )
      .to(
        die,
        {
          scaleX: 0.88,
          scaleY: 1.18,
          duration: 0.14,
          ease: "power1.out",
        },
        "diceRoll+=0.52"
      )
      .to(
        die,
        {
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 0.18,
          ease: "bounce.out",
        },
        "diceRoll+=0.66"
      );
  }

  // ==========================================
  // 3. TITLE REVEAL (~1.6s -> ~2.4s)
  // ==========================================
  tl.addLabel("titleReveal", 1.62);

  // "STARTUP" bold black header drops in with slight punch
  if (titleStartup) {
    tl.to(
      titleStartup,
      {
        opacity: 1,
        y: 0,
        duration: 0.32,
        ease: "back.out(1.6)",
      },
      "titleReveal"
    );
  }

  // "POLY" vibrant blue background badge pops open
  if (titlePolyBadge) {
    tl.to(
      titlePolyBadge,
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      "titleReveal+=0.1"
    );
  }

  // "P   LY" lettering reveals inside the badge
  if (titlePolyText) {
    tl.to(
      titlePolyText,
      {
        opacity: 1,
        duration: 0.22,
        ease: "power1.out",
      },
      "titleReveal+=0.18"
    );
  }

  // ==========================================
  // 4. RESOLUTION (~2.4s -> ~3.2s)
  // ==========================================
  tl.addLabel("resolution", 2.4);

  // Tagline wipes in beneath the title
  if (tagline) {
    tl.to(
      tagline,
      {
        opacity: 1,
        y: 0,
        duration: 0.34,
        ease: "power2.out",
      },
      "resolution"
    );
  }

  // Card deck stacks slide in from left and right edges
  if (leftDeck) {
    tl.to(
      leftDeck,
      {
        opacity: 1,
        x: 0,
        duration: 0.44,
        ease: "power2.out",
      },
      "resolution+=0.1"
    );
  }

  if (rightDeck) {
    tl.to(
      rightDeck,
      {
        opacity: 1,
        x: 0,
        duration: 0.44,
        ease: "power2.out",
      },
      "resolution+=0.1"
    );
  }

  // Ambient star sparkles fade in gently
  if (ambientAccents) {
    tl.to(
      ambientAccents,
      {
        opacity: 1,
        duration: 0.4,
        ease: "power1.out",
      },
      "resolution+=0.22"
    );
  }

  // ==========================================
  // 5. HOLD (~3.2s -> ~3.8s)
  // ==========================================
  tl.addLabel("hold", 3.2);

  // Subtle idle breathing motion
  if (boardGroup) {
    tl.to(
      boardGroup,
      {
        y: -4,
        duration: 0.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      },
      "hold"
    );
  }

  // ==========================================
  // 6. EXIT (~3.8s -> ~4.4s)
  // ==========================================
  tl.addLabel("exit", 3.8);

  // Title, tagline, die, decks fade out quickly
  const fadeOutElements: SVGElement[] = [];
  if (titleStartup) fadeOutElements.push(titleStartup);
  if (titlePolyBadge) fadeOutElements.push(titlePolyBadge);
  if (titlePolyText) fadeOutElements.push(titlePolyText);
  if (tagline) fadeOutElements.push(tagline);
  if (die) fadeOutElements.push(die);
  if (leftDeck) fadeOutElements.push(leftDeck);
  if (rightDeck) fadeOutElements.push(rightDeck);
  if (ambientAccents) fadeOutElements.push(ambientAccents);

  if (fadeOutElements.length > 0) {
    tl.to(
      fadeOutElements,
      {
        opacity: 0,
        duration: 0.24,
        ease: "power2.in",
      },
      "exit"
    );
  }

  // Board tiles disassemble outward in reverse stagger
  if (tiles.length > 0) {
    tl.to(
      tiles,
      {
        opacity: 0,
        scale: 0.7,
        duration: 0.26,
        stagger: {
          each: 0.02,
          from: "end",
        },
        ease: "power2.in",
      },
      "exit+=0.06"
    );
  }

  if (centerPanel) {
    tl.to(
      centerPanel,
      {
        opacity: 0,
        scale: 0.85,
        duration: 0.25,
        ease: "power2.in",
      },
      "exit+=0.1"
    );
  }

  // Container fades out to reveal website
  if (container) {
    tl.to(
      container,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      "exit+=0.25"
    );
  }

  return tl;
}

/**
 * Fast-forward timeline to the exit phase on user skip / dismiss.
 */
export function skipStartupPolyTimelineToExit(
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
    }
  } else {
    tl.progress(1);
  }
}
