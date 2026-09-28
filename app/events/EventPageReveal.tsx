"use client";

import { useEffect, useState } from "react";
import {
  animationRegistry,
  triggerAnimation,
  type AnimationEventKey,
} from "@/app/overlay-animations";

interface EventPageRevealProps {
  slug: string;
  children: React.ReactNode;
}

export function EventPageReveal({ slug, children }: EventPageRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Check if the animation exists for this event
    if (!(slug in animationRegistry)) {
      setIsRevealed(true);
      return;
    }

    // Removed the hardcoded window.innerWidth < 768 block so mobile can
    // attempt to render the animations, relying on CSS/GSAP optimizations instead.
    
    // Subscribe to the global animation completion event we added
    const handleComplete = () => {
      setIsRevealed(true);
    };

    window.addEventListener("equinox:animation-complete", handleComplete);

    // Deferred one tick so OverlayAnimationHost has finished subscribing before this dispatches.
    const id = setTimeout(() => {
      triggerAnimation({ type: "event", event: slug as AnimationEventKey });
    }, 0);

    return () => {
      clearTimeout(id);
      window.removeEventListener("equinox:animation-complete", handleComplete);
    };
  }, [slug]);

  return (
    <div
      className={`transition-opacity duration-1000 ease-out ${
        isRevealed ? "opacity-100" : "opacity-0"
      }`}
      style={{
        pointerEvents: isRevealed ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
}
