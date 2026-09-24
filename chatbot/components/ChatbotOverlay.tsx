"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatWindow } from "./ChatWindow";
import {
  animateChatOpen,
  animateChatClose,
  animateTriggerHover,
  animateTriggerLeave,
  animateClickPop,
} from "../animations/chatAnimations";
import Image from "next/image";
import { X } from "lucide-react";
import "../styles/chatbot.css";

interface ChatbotOverlayProps {
  initialOpen?: boolean;
  onEventSelect?: (slug: string) => void;
}

const PROMPTS_SCROLL = [
  {
    title: "Scroll to explore",
    arrow: "↓",
    subtitle: "Scroll down to travel the galaxy",
  },
  {
    title: "Have doubts? Ask me!",
    arrow: "→",
    subtitle: "Events, rules & schedules",
  },
];

const PROMPTS_OTHER = [
  {
    title: "Have doubts? Ask me!",
    arrow: "→",
    subtitle: "Events, rules & schedules",
  },
  {
    title: "Need help? Ask Chitti",
    arrow: "→",
    subtitle: "Clear your doubts & explore",
  },
];

export function ChatbotOverlay({ initialOpen = false, onEventSelect }: ChatbotOverlayProps) {
  const pathname = usePathname();
  const isScrollJourney = pathname === "/";
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isRendered, setIsRendered] = useState(initialOpen);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const windowRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activePrompts = isScrollJourney ? PROMPTS_SCROLL : PROMPTS_OTHER;

  // Cycle the bubble message every 4 seconds while visible
  useEffect(() => {
    if (!isBubbleVisible || isOpen) return;
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % activePrompts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isBubbleVisible, isOpen, activePrompts.length]);

  // Initial bubble appearance
  useEffect(() => {
    if (isOpen) {
      setIsBubbleVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsBubbleVisible(true);
    }, isScrollJourney ? 2500 : 1500);

    const handleIntroDone = () => {
      setIsBubbleVisible(true);
    };

    window.addEventListener("equinox:intro-done", handleIntroDone);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("equinox:intro-done", handleIntroDone);
    };
  }, [isScrollJourney, isOpen]);

  // Handle scroll detection and 4-second idle return (only in scroll journey)
  useEffect(() => {
    if (!isScrollJourney) return;

    const handleScrollActivity = () => {
      // Disappear immediately when scrolling starts
      setIsBubbleVisible(false);

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      // Return if user hasn't scrolled for 4 seconds, showing "Scroll to explore"
      idleTimerRef.current = setTimeout(() => {
        if (!isOpen && isScrollJourney) {
          setPromptIndex(0);
          setIsBubbleVisible(true);
        }
      }, 4000);
    };

    window.addEventListener("scroll", handleScrollActivity, { passive: true });
    window.addEventListener("wheel", handleScrollActivity, { passive: true });
    window.addEventListener("touchmove", handleScrollActivity, { passive: true });

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      window.removeEventListener("scroll", handleScrollActivity);
      window.removeEventListener("wheel", handleScrollActivity);
      window.removeEventListener("touchmove", handleScrollActivity);
    };
  }, [isScrollJourney, isOpen]);

  // Handle open/close GSAP animations
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else if (isRendered) {
      if (windowRef.current) {
        animateChatClose(windowRef.current, () => {
          setIsRendered(false);
        });
      } else {
        setIsRendered(false);
      }
    }
  }, [isOpen]);

  // Run enter animation when window element mounts
  useEffect(() => {
    if (isRendered && windowRef.current) {
      animateChatOpen(windowRef.current);
    }
  }, [isRendered]);

  const toggleOpen = () => {
    if (triggerRef.current) {
      animateClickPop(triggerRef.current);
    }
    setIsOpen((prev) => !prev);
  };

  const currentPrompt = activePrompts[promptIndex % activePrompts.length];

  return (
    <div className="equinox-chatbot-root" data-lenis-prevent>
      {/* Floating Circular Equinox AI Launcher Button & Speech Bubble */}
      <div className="fixed right-4 bottom-4 z-[99990] sm:right-6 sm:bottom-6 flex items-center">
        {/* Chat Speech Bubble */}
        {!isOpen && (
          <div
            onClick={toggleOpen}
            className={`cursor-pointer select-none transition-all duration-300 ease-out mr-3 flex items-center gap-2.5 rounded-2xl bg-[#0E0E0E]/95 backdrop-blur-md border border-white/20 px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.85)] relative group hover:border-[#7484FE]/60 hover:bg-[#141414] ${
              isBubbleVisible
                ? "opacity-100 translate-x-0 pointer-events-auto scale-100"
                : "opacity-0 translate-x-2 pointer-events-none scale-95"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#33FF67] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#33FF67]" />
              </span>
              <div className="flex flex-col text-left min-w-[145px] sm:min-w-[165px]">
                <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wide text-white/95 whitespace-nowrap flex items-center gap-1.5">
                  {currentPrompt.title}{" "}
                  <span className="text-[#7484FE] font-bold group-hover:translate-x-0.5 transition-transform">
                    {currentPrompt.arrow}
                  </span>
                </span>
                <span className="text-[10px] text-white/60 tracking-tight font-sans">
                  {currentPrompt.subtitle}
                </span>
              </div>
            </div>
            {/* Tail pointing right towards the launcher button */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-white/20" />
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-[#0E0E0E]" />
          </div>
        )}

        <button
          ref={triggerRef}
          onClick={toggleOpen}
          onMouseEnter={() => animateTriggerHover(triggerRef.current)}
          onMouseLeave={() => animateTriggerLeave(triggerRef.current)}
          className="chatbot-launcher-btn relative"
          aria-label={isOpen ? "Close Equinox AI Assistant" : "Open Equinox AI Assistant"}
          title={isOpen ? "Close Equinox AI" : "Chat with Equinox AI"}
        >
          {/* Active status beacon */}
          {!isOpen && (
            <span className="absolute top-[16%] right-[16%] flex h-2 w-2">
              <span className="h-full w-full rounded-full bg-[#33FF67] border border-black animate-pulse" />
            </span>
          )}

          {isOpen ? (
            <X className="h-6 w-6 text-white stroke-[2.5] sm:h-7 sm:w-7" />
          ) : (
            <Image
              src="/chitti-2.0.png"
              alt="Chitti 2.0 Mascot"
              width={160}
              height={225}
              priority
              className="h-[86%] w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            />
          )}
        </button>
      </div>

      {/* Floating Chat Overlay Window */}
      {isRendered && (
        <div
          ref={windowRef}
          data-lenis-prevent
          className="fixed right-3 left-3 sm:left-auto sm:right-6 bottom-[76px] sm:bottom-[100px] z-[99999] flex h-[440px] max-h-[calc(100dvh-88px)] sm:h-[500px] sm:max-h-[min(520px,calc(100vh-140px))] w-auto sm:w-[340px] max-w-[calc(100vw-1.5rem)] sm:max-w-[340px] flex-col"
        >
          <ChatWindow
            onClose={() => setIsOpen(false)}
            onEventSelect={onEventSelect}
          />
        </div>
      )}
    </div>
  );
}
