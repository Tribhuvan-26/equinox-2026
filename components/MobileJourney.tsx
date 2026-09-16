"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { subEvents } from "@/lib/content";
import { PlanetSVG, PlanetGradients } from "./JourneyPlanets";

gsap.registerPlugin(ScrollTrigger);

const ROCKET_HEIGHT = 40;

/**
 * Mobile-only journey. The desktop version is a 16500px horizontal world that
 * cannot work on a phone, so below 768px the same 10 events render as a vertical
 * spine of bullet nodes and the rocket travels up/down it with scroll.
 */
export default function MobileJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [nosingDown, setNosingDown] = useState(true);
  // md:hidden only hides the root, so the trigger must not be built on desktop
  // against a zero-height element. Tracked as state, not read once at mount, so
  // resizing across the breakpoint builds or tears down the trigger.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const ctx = gsap.context(() => {
      const spine = spineRef.current;
      const rocket = rocketRef.current;
      if (!spine || !rocket) return;

      const setY = (y: number) => {
        rocket.style.transform = `translate3d(-50%, ${y}px, 0)`;
      };
      setY(0);

      let lastProgress = 0;

      ScrollTrigger.create({
        trigger: spine,
        start: "top 80%",
        end: "bottom 20%",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Travel stops a rocket-height short so the glyph lands on the last
          // node instead of hanging below the spine.
          setY(p * Math.max(0, spine.offsetHeight - ROCKET_HEIGHT));

          // Nose follows travel. The threshold keeps a jittery finger scroll
          // from flipping the ship every frame.
          const delta = p - lastProgress;
          if (delta > 0.004) {
            setNosingDown(true);
            lastProgress = p;
          } else if (delta < -0.004) {
            setNosingDown(false);
            lastProgress = p;
          }

          setActiveIdx(Math.min(subEvents.length - 1, Math.floor(p * subEvents.length)));
        },
      });
    }, rootRef);

    // The spine's height depends on images and fonts that land after mount;
    // without this the trigger keeps the start/end it measured too early.
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 300);
    window.addEventListener("load", refresh);

    return () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <div
      ref={rootRef}
      className="relative w-full bg-[#0A0A0A] px-4 pt-8 pb-16 md:hidden"
    >
      <div className="mb-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#33FF67]">
          The Journey · 10 Events
        </p>
        <h2 className="mt-2 font-mono text-3xl font-black uppercase tracking-tight text-[#F7F2F6]">
          Chart the course
        </h2>
      </div>

      <div ref={spineRef} className="relative pl-16">
        {/* One copy of the planet gradients; each bullet references them by id. */}
        <svg width="0" height="0" aria-hidden className="absolute">
          <defs>
            <PlanetGradients />
          </defs>
        </svg>

        {/* Spine */}
        <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-[#7484FE] via-[#33FF67] to-[#7484FE] opacity-40" />

        {/* Rocket riding the spine */}
        <div
          ref={rocketRef}
          className="absolute left-[27px] top-0 z-10 will-change-transform"
        >
          {/* Same ship the desktop journey flies. Its art points up, so 180
              turns the nose down the spine. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/LukeSpaceship.svg"
            alt=""
            className={`h-10 w-10 drop-shadow-[0_0_10px_rgba(51,255,103,0.55)] transition-transform duration-300 ${
              nosingDown ? "rotate-180" : "rotate-0"
            }`}
            draggable={false}
          />
        </div>

        <ol className="flex flex-col gap-6">
          {subEvents.map((ev, idx) => {
            const isEven = idx % 2 === 0;
            const accent = isEven ? "#7484FE" : "#33FF67";
            const isActive = idx === activeIdx;

            return (
              <li key={ev.id} className="relative">
                {/* Bullet node on the spine */}
                <svg
                  viewBox="-250 -250 500 500"
                  aria-hidden
                  className={`absolute -left-16 top-4 h-[54px] w-[54px] transition-all duration-300 ${
                    isActive ? "scale-110 opacity-100" : "opacity-55"
                  }`}
                >
                  <PlanetSVG index={idx} event={ev} x={0} y={0} badge="" />
                </svg>

                <div
                  className={`rounded-2xl border bg-[#151515] p-4 transition-all duration-500 ${
                    isActive
                      ? "border-white/[0.14] opacity-100"
                      : "border-white/[0.06] opacity-40"
                  }`}
                >
                  <div
                    className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em]"
                    style={{
                      color: accent,
                      borderColor: `${accent}4D`,
                      backgroundColor: `${accent}1A`,
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                    <span>
                      {String(idx + 1).padStart(2, "0")} / 10 · {ev.category}
                    </span>
                  </div>

                  <div className="mt-3 flex h-16 items-center border-b border-white/[0.06] pb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/logos/${ev.slug}.png`}
                      alt={ev.name}
                      className="h-full w-auto object-contain object-left"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#7484FE]">
                    {ev.tagline}
                  </p>
                  <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-[#F7F2F6]/75">
                    {ev.description}
                  </p>

                  <Link
                    href={`/events/${ev.slug}`}
                    className="mt-4 inline-flex items-center justify-between gap-3 rounded-full bg-[#33FF67] py-2 pl-5 pr-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#161616] active:scale-[0.98]"
                  >
                    <span>Explore Event</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#181818]/15">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
