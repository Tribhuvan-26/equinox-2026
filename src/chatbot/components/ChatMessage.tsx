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
            // Make bare https:// links (e.g. application forms) clickable.
            return (
              <span key={pIdx}>
                {part.split(/(https:\/\/\S+)/g).map((seg, sIdx) =>
                  seg.startsWith("https://") ? (
                    <a
                      key={sIdx}
                      href={seg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all font-bold text-[#33FF67] underline"
                    >
                      {seg}
                    </a>
                  ) : (
                    seg
                  )
                )}
              </span>
            );
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
      {/* Brutalist Message Box */}
      <div
        className={`max-w-[92%] rounded-none px-3.5 py-2.5 text-xs sm:text-[13px] ${
          isUser
            ? "border-2 border-white bg-[#7484FE] text-[#121212] font-medium shadow-[3px_3px_0px_#33FF67]"
            : "border-2 border-white/30 bg-[#1E1E1E] text-[#F7F2F6] shadow-[3px_3px_0px_#000000]"
        }`}
      >
        {!isUser && (
          <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#7484FE]">
            <div className="flex items-center gap-1.5">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-none border border-[#7484FE] bg-[#101014] text-[#7484FE]">
                <Bot className="h-2 w-2" />
              </span>
              <span className="text-[#F7F2F6]/90">[ EQUINOX 2.0 AI ]</span>
            </div>
            {message.timestamp && (
              <span className="text-[#F7F2F6]/40 text-[9px] font-mono">{message.timestamp}</span>
            )}
          </div>
        )}

        {isUser ? (
          <div>
            <p className="leading-relaxed">{message.text}</p>
            {message.timestamp && (
              <span className="block mt-1 text-right text-[8.5px] text-[#121212]/60 font-mono font-normal">
                {message.timestamp}
              </span>
            )}
          </div>
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
        <div className="pl-0.5 pt-1 max-w-[98%]">
          <QuickActions
            actions={message.suggestions}
            onSelect={onSelectSuggestion}
          />
        </div>
      )}
    </div>
  );
}
