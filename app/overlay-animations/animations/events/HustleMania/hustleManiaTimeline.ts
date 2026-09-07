// app/overlay-animations/animations/events/HustleMania/hustleManiaTimeline.ts
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface HustleManiaSceneTargets {
  container: HTMLElement | null;
  skipButton: HTMLElement | null;
  // Groups animated together in entrance (tight stagger)
  leftStall: SVGElement | null;
  rightStall: SVGElement | null;
  centerBg: SVGElement | null;
  buntingGroup: SVGElement | null;
  titleGroup: SVGElement | null;
  callout: SVGElement | null;
  leftBuyer: SVGElement | null;
  rightBuyer: SVGElement | null;
  bubbleDeal: SVGElement | null;
  bubbleYours: SVGElement | null;
  rightSign: SVGElement | null;
  steamGroup: SVGElement | null;
  cornerAnnotations: SVGElement | null;
  // For idle loops
  buntingFlags: SVGElement[];
  steamEls: SVGElement[];
}

export interface HustleManiaTimelineOptions {
  /** Fires when the entrance phase finishes (time to start idle loops). */
  onEntranceComplete?: () => void;
  /** Fires when the exit phase finishes (time to unmount/clear). */
  onComplete?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Entrance timeline (pop-in, ~0.55s)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates and returns the entrance GSAP timeline (paused).
 * Call .play() after creation.
 * When the entrance finishes, `options.onEntranceComplete` fires so the
 * caller can start idle loops.
 */
export function createHustleManiaEntranceTl(
  t: HustleManiaSceneTargets,
  options: HustleManiaTimelineOptions = {}
): gsap.core.Timeline {
  const { onEntranceComplete, onComplete } = options;

  // ── Initial states ────────────────────────────────────────────────────────
  if (t.container) gsap.set(t.container, { opacity: 0 });
  if (t.skipButton) gsap.set(t.skipButton, { opacity: 0, pointerEvents: "none" });

  const sceneGroups = [
    t.leftStall,
    t.rightStall,
    t.centerBg,
    t.buntingGroup,
    t.titleGroup,
    t.callout,
    t.leftBuyer,
    t.rightBuyer,
    t.rightSign,
    t.steamGroup,
    t.cornerAnnotations,
  ].filter(Boolean) as SVGElement[];
  if (sceneGroups.length) gsap.set(sceneGroups, { opacity: 0 });

  if (t.bubbleDeal) gsap.set(t.bubbleDeal, { opacity: 0, scale: 0, transformOrigin: "685px 494px" });
  if (t.bubbleYours) gsap.set(t.bubbleYours, { opacity: 0, scale: 0, transformOrigin: "1618px 494px" });
  if (t.leftStall) gsap.set(t.leftStall, { x: -30, transformOrigin: "320px 600px" });
  if (t.rightStall) gsap.set(t.rightStall, { x: 30, transformOrigin: "1555px 600px" });
  if (t.titleGroup) gsap.set(t.titleGroup, { opacity: 0 });

  // ── Timeline build ────────────────────────────────────────────────────────
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      onEntranceComplete?.();
      onComplete?.();
    },
  });

  // Container fades in
  tl.to(t.container, { opacity: 1, duration: 0.28, ease: "power1.out" }, 0);

  // Skip button appears
  tl.to(t.skipButton, { opacity: 1, pointerEvents: "auto", duration: 0.2 }, 0.18);

  // Background + center
  if (t.centerBg)
    tl.to(t.centerBg, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0.04);

  // Stalls pop in from each side
  if (t.leftStall)
    tl.to(t.leftStall, { opacity: 1, x: 0, duration: 0.32, ease: "back.out(1.3)" }, 0.06);
  if (t.rightStall)
    tl.to(t.rightStall, { opacity: 1, x: 0, duration: 0.32, ease: "back.out(1.3)" }, 0.1);

  // Title group fades in
  if (t.titleGroup)
    tl.to(t.titleGroup, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0.16);

  // Bunting
  if (t.buntingGroup)
    tl.to(t.buntingGroup, { opacity: 1, duration: 0.22, ease: "power1.out" }, 0.18);

  // Callout
  if (t.callout)
    tl.to(t.callout, { opacity: 1, duration: 0.22 }, 0.26);

  // Buyers appear
  if (t.leftBuyer)
    tl.to(t.leftBuyer, { opacity: 1, duration: 0.24, ease: "power1.out" }, 0.24);
  if (t.rightBuyer)
    tl.to(t.rightBuyer, { opacity: 1, duration: 0.24, ease: "power1.out" }, 0.28);

  // Speech bubbles pop in
  if (t.bubbleDeal)
    tl.to(t.bubbleDeal, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2.2)" }, 0.32);
  if (t.bubbleYours)
    tl.to(t.bubbleYours, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2.2)" }, 0.35);

  // Standing sign + steam + corners
  if (t.rightSign)
    tl.to(t.rightSign, { opacity: 1, duration: 0.2 }, 0.34);
  if (t.steamGroup)
    tl.to(t.steamGroup, { opacity: 1, duration: 0.2 }, 0.38);
  if (t.cornerAnnotations)
    tl.to(t.cornerAnnotations, { opacity: 1, duration: 0.28 }, 0.36);

  return tl;
}

