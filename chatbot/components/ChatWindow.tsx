"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [messages, setMessages] = useState<MessageData[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeEventDetail, setActiveEventDetail] = useState<SubEventInfo | null>(null);
  const [isEventListOpen, setIsEventListOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping, isEventListOpen]);

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
    if (suggestion === "Events" || suggestion === "Browse Events") {
      setIsEventListOpen(true);
      return;
    }
    handleSendMessage(suggestion);
  };

  const handleEventClick = (slug: string) => {
    if (onEventSelect) {
      onEventSelect(slug);
    } else {
      router.push(`/events/${slug}`);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setActiveEventDetail(null);
    setIsEventListOpen(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/50 bg-[#2074d5] text-white shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_25px_rgba(32,116,213,0.35)]">
      {/* Header */}
      <div className="chatbot-riso-bg flex items-center justify-between border-b border-white/20 px-3.5 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/40 bg-[#161622] shadow-xs">
            <Image
              src="/chatbot-mascot.png"
              alt=""
              width={64}
              height={90}
              className="h-[88%] w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-black tracking-wider uppercase text-white sm:text-sm">
                EQUINOX AI
              </span>
              <span className="rounded bg-white px-1 py-0.2 font-mono text-[8.5px] font-black text-[#282828]">
                2.0
              </span>
            </div>
            <p className="text-[9.5px] text-white/75 font-mono">
              Grounded In Official Details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={handleReset}
            className="rounded-full p-1.5 text-white/70 transition hover:bg-white/15 hover:text-white"
            title="Reset conversation"
            aria-label="Reset chat"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/70 transition hover:bg-white/15 hover:text-white"
            aria-label="Close chat window"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Message History Scroller */}
      <div
        ref={scrollRef}
        className="chatbot-scrollbar flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-3"
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
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/30 bg-[#0c2b94]/80 px-3.5 py-2 text-white/80 max-w-[80px]">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
          </div>
        )}
      </div>

      {/* Quick Action Bar / Sub-Events Expansion Row */}
      <div className="border-t border-white/15 bg-[#0c2b94]/95 px-2.5 py-1.5 text-white">
        {isEventListOpen ? (
          <div>
            <div className="mb-1 flex items-center justify-between font-mono text-[10px] text-white/90">
              <span className="font-bold tracking-wider uppercase text-white flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Select Sub-Event:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsEventListOpen(false)}
                className="text-[9.5px] font-mono text-white/75 hover:text-white underline transition"
              >
                ← Back
              </button>
            </div>
            <div className="flex flex-wrap gap-1 max-h-[88px] overflow-y-auto chatbot-scrollbar pt-0.5">
              {SUB_EVENTS.map((evt) => (
                <button
                  key={evt.slug}
                  type="button"
                  onClick={() => handleEventClick(evt.slug)}
                  className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-medium text-white transition hover:border-white hover:bg-white hover:text-[#2074d5] active:scale-95"
                >
                  {evt.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1 max-h-[56px] overflow-y-auto chatbot-scrollbar">
            {/* Events Quick-Action Button */}
            <button
              type="button"
              onClick={() => setIsEventListOpen(true)}
              className="flex items-center gap-1 rounded-full border border-white bg-white/20 px-2 py-0.5 font-mono text-[10px] font-black text-white shadow-xs transition hover:bg-white hover:text-[#2074d5] active:scale-95"
            >
              <Calendar className="h-2.5 w-2.5" />
              Events
            </button>
            {DEFAULT_QUICK_ACTIONS.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(action)}
                className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-medium text-white transition hover:border-white hover:bg-white hover:text-[#2074d5] active:scale-95"
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
