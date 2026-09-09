"use client";

import React from "react";
import { Zap, Dices, Trophy, Swords, Rocket, Calendar, Phone, Sparkles, type LucideIcon } from "lucide-react";

interface QuickActionsProps {
  actions?: string[];
  onSelect: (action: string) => void;
  disabled?: boolean;
}

const DEFAULT_ACTIONS = [
  "Tell me about Hustle Mania",
  "What is Startup Poly?",
  "How does IPL Auction work?",
  "Brand Battles details",
  "Startup Expo",
  "Summit dates & venue",
  "Coordinator contacts",
];

const ICON_KEYWORDS: [string, LucideIcon][] = [
  ["hustle", Zap],
  ["startup poly", Dices],
  ["ipl auction", Trophy],
  ["brand battles", Swords],
  ["startup expo", Rocket],
  ["date", Calendar],
  ["venue", Calendar],
  ["coordinator", Phone],
];

function iconForAction(action: string): LucideIcon {
  const lower = action.toLowerCase();
  const match = ICON_KEYWORDS.find(([keyword]) => lower.includes(keyword));
  return match ? match[1] : Sparkles;
}

export function QuickActions({
  actions = DEFAULT_ACTIONS,
  onSelect,
  disabled = false,
}: QuickActionsProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {actions.map((action, idx) => {
        const Icon = iconForAction(action);
        return (
          <button
            key={idx}
            onClick={() => onSelect(action)}
            disabled={disabled}
            className="flex items-center gap-1.5 rounded-full border border-white/35 bg-white/10 px-2.5 py-1 font-mono text-[11px] font-medium text-white transition hover:border-white hover:bg-white hover:text-[#2074d5] disabled:pointer-events-none disabled:opacity-40"
          >
            <Icon className="h-3 w-3" />
            {action}
          </button>
        );
      })}
    </div>
  );
}
