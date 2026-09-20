// app/overlay-animations/animations/core/animationRegistry.ts
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type {
  AnimationRegistry,
  AnimationTriggerPayload,
  AnimationComponentProps,
  AnimationEventKey,
} from "./animationTypes";

/* Each overlay is a big SVG/GSAP scene that only plays on demand. Loading them
   lazily keeps ~10k lines out of the root-layout bundle every page pays for. */
const lazyAnimation = (
  load: () => Promise<{ default: ComponentType<AnimationComponentProps> }>
) => dynamic(load, { ssr: false });

const SpotlightAnimation = lazyAnimation(() => import("../events/Spotlight/SpotlightAnimation"));
const StartupPolyAnimation = lazyAnimation(() => import("../events/StartupPoly/StartupPolyAnimation"));
const IplAuctionAnimation = lazyAnimation(() => import("../events/IplAuction/IplAuctionAnimation"));
const HustleManiaAnimation = lazyAnimation(() => import("../events/HustleMania/HustleManiaAnimation"));
const CrossroadsAnimation = lazyAnimation(() => import("../events/Crossroads/CrossroadsAnimation"));
const PitchDeckAnimation = lazyAnimation(() =>
  import("../events/PitchDeck/PitchDeckAnimation").then((m) => ({ default: m.PitchDeckAnimation }))
);
const StartupExpoAnimation = lazyAnimation(() =>
  import("../events/StartupExpo/StartupExpoAnimation").then((m) => ({ default: m.StartupExpoAnimation }))
);
const BrandBattlesAnimation = lazyAnimation(() =>
  import("../events/BrandBattles/BrandBattlesAnimation").then((m) => ({ default: m.BrandBattlesAnimation }))
);
const ECellMeetAnimation = lazyAnimation(() => import("../events/ECellMeet/ECellMeetAnimation"));
const InternshipDriveAnimation = lazyAnimation(() => import("../events/InternshipDrive/InternshipDriveAnimation"));

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
  "ipl-auction": {
    Component: IplAuctionAnimation,
    id: "ipl-auction",
    title: "IPL Auction",
  },
  "hustle-mania": {
    Component: HustleManiaAnimation,
    id: "hustle-mania",
    title: "Hustle Mania",
  },
  crossroads: {
    Component: CrossroadsAnimation,
    id: "crossroads",
    title: "Cross Roads",
  },
  "pitch-deck": {
    Component: PitchDeckAnimation,
    id: "pitch-deck",
    title: "Pitch Deck",
  },
  "startup-expo": {
    Component: StartupExpoAnimation,
    id: "startup-expo",
    title: "Startup Expo",
  },
  "brand-battles": {
    Component: BrandBattlesAnimation,
    id: "brand-battles",
    title: "Brand Battles",
  },
  "e-cell-meet": {
    Component: ECellMeetAnimation,
    id: "e-cell-meet",
    title: "E-Cell Meet",
  },
  "ecell-meet": {
    Component: ECellMeetAnimation,
    id: "e-cell-meet",
    title: "E-Cell Meet",
  },
  "e_cell_meet": {
    Component: ECellMeetAnimation,
    id: "e-cell-meet",
    title: "E-Cell Meet",
  },
  "e-cell": {
    Component: ECellMeetAnimation,
    id: "e-cell-meet",
    title: "E-Cell Meet",
  },
  ecell: {
    Component: ECellMeetAnimation,
    id: "e-cell-meet",
    title: "E-Cell Meet",
  },
  "internship-drive": {
    Component: InternshipDriveAnimation,
    id: "internship-drive",
    title: "Internship Drive",
  },
  "internship_drive": {
    Component: InternshipDriveAnimation,
    id: "internship-drive",
    title: "Internship Drive",
  },
  internship: {
    Component: InternshipDriveAnimation,
    id: "internship-drive",
    title: "Internship Drive",
  },
  drive: {
    Component: InternshipDriveAnimation,
    id: "internship-drive",
    title: "Internship Drive",
  },
  "ipl_auction": {
    Component: IplAuctionAnimation,
    id: "ipl-auction",
    title: "IPL Auction",
  },
  ipl: {
    Component: IplAuctionAnimation,
    id: "ipl-auction",
    title: "IPL Auction",
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
 * The scenes are lazy chunks. If one fails to load (flaky network, stale chunk
 * hash after a deploy) or throws, drop the overlay instead of letting the error
 * unmount the whole root layout.
 */
class OverlayErrorBoundary extends React.Component<
  { onError: () => void; children?: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    console.error("[OverlayAnimations] overlay failed to render:", err);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * OverlayAnimationHost
 * Renders the currently active overlay animation at the root of the viewport.
 */
export const OverlayAnimationHost: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<AnimationEventKey | null>(null);
  const [playKey, setPlayKey] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);


  const lastTriggerRef = useRef<{ event: string; time: number } | null>(null);

  const handleTrigger = useCallback((payload: AnimationTriggerPayload) => {
    if (payload.type === "event" && payload.event) {
      const now = Date.now();
      if (
        lastTriggerRef.current &&
        lastTriggerRef.current.event === payload.event &&
        now - lastTriggerRef.current.time < 2000
      ) {
        // Prevent duplicate trigger restart within 2s during navigation transitions
        return;
      }
      lastTriggerRef.current = { event: payload.event, time: now };

      setActiveEvent(payload.event);
      setPlayKey((k) => k + 1);
      setIsDismissed(false);
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

  return React.createElement(
    OverlayErrorBoundary,
    { key: `${activeEvent}-${playKey}`, onError: handleComplete },
    React.createElement(ActiveComponent, {
      onComplete: handleComplete,
      isDismissed: isDismissed,
      onDismiss: handleDismiss,
    })
  );
};

export default animationRegistry;
