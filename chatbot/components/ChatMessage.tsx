"use client";

import React, { useEffect, useRef } from "react";
import { SubEventInfo } from "../data/events";
import { EventCard } from "./EventCard";
import { QuickActions } from "./QuickActions";
import { animateMessageEntrance } from "../animations/chatAnimations";
import { Bot, User } from "lucide-react";

export interface MessageData {
  id: string;
  sender: "user" | "bot";
  text: string;
  eventCard?: SubEventInfo;
  suggestions?: string[];
  timestamp?: string;
}

interface ChatMessageProps {
  message: MessageData;
  onSelectEvent: (event: SubEventInfo) => void;
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
        className={`max-w-[90%] rounded-2xl px-3 py-2 text-xs sm:text-[13px] ${
          isUser
            ? "border border-white/80 bg-white text-[#282828] shadow-xs font-medium"
            : "border border-white/25 bg-[#0c2b94]/95 text-white/95 shadow-xs backdrop-blur-xs"
        }`}
      >
        {!isUser && (
          <div className="mb-1 flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider uppercase text-white/70">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[#2074d5]">
              <Bot className="h-2 w-2" />
            </span>
            <span>EQUINOX 2.0 AI</span>
          </div>
        )}

        {isUser ? (
          <p className="leading-relaxed">{message.text}</p>
        ) : (
          <div className="leading-relaxed">{renderFormattedText(message.text)}</div>
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
