// app/overlay-animations/animations/events/Crossroads/crossroadsTimeline.ts
import gsap from "gsap";

export interface CrossroadsSceneTargets {
  container: HTMLElement | null;
  skipButton: HTMLElement | null;

  // Background & Clouds
  backgroundGroup: SVGElement | null;
  cloudsGroup: SVGElement | null;

  // Semicircle Glow behind signpost
  semicircleGlow: SVGElement | null;

  // Signpost Pole & Base
  signpostPole: SVGElement | null;

  // 3 Arrow Signs
  signArrow1: SVGElement | null;
  signArrow2: SVGElement | null;
  signArrow3: SVGElement | null;

  // Roads Group & Extension Clips
  roadsGroup: SVGElement | null;
  roadLeftGroup: SVGElement | null;
  roadRightGroup: SVGElement | null;
  clipRectRoadLeft: SVGRectElement | null;
  clipRectRoadRight: SVGRectElement | null;
  crosswalkX: SVGElement | null;
  roadBottomBlue: SVGElement | null;

  // Motion-line Accents
  motionAccentsGroup: SVGElement | null;

  // Title Wipe & Ambient
  titleGroup: SVGElement | null;
  titleClipRect: SVGRectElement | null;
  ambientGroup: SVGElement | null;
}

export interface CrossroadsTimelineOptions {
  onEntranceComplete?: () => void;
  onComplete?: () => void;
}

