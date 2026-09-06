// app/overlay-animations/animations/core/animationTypes.ts
import type { ComponentType } from "react";

export type AnimationEventKey =
  | "spotlight"
  | "startup-poly"
  | (string & {});

export interface AnimationTriggerPayload {
  type: "event" | string;
  event: AnimationEventKey;
  [key: string]: unknown;
}

export interface AnimationComponentProps {
  onComplete?: () => void;
  isDismissed?: boolean;
  onDismiss?: () => void;
  skip?: boolean;
}

export interface AnimationRegistryEntry {
  Component: ComponentType<AnimationComponentProps>;
  id: string;
  title: string;
}

export type AnimationRegistry = Record<string, AnimationRegistryEntry>;
