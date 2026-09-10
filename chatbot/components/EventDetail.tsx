"use client";

import React from "react";
import Link from "next/link";
import { SubEventInfo, OFFICIAL_COORDINATORS } from "../data/events";
import { X, Calendar, MapPin, Award, Users, Phone, ArrowLeft, ArrowRight } from "lucide-react";

interface EventDetailProps {
  event: SubEventInfo | null;
  onClose: () => void;
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-[#2074d5] text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/20 bg-[#0c2b94] px-4 py-3">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold text-white transition hover:bg-white hover:text-[#2074d5]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Chat</span>
        </button>

        <span className="font-mono text-[11px] font-black uppercase tracking-wider text-white/80">
          Page {event.pageNumber}
        </span>

        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="chatbot-scrollbar flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {/* Title Lockup */}
        <div className="rounded-2xl border-2 border-white/40 bg-white/10 p-4">
          <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white">
            {event.category}
          </span>
          <h3 className="mt-2 font-mono text-2xl font-black uppercase text-white">
            {event.name}
          </h3>
          <p className="mt-1 text-xs text-white/80 font-medium">
            {event.tagline}
          </p>
        </div>

        {/* Official Description */}
        <div>
          <h5 className="font-mono text-[11px] font-black uppercase tracking-wider text-white/70">
            Official Synopsis
          </h5>
          <p className="mt-1.5 text-xs leading-relaxed text-white/95">
            {event.description}
          </p>
        </div>

        {/* Particulars Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/20 bg-white/5 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-white/70">
              <Calendar className="h-3 w-3" />
              Timing
            </div>
            <p className="mt-0.5 text-xs font-medium text-white">{event.timing}</p>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/5 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-white/70">
              <MapPin className="h-3 w-3" />
              Venue
            </div>
            <p className="mt-0.5 text-xs font-medium text-white">{event.venueRoom}</p>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/5 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-white/70">
              <Users className="h-3 w-3" />
              Format
            </div>
            <p className="mt-0.5 text-xs font-medium text-white">{event.format}</p>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/5 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-white/70">
              <Award className="h-3 w-3" />
              Eligibility
            </div>
            <p className="mt-0.5 text-xs font-medium text-white">{event.eligibility}</p>
          </div>
        </div>

        {/* Key Skills */}
        <div>
          <h5 className="font-mono text-[11px] font-black uppercase tracking-wider text-white/70">
            Core Competencies &amp; Skills
          </h5>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {event.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[11px] text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Coordinator Contacts */}
        <div className="rounded-xl border border-white/30 bg-[#282828]/40 p-3">
          <p className="text-[11px] font-bold text-white/80">
            Student Coordinators for {event.name}:
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {OFFICIAL_COORDINATORS.map((c) => (
              <a
                key={c.name}
                href={`tel:${c.phoneRaw}`}
                className="flex items-center gap-1 text-[11px] font-mono text-white/90 hover:underline"
              >
                <Phone className="h-2.5 w-2.5 text-white/60" />
                <span>{c.name}: {c.phone}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/20 bg-[#0c2b94] p-3 space-y-2 text-center">
        <Link
          href={`/events/${event.slug}`}
          onClick={onClose}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-white bg-white py-2 text-xs font-bold text-[#174ae8] shadow-md transition hover:bg-white/90"
        >
          <span>Open {event.name} Page &amp; Experience Animation</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <a
          href="#contact"
          className="inline-flex w-full items-center justify-center rounded-xl border border-white/40 bg-white/10 py-1.5 text-[11px] font-medium text-white/90 transition hover:bg-white/20"
        >
          Enquire / Hold Slot
        </a>
      </div>
    </div>
  );
}