export function createCrossroadsMasterTl(
  t: CrossroadsSceneTargets,
  options: CrossroadsTimelineOptions = {}
): gsap.core.Timeline {
  const { onEntranceComplete, onComplete } = options;

  // ── Initial setup ───────────────────────────────────────────────────────────
  if (t.container) gsap.set(t.container, { opacity: 0 });
  if (t.skipButton) gsap.set(t.skipButton, { opacity: 0, pointerEvents: "none" });

  if (t.cloudsGroup) gsap.set(t.cloudsGroup, { opacity: 0, y: -15 });
  if (t.backgroundGroup) gsap.set(t.backgroundGroup, { opacity: 0 });

  if (t.signpostPole) {
    gsap.set(t.signpostPole, {
      scaleY: 0,
      transformOrigin: "730px 562px",
      opacity: 0,
    });
  }

  if (t.semicircleGlow) {
    gsap.set(t.semicircleGlow, {
      opacity: 0,
      scale: 0.75,
      transformOrigin: "730px 424px",
    });
  }

  if (t.signArrow1) {
    gsap.set(t.signArrow1, {
      scale: 0,
      transformOrigin: "730px 100px",
      opacity: 0,
    });
  }
  if (t.signArrow2) {
    gsap.set(t.signArrow2, {
      scale: 0,
      transformOrigin: "730px 178px",
      opacity: 0,
    });
  }
  if (t.signArrow3) {
    gsap.set(t.signArrow3, {
      scale: 0,
      transformOrigin: "730px 273px",
      opacity: 0,
    });
  }

  // Roads initially clipped at center (x=730, width=0)
  if (t.clipRectRoadLeft) {
    gsap.set(t.clipRectRoadLeft, { attr: { x: 730, width: 0 } });
  }
  if (t.clipRectRoadRight) {
    gsap.set(t.clipRectRoadRight, { attr: { x: 725, width: 0 } });
  }
  if (t.roadLeftGroup) {
    gsap.set(t.roadLeftGroup, { transformOrigin: "730px 562px", opacity: 0.8 });
  }
  if (t.roadRightGroup) {
    gsap.set(t.roadRightGroup, { transformOrigin: "730px 562px", opacity: 0.8 });
  }
  if (t.roadBottomBlue) {
    gsap.set(t.roadBottomBlue, { opacity: 0 });
  }
  if (t.crosswalkX) {
    gsap.set(t.crosswalkX, {
      scale: 0,
      transformOrigin: "730px 617px",
      opacity: 0,
    });
  }

  if (t.motionAccentsGroup) {
    gsap.set(t.motionAccentsGroup, { opacity: 0, scale: 0.6, transformOrigin: "730px 240px" });
  }

  // Title clip: initially 0 width centered at x=730
  if (t.titleClipRect) {
    gsap.set(t.titleClipRect, { attr: { x: 730, width: 0 } });
  }
  if (t.titleGroup) {
    gsap.set(t.titleGroup, { opacity: 1 });
  }
  if (t.ambientGroup) {
    gsap.set(t.ambientGroup, { opacity: 0 });
  }

  // ── Timeline construction ───────────────────────────────────────────────────
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      onComplete?.();
    },
  });

  // ── PHASE 1: ENTRANCE (0 → ~0.4s) ──────────────────────────────────────────
  tl.to(t.container, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0);
  tl.to(t.backgroundGroup, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0);
  tl.to(t.skipButton, { opacity: 1, pointerEvents: "auto", duration: 0.25 }, 0.2);

  // Clouds fade in & float gently down to resting position
  if (t.cloudsGroup) {
    tl.to(t.cloudsGroup, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.05);
  }

  // Signpost pole pops in growing upward from base (730, 562)
  if (t.signpostPole) {
    tl.to(t.signpostPole, {
      scaleY: 1,
      opacity: 1,
      duration: 0.38,
      ease: "back.out(1.4)",
    }, 0.1);
  }

  // ── PHASE 2: MAIN IDEA — ROADS EXTEND (~0.4s → ~1.4s) ──────────────────────
  // Semicircle glow fades in behind the signpost as roads begin extending
  if (t.semicircleGlow) {
    tl.to(t.semicircleGlow, {
      opacity: 1,
      scale: 1,
      duration: 0.55,
      ease: "power2.out",
    }, 0.38);
  }

  // Left road extends from signpost outward toward bottom-left corner
  if (t.clipRectRoadLeft) {
    tl.to(t.clipRectRoadLeft, {
      attr: { x: 0, width: 735 },
      duration: 0.88,
      ease: "power2.inOut",
    }, 0.42);
  }
  if (t.roadLeftGroup) {
    tl.to(t.roadLeftGroup, { opacity: 1, duration: 0.4 }, 0.42);
  }

  // Right road extends from signpost outward toward bottom-right (0.07s slight stagger)
  if (t.clipRectRoadRight) {
    tl.to(t.clipRectRoadRight, {
      attr: { width: 735 },
      duration: 0.88,
      ease: "power2.inOut",
    }, 0.49);
  }
  if (t.roadRightGroup) {
    tl.to(t.roadRightGroup, { opacity: 1, duration: 0.4 }, 0.49);
  }

  // Bottom convergence blue border reveals
  if (t.roadBottomBlue) {
    tl.to(t.roadBottomBlue, { opacity: 1, duration: 0.35, ease: "power1.out" }, 1.05);
  }

  // ── PHASE 3: INTERACTION (~1.4s → ~1.8s) ───────────────────────────────────
  // White crosswalk X marks the convergence point right as roads finish extending
  if (t.crosswalkX) {
    tl.to(t.crosswalkX, {
      scale: 1,
      opacity: 1,
      duration: 0.32,
      ease: "back.out(1.6)",
    }, 1.35);
  }

  // 3 arrow signs pop in with sequential stagger
  if (t.signArrow1) {
    tl.to(t.signArrow1, {
      scale: 1,
      opacity: 1,
      duration: 0.32,
      ease: "back.out(1.9)",
    }, 1.42);
  }
  if (t.signArrow2) {
    tl.to(t.signArrow2, {
      scale: 1,
      opacity: 1,
      duration: 0.32,
      ease: "back.out(1.9)",
    }, 1.50);
  }
  if (t.signArrow3) {
    tl.to(t.signArrow3, {
      scale: 1,
      opacity: 1,
      duration: 0.32,
      ease: "back.out(1.9)",
    }, 1.58);
  }

  // Motion-line accents flicker in
  if (t.motionAccentsGroup) {
    tl.to(t.motionAccentsGroup, {
      opacity: 1,
      scale: 1,
      duration: 0.24,
      ease: "back.out(2)",
    }, 1.64);
  }

  // Call onEntranceComplete hook
  tl.call(() => {
    onEntranceComplete?.();
  }, undefined, 1.78);

  // ── PHASE 4: TITLE REVEAL (~1.8s → ~2.5s) ──────────────────────────────────
  // "CROSS" (black) + "ROADS" (blue) wipes in outward from center x=730
  if (t.titleClipRect) {
    tl.to(t.titleClipRect, {
      attr: { x: 180, width: 1100 },
      duration: 0.65,
      ease: "power2.out",
    }, 1.82);
  }

  // Side text ("IDEAS PEOPLE OPPORTUNITIES" & "DIFFERENT PERSPECTIVES...") fade in
  if (t.ambientGroup) {
    tl.to(t.ambientGroup, { opacity: 1, duration: 0.45, ease: "power1.out" }, 2.05);
  }

  // ── PHASE 5: RESOLUTION / HOLD (~2.5s → ~3.2s) ─────────────────────────────
  // Idle settle period — no new disruptive elements, holds until 3.2s
  tl.to({}, { duration: 0.7 }, 2.5);

  // ── PHASE 6: EXIT (~3.2s → ~3.8s) ──────────────────────────────────────────
  // Title fades quickly first
  if (t.titleGroup) {
    tl.to(t.titleGroup, { opacity: 0, duration: 0.22, ease: "power1.in" }, 3.20);
  }
  if (t.ambientGroup) {
    tl.to(t.ambientGroup, { opacity: 0, duration: 0.22, ease: "power1.in" }, 3.20);
  }
  if (t.motionAccentsGroup) {
    tl.to(t.motionAccentsGroup, { opacity: 0, duration: 0.16 }, 3.22);
  }

  // Roads retract back into the signpost (reverse of extension)
  if (t.clipRectRoadLeft) {
    tl.to(t.clipRectRoadLeft, {
      attr: { x: 730, width: 0 },
      duration: 0.45,
      ease: "power2.in",
    }, 3.25);
  }
  if (t.clipRectRoadRight) {
    tl.to(t.clipRectRoadRight, {
      attr: { width: 0 },
      duration: 0.45,
      ease: "power2.in",
    }, 3.25);
  }
  if (t.crosswalkX) {
    tl.to(t.crosswalkX, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in" }, 3.26);
  }
  if (t.roadBottomBlue) {
    tl.to(t.roadBottomBlue, { opacity: 0, duration: 0.2 }, 3.28);
  }

  // Semicircle glow shrinks & fades
  if (t.semicircleGlow) {
    tl.to(t.semicircleGlow, { scale: 0.75, opacity: 0, duration: 0.32, ease: "power2.in" }, 3.32);
  }

  // Arrow signs pop out in reverse order
  if (t.signArrow3) {
    tl.to(t.signArrow3, { scale: 0, opacity: 0, duration: 0.22, ease: "back.in(1.6)" }, 3.34);
  }
  if (t.signArrow2) {
    tl.to(t.signArrow2, { scale: 0, opacity: 0, duration: 0.22, ease: "back.in(1.6)" }, 3.38);
  }
  if (t.signArrow1) {
    tl.to(t.signArrow1, { scale: 0, opacity: 0, duration: 0.22, ease: "back.in(1.6)" }, 3.42);
  }

  // Signpost pole shrinks back down to base
  if (t.signpostPole) {
    tl.to(t.signpostPole, { scaleY: 0, opacity: 0, duration: 0.3, ease: "power2.in" }, 3.44);
  }

  // Clouds and background fade out, revealing website
  if (t.cloudsGroup) {
    tl.to(t.cloudsGroup, { opacity: 0, y: -10, duration: 0.28 }, 3.50);
  }
  tl.to(t.container, { opacity: 0, duration: 0.3, ease: "power1.in" }, 3.52);

  return tl;
}

