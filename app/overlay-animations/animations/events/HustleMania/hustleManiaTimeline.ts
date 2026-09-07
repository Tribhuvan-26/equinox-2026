// app/overlay-animations/animations/events/HustleMania/hustleManiaTimeline.ts
import gsap from "gsap";

export interface HustleManiaSceneTargets {
  container: HTMLElement | null;
  stageFrame: HTMLElement | null;
  baseImage: HTMLElement | null;
  skipButton: HTMLElement | null;

  // Header & branding
  brandingLeft: SVGElement | null;
  brandingRight: SVGElement | null;
  topTagline: SVGElement | null;

  // Scene accents
  signBoard: SVGElement | null;
  hangingTagGroup: SVGElement | null;
  hangingTag: SVGElement | null; // inner tag for swinging rotation
  dealBubbleGroup: SVGElement | null;

  // Title elements
  titleBlock: SVGElement | null;
  titleHustle: SVGElement | null;
  titleMania: SVGElement | null;
  motionLinesLeft: SVGElement | null;
  motionLinesRight: SVGElement | null;

  // Slanted callout
  sameGameDreams: SVGElement | null;
}

export interface HustleManiaTimelineOptions {
  onEntranceComplete?: () => void;
  onComplete?: () => void;
}

export function createHustleManiaMasterTl(
  t: HustleManiaSceneTargets,
  options: HustleManiaTimelineOptions = {}
): gsap.core.Timeline {
  const { onEntranceComplete, onComplete } = options;

  // ── Initial Setup ──────────────────────────────────────────────────────────
  if (t.container) gsap.set(t.container, { opacity: 0 });
  if (t.stageFrame) gsap.set(t.stageFrame, { opacity: 0, scale: 0.96 });
  if (t.baseImage) gsap.set(t.baseImage, { opacity: 0, scale: 0.97 });
  if (t.skipButton) gsap.set(t.skipButton, { opacity: 0, pointerEvents: "none" });

  // Branding & taglines
  if (t.brandingLeft) gsap.set(t.brandingLeft, { opacity: 0, y: -10 });
  if (t.brandingRight) gsap.set(t.brandingRight, { opacity: 0, y: -10 });
  if (t.topTagline) gsap.set(t.topTagline, { opacity: 0, y: -8 });

  // Main props
  if (t.signBoard) gsap.set(t.signBoard, { opacity: 0, scale: 0.85, transformOrigin: "256px 540px" });
  if (t.hangingTagGroup) gsap.set(t.hangingTagGroup, { opacity: 0, y: -15 });
  if (t.hangingTag) gsap.set(t.hangingTag, { transformOrigin: "765px 282px" });

  // Interaction bubble
  if (t.dealBubbleGroup) gsap.set(t.dealBubbleGroup, { opacity: 0, scale: 0.5, transformOrigin: "530px 355px" });

  // Title & motion lines
  if (t.titleHustle) gsap.set(t.titleHustle, { opacity: 0, y: -20, scaleY: 0.8, transformOrigin: "505px 145px" });
  if (t.titleMania) gsap.set(t.titleMania, { opacity: 0, scale: 0.82, transformOrigin: "505px 245px" });
  if (t.motionLinesLeft) gsap.set(t.motionLinesLeft, { opacity: 0, x: 15 });
  if (t.motionLinesRight) gsap.set(t.motionLinesRight, { opacity: 0, x: -15 });

  // Slanted callout
  if (t.sameGameDreams) gsap.set(t.sameGameDreams, { opacity: 0, scale: 0.88, transformOrigin: "900px 150px" });

  // ── Master Timeline ────────────────────────────────────────────────────────
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      onComplete?.();
    },
  });

  // 1. ENTRANCE (~0.5s): Overlay fades in, base stall image scales/fades in centered
  tl.to(t.container, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0);
  tl.to(t.stageFrame, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 0.05);
  tl.to(t.baseImage, { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }, 0.08);
  tl.to(t.skipButton, { opacity: 1, pointerEvents: "auto", duration: 0.25 }, 0.25);

  // 2. MAIN IDEA (~0.5s → ~1.3s): Sign board and hanging tag pop in around the stall image
  if (t.signBoard) {
    tl.to(
      t.signBoard,
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.4)",
      },
      0.55
    );
  }

  if (t.hangingTagGroup) {
    tl.to(
      t.hangingTagGroup,
      {
        opacity: 1,
        y: 0,
        duration: 0.48,
        ease: "back.out(1.3)",
      },
      0.72
    );
  }

  // 3. INTERACTION (~1.3s → ~1.9s): "DEAL?" speech bubble pops in near the figures
  if (t.dealBubbleGroup) {
    tl.to(
      t.dealBubbleGroup,
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.8)",
      },
      1.35
    );
  }

  // 4. TITLE REVEAL (~1.9s → ~2.6s): "HUSTLE" wipes in, "MANIA" wipes in beneath ~0.1s after
  if (t.titleHustle) {
    tl.to(
      t.titleHustle,
      {
        opacity: 1,
        y: 0,
        scaleY: 1,
        duration: 0.35,
        ease: "back.out(1.5)",
      },
      1.9
    );
  }

  if (t.titleMania) {
    tl.to(
      t.titleMania,
      {
        opacity: 1,
        scale: 1,
        duration: 0.38,
        ease: "back.out(1.6)",
      },
      2.05
    );
  }

  // 5. RESOLUTION / HOLD (~2.6s → ~3.3s): Tagline, "SAME GAME BIGGER DREAMS", motion lines
  if (t.topTagline) {
    tl.to(t.topTagline, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 2.5);
  }

  if (t.brandingLeft) {
    tl.to(t.brandingLeft, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 2.55);
  }

  if (t.brandingRight) {
    tl.to(t.brandingRight, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 2.55);
  }

  if (t.sameGameDreams) {
    tl.to(
      t.sameGameDreams,
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.4)",
      },
      2.6
    );
  }

  if (t.motionLinesLeft) {
    tl.to(t.motionLinesLeft, { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }, 2.65);
  }

  if (t.motionLinesRight) {
    tl.to(t.motionLinesRight, { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }, 2.65);
  }

  tl.call(() => {
    onEntranceComplete?.();
  }, undefined, 2.7);

  // 6. EXIT (~3.3s → ~3.9s): Everything fades out fast, base image fades/scales out last
  tl.to(
    [
      t.titleHustle,
      t.titleMania,
      t.topTagline,
      t.sameGameDreams,
      t.motionLinesLeft,
      t.motionLinesRight,
      t.dealBubbleGroup,
      t.signBoard,
      t.hangingTagGroup,
      t.brandingLeft,
      t.brandingRight,
      t.skipButton,
    ],
    {
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
    },
    3.3
  );

  tl.to(
    t.baseImage,
    {
      opacity: 0,
      scale: 0.96,
      duration: 0.35,
      ease: "power2.in",
    },
    3.45
  );

  tl.to(
    t.container,
    {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    },
    3.6
  );

  return tl;
}

export function startHustleManiaIdleLoops(targets: {
  hangingTag: SVGElement | null;
}): gsap.core.Tween[] {
  const loops: gsap.core.Tween[] = [];

  if (targets.hangingTag) {
    loops.push(
      gsap.to(targets.hangingTag, {
        rotation: 4.5,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "765px 282px",
      })
    );
  }

  return loops;
}

export function runHustleManiaExit(
  container: HTMLElement | null,
  idleTweens: gsap.core.Tween[],
  onComplete?: () => void
): void {
  idleTweens.forEach((tw) => tw.kill());
  if (!container) {
    onComplete?.();
    return;
  }
  gsap.killTweensOf(container);
  gsap.to(container, {
    opacity: 0,
    duration: 0.25,
    ease: "power2.in",
    onComplete: () => {
      onComplete?.();
    },
  });
}
