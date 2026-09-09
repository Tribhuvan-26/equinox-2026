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
    <div className="border-t border-white/20 bg-[#0c2b94] p-3 text-white">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex flex-1 items-center rounded-2xl border-2 border-white/40 bg-white/10 px-3.5 py-1.5 focus-within:border-white focus-within:bg-white/20">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className="flex-1 bg-transparent py-1 text-xs sm:text-sm text-white placeholder-white/60 outline-hidden disabled:opacity-50"
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
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#2074d5] shadow-md transition hover:bg-white/90 disabled:opacity-40 disabled:hover:bg-white"
          aria-label="Send query"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-white/60 font-mono">
        <span>Equinox 2.0 · Offline Assistant</span>
        <span>Press Enter ↵</span>
      </div>
    </div>
  );
}
