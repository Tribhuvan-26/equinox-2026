"use client";

import React, { useEffect, useRef } from "react";
import { BrochureSubEvent } from "../data/events";
import { triggerEventAnimation } from "../animations/eventAnimations";
import { ArrowRight, Calendar, MapPin, Sparkles, Gavel, Tag, Handshake, DollarSign, Dices } from "lucide-react";

interface EventCardProps {
  event: BrochureSubEvent;
  onSelect: (event: BrochureSubEvent) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  const animRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animRef.current) {
      triggerEventAnimation(event.animationType, animRef.current);
    }
  }, [event]);

  return (
    <div className="event-card-container mt-2.5 overflow-hidden rounded-2xl border-2 border-white/50 bg-[#0d2d99] text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/20 bg-[#0a2377] px-3.5 py-2">
        <span className="font-mono text-[10px] font-black uppercase tracking-wider text-white/80">
          PAGE {event.pageNumber} · {event.category}
        </span>
        <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[9px] font-black text-[#0d0e15]">
          EQUINOX 2.0
        </span>
      </div>

      {/* Main Card Content */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-mono text-base font-black tracking-tight text-white uppercase sm:text-lg">
              {event.name}
            </h4>
            <p className="mt-0.5 text-xs text-white/80 font-medium line-clamp-2">
              {event.tagline}
            </p>
          </div>
        </div>

        {/* GSAP Event Animation Canvas */}
        <div
          ref={animRef}
          className="event-anim-canvas mt-3 flex h-20 w-full items-center justify-center p-2"
        >
          {/* Spotlight Animation Elements */}
          {event.animationType === "spotlight" && (
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              <div className="spotlight-glow-center absolute h-8 w-8 rounded-full bg-blue-300/40 blur-xs" />
              <div className="spotlight-beam-shape absolute h-16 w-36 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px]" />
              <div className="relative z-10 font-mono text-xs font-black uppercase tracking-widest text-white">
                SPOTLIGHT BEAM
              </div>
            </div>
          )}

          {/* Crossroads Animation Elements */}
          {event.animationType === "crossroads" && (
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="cross-line-h absolute h-[2px] w-3/4 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <div className="cross-line-v absolute h-14 w-[2px] bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <div className="cross-node absolute h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-md" />
              <span className="absolute bottom-1 font-mono text-[9px] font-bold text-emerald-200">
                STRATEGY CROSSING
              </span>
            </div>
          )}

          {/* Startup Expo Animation Elements */}
          {event.animationType === "startup-expo" && (
            <div className="relative flex h-full w-full flex-col items-center justify-center">
              <div className="expo-spark-trail absolute bottom-2 h-8 w-1 bg-amber-400 blur-[1px]" />
              <div className="expo-rocket-icon relative text-amber-300">
                <Sparkles className="h-6 w-6 animate-pulse text-amber-300" />
              </div>
              <div className="expo-booth-door mt-1 rounded border border-amber-300/40 bg-amber-500/20 px-3 py-0.5 font-mono text-[10px] font-black text-amber-200">
                LIVE BOOTH SHOWCASE
              </div>
            </div>
          )}

          {/* Brand Battles Animation Elements */}
          {event.animationType === "brand-battles" && (
            <div className="relative flex h-full w-full items-center justify-center gap-3">
              <div className="brand-shield-left rounded border border-red-300 bg-red-500/30 px-2.5 py-1 font-mono text-[10px] font-black text-white">
                BRAND A
              </div>
              <div className="brand-clash-spark font-mono text-sm font-black text-red-400">
                VS
              </div>
              <div className="brand-shield-right rounded border border-red-300 bg-red-500/30 px-2.5 py-1 font-mono text-[10px] font-black text-white">
                BRAND B
              </div>
            </div>
          )}

          {/* IPL Auction Animation Elements */}
          {event.animationType === "ipl-auction" && (
            <div className="relative flex h-full w-full items-center justify-around px-4">
              <div className="ipl-gavel-icon rounded-full border border-purple-300/60 bg-purple-500/30 p-2 text-purple-200">
                <Gavel className="h-4 w-4" />
              </div>
              <div className="flex flex-col items-center">
                <span className="font-mono text-[9px] text-purple-300 uppercase">Live Bid</span>
                <span className="ipl-bid-val font-mono text-base font-black text-white">
                  ₹ 20 L
                </span>
              </div>
            </div>
          )}

          {/* Hustle Mania Animation Elements */}
          {event.animationType === "hustle-mania" && (
            <div className="relative flex h-full w-full items-center justify-center gap-1.5">
              <div className="hustle-card-1 flex items-center gap-1 rounded border border-pink-300 bg-pink-500/30 px-2 py-1 font-mono text-[10px] font-bold text-white shadow-xs">
                <Tag className="h-3 w-3" /> Sell
              </div>
              <div className="hustle-card-2 flex items-center gap-1 rounded border border-pink-300 bg-pink-500/30 px-2 py-1 font-mono text-[10px] font-bold text-white shadow-xs">
                <Handshake className="h-3 w-3" /> Pitch
              </div>
              <div className="hustle-card-3 flex items-center gap-1 rounded border border-white bg-pink-600 px-2.5 py-1 font-mono text-[10px] font-black text-white shadow-md">
                <DollarSign className="h-3 w-3" /> Profit
              </div>
            </div>
          )}

          {/* Internship Drive Animation Elements */}
          {event.animationType === "internship-drive" && (
            <div className="relative flex h-full w-full items-center justify-between px-6">
              <div className="rounded-full border border-cyan-300 bg-cyan-500/30 px-2 py-1 font-mono text-[10px] text-cyan-200">
                Candidate
              </div>
              <svg className="h-2 w-16 text-cyan-300" viewBox="0 0 60 4">
                <line
                  x1="0"
                  y1="2"
                  x2="60"
                  y2="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="intern-connect-line"
                />
              </svg>
              <div className="intern-offer-badge rounded-full border border-white bg-cyan-500 px-2 py-1 font-mono text-[10px] font-black text-[#0d0e15]">
                Startup
              </div>
            </div>
          )}

          {/* Startup Poly Animation Elements */}
          {event.animationType === "startup-poly" && (
            <div className="relative flex h-full w-full items-center justify-center gap-4">
              <div className="poly-dice-icon flex h-8 w-8 items-center justify-center rounded-lg border-2 border-white bg-yellow-400 text-[#0d0e15] shadow-md">
                <Dices className="h-4 w-4" />
              </div>
              <div className="poly-board-tile rounded border border-yellow-300/60 bg-yellow-500/20 px-3 py-1 font-mono text-xs font-bold text-yellow-200">
                Enterprise Tile
              </div>
            </div>
          )}

          {/* E-Cell Meet Animation Elements */}
          {event.animationType === "e-cell-meet" && (
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="ecell-hub flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-500 font-mono text-[10px] font-black text-white shadow-md">
                CIE
              </div>
              <div className="ecell-subnode absolute -top-1 left-8 h-2.5 w-2.5 rounded-full bg-indigo-300" />
              <div className="ecell-subnode absolute -bottom-1 left-12 h-2.5 w-2.5 rounded-full bg-indigo-300" />
              <div className="ecell-subnode absolute -top-1 right-8 h-2.5 w-2.5 rounded-full bg-indigo-300" />
              <div className="ecell-subnode absolute -bottom-1 right-12 h-2.5 w-2.5 rounded-full bg-indigo-300" />
            </div>
          )}

          {/* Pitch Deck Animation Elements */}
          {event.animationType === "pitch-deck" && (
            <div className="relative flex h-full w-full items-end justify-center gap-2 pb-2">
              <div className="pitch-bar-1 h-6 w-3.5 rounded-t bg-teal-400/60" />
              <div className="pitch-bar-2 h-10 w-3.5 rounded-t bg-teal-400/80" />
              <div className="pitch-bar-3 h-14 w-3.5 rounded-t bg-teal-300 shadow-md" />
              <div className="pitch-star absolute top-2 right-10 text-teal-300 text-xs font-bold">
                ⭐ 10x ROI
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta & Action */}
        <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2.5">
          <div className="flex items-center gap-1.5 text-[11px] text-white/80">
            <Calendar className="h-3 w-3" />
            <span>{event.timing.split("(")[0]}</span>
          </div>

          <button
            onClick={() => onSelect(event)}
            className="flex items-center gap-1 rounded-full border border-white bg-white px-3 py-1 font-mono text-xs font-black text-[#174ae8] transition hover:bg-white/90"
          >
            <span>View Details</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
