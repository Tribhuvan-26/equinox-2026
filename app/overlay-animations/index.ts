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

export { SpotlightAnimation } from "./animations/events/Spotlight/SpotlightAnimation";
export { ECellMeetAnimation } from "./animations/events/ECellMeet/ECellMeetAnimation";
export { InternshipDriveAnimation } from "./animations/events/InternshipDrive/InternshipDriveAnimation";
export { OVERLAY_EVENTS } from "./data/events";
