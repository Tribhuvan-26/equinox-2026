"use client";

import React, { useEffect } from "react";
import { X, Calendar, MapPin, Award, Users, ArrowRight, Share2, Sparkles } from "lucide-react";
import { SubEvent, studentCoordinators } from "@/lib/content";
import { SubEventBadge } from "./BrochureGraphics";

interface EventModalProps {
  event: SubEvent | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (event) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#081a63]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-white/60 bg-[#174ae8] text-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/20 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-bold tracking-wider uppercase">
              Brochure Page {event.pageNumber}
            </span>
            <span className="text-xs font-semibold text-white/80">
              {event.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors hover:bg-white hover:text-[#174ae8]"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
          {/* Brand Badge Highlight */}
          <div className="flex flex-col items-start gap-3 rounded-2xl border-2 border-white/40 bg-white/10 p-6 backdrop-blur-xs">
            <div className="flex items-center justify-between w-full">
              <div className="rounded-2xl border-2 border-white bg-[#174ae8] px-6 py-3 shadow-lg">
                <SubEventBadge slug={event.slug} />
              </div>
              <span className="rounded-full bg-white px-3 py-1 font-mono text-xs font-black text-[#0d0e15]">
                EQUINOX 2.0
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold tracking-wide text-white/90">
              {event.tagline}
            </p>
          </div>

          {/* Official Brochure Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/75">
              Official Description
            </h4>
            <p className="mt-2 text-base leading-relaxed text-white sm:text-lg">
              {event.description}
            </p>
          </div>

          {/* Event Particulars Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Format */}
            <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white/70">
                <Users className="h-4 w-4" />
                Format
              </div>
              <p className="mt-1 text-sm font-medium text-white">{event.format}</p>
            </div>

            {/* Timing */}
            <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white/70">
                <Calendar className="h-4 w-4" />
                Confirmed Timing
              </div>
              <p className="mt-1 text-sm font-medium text-white">{event.timing}</p>
            </div>

            {/* Venue Room */}
            <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white/70">
                <MapPin className="h-4 w-4" />
                Venue
              </div>
              <p className="mt-1 text-sm font-medium text-white">{event.venueRoom}</p>
            </div>

            {/* Eligibility */}
            <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white/70">
                <Award className="h-4 w-4" />
                Eligibility
              </div>
              <p className="mt-1 text-sm font-medium text-white">{event.eligibility}</p>
            </div>
          </div>

          {/* Skills & Takeaways */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/75">
              Key Focus &amp; Skills Developed
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {event.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/40 bg-white/15 px-3.5 py-1 text-xs font-medium text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Coordinators Contact Notice */}
          <div className="rounded-2xl border border-white/30 bg-[#0d0e15]/40 p-4">
            <p className="text-xs font-semibold text-white/80">
              Questions regarding {event.name}? Contact Student Coordinators:
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {studentCoordinators.map((c) => (
                <a
                  key={c.name}
                  href={`tel:${c.phoneRaw}`}
                  className="text-xs font-mono underline decoration-white/50 underline-offset-2 hover:text-white hover:decoration-white"
                >
                  {c.name}: {c.phone}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 bg-[#123ebd] px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2 text-xs text-white/80">
            <Sparkles className="h-4 w-4 text-white" />
            <span>Dates: 30 - 31 October 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${event.name} | The Equinox 2.0`,
                    text: event.description,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard?.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className="flex items-center gap-1.5 rounded-full border border-white/40 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>

            <a
              href="#contact"
              onClick={onClose}
              className="flex items-center gap-2 rounded-full border-2 border-white bg-white px-5 py-2 text-xs font-bold text-[#174ae8] shadow-md transition hover:bg-white/90 hover:scale-[1.02]"
            >
              Enquire &amp; Register
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
