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
    <div className="border-t-2 border-white/20 bg-[#161616] p-2.5 sm:p-3 text-[#F7F2F6]">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex flex-1 items-center rounded-none border-2 border-white/30 bg-[#0E0E0E] px-3 py-1.5 focus-within:border-[#33FF67] focus-within:shadow-[2px_2px_0px_#33FF67] transition-all">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className="flex-1 bg-transparent py-0.5 text-xs sm:text-[13px] text-[#F7F2F6] placeholder-white/40 outline-hidden disabled:opacity-50"
          />
          {text.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setText("")}
              className="mr-1 font-mono text-xs text-white/50 hover:text-white"
            >
              [×]
            </button>
          )}
        </div>

        <button
          ref={buttonRef}
          type="submit"
          disabled={!text.trim() || disabled}
          className="flex h-9 w-9 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-none border-2 border-white bg-[#7484FE] text-[#121212] shadow-[2px_2px_0px_#33FF67] hover:bg-[#33FF67] hover:shadow-[1px_1px_0px_#7484FE] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Send query"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-1.5 flex items-center justify-between px-0.5 font-mono text-[9px] text-[#F7F2F6]/50">
        <span>[ SYS: EQUINOX 2.0 ]</span>
        <span>PRESS ENTER ↵</span>
      </div>
    </div>
  );
}
