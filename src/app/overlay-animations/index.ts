// app/overlay-animations/index.ts
"use client";

export {
  animationRegistry,
  triggerAnimation,
  subscribeToAnimation,
  OverlayAnimationHost,
} from "./animations/core/animationRegistry";

export type {
  AnimationComponentProps,
  AnimationEventKey,
  AnimationRegistry,
  AnimationRegistryEntry,
  AnimationTriggerPayload,
} from "./animations/core/animationTypes";

export { OVERLAY_EVENTS } from "./data/events";
