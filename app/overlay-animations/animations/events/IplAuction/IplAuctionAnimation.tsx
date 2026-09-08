// app/overlay-animations/animations/events/IplAuction/IplAuctionAnimation.tsx
"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import { BadgeIPLAuction } from "../../../../EventGraphics";
import {
  createIplAuctionTimeline,
  skipIplAuctionTimelineToExit,
} from "./iplAuctionTimeline";
import styles from "./IplAuctionAnimation.module.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Color-coded stand-ins for the bidding franchises — the real team crests are
// BCCI-licensed trademarks and this is an unofficial college fest page, so we
// signal "which team" with brand color only, styled like the site's own
// bordered program cards rather than any official logo artwork.
const PADDLE_TEAMS = [
  { label: "CSK", accent: "#F9D47B" },
  { label: "MI", accent: "#2074D5" },
  { label: "RCB", accent: "#EB547C" },
  { label: "SRH", accent: "#C93D62" },
];

export const IplAuctionAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headlineBlackRef = useRef<HTMLSpanElement>(null);
  const headlineWhiteRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const bidBlockRef = useRef<HTMLDivElement>(null);
  const bidValueRef = useRef<HTMLDivElement>(null);
  const paddleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const paddles = paddleRefs.current.filter(
        (el): el is HTMLDivElement => el !== null
      );

      const tl = createIplAuctionTimeline(
        {
          container: containerRef.current,
          skipButton: skipButtonRef.current,
          tag: tagRef.current,
          headlineBlack: headlineBlackRef.current,
          headlineWhite: headlineWhiteRef.current,
          badge: badgeRef.current,
          divider: dividerRef.current,
          bidBlock: bidBlockRef.current,
          bidValue: bidValueRef.current,
          paddles,
        },
        {
          onComplete: () => {
            onComplete?.();
          },
        }
      );

      timelineRef.current = tl;
      tl.play();
    }, containerRef);

    return () => {
      ctx.revert();
      timelineRef.current = null;
    };
  }, [onComplete]);

  useEffect(() => {
    if (isDismissed || skip) {
      skipIplAuctionTimelineToExit(timelineRef.current);
    }
  }, [isDismissed, skip]);

  const handleManualDismiss = () => {
    skipIplAuctionTimelineToExit(timelineRef.current);
    onDismiss?.();
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.overlayContainer} riso-texture`}
      role="dialog"
      aria-label="IPL Auction Event Animation"
    >
      <div className="paper-grain absolute inset-0" />

      <button
        ref={skipButtonRef}
        type="button"
        onClick={handleManualDismiss}
        aria-label="Skip Animation"
        className="absolute right-7 top-6 z-10 inline-flex items-center gap-2 border-2 border-white bg-transparent px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-[#2074D5]"
      >
        Skip <X className="h-3 w-3" />
      </button>

      <div className="relative z-[2] flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <div ref={tagRef}>
          <span className="inline-block border border-white/40 bg-[#282828] px-3.5 py-1 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[2px_2px_0px_#ffffff]">
            Official Equinox Sub-Event · Strategic Simulation
          </span>
        </div>

        <h2 className="font-display-title mt-5 text-5xl font-black uppercase tracking-tight sm:text-7xl lg:text-8xl">
          <span
            ref={headlineBlackRef}
            className="mr-2 inline-block bg-white px-2.5 py-0.5 text-[#282828] shadow-[3px_3px_0px_#282828] sm:mr-3 sm:px-3 sm:shadow-[4px_4px_0px_#282828]"
          >
            IPL
          </span>
          <span ref={headlineWhiteRef} className="inline-block break-words text-white">
            AUCTION
          </span>
        </h2>

        <div ref={badgeRef} className="mt-7">
          <div className="flex h-[88px] min-w-[220px] items-center justify-center rounded-2xl border-2 border-white bg-white/10 px-8 py-4 text-white shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
            <BadgeIPLAuction />
          </div>
        </div>

        <div ref={dividerRef} className="mt-9 h-[2px] w-[420px] max-w-[70vw] bg-white/50" />

        <div
          ref={bidBlockRef}
          className="mt-9 border-2 border-white/40 bg-[#282828] px-10 py-5 shadow-[6px_6px_0px_#282828]"
        >
          <span className="font-mono text-xs font-black uppercase tracking-widest text-white/70">
            Current Bid
          </span>
          <div
            ref={bidValueRef}
            className="font-display-title mt-1 text-4xl font-black tracking-tight text-white sm:text-5xl"
          >
            ₹ 20 L
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {PADDLE_TEAMS.map((team, i) => (
            <div
              key={team.label}
              ref={(el) => {
                paddleRefs.current[i] = el;
              }}
              className="border-2 border-white/60 bg-white/10 px-6 py-3 font-mono text-lg font-black uppercase tracking-widest text-white"
              style={{ borderBottomColor: team.accent, borderBottomWidth: "4px" }}
            >
              {team.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IplAuctionAnimation;
