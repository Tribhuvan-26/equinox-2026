"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChatWindow } from "./ChatWindow";
import {
  animateChatOpen,
  animateChatClose,
  animateTriggerHover,
  animateTriggerLeave,
  animateClickPop,
} from "../animations/chatAnimations";
import { Sparkles, MessageSquare, X } from "lucide-react";
import "../styles/chatbot.css";

interface ChatbotOverlayProps {
  initialOpen?: boolean;
  onEventSelect?: (slug: string) => void;
}

export function ChatbotOverlay({ initialOpen = false, onEventSelect }: ChatbotOverlayProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isRendered, setIsRendered] = useState(initialOpen);
  const windowRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  return (
    <div className="equinox-chatbot-root">
      {/* Floating Equinox AI Trigger Button */}
      <div className="fixed right-5 bottom-5 z-[99990]">
        <button
          ref={triggerRef}
          onClick={toggleOpen}
          onMouseEnter={() => animateTriggerHover(triggerRef.current)}
          onMouseLeave={() => animateTriggerLeave(triggerRef.current)}
          className="group relative flex items-center gap-2.5 rounded-full border-2 border-white bg-[#0f35b5] px-4 py-2.5 sm:px-5 sm:py-3 text-white shadow-2xl transition hover:bg-white hover:text-[#2074d5]"
          aria-label={isOpen ? "Close Equinox AI Chat" : "Open Equinox AI Chat"}
        >
          {/* Animated Glowing Beacon */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#2074d5] group-hover:bg-[#2074d5] group-hover:text-white shadow-md">
            {isOpen ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            {!isOpen && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
              </span>
            )}
          </div>

          <div className="text-left">
            <span className="block font-mono text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-white/75 group-hover:text-[#2074d5]/80">
              {isOpen ? "CLOSE" : "ASK EQUINOX"}
            </span>
            <span className="block font-mono text-xs sm:text-sm font-black tracking-wider uppercase text-white group-hover:text-[#2074d5]">
              EQUINOX AI
            </span>
          </div>
        </button>
      </div>

      {/* Floating Chat Overlay Window */}
      {isRendered && (
        <div
          ref={windowRef}
          className="fixed right-3 bottom-20 z-[99999] flex h-[600px] max-h-[82vh] w-[calc(100vw-1.5rem)] max-w-[420px] flex-col sm:right-6"
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
