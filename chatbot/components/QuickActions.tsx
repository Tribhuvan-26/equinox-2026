"use client";

import React from "react";

interface QuickActionsProps {
  actions?: string[];
  onSelect: (action: string) => void;
  disabled?: boolean;
}

const DEFAULT_ACTIONS = [
  "⚡ Tell me about Hustle Mania",
  "🎲 What is Startup Poly?",
  "🏏 How does IPL Auction work?",
  "⚔️ Brand Battles details",
  "🚀 Startup Expo",
  "📅 Summit dates & venue",
  "📞 Coordinator contacts",
];

export function QuickActions({
  actions = DEFAULT_ACTIONS,
  onSelect,
  disabled = false,
}: QuickActionsProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(action)}
          disabled={disabled}
          className="rounded-full border border-white/35 bg-white/10 px-2.5 py-1 font-mono text-[11px] font-medium text-white transition hover:border-white hover:bg-white hover:text-[#174ae8] disabled:pointer-events-none disabled:opacity-40"
        >
          {action}
        </button>
      ))}
    </div>
  );
}
