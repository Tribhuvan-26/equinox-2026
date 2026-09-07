"use client";

import { useEffect } from "react";
import {
  animationRegistry,
  triggerAnimation,
  type AnimationEventKey,
} from "@/app/overlay-animations";

interface AutoPlayAnimationProps {
  slug: string;
}

/**
 * Plays this sub-event's overlay animation once whenever its page is visited,
 * regardless of how the visitor got here (direct link, browser refresh, or
 * in-app navigation) — the animation belongs to the page, not the chatbot.
 */
export function AutoPlayAnimation({ slug }: AutoPlayAnimationProps) {
  useEffect(() => {
    if (!(slug in animationRegistry)) return;

    // Deferred one tick so OverlayAnimationHost (mounted in the same commit)
    // has finished subscribing before this dispatches.
    const id = setTimeout(() => {
      triggerAnimation({ type: "event", event: slug as AnimationEventKey });
    }, 0);

    return () => clearTimeout(id);
  }, [slug]);

  return null;
}
