"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageData, ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { EventDetail } from "./EventDetail";
import { SubEventInfo } from "../data/events";
import { getBotResponse } from "../data/responses";
import Image from "next/image";
import { Sparkles, X, RotateCcw, Calendar } from "lucide-react";

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
  "E-Cell Meet",
  "Hustle Mania",
  "Startup Poly",
  "IPL Auction",
  "Dates & Venue",
  "Coordinators",
];

const INITIAL_MESSAGE: MessageData = {
  id: "msg-welcome",
  sender: "bot",
  text: "Welcome to **The Equinox 2.0**!\n\nI am your interactive event assistant, grounded directly in the official event program. Ask me about any of our **10 sub-events**, confirmed dates (**30 - 31 OCT**), MLRIT venue, or coordinators!",
  suggestions: [
    "Events",
    "E-Cell Meet",
    "Tell me about Hustle Mania",
    "What is Startup Poly?",
    "How does IPL Auction work?",
    "Dates & Venue",
    "Coordinators",
  ],
};

export function ChatWindow({ onClose, onEventSelect }: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageData[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeEventDetail, setActiveEventDetail] = useState<SubEventInfo | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const userMsg: MessageData = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const historyPayload = messages.slice(-8).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyPayload }),
      });

      if (!res.ok) {
        throw new Error(`Chat API responded with status ${res.status}`);
      }

      const data = await res.json();
      const botMsg: MessageData = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.answer || "I received an empty response. Please try again.",
        eventCard: data.eventCard,
        suggestions: data.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn("ChatWindow backend fetch failed, using fallback:", err);
      const reply = getBotResponse(text, historyPayload as any);
      const botMsg: MessageData = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: reply.text,
        eventCard: reply.eventCard,
        suggestions: reply.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setActiveEventDetail(null);
  };

  return (
    <div
      data-lenis-prevent
      className="relative flex h-full w-full flex-col overflow-hidden rounded-none border-2 border-white/70 bg-[#161616] text-[#F7F2F6] shadow-[6px_6px_0px_#000000,8px_8px_0px_#7484FE]"
    >
      {/* Header */}
      <div className="chatbot-riso-bg shrink-0 flex items-center justify-between border-b-2 border-white/20 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#1C1C1C]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8.5 w-8.5 items-center justify-center overflow-hidden rounded-none border-2 border-[#7484FE] bg-[#101014] shadow-[2px_2px_0px_#000000]">
            <Image
              src="/chatbot-mascot.png"
              alt="Equinox Mascot"
              width={64}
              height={90}
              className="h-[88%] w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-black tracking-wider uppercase text-[#F7F2F6] sm:text-sm">
                EQUINOX AI
              </span>
              <span className="rounded-none border border-black bg-[#33FF67] px-1.5 py-0.2 font-mono text-[8.5px] font-black text-[#121212] shadow-[1px_1px_0px_#000000]">
                2.0
              </span>
            </div>
            <p className="text-[9.5px] text-[#F7F2F6]/75 font-mono tracking-wide flex items-center gap-1.5 mt-0.5">
              <span className="inline-block h-1.5 w-1.5 bg-[#33FF67] animate-pulse" />
              <span>GROUNDED // OFFICIAL SPEC</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="flex h-7 w-7 items-center justify-center rounded-none border border-white/20 bg-[#222222] text-[#F7F2F6] shadow-[2px_2px_0px_#000000] hover:bg-[#7484FE] hover:text-[#121212] hover:border-white hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            title="Reset conversation"
            aria-label="Reset chat"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-none border border-white/20 bg-[#222222] text-[#F7F2F6] shadow-[2px_2px_0px_#000000] hover:bg-[#FF4545] hover:text-white hover:border-white hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            aria-label="Close chat window"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Message History Scroller */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        className="chatbot-scrollbar flex-1 min-h-0 overflow-y-auto p-3 sm:p-3.5 space-y-3"
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
          <div className="flex items-center gap-1.5 rounded-none border-2 border-white/25 bg-[#222222] px-3.5 py-2 text-[#F7F2F6]/80 shadow-[2px_2px_0px_#000000] max-w-[85px]">
            <span className="h-1.5 w-1.5 bg-[#7484FE] animate-pulse" />
            <span className="h-1.5 w-1.5 bg-[#33FF67] animate-pulse [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 bg-[#F7F2F6] animate-pulse [animation-delay:-0.3s]" />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="shrink-0">
        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>

      {/* Event Detail Slide-over Panel */}
      <EventDetail
        event={activeEventDetail}
        onClose={() => setActiveEventDetail(null)}
      />
    </div>
  );
}
