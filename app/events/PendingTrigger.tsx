"use client";

import { useEffect } from "react";
import { consumePendingAnimation } from "@/app/overlay-animations";

interface PendingTriggerProps {
  slug: string;
}

/**
 * Consumes the one-time chatbot-set pending trigger on mount.
 * Fires triggerAnimation exactly once if sessionStorage matches slug,
 * and clears the key immediately to prevent replays on refresh.
 */
export function PendingTrigger({ slug }: PendingTriggerProps) {
  useEffect(() => {
    consumePendingAnimation(slug);
  }, [slug]);

  return null;
}
