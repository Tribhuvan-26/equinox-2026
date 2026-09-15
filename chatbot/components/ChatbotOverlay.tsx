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
import { Bot, X } from "lucide-react";
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
      {/* Floating Circular Equinox AI Launcher Button */}
      <div className="fixed right-4 bottom-4 z-[99990] sm:right-6 sm:bottom-6">
        <button
          ref={triggerRef}
          onClick={toggleOpen}
          onMouseEnter={() => animateTriggerHover(triggerRef.current)}
          onMouseLeave={() => animateTriggerLeave(triggerRef.current)}
          className="chatbot-launcher-btn"
          aria-label={isOpen ? "Close Equinox AI Assistant" : "Open Equinox AI Assistant"}
          title={isOpen ? "Close Equinox AI" : "Chat with Equinox AI"}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white stroke-[2.2] sm:h-7 sm:w-7" />
          ) : (
            <Bot className="h-7 w-7 text-white stroke-[2] sm:h-8 sm:w-8" />
          )}
        </button>
      </div>

      {/* Floating Chat Overlay Window */}
      {isRendered && (
        <div
          ref={windowRef}
          className="fixed right-3 left-3 sm:left-auto sm:right-6 bottom-[76px] sm:bottom-[100px] z-[99999] flex h-[580px] max-h-[calc(100dvh-88px)] sm:h-[640px] sm:max-h-[min(660px,calc(100vh-120px))] w-auto sm:w-[420px] max-w-[calc(100vw-1.5rem)] sm:max-w-[420px] flex-col"
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
