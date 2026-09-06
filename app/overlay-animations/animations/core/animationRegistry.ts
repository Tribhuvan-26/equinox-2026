// app/overlay-animations/animations/core/animationRegistry.ts
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SpotlightAnimation } from "../events/Spotlight/SpotlightAnimation";
import { StartupPolyAnimation } from "../events/StartupPoly/StartupPolyAnimation";
import type {
  AnimationRegistry,
  AnimationTriggerPayload,
  AnimationComponentProps,
  AnimationEventKey,
} from "./animationTypes";

/**
 * Official registry mapping event keys to their respective overlay components.
 */
export const animationRegistry: AnimationRegistry = {
  spotlight: {
    Component: SpotlightAnimation,
    id: "spotlight",
    title: "Spotlight",
  },
  "startup-poly": {
    Component: StartupPolyAnimation,
    id: "startup-poly",
    title: "Startup Poly",
  },
};

type AnimationListener = (payload: AnimationTriggerPayload) => void;
const listeners = new Set<AnimationListener>();

/**
 * Subscribe to animation triggers.
 */
export function subscribeToAnimation(listener: AnimationListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Triggers a registered overlay animation across the application.
 * Example: triggerAnimation({ type: "event", event: "spotlight" })
 */
export function triggerAnimation(payload: AnimationTriggerPayload): void {
  if (typeof window !== "undefined") {
    // Dispatch custom event for decoupling
    const event = new CustomEvent("equinox:trigger-animation", {
      detail: payload,
    });
    window.dispatchEvent(event);
  }

  listeners.forEach((listener) => {
    try {
      listener(payload);
    } catch (err) {
      console.error("[OverlayAnimations] Error in trigger listener:", err);
    }
  });
}

// Attach to window in browser environments for dev inspection / console triggering
if (typeof window !== "undefined") {
  (window as unknown as { triggerAnimation: typeof triggerAnimation }).triggerAnimation =
    triggerAnimation;
}

/**
 * OverlayAnimationHost
 * Renders the currently active overlay animation at the root of the viewport.
 */
export const OverlayAnimationHost: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<AnimationEventKey | null>(null);
  const [playKey, setPlayKey] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    console.log("[OverlayAnimations] OverlayAnimationHost mounted at root layout!");
  }, []);

  const handleTrigger = useCallback((payload: AnimationTriggerPayload) => {
    console.log("[OverlayAnimations] OverlayAnimationHost received trigger:", payload);
    if (payload.type === "event" && payload.event) {
      setActiveEvent((prev) => {
        if (prev === payload.event) {
          // Replay if already active: increment key to force clean restart from 0
          setPlayKey((k) => k + 1);
          setIsDismissed(false);
          return prev;
        }
        setPlayKey((k) => k + 1);
        setIsDismissed(false);
        return payload.event;
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAnimation(handleTrigger);

    const onCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent<AnimationTriggerPayload>).detail;
      if (detail) handleTrigger(detail);
    };

    window.addEventListener("equinox:trigger-animation", onCustomEvent);

    return () => {
      unsubscribe();
      window.removeEventListener("equinox:trigger-animation", onCustomEvent);
    };
  }, [handleTrigger]);

  const handleComplete = useCallback(() => {
    setActiveEvent(null);
    setIsDismissed(false);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
  }, []);

  if (!activeEvent) {
    return null;
  }

  const entry = animationRegistry[activeEvent];
  if (!entry) {
    return null;
  }

  const ActiveComponent = entry.Component;

  return React.createElement(ActiveComponent, {
    key: `${activeEvent}-${playKey}`,
    onComplete: handleComplete,
    isDismissed: isDismissed,
    onDismiss: handleDismiss,
  });
};

export default animationRegistry;