// ─────────────────────────────────────────────────────────────────────────────
// Idle loops — call after entrance completes
// Returns an array of live tweens so the caller can kill them on exit.
// All created inside the gsap.context() scope of the component.
// ─────────────────────────────────────────────────────────────────────────────

export function startHustleManiaIdleLoops(
  t: Pick<HustleManiaSceneTargets, "buntingFlags" | "steamEls" | "bubbleDeal" | "bubbleYours" | "callout">
): gsap.core.Tween[] {
  const loops: gsap.core.Tween[] = [];

  // 1. Bunting flag sway — each flag sways from its resting position
  t.buntingFlags.forEach((flag, i) => {
    if (!flag) return;
    const amplitude = 4 + (i % 3) * 1.5;
    const dur = 0.75 + (i % 4) * 0.12;
    const delay = i * 0.05;
    loops.push(
      gsap.to(flag, {
        rotation: amplitude,
        transformOrigin: "top center",
        duration: dur,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay,
      })
    );
  });

  // 2. Steam wisps — continuous upward drift + fade, staggered starts
  t.steamEls.forEach((steam, i) => {
    if (!steam) return;
    loops.push(
      gsap.fromTo(
        steam,
        { y: 0, opacity: 0.38 },
        {
          y: -52,
          opacity: 0,
          duration: 1.3 + i * 0.28,
          ease: "power1.out",
          repeat: -1,
          delay: i * 0.45,
        }
      )
    );
  });

  // 3. Speech bubble pulse — subtle scale breathe
  if (t.bubbleDeal) {
    loops.push(
      gsap.to(t.bubbleDeal, {
        scale: 1.042,
        transformOrigin: "882px 378px",
        duration: 1.3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    );
  }
  if (t.bubbleYours) {
    loops.push(
      gsap.to(t.bubbleYours, {
        scale: 1.038,
        transformOrigin: "1480px 404px",
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.4,
      })
    );
  }

  // 4. Callout sway — very subtle, slow rotation
  if (t.callout) {
    loops.push(
      gsap.to(t.callout, {
        rotation: 2.5,
        transformOrigin: "1490px 188px",
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.6,
      })
    );
  }

  return loops;
}

// ─────────────────────────────────────────────────────────────────────────────
// Exit — kill idle loops then fade everything out
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Kills all running idle loops and fades out the overlay container.
 * `onComplete` fires when the exit fade finishes.
 */
export function runHustleManiaExit(
  container: HTMLElement | null,
  idleLoops: gsap.core.Tween[],
  onComplete?: () => void
): void {
  // Kill idle loops first — important so they don't fight the fade-out
  idleLoops.forEach((t) => t.kill());

  if (!container) {
    onComplete?.();
    return;
  }

  gsap.to(container, {
    opacity: 0,
    duration: 0.5,
    ease: "power2.in",
    overwrite: "auto",
    onComplete: () => {
      onComplete?.();
    },
  });
}
