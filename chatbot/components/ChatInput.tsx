"use client";

import React, { useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { animateClickPop } from "../animations/chatAnimations";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Ask about events, dates, venue...",
}: ChatInputProps) {
  const [text, setText] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    if (buttonRef.current) {
      animateClickPop(buttonRef.current);
    }

    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-white/15 bg-[#0c2b94] p-2.5 sm:p-3 text-white">
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 sm:gap-2">
        <div className="relative flex flex-1 items-center rounded-xl border border-white/35 bg-white/10 px-3 py-1 focus-within:border-white focus-within:bg-white/15">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className="flex-1 bg-transparent py-0.5 text-xs sm:text-[13px] text-white placeholder-white/50 outline-hidden disabled:opacity-50"
          />
          {text.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setText("")}
              className="mr-1 text-xs text-white/60 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        <button
          ref={buttonRef}
          type="submit"
          disabled={!text.trim() || disabled}
          className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-lg bg-white text-[#2074d5] shadow-xs transition hover:bg-white/90 active:scale-95 disabled:opacity-40 disabled:hover:bg-white"
          aria-label="Send query"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>

      <div className="mt-1 flex items-center justify-between px-0.5 text-[9px] text-white/50 font-mono">
        <span>Equinox 2.0 Assistant</span>
        <span>Enter ↵</span>
      </div>
    </div>
  );
}
