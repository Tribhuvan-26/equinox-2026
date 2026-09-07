// chatbot/animations/chatAnimations.ts
// GSAP timelines for overlay open/close, message entrances, and trigger physics

import gsap from "gsap";

/**
 * Animate chat window opening
 */
export function animateChatOpen(element: HTMLElement | null, onComplete?: () => void) {
  if (!element) return;

  gsap.killTweensOf(element);

  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.85,
      y: 24,
      transformOrigin: "bottom right",
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.38,
      ease: "back.out(1.25)",
      onComplete,
    }
  );
}

/**
 * Animate chat window closing
 */
export function animateChatClose(element: HTMLElement | null, onComplete?: () => void) {
  if (!element) return;

  gsap.killTweensOf(element);

  gsap.to(element, {
    opacity: 0,
    scale: 0.9,
    y: 16,
    duration: 0.22,
    ease: "power2.in",
    onComplete,
  });
}

/**
 * Floating button idle breathing animation
 */
export function animateTriggerHover(element: HTMLElement | null) {
  if (!element) return;

  gsap.to(element, {
    scale: 1.06,
    y: -3,
    duration: 0.2,
    ease: "power2.out",
  });
}

export function animateTriggerLeave(element: HTMLElement | null) {
  if (!element) return;

  gsap.to(element, {
    scale: 1,
    y: 0,
    duration: 0.25,
    ease: "power2.out",
  });
}

/**
 * Staggered entrance for newly appended message bubble
 */
export function animateMessageEntrance(element: HTMLElement | null) {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 14,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.32,
      ease: "power2.out",
    }
  );
}

/**
 * Event card entrance inside chat stream
 */
export function animateCardEntrance(element: HTMLElement | null) {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.94,
      y: 18,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.42,
      ease: "back.out(1.3)",
      delay: 0.08,
    }
  );
}

/**
 * Subtle button click ripple / pop
 */
export function animateClickPop(element: HTMLElement | null) {
  if (!element) return;

  gsap.timeline()
    .to(element, { scale: 0.92, duration: 0.08, ease: "power1.in" })
    .to(element, { scale: 1, duration: 0.18, ease: "back.out(2)" });
}
