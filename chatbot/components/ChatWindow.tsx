"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageData, ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { EventDetail } from "./EventDetail";
import { BrochureSubEvent } from "../data/events";
import { getBotResponse } from "../data/responses";
import { setPendingAnimation, triggerAnimation } from "@/app/overlay-animations";
import { Sparkles, X, RotateCcw, Bot } from "lucide-react";

interface ChatWindowProps {
  onClose: () => void;
  onEventSelect?: (slug: string) => void;
}

export const SUB_EVENTS = [
  { name: "Spotlight", slug: "spotlight" },
  { name: "Crossroads", slug: "crossroads" },
  { name: "Startup Expo", slug: "startup-expo" },
  { name: "Brand Battles", slug: "brand-battles" },
  { name: "IPL Auction", slug: "ipl-auction" },
  { name: "Hustle Mania", slug: "hustle-mania" },
  { name: "Internship Drive", slug: "internship-drive" },
  { name: "Startup Poly", slug: "startup-poly" },
  { name: "E-Cell Meet", slug: "e-cell-meet" },
  { name: "Pitch Deck", slug: "pitch-deck" },
] as const;

const DEFAULT_QUICK_ACTIONS = [
  "⚡ Hustle Mania",
  "🎲 Startup Poly",
  "🏏 IPL Auction",
  "📅 Dates & Venue",
  "📞 Coordinators",
];

const INITIAL_MESSAGE: MessageData = {
  id: "msg-welcome",
  sender: "bot",
  text: "Welcome to **The Equinox 2.0**! 🚀\n\nI am your interactive event assistant, grounded directly in the official brochure. Ask me about any of our **10 sub-events**, confirmed dates (**30 - 31 OCT**), MLRIT venue, or coordinators!",
  suggestions: [
    "📅 Events",
    "⚡ Tell me about Hustle Mania",
    "🎲 What is Startup Poly?",
    "🏏 How does IPL Auction work?",
    "📅 Dates & Venue",
    "📞 Coordinators",
  ],
};

export function ChatWindow({ onClose, onEventSelect }: ChatWindowProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageData[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeEventDetail, setActiveEventDetail] = useState<BrochureSubEvent | null>(null);
  const [isEventListOpen, setIsEventListOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping, isEventListOpen]);

  const handleSendMessage = (text: string) => {
    const userMsg: MessageData = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Realistic processing delay for polished UI feel
    setTimeout(() => {
      const reply = getBotResponse(text);
      const botMsg: MessageData = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: reply.text,
        eventCard: reply.eventCard,
        suggestions: reply.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    if (
      suggestion === "📅 Events" ||
      suggestion === "Events" ||
      suggestion === "📅 Browse Events"
    ) {
      setIsEventListOpen(true);
      return;
    }
    handleSendMessage(suggestion);
  };

  const handleEventClick = (slug: string) => {
    // 1. Sets one-time pending-trigger marker BEFORE navigating
    if (onEventSelect) {
      onEventSelect(slug);
    } else {
      if (typeof window !== "undefined" && window.location.pathname === `/events/${slug}`) {
        triggerAnimation({ type: "event", event: slug as any });
      } else {
        setPendingAnimation(slug);
        router.push(`/events/${slug}`);
      }
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setActiveEventDetail(null);
    setIsEventListOpen(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border-2 border-white/60 bg-[#174ae8] text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
      {/* Header */}
      <div className="chatbot-riso-bg flex items-center justify-between border-b border-white/20 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/40 bg-white text-[#174ae8] shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-black tracking-wider uppercase text-white">
                EQUINOX AI
              </span>
              <span className="rounded bg-white px-1 py-0.2 font-mono text-[9px] font-black text-[#0d0e15]">
                2.0
              </span>
            </div>
            <p className="text-[10px] text-white/75 font-mono">
              Official Brochure Grounded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            title="Reset conversation"
            aria-label="Reset chat"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close chat window"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Message History Scroller */}
      <div
        ref={scrollRef}
        className="chatbot-scrollbar flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg, idx) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSelectEvent={(evt) => setActiveEventDetail(evt)}
            onSelectSuggestion={handleSuggestionSelect}
            isLast={idx === messages.length - 1}
          />
        ))}

        {/* Typing Loading State */}
        {isTyping && (
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/30 bg-[#0c2b94]/80 px-4 py-2.5 text-white/80 max-w-[90px]">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
          </div>
        )}
      </div>

      {/* Quick Action Bar / Sub-Events Expansion Row */}
      <div className="border-t border-white/20 bg-[#0c2b94]/90 px-3 py-2 text-white">
        {isEventListOpen ? (
          <div>
            <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-white/90">
              <span className="font-bold tracking-wider uppercase text-white flex items-center gap-1.5">
                <span>📅</span>
                <span>Select Sub-Event:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsEventListOpen(false)}
                className="text-[10px] font-mono text-white/75 hover:text-white underline transition"
              >
                ← Back
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-[105px] overflow-y-auto chatbot-scrollbar pt-0.5">
              {SUB_EVENTS.map((evt) => (
                <button
                  key={evt.slug}
                  type="button"
                  onClick={() => handleEventClick(evt.slug)}
                  className="rounded-full border border-white/40 bg-white/10 px-2.5 py-1 font-mono text-[11px] font-medium text-white transition hover:border-white hover:bg-white hover:text-[#174ae8] active:scale-95"
                >
                  {evt.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5 max-h-[64px] overflow-y-auto chatbot-scrollbar">
            {/* Events Quick-Action Button */}
            <button
              type="button"
              onClick={() => setIsEventListOpen(true)}
              className="rounded-full border border-white bg-white/20 px-2.5 py-1 font-mono text-[11px] font-black text-white shadow-xs transition hover:bg-white hover:text-[#174ae8] active:scale-95"
            >
              📅 Events
            </button>
            {DEFAULT_QUICK_ACTIONS.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(action)}
                className="rounded-full border border-white/35 bg-white/10 px-2.5 py-1 font-mono text-[11px] font-medium text-white transition hover:border-white hover:bg-white hover:text-[#174ae8] active:scale-95"
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <ChatInput onSend={handleSendMessage} disabled={isTyping} />

      {/* Event Detail Slide-over Panel */}
      <EventDetail
        event={activeEventDetail}
        onClose={() => setActiveEventDetail(null)}
      />
    </div>
  );
}
