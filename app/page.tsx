"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import {
  event,
  about,
  subEvents,
  highlights,
  studentCoordinators,
  contact,
} from "@/lib/content";
import {
  InstitutionalHeader,
  HangingTag,
  CoverPopUpArt,
  PageFooterTimeline,
  SubEventBadge,
} from "./EventGraphics";
import AccordionGallery from "./components/AccordionGallery";
import {
  ArrowRight,
  Mail,
  Globe,
  MapPin,
  Phone,
  Calendar,
  Sparkles,
  Layers,
  ExternalLink,
} from "lucide-react";

const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HomePage() {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const eventsScrollRef = useRef<HTMLDivElement>(null);

  // Scroll progress across the pinned fan, eased with a spring so the active
  // panel settles into place instead of snapping frame-to-frame with raw scroll.
  const { scrollYProgress } = useScroll({
    target: eventsScrollRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 34,
    mass: 0.6,
  });

  useMotionValueEvent(smoothProgress, "change", (p) => {
    const n = subEvents.length;
    const idx = Math.min(n - 1, Math.max(0, Math.round(p * n - 0.5)));
    setActiveEventIndex((prev) => (prev === idx ? prev : idx));
  });

  return (
    <div className="riso-texture brochure-grid min-h-screen overflow-x-clip text-[#F7F2F6] selection:bg-[#7484FE] selection:text-[#2A2A2A]">
      {/* =========================================================================
          SECTION 1: HERO / COVER (Page 01)
          ========================================================================= */}
      <section
        id="top"
        className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col justify-between px-4 pt-4 pb-12 sm:px-8 sm:pt-6"
      >
        {/* Institutional Header */}
        <InstitutionalHeader />

        {/* Cover Title Area — asymmetric on desktop: copy left, pop-up art offset right */}
        <div className="relative my-auto flex flex-col items-center text-center lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:text-left">
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {/* Top Row: Date Pill and Edition */}
            <motion.div
              variants={heroFadeUp}
              className="flex w-full max-w-4xl items-center justify-between px-2 sm:px-4 lg:max-w-none lg:justify-start lg:gap-6 lg:px-0"
            >
              <span className="font-mono text-xs font-black tracking-widest uppercase text-[#F7F2F6]/90 sm:text-sm">
                E-SUMMIT
              </span>
              <div className="flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-4 py-1.5 backdrop-blur-xs">
                <Calendar className="h-4 w-4 text-[#33FF67]" />
                <span className="font-mono text-xs font-black tracking-wider uppercase sm:text-sm text-[#F7F2F6]">
                  {event.date}
                </span>
              </div>
            </motion.div>

            {/* Massive "THE EQUINOX" Title Lockup with Hanging "2.0" */}
            <motion.div variants={heroFadeUp} className="mt-4 flex justify-center lg:justify-start">
              <div className="leading-none">
                <span className="block font-mono text-2xl font-black tracking-widest bg-gradient-to-r from-[#7484FE] to-[#33FF67] bg-clip-text text-transparent sm:text-4xl lg:text-5xl">
                  THE
                </span>
                {/* Wrapping the word in its own relative box */}
                <div className="relative inline-block">
                  <h1 className="font-display-title display-title-shadow text-6xl tracking-tighter text-[#F7F2F6] sm:text-8xl md:text-9xl lg:text-[clamp(4rem,10vw,12rem)]">
                    EQUINOX
                  </h1>
                  <div className="absolute top-full left-[57%] -mt-4 sm:-mt-6 lg:-mt-10">
                    <HangingTag />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hashtag Tagline Badge */}
            <motion.div variants={heroFadeUp} className="mt-4 flex justify-center sm:mt-6 lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-md border-2 border-[#33FF67] bg-[#33FF67] px-4 py-2 shadow-[4px_4px_0px_#2A2A2A] sm:px-6 sm:py-2.5">
                <span className="font-mono text-sm font-black text-[#2A2A2A] sm:text-base">
                  #
                </span>
                <span className="font-mono text-xs font-black tracking-wider uppercase text-[#2A2A2A] sm:text-sm md:text-base">
                  WHERE PASSION MEETS PERSEVERANCE
                </span>
              </div>
            </motion.div>

            {/* Spaced OVERVIEW Typography */}
            <motion.div variants={heroFadeUp} className="mt-4 w-full">
              <h2 className="font-mono text-3xl font-black tracking-[0.28em] text-[#F7F2F6] uppercase sm:text-5xl md:text-6xl lg:text-7xl">
                OVERVIEW
              </h2>
            </motion.div>

            {/* CTA & Quick Actions */}
            <motion.div variants={heroFadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href="#events"
                className="flex items-center gap-2 rounded-full border-2 border-[#2A2A2A] bg-[#7484FE] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#F7F2F6] shadow-[4px_4px_0px_#2A2A2A] transition hover:scale-105 hover:bg-[#5868DF]"
              >
                Explore 10 Sub-Events
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#about"
                className="flex items-center gap-2 rounded-full border-2 border-white/80 bg-white/10 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#F7F2F6] backdrop-blur-xs transition hover:bg-[#7484FE] hover:border-[#7484FE] hover:text-[#F7F2F6]"
              >
                About Equinox
              </a>
            </motion.div>
          </motion.div>

          {/* Vector Pop-Up Book Editorial Art — offset into its own column, overlapping on desktop */}
          <motion.div
            className="mt-6 w-full max-w-2xl px-2 sm:mt-8 lg:col-span-5 lg:mt-20 lg:max-w-none lg:translate-x-6 lg:px-0"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <div className="animate-float">
              <CoverPopUpArt />
            </div>
          </motion.div>
        </div>

        {/* Cover Page Footer Timeline */}
        <PageFooterTimeline pageNumber="01" />
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT EQUINOX (Who Are We / What We Do / What Is Equinox)
          ========================================================================= */}
      <section
        id="about"
        className="relative mx-auto max-w-[1400px] border-t border-white/20 px-4 py-20 sm:px-8"
      >
        <div className="max-w-4xl">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#F7F2F6]">
            Page 01 · {about.eyebrow}
          </span>
          <h2 className="mt-4 font-display-title text-4xl font-black tracking-tight text-[#F7F2F6] sm:text-6xl lg:text-7xl">
            {about.heading}
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-[#F7F2F6]/95 sm:text-2xl font-medium">
            {about.whatIsEquinox}
          </p>
        </div>

        {/* Editorial Pair: who are we? / what we do — matching brochure casing */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* who are we? */}
          <div className="program-card rounded-3xl border-2 border-white/20 bg-white/5 p-8 backdrop-blur-xs">
            <span className="font-mono text-xs font-black tracking-wider text-[#33FF67] uppercase">
              01 · Vision
            </span>
            <h3 className="mt-2 text-3xl font-black lowercase text-[#F7F2F6] sm:text-4xl">
              who <span className="text-[#33FF67]">are we?</span>
            </h3>
            <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/80">
              Centre for Innovation &amp; Entrepreneurship @MLRIT
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#F7F2F6]/90">
              Established in 2015, MLRIT-CIE is an <span className="font-bold text-[#33FF67]">entrepreneurship development cell</span> dedicated to nurturing young innovators and supporting <span className="font-bold text-[#7484FE]">early-stage startups</span>. We focus on building a strong and thriving ecosystem that encourages growth, collaboration, and innovation.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#F7F2F6]/90">
              By inspiring <span className="font-bold text-[#7484FE]">creativity</span> and <span className="font-bold text-[#33FF67]">entrepreneurial spirit</span> among students, alumni, faculty, and industry partners, we create opportunities for <span className="font-bold text-[#7484FE]">learning, development</span>, and success. Through continuous support and guidance, we aim to drive innovation and turn <span className="font-bold text-[#33FF67]">ideas into reality</span>.
            </p>
          </div>

          {/* what we do */}
          <div className="program-card rounded-3xl border-2 border-white/20 bg-white/5 p-8 backdrop-blur-xs flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-black tracking-wider text-[#33FF67] uppercase">
                02 · Mission
              </span>
              <h3 className="mt-2 text-3xl font-black lowercase text-[#F7F2F6] sm:text-4xl">
                what <span className="text-[#33FF67]">we do</span>
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[#F7F2F6]/95 sm:text-lg">
                We host high-impact hackathons, from MetaLoop, our biggest national-level AR/VR hackathon, to Inventron, our flagship 36-hour build challenge.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#F7F2F6]/85">
                CIE MLRIT creates an ecosystem where ambitious students transform theoretical ideas into viable ventures through hands-on mentorship, seed funding, prototype support, and direct access to angel investors.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/20 bg-white/5 p-4">
              <span className="font-mono text-xs font-black text-[#33FF67] uppercase">
                Flagship Hackathon Series
              </span>
              <p className="mt-1 font-bold text-[#F7F2F6] text-sm">
                MetaLoop (National AR/VR) &amp; Inventron (36-Hour Build Challenge)
              </p>
            </div>
          </div>
        </div>

        {/* what is THE EQUINOX 2.0 — Banner matching Brochure Page 03 */}
        <div className="program-card mt-8 flex flex-col gap-8 rounded-3xl border-2 border-white/20 bg-[#2A2A2A] p-8 text-[#F7F2F6] shadow-xl sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:max-w-xl">
            <span className="font-mono text-xs font-black tracking-wider text-[#7484FE] uppercase">
              03 · The Summit (Page 03)
            </span>
            <h3 className="mt-2 text-3xl font-black text-[#F7F2F6] sm:text-4xl">
              what is <span className="text-[#7484FE]">THE</span> <span className="text-[#F7F2F6]">EQUINOX</span> <span className="text-[#33FF67]">2.0</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[#F7F2F6]/85">
              Equinox is a 2-day E Summit at MLR Institute of Technology, Hyderabad. It pictures a vibrant and engaging environment where students come together to take on real-world challenges and explore entrepreneurship through events like Spotlight, Case-Study Competitions, Brand Battles, IPL Auction, Startup Expo, Pitch Deck, and E-Cell Meet.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs font-black text-[#7484FE] lg:shrink-0">
            <span>30 - 31 OCTOBER 2026</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* Highlights Row (What's In Store stats) */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#F7F2F6]/80">
              What&apos;s In Store · Summit Scale
            </span>
            <span className="font-mono text-xs font-bold text-[#33FF67] uppercase">
              Page 04
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, idx) => (
              <div
                key={item.label}
                className="rounded-2xl border-2 border-white/20 bg-white/5 p-6 backdrop-blur-xs transition hover:border-[#7484FE] hover:bg-white/10"
              >
                <p className={`font-mono text-4xl font-black sm:text-5xl ${idx % 2 === 0 ? "text-[#7484FE]" : "text-[#33FF67]"}`}>
                  {item.value}
                </p>
                <p className="mt-2 font-bold text-[#F7F2F6] text-base">
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-[#F7F2F6]/80">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Page Footer Timeline */}
        <PageFooterTimeline pageNumber="03" />
      </section>

      {/* =========================================================================
          SECTION 4: SUB-EVENTS (Pages 05 & 06)
          ========================================================================= */}
      <section
        id="events"
        className="relative mx-auto max-w-[1400px] border-t border-white/20 px-4 py-20 sm:px-8"
      >
        {/* Section Header */}
        <div>
          <span className="rounded-full border border-white/40 bg-white/15 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white">
            Pages 05 &amp; 06
          </span>
          <h2 className="mt-3 font-display-title text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
            SUB-EVENTS
          </h2>
          <p className="mt-3 max-w-xl text-base text-white/90 sm:text-lg">
            All 10 official sub-events, locked in one after another. Keep scrolling to step through every one, then hit Register on the one you want.
          </p>
        </div>
      </section>

      {/* Scroll-Locked Fan — this wrapper is tall (10 viewport-heights), and
          the fan pins in place (position: sticky) while it scrolls past, so
          every event has to be stepped through before the page moves on to
          the next section below. */}
      <div ref={eventsScrollRef} style={{ height: `${subEvents.length * 70}vh` }} className="relative">
        <div className="sticky top-0 flex h-screen items-center px-4 sm:px-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <div className="mb-6 text-center font-mono text-xs font-bold uppercase tracking-wider text-white/70">
              Keep scrolling to move through all {subEvents.length} events
            </div>

            <div className="h-[520px] lg:h-[560px]">
              <AccordionGallery
                activeIndex={activeEventIndex}
                onSelect={setActiveEventIndex}
                className="h-full flex-col lg:flex-row"
                items={subEvents.map((item, idx) => {
                  const isActive = idx === activeEventIndex;
                  return {
                    content: (
                      <div
                        className={`h-full w-full border-2 transition-colors duration-300 ${
                          isActive
                            ? "border-[#7484FE] bg-[#2A2A2A]"
                            : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                        }`}
                      >
                        {isActive ? (
                          /* Expanded content */
                          <div className="flex h-full flex-col p-6 sm:p-8">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-xs font-black tracking-widest text-[#7484FE]">
                            PAGE {item.pageNumber} · {item.category}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#F7F2F6]/70">
                            Event {String(idx + 1).padStart(2, "0")} of {subEvents.length}
                          </span>
                        </div>

                        <div className="mt-4 flex min-h-[88px] w-full items-center justify-center rounded-2xl border-2 border-white/20 bg-[#1E1E1E] p-4 text-center">
                          <SubEventBadge slug={item.slug} />
                        </div>

                        <p className="mt-5 text-base leading-relaxed text-[#F7F2F6] sm:text-lg">
                          {item.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-xs text-[#F7F2F6]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex flex-col gap-3 border-t border-white/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F2F6]/80">
                            <Calendar className="h-3.5 w-3.5 text-[#33FF67]" />
                            {item.timing}
                          </span>
                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/events/${item.slug}`}
                              className="group/link flex shrink-0 items-center gap-1 text-xs font-bold text-[#F7F2F6] hover:text-[#7484FE] hover:underline"
                            >
                              View Details &amp; Rules
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                            <Link
                              href="/register"
                              className="flex shrink-0 items-center gap-2 rounded-full border-2 border-[#2A2A2A] bg-[#7484FE] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#F7F2F6] shadow-[3px_3px_0px_#2A2A2A] transition hover:scale-105 hover:bg-[#5868DF]"
                            >
                              Register Now
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Collapsed spine: just the number + name */
                      <div className="flex h-full w-full items-center gap-3 px-5 lg:flex-col lg:justify-between lg:gap-4 lg:px-0 lg:py-6">
                        <span className="font-mono text-xs font-black text-[#33FF67]">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display-title text-base font-black uppercase tracking-tight text-[#F7F2F6] lg:[writing-mode:vertical-rl]">
                          {item.name}
                        </span>
                      </div>
                    )}
                      </div>
                    ),
                  };
                })}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="relative mx-auto max-w-[1400px] border-t border-white/20 px-4 pt-4 pb-4 sm:px-8">
        {/* Page Footer Markers */}
        <PageFooterTimeline pageNumber={subEvents[activeEventIndex].pageNumber} />
      </section>

      {/* =========================================================================
          SECTION 5: SUMMIT HIGHLIGHTS & OUR IMPACT (Why Sponsor Us)
          ========================================================================= */}
      <section
        id="impact"
        className="relative mx-auto max-w-[1400px] border-t border-white/20 px-4 py-20 sm:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#F7F2F6]">
                Brochure Page 07 · Impact
              </span>
              <span className="font-mono text-sm font-bold text-[#33FF67] italic">
                Why Sponsor Us
              </span>
            </div>
            <h2 className="mt-4 font-display-title text-4xl font-black tracking-tight text-[#F7F2F6] sm:text-6xl uppercase">
              OUR IMPACT
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#F7F2F6]/90">
              The Equinox connects the brightest engineering and business minds with early-stage venture ecosystems. Sponsoring Equinox places your brand at the epicentre of student entrepreneurship across southern India.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
                <h4 className="font-bold text-[#7484FE] text-lg">Direct Campus Engagement</h4>
                <p className="mt-1 text-sm text-[#F7F2F6]/85">
                  Direct visibility before 2,000+ top engineering and MBA students, coders, and startup innovators.
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
                <h4 className="font-bold text-[#7484FE] text-lg">Talent &amp; Startup Scouting</h4>
                <p className="mt-1 text-sm text-[#F7F2F6]/85">
                  Immediate access to hiring pipelines via Internship Drive and pre-screened student ventures in Pitch Deck and Startup Expo.
                </p>
              </div>
            </div>
          </div>

          {/* Distinct "Why Sponsor Us" Stats (2,000+ Footfall, 600+ Participants distinct) */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="rounded-3xl border border-white/20 bg-[#2A2A2A] p-8 text-[#F7F2F6] shadow-xl">
              <span className="font-mono text-xs font-black uppercase text-[#7484FE]">Audience Reach</span>
              <p className="mt-2 font-mono text-5xl font-black text-[#7484FE] sm:text-6xl">2,000+</p>
              <p className="mt-2 font-bold text-base text-[#F7F2F6]">Footfall</p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-xs">
              <span className="font-mono text-xs font-black uppercase text-[#33FF67]">Active Delegates</span>
              <p className="mt-2 font-mono text-5xl font-black text-[#33FF67] sm:text-6xl">600+</p>
              <p className="mt-2 font-bold text-[#F7F2F6] text-base">Participants</p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-xs">
              <span className="font-mono text-xs font-black uppercase text-[#7484FE]">Ecosystem</span>
              <p className="mt-2 font-mono text-5xl font-black text-[#7484FE] sm:text-6xl">15+</p>
              <p className="mt-2 font-bold text-[#F7F2F6] text-base">Startups</p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-[#2A2A2A] p-8 text-[#F7F2F6] shadow-xl">
              <span className="font-mono text-xs font-black uppercase text-[#33FF67]">Competitions</span>
              <p className="mt-2 font-mono text-5xl font-black text-[#33FF67] sm:text-6xl">10</p>
              <p className="mt-2 font-bold text-base text-[#F7F2F6]">Sub-Events</p>
            </div>
          </div>
        </div>

        {/* Page Footer Timeline */}
        <PageFooterTimeline pageNumber="08" />
      </section>

      {/* =========================================================================
          SECTION 6: CONTACT US (Page 12)
          ========================================================================= */}
      <section
        id="contact"
        className="relative mx-auto max-w-[1400px] border-t border-white/20 px-4 py-20 sm:px-8"
      >
        {/* Dark Editorial Heading Replicating Page 12 */}
        <div className="max-w-3xl">
          <h2 className="font-display-title text-6xl font-black tracking-tighter text-[#F7F2F6] sm:text-7xl lg:text-8xl">
            Contact Us
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[#F7F2F6]/95 sm:text-xl font-medium">
            {contact.lead}
          </p>
        </div>

        {/* Student Coordinators from Page 12 */}
        <div className="mt-12">
          <h3 className="font-mono text-sm font-black uppercase tracking-wider text-[#33FF67]">
            {contact.subheading}
          </h3>
          <p className="mt-1 font-bold text-xl text-[#F7F2F6]">Student Coordinators</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studentCoordinators.map((coordinator) => (
              <a
                key={coordinator.name}
                href={`tel:${coordinator.phoneRaw}`}
                className="program-card group flex items-center justify-between rounded-2xl border-2 border-white/20 bg-white/5 p-5 backdrop-blur-xs transition hover:border-[#7484FE] hover:bg-[#7484FE]/20 hover:text-[#F7F2F6]"
              >
                <div>
                  <p className="font-bold text-lg text-[#F7F2F6] group-hover:text-[#7484FE]">
                    {coordinator.name}
                  </p>
                  <p className="font-mono text-sm text-[#33FF67] font-semibold">
                    {coordinator.phone}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-current text-[#7484FE]">
                  <Phone className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Official Contact Box */}
        <div className="mt-12 rounded-3xl border-2 border-white/20 bg-white/5 p-8 backdrop-blur-xs sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Email & Website */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7484FE] text-[#F7F2F6]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">
                    Mail
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-lg font-bold text-[#F7F2F6] hover:text-[#7484FE] hover:underline sm:text-xl"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7484FE] text-[#F7F2F6]">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">
                    Website
                  </p>
                  <a
                    href={contact.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-[#F7F2F6] hover:text-[#7484FE] hover:underline sm:text-xl"
                  >
                    {contact.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 border-t border-white/20 pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7484FE] text-[#F7F2F6]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">
                  Address
                </p>
                <div className="mt-1 text-sm leading-relaxed text-[#F7F2F6]/90">
                  {contact.addressLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Row from Page 12 */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6">
            <div className="flex flex-wrap items-center gap-4">
              {contact.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold text-[#F7F2F6] transition hover:bg-[#7484FE] hover:border-[#7484FE]"
                >
                  {social.platform === "Instagram" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  )}
                  {social.platform === "LinkedIn" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  )}
                  {social.platform === "X" && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {social.platform === "Facebook" && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  <span>{social.handle}</span>
                </a>
              ))}
            </div>

            <span className="font-mono text-xs text-white/70">
              MLRIT CIE · Official Program
            </span>
          </div>
        </div>

        {/* Page 12 Footer Timeline Marker */}
        <PageFooterTimeline pageNumber="12" />
      </section>
    </div>
  );
}
