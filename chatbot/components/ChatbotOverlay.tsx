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
import Image from "next/image";
import { X } from "lucide-react";
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
    <div className="equinox-chatbot-root" data-lenis-prevent>
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
            <Image
              src="/chatbot-mascot.png"
              alt=""
              width={160}
              height={225}
              priority
              className="h-[86%] w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
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
