"use client";

import React from "react";
import Link from "next/link";
import { SubEventInfo, getEventSPOCs } from "../data/events";
import { X, Calendar, MapPin, Award, Users, Phone, ArrowLeft, ArrowRight, Trophy } from "lucide-react";

interface EventDetailProps {
  event: SubEventInfo | null;
  onClose: () => void;
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null;

  const spocs = event.spocs && event.spocs.length > 0 ? event.spocs : getEventSPOCs(event.slug || event.name);

  return (
    <div
      data-lenis-prevent
      className="absolute inset-0 z-30 flex h-full w-full flex-col overflow-hidden rounded-none border-l-2 border-white/40 bg-[#161616] text-[#F7F2F6]"
    >
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between border-b-2 border-white/20 bg-[#202020] px-4 py-3">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-none border-2 border-white/30 bg-[#222222] px-3 py-1 font-mono text-xs font-bold text-[#F7F2F6] shadow-[2px_2px_0px_#7484FE] hover:border-white hover:bg-[#7484FE] hover:text-[#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>BACK</span>
        </button>

        <span className="font-mono text-[11px] font-black uppercase tracking-wider text-[#7484FE]">
          PAGE // {event.pageNumber}
        </span>

        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-none border border-white/20 bg-[#222222] text-[#F7F2F6] shadow-[2px_2px_0px_#000000] hover:bg-[#FF4545] hover:text-white hover:border-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        className="chatbot-scrollbar flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-sm"
      >
        {/* Title Lockup */}
        <div className="rounded-none border-2 border-white/30 bg-[#1F1F1F] p-4 shadow-[3px_3px_0px_#000000]">
          <span className="inline-block rounded-none border border-[#7484FE]/50 bg-[#7484FE]/20 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase text-[#7484FE]">
            {event.category}
          </span>
          <h3 className="mt-2 font-mono text-2xl font-black uppercase tracking-tight text-[#F7F2F6]">
            {event.name}
          </h3>
          <p className="mt-1 text-xs text-[#F7F2F6]/75 font-medium">
            {event.tagline}
          </p>
        </div>

        {/* Official Prize / Rewards */}
        {event.prize && (
          <div className="rounded-none border-2 border-[#33FF67] bg-[#33FF67]/10 p-3.5 shadow-[3px_3px_0px_#33FF67]">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-black uppercase tracking-wider text-[#33FF67]">
              <Trophy className="h-4 w-4" />
              <span>OFFICIAL PRIZE &amp; REWARDS</span>
            </div>
            <p className="mt-1 font-mono text-sm font-bold text-[#F7F2F6]">
              {event.prize}
            </p>
          </div>
        )}

        {/* Official Description */}
        <div>
          <h5 className="font-mono text-[11px] font-black uppercase tracking-wider text-[#F7F2F6]/70">
            [ SYNOPSIS ]
          </h5>
          <p className="mt-1.5 text-xs leading-relaxed text-[#F7F2F6]/90">
            {event.description}
          </p>
        </div>

        {/* Particulars Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-none border-2 border-white/20 bg-[#1F1F1F] p-2.5 shadow-[2px_2px_0px_#000000]">
            <div className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-[#7484FE]">
              <Calendar className="h-3 w-3" />
              Timing
            </div>
            <p className="mt-0.5 font-mono text-xs font-medium text-[#F7F2F6]">{event.timing}</p>
          </div>

          <div className="rounded-none border-2 border-white/20 bg-[#1F1F1F] p-2.5 shadow-[2px_2px_0px_#000000]">
            <div className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-[#7484FE]">
              <MapPin className="h-3 w-3" />
              Venue
            </div>
            <p className="mt-0.5 font-mono text-xs font-medium text-[#F7F2F6]">{event.venueRoom}</p>
          </div>

          <div className="rounded-none border-2 border-white/20 bg-[#1F1F1F] p-2.5 shadow-[2px_2px_0px_#000000]">
            <div className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-[#7484FE]">
              <Users className="h-3 w-3" />
              Format
            </div>
            <p className="mt-0.5 font-mono text-xs font-medium text-[#F7F2F6]">{event.format}</p>
          </div>

          <div className="rounded-none border-2 border-white/20 bg-[#1F1F1F] p-2.5 shadow-[2px_2px_0px_#000000]">
            <div className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-[#7484FE]">
              <Award className="h-3 w-3" />
              Eligibility
            </div>
            <p className="mt-0.5 font-mono text-xs font-medium text-[#F7F2F6]">{event.eligibility}</p>
          </div>
        </div>

        {/* Key Skills */}
        <div>
          <h5 className="font-mono text-[11px] font-black uppercase tracking-wider text-[#F7F2F6]/70">
            [ KEY COMPETENCIES ]
          </h5>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {event.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-none border border-white/25 bg-[#222222] px-2.5 py-0.5 font-mono text-[11px] text-[#F7F2F6] shadow-[1px_1px_0px_#7484FE]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Coordinator Contacts */}
        <div className="rounded-none border-2 border-white/20 bg-[#1F1F1F] p-3 shadow-[2px_2px_0px_#000000]">
          <p className="font-mono text-[11px] font-bold uppercase text-[#F7F2F6]/80">
            Student Coordinators:
          </p>
          <div className="mt-2 flex flex-col gap-1.5">
            {spocs.map((c) => (
              <a
                key={c.name}
                href={`tel:${c.phoneRaw || c.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-1.5 font-mono text-[11px] text-[#33FF67] hover:underline"
              >
                <Phone className="h-2.5 w-2.5 text-[#33FF67]" />
                <span>{c.name} — {c.phone}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t-2 border-white/20 bg-[#161616] p-3 space-y-2 text-center">
        <Link
          href={`/events/${event.slug}`}
          onClick={onClose}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-none border-2 border-white bg-[#7484FE] py-2.5 font-mono text-xs font-black uppercase text-[#121212] shadow-[3px_3px_0px_#33FF67] hover:bg-[#33FF67] hover:shadow-[1px_1px_0px_#7484FE] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <span>Open {event.name} Page</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <a
          href="#contact"
          className="inline-flex w-full items-center justify-center rounded-none border border-white/20 bg-[#222222] py-1.5 font-mono text-[11px] font-bold uppercase text-[#F7F2F6]/90 shadow-[2px_2px_0px_#000000] hover:bg-white/10 hover:text-white transition-all"
        >
          Enquire / Hold Slot
        </a>
      </div>
    </div>
  );
}
