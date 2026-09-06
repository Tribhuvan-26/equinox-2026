"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatbotOverlay } from "@/chatbot";
import { setPendingAnimation, triggerAnimation, type AnimationEventKey } from "@/app/overlay-animations";

/**
 * Chatbot component with quick-action sub-events wiring.
 * When a sub-event is selected:
 * 1. Sets a one-time pending-trigger marker in sessionStorage ("equinox:pendingAnimation").
 * 2. Navigates cleanly to /events/{slug}.
 * 3. Destination event page consumes it once on mount to play overlay animation.
 * 4. If already on destination event page, triggers overlay animation directly without reload.
 */
export function Chatbot() {
  const router = useRouter();

  const handleEventSelect = useCallback(
    (slug: string) => {
      if (typeof window !== "undefined" && window.location.pathname === `/events/${slug}`) {
        // Already on destination event page: fire overlay animation directly
        triggerAnimation({ type: "event", event: slug as AnimationEventKey });
        return;
      }
      // Set one-time pending trigger marker BEFORE navigation
      setPendingAnimation(slug);
      // Navigate to destination event page
      router.push(`/events/${slug}`);
    },
    [router]
  );

  return <ChatbotOverlay onEventSelect={handleEventSelect} />;
}
