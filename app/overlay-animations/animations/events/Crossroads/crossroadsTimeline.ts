// app/overlay-animations/animations/events/Crossroads/crossroadsTimeline.ts
import gsap from "gsap";

export interface CrossroadsSceneTargets {
  container: HTMLElement | null;
  skipButton: HTMLElement | null;
  semicircleGlow: SVGElement | null;
  signpostPole: SVGElement | null;
  signArrow1: SVGElement | null;
  signArrow2: SVGElement | null;
  signArrow3: SVGElement | null;
  // Road A stroked elements (drawn from signpost outward)
  roadAEls: SVGElement[];
  // Road B stroked elements
  roadBEls: SVGElement[];
  // Crosswalk X
  crosswalkXArm1: SVGLineElement | null;
  crosswalkXArm2: SVGLineElement | null;
  // Title wipe reveal clip rects
  titleClipLeft: SVGRectElement | null;
  titleClipRight: SVGRectElement | null;
  titleGroup: SVGElement | null;
  ambientGroup: SVGElement | null;
  cornerAnnotations: SVGElement | null;
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

  // ── Initial states ─────────────────────────────────────────────────────────
  if (t.container) gsap.set(t.container, { opacity: 0 });
  if (t.skipButton) gsap.set(t.skipButton, { opacity: 0, pointerEvents: "none" });

  if (t.semicircleGlow) gsap.set(t.semicircleGlow, { opacity: 0, scale: 0.8, transformOrigin: "960px 650px" });
  if (t.signpostPole) gsap.set(t.signpostPole, { scaleY: 0, transformOrigin: "960px 650px", opacity: 0 });

  if (t.signArrow1) gsap.set(t.signArrow1, { scale: 0, transformOrigin: "960px 185px", opacity: 0 });
  if (t.signArrow2) gsap.set(t.signArrow2, { scale: 0, transformOrigin: "960px 255px", opacity: 0 });
  if (t.signArrow3) gsap.set(t.signArrow3, { scale: 0, transformOrigin: "960px 325px", opacity: 0 });

  // Roads initially hidden via strokeDashoffset
  const roadLen = 1400;
  t.roadAEls.forEach((el) => {
    if (el) gsap.set(el, { strokeDasharray: roadLen, strokeDashoffset: roadLen });
  });
  t.roadBEls.forEach((el) => {
    if (el) gsap.set(el, { strokeDasharray: roadLen, strokeDashoffset: roadLen });
  });

  // Crosswalk X arms
  const xArmLen = 300;
  if (t.crosswalkXArm1) gsap.set(t.crosswalkXArm1, { strokeDasharray: xArmLen, strokeDashoffset: xArmLen });
  if (t.crosswalkXArm2) gsap.set(t.crosswalkXArm2, { strokeDasharray: xArmLen, strokeDashoffset: xArmLen });

  // Title clip rectangles: initially 0 width anchored at x=960
  if (t.titleClipLeft) gsap.set(t.titleClipLeft, { attr: { x: 960, width: 0 } });
  if (t.titleClipRight) gsap.set(t.titleClipRight, { attr: { x: 960, width: 0 } });
  if (t.titleGroup) gsap.set(t.titleGroup, { opacity: 1 });

  if (t.ambientGroup) gsap.set(t.ambientGroup, { opacity: 0 });
  if (t.cornerAnnotations) gsap.set(t.cornerAnnotations, { opacity: 0 });