// ── Gentle ambient idle loops ──────────────────────────────────────────────────
export function startCrossroadsIdleLoops(t: CrossroadsSceneTargets): gsap.core.Tween[] {
  const tweens: gsap.core.Tween[] = [];

  if (t.cloudsGroup) {
    tweens.push(
      gsap.to(t.cloudsGroup, {
        y: "+=6",
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      })
    );
  }

  if (t.motionAccentsGroup) {
    tweens.push(
      gsap.to(t.motionAccentsGroup, {
        opacity: 0.75,
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      })
    );
  }

  return tweens;
}

// ── Interruptible exit transition ─────────────────────────────────────────────
export function runCrossroadsExit(
  t: CrossroadsSceneTargets,
  onComplete: () => void,
  idleTweens: gsap.core.Tween[] = []
): void {
  idleTweens.forEach((tw) => tw.kill());

  const exitTl = gsap.timeline({
    onComplete: () => {
      onComplete();
    },
  });

  if (t.titleGroup) {
    exitTl.to(t.titleGroup, { opacity: 0, duration: 0.18 }, 0);
  }
  if (t.ambientGroup) {
    exitTl.to(t.ambientGroup, { opacity: 0, duration: 0.18 }, 0);
  }
  if (t.motionAccentsGroup) {
    exitTl.to(t.motionAccentsGroup, { opacity: 0, duration: 0.15 }, 0);
  }

  if (t.clipRectRoadLeft) {
    exitTl.to(t.clipRectRoadLeft, { attr: { x: 730, width: 0 }, duration: 0.28, ease: "power2.in" }, 0.05);
  }
  if (t.clipRectRoadRight) {
    exitTl.to(t.clipRectRoadRight, { attr: { width: 0 }, duration: 0.28, ease: "power2.in" }, 0.05);
  }
  if (t.crosswalkX) {
    exitTl.to(t.crosswalkX, { scale: 0, opacity: 0, duration: 0.2 }, 0.05);
  }
  if (t.signArrow1) exitTl.to(t.signArrow1, { scale: 0, opacity: 0, duration: 0.18 }, 0.1);
  if (t.signArrow2) exitTl.to(t.signArrow2, { scale: 0, opacity: 0, duration: 0.18 }, 0.1);
  if (t.signArrow3) exitTl.to(t.signArrow3, { scale: 0, opacity: 0, duration: 0.18 }, 0.1);
  if (t.signpostPole) exitTl.to(t.signpostPole, { scaleY: 0, opacity: 0, duration: 0.2 }, 0.14);
  if (t.semicircleGlow) exitTl.to(t.semicircleGlow, { scale: 0.75, opacity: 0, duration: 0.2 }, 0.14);
  if (t.container) exitTl.to(t.container, { opacity: 0, duration: 0.24, ease: "power1.in" }, 0.18);
}
