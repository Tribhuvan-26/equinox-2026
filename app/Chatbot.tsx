"use client";

<<<<<<< HEAD
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";

interface MessageLink {
  label: string;
  url: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  links?: MessageLink[];
  suggestions?: string[];
}

const INITIAL_SUGGESTIONS = [
  "🎪 Explore events",
  "🗓 What's on the agenda?",
  "🎤 Meet the speakers",
  "🎟 Ticket prices",
  "📝 How do I register?",
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Welcome to **Equinox 2026**! 🌌\nI'm your AI Event Assistant, grounded on our official summit details. Ask me anything about our 6 flagship events, 3-day agenda, speaker lineup, summit passes, or registration!",
  suggestions: INITIAL_SUGGESTIONS,
  links: [
    { label: "Browse Events", url: "/events" },
    { label: "Summit Passes", url: "/register" },
  ],
};

function renderFormattedContent(text: string) {
  // Simple markdown link parser: [label](url) and bold **text**
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\n)/g);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part === "\n") {
      return <br key={index} />;
    }

    // Markdown link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isInternal = url.startsWith("/");
      if (isInternal) {
        return (
          <Link
            key={index}
            href={url}
            className="inline-flex items-center gap-0.5 font-medium text-beam underline underline-offset-2 hover:text-white"
          >
            {label}
            <ArrowUpRight className="inline h-3 w-3" />
          </Link>
        );
      }
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-beam underline underline-offset-2 hover:text-white"
        >
          {label}
          <ArrowUpRight className="inline h-3 w-3" />
        </a>
      );
    }

    // Bold text: **text**
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return <strong key={index} className="font-semibold text-fg">{boldMatch[1]}</strong>;
    }

    return <span key={index}>{part}</span>;
  });
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageCounter = useRef(1);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, loading]);

  const handleSend = async (userQuery?: string) => {
    const text = (userQuery ?? input).trim();
    if (!text || loading) return;

    const userCount = messageCounter.current++;
    const userMessage: ChatMessage = {
      id: `u-${userCount}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            text: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const botCount = messageCounter.current++;

      const botMessage: ChatMessage = {
        id: `b-${botCount}`,
        role: "assistant",
        content: data.answer || "I could not retrieve an answer. Please try again.",
        links: data.links,
        suggestions: data.suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errCount = messageCounter.current++;
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${errCount}`,
          role: "assistant",
          content:
            "I encountered a temporary connection hiccup. Please try again or reach out to equinox2026@gmail.com.",
          suggestions: INITIAL_SUGGESTIONS,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <motion.button
        type="button"
        aria-label={isOpen ? "Close Event Assistant" : "Open Event Assistant"}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="press fixed right-5 bottom-6 z-[9990] flex items-center gap-2.5 rounded-full border border-beam/35 bg-[color-mix(in_oklab,var(--color-night)_75%,transparent)] px-4 py-3 text-fg shadow-[0_0_25px_rgba(167,139,250,0.35)] backdrop-blur-2xl transition hover:border-beam hover:shadow-[0_0_35px_rgba(167,139,250,0.55)] focus-visible:ring-2 focus-visible:ring-beam focus-visible:outline-none sm:right-8 sm:bottom-8 sm:px-5 sm:py-3.5"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-beam opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-beam" />
        </span>

        {isOpen ? (
          <X className="h-5 w-5 text-beam" />
        ) : (
          <MessageSquare className="h-5 w-5 text-beam" />
        )}

        <span className="label text-xs font-semibold tracking-wider text-fg sm:text-sm">
          {isOpen ? "Close" : "AI Assistant"}
        </span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.05, duration: 0.35 }}
            className="fixed right-4 bottom-22 z-[9990] flex h-[580px] max-h-[calc(100svh-7.5rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-beam/30 bg-[color-mix(in_oklab,#0a0812_88%,transparent)] shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(167,139,250,0.15)] backdrop-blur-3xl sm:right-8 sm:bottom-24 sm:w-[395px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-fg/10 bg-gradient-to-r from-surface to-surface-2 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-beam/15 text-beam ring-1 ring-beam/30">
                  <Sparkles className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-night" />
                </div>
                <div>
                  <h3 className="heading text-base text-fg">Equinox AI</h3>
                  <p className="label text-[10px] text-accent">
                    CIE MLRIT Summit Guide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Reset conversation"
                  onClick={handleReset}
                  className="press rounded-lg p-2 text-fg/60 transition hover:bg-fg/10 hover:text-fg"
                  title="Reset conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Close chat"
                  onClick={() => setIsOpen(false)}
                  className="press rounded-lg p-2 text-fg/60 transition hover:bg-fg/10 hover:text-fg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div
              ref={scrollRef}
              className="no-scrollbar flex-1 space-y-4 overflow-y-auto p-4 text-sm"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                      m.role === "user"
                        ? "rounded-tr-xs bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] text-white shadow-md shadow-purple-950/30"
                        : "rounded-tl-xs border border-fg/10 bg-surface/90 text-fg/90 backdrop-blur-md"
                    }`}
                  >
                    <div className="space-y-1.5 whitespace-pre-wrap">
                      {renderFormattedContent(m.content)}
                    </div>

                    {/* Action Links */}
                    {m.links && m.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-fg/10 pt-2.5">
                        {m.links.map((link) => (
                          <Link
                            key={link.url}
                            href={link.url}
                            onClick={() => setIsOpen(false)}
                            className="press label flex items-center gap-1 rounded-full border border-beam/35 bg-beam/10 px-2.5 py-1 text-[11px] text-beam transition hover:bg-beam hover:text-ground"
                          >
                            {link.label}
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2.5 flex max-w-[90%] flex-wrap gap-1.5">
                      {m.suggestions.map((sugg) => (
                        <button
                          key={sugg}
                          type="button"
                          onClick={() => handleSend(sugg)}
                          className="press label flex items-center rounded-full border border-fg/15 bg-fg/5 px-2.5 py-1 text-[10px] text-fg/80 transition hover:border-beam hover:bg-beam/15 hover:text-fg"
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-fg/10 bg-surface px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-beam [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-beam [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-beam" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="border-t border-fg/10 bg-ground/80 p-3 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 rounded-full border border-fg/15 bg-surface/90 px-3.5 py-1.5 focus-within:border-beam focus-within:ring-1 focus-within:ring-beam">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about events, passes, schedule..."
                  className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg/40 focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="press grid h-8 w-8 place-items-center rounded-full bg-beam text-ground transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
=======
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatbotOverlay } from "@/chatbot";

/**
 * Chatbot component with quick-action sub-events wiring.
 * Selecting a sub-event just navigates to /events/{slug} — that page owns
 * playing its own overlay animation (see AutoPlayAnimation), so the effect
 * is tied to the sub-event, not to how the visitor got there.
 */
export function Chatbot() {
  const router = useRouter();

  const handleEventSelect = useCallback(
    (slug: string) => {
      router.push(`/events/${slug}`);
    },
    [router]
  );

  return <ChatbotOverlay onEventSelect={handleEventSelect} />;
>>>>>>> ChatBot
}
