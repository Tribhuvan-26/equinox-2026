"use client";

import React, { useEffect, useRef } from "react";
import { BrochureSubEvent } from "../data/events";
import { EventCard } from "./EventCard";
import { QuickActions } from "./QuickActions";
import { animateMessageEntrance } from "../animations/chatAnimations";
import { Bot, User } from "lucide-react";

export interface MessageData {
  id: string;
  sender: "user" | "bot";
  text: string;
  eventCard?: BrochureSubEvent;
  suggestions?: string[];
  timestamp?: string;
}

interface ChatMessageProps {
  message: MessageData;
  onSelectEvent: (event: BrochureSubEvent) => void;
  onSelectSuggestion: (text: string) => void;
  isLast?: boolean;
}

export function ChatMessage({
  message,
  onSelectEvent,
  onSelectSuggestion,
  isLast,
}: ChatMessageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      animateMessageEntrance(containerRef.current);
    }
  }, []);

  // Format simple **bold** and newlines
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={lIdx} className={line.trim() === "" ? "h-2" : "mb-1 leading-relaxed"}>
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-extrabold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  const isUser = message.sender === "user";

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1.5`}
    >
      {/* Bubble */}
      <div
        className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm ${
          isUser
            ? "border-2 border-white bg-white text-[#0d0e15] shadow-md font-medium"
            : "border border-white/30 bg-[#0c2b94]/95 text-white/95 shadow-sm backdrop-blur-xs"
        }`}
      >
        {!isUser && (
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-white/70">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#174ae8]">
              <Bot className="h-2.5 w-2.5" />
            </span>
            <span>EQUINOX 2.0 AI</span>
          </div>
        )}

        {isUser ? (
          <p className="leading-relaxed">{message.text}</p>
        ) : (
          <div>{renderFormattedText(message.text)}</div>
        )}

        {/* Embedded Interactive Event Card */}
        {message.eventCard && (
          <EventCard event={message.eventCard} onSelect={onSelectEvent} />
        )}
      </div>

      {/* Suggested Follow-up Action Chips */}
      {!isUser && message.suggestions && message.suggestions.length > 0 && isLast && (
        <div className="pl-1 pt-1 max-w-[95%]">
          <QuickActions
            actions={message.suggestions}
            onSelect={onSelectSuggestion}
          />
        </div>
      )}
    </div>
  );
}