  // ── Timeline construction ──────────────────────────────────────────────────
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      onComplete?.();
    },
  });

  // 1. ENTRANCE (0 → ~0.5s)
  tl.to(t.container, { opacity: 1, duration: 0.35, ease: "power1.out" }, 0);
  tl.to(t.skipButton, { opacity: 1, pointerEvents: "auto", duration: 0.25 }, 0.2);

  // Semicircle glow fades & scales in behind signpost
  if (t.semicircleGlow) {
    tl.to(t.semicircleGlow, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.2)" }, 0.08);
  }

  // Signpost pole grows up from base
  if (t.signpostPole) {
    tl.to(t.signpostPole, { scaleY: 1, opacity: 1, duration: 0.42, ease: "power2.out" }, 0.12);
  }

  // 3 arrow signs pop in with 0.05s stagger
  if (t.signArrow1) tl.to(t.signArrow1, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.8)" }, 0.3);
  if (t.signArrow2) tl.to(t.signArrow2, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.8)" }, 0.35);
  if (t.signArrow3) tl.to(t.signArrow3, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.8)" }, 0.4);

  // 2. MAIN IDEA — ROADS EXTEND AND CROSS (~0.5s → ~1.5s)
  // Road A extends from signpost outward toward bottom-left
  t.roadAEls.forEach((el) => {
    if (el) {
      tl.to(el, { strokeDashoffset: 0, duration: 0.95, ease: "power2.inOut" }, 0.5);
    }
  });

  // Road B extends from signpost outward toward bottom-right (slight 0.08s stagger)
  t.roadBEls.forEach((el) => {
    if (el) {
      tl.to(el, { strokeDashoffset: 0, duration: 0.95, ease: "power2.inOut" }, 0.58);
    }
  });

  // Crosswalk X marking draws on right as roads complete
  if (t.crosswalkXArm1) {
    tl.to(t.crosswalkXArm1, { strokeDashoffset: 0, duration: 0.28, ease: "power1.out" }, 1.38);
  }
  if (t.crosswalkXArm2) {
    tl.to(t.crosswalkXArm2, { strokeDashoffset: 0, duration: 0.28, ease: "power1.out" }, 1.44);
  }

  // 3. TITLE EMERGES FROM SIGN (~1.5s → ~2.3s)
  // "CROSS" emerges/slides out from the LEFT side of the signpost
  if (t.titleClipLeft) {
    tl.to(
      t.titleClipLeft,
      {
        attr: { x: 0, width: 960 },
        duration: 0.72,
        ease: "power3.out",
      },
      1.52
    );
  }

  // "ROADS" emerges/slides out from the RIGHT side of the signpost (staggered ~0.1s after CROSS)
  if (t.titleClipRight) {
    tl.to(
      t.titleClipRight,
      {
        attr: { x: 960, width: 960 },
        duration: 0.72,
        ease: "power3.out",
      },
      1.62
    );
  }

  // 4. RESOLUTION / HOLD (~2.3s → ~3.8s)
  // Ambient details and corner annotations fade in softly
  if (t.ambientGroup) {
    tl.to(t.ambientGroup, { opacity: 1, duration: 0.55, ease: "power1.out" }, 2.15);
  }
  if (t.cornerAnnotations) {
    tl.to(t.cornerAnnotations, { opacity: 1, duration: 0.45, ease: "power1.out" }, 2.2);
  }

  // Notify entrance complete at 2.3s
  tl.call(() => {
    onEntranceComplete?.();
  }, undefined, 2.3);

  // 5. EXIT (~4.6s → ~5.2s)
  // Title fades out fast
  if (t.titleGroup) {
    tl.to(t.titleGroup, { opacity: 0, duration: 0.25, ease: "power2.in" }, 4.6);
  }
  if (t.ambientGroup) {
    tl.to(t.ambientGroup, { opacity: 0, duration: 0.25, ease: "power2.in" }, 4.65);
  }
  if (t.crosswalkXArm1) {
    tl.to(t.crosswalkXArm1, { strokeDashoffset: xArmLen, duration: 0.25, ease: "power2.in" }, 4.65);
  }
  if (t.crosswalkXArm2) {
    tl.to(t.crosswalkXArm2, { strokeDashoffset: xArmLen, duration: 0.25, ease: "power2.in" }, 4.65);
  }

  // Roads retract back into the signpost
  t.roadAEls.forEach((el) => {
    if (el) tl.to(el, { strokeDashoffset: roadLen, duration: 0.42, ease: "power2.in" }, 4.7);
  });
  t.roadBEls.forEach((el) => {
    if (el) tl.to(el, { strokeDashoffset: roadLen, duration: 0.42, ease: "power2.in" }, 4.72);
  });

  // Signpost and glow fade out last
  if (t.signArrow1) tl.to(t.signArrow1, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.in" }, 4.85);
  if (t.signArrow2) tl.to(t.signArrow2, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.in" }, 4.88);
  if (t.signArrow3) tl.to(t.signArrow3, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.in" }, 4.9);
  if (t.signpostPole) tl.to(t.signpostPole, { scaleY: 0, opacity: 0, duration: 0.25, ease: "power2.in" }, 4.92);
  if (t.semicircleGlow) tl.to(t.semicircleGlow, { opacity: 0, scale: 0.8, duration: 0.25, ease: "power2.in" }, 4.95);
  if (t.cornerAnnotations) tl.to(t.cornerAnnotations, { opacity: 0, duration: 0.25 }, 4.95);

  // Background fades out
  tl.to(t.container, { opacity: 0, duration: 0.35, ease: "power2.in" }, 5.0);

  return tl;
}

export function startCrossroadsIdleLoops(
  targets: Pick<CrossroadsSceneTargets, "signArrow1" | "signArrow2" | "signArrow3">
): gsap.core.Tween[] {
  const loops: gsap.core.Tween[] = [];

  if (targets.signArrow1) {
    loops.push(
      gsap.to(targets.signArrow1, {
        rotation: "+=2.2",
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "960px 185px",
      })
    );
  }
  if (targets.signArrow2) {
    loops.push(
      gsap.to(targets.signArrow2, {
        rotation: "-=2.4",
        duration: 2.6,
        delay: 0.3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "960px 255px",
      })
    );
  }
  if (targets.signArrow3) {
    loops.push(
      gsap.to(targets.signArrow3, {
        rotation: "+=1.8",
        duration: 2.4,
        delay: 0.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "960px 325px",
      })
    );
  }

  return loops;
}

export function runCrossroadsExit(
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
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      onComplete?.();
    },
  });
}
