"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatbotOverlay } from "@/chatbot";

/**
 * Chatbot component with quick-action sub-events wiring.
 * Selecting a sub-event just navigates to /events/{slug} — that page owns
 * playing its own overlay animation (see AutoPlayAnimation), so the effect
 * is tied to the sub-event, not to how the visitor got there.
 */
export function Chatbot() {
  const router = useRouter();

  const handleEventSelect = useCallback(
    (slug: string) => {
      router.push(`/events/${slug}`);
    },
    [router]
  );

  return <ChatbotOverlay onEventSelect={handleEventSelect} />;
}
