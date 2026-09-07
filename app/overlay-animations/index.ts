// app/overlay-animations/index.ts
"use client";

export {
  animationRegistry,
  triggerAnimation,
  subscribeToAnimation,
  OverlayAnimationHost,
  PENDING_ANIMATION_KEY,
  setPendingAnimation,
  consumePendingAnimation,
} from "./animations/core/animationRegistry";

export type {
  AnimationComponentProps,
  AnimationEventKey,
  AnimationRegistry,
  AnimationRegistryEntry,
  AnimationTriggerPayload,
} from "./animations/core/animationTypes";

export { SpotlightAnimation } from "./animations/events/Spotlight/SpotlightAnimation";
export { OVERLAY_EVENTS } from "./data/events";
