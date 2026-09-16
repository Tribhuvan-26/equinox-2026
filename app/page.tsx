"use client";

import { useRef, useState } from "react";
import {
  motion,
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
import ScrollJourney from "../components/ScrollJourney";
import JourneyOutro from "../components/JourneyOutro";
import ScrollReveal from "../components/ScrollReveal";
import PinnedSplit from "../components/PinnedSplit";
import LogoMarquee from "../components/LogoMarquee";
import GallerySection from "../components/GallerySection";

const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HomePage() {
  return (
    <div id="top" className="riso-texture brochure-grid min-h-screen overflow-x-clip text-[#F7F2F6] selection:bg-[#7484FE] selection:text-[#2A2A2A]">
      <ScrollJourney />

      {/* Seam out of the journey: warp exit, then the summit chapters */}
      <JourneyOutro line="Ten events charted. The summit begins." />
      {/* =========================================================================
          SECTION 2: ABOUT EQUINOX (Who Are We / What We Do / What Is Equinox)
          ========================================================================= */}
      <section
        id="about"
        className="relative mx-auto max-w-[1400px] px-4 py-32 sm:px-8 md:py-48"
      >
        <div className="max-w-5xl">
          <h2
            className="font-display-title font-black leading-[0.95] tracking-tight text-[#F7F2F6]"
            style={{ fontSize: "clamp(2.6rem, 5.2vw, 5.5rem)" }}
          >
            {about.heading}
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-[#F7F2F6]/95 sm:text-2xl font-medium">
            {about.whatIsEquinox}
          </p>
        </div>

        {/* Editorial Pair: who are we? / what we do — matching brochure casing */}
        <ScrollReveal className="mt-16 grid gap-8 md:grid-cols-2">
          {/* who are we? */}
          <div className="program-card rounded-3xl border border-white/10 bg-[#151515] p-8">
            <h3 className="text-3xl font-black lowercase text-[#F7F2F6] sm:text-4xl">
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
          <div className="program-card flex flex-col justify-between rounded-3xl border border-white/10 bg-[#151515] p-8">
            <div>
              <h3 className="text-3xl font-black lowercase text-[#F7F2F6] sm:text-4xl">
                what <span className="text-[#33FF67]">we do</span>
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[#F7F2F6]/95 sm:text-lg">
                We host high-impact hackathons, from MetaLoop, our biggest national-level AR/VR hackathon, to Inventron, our flagship 36-hour build challenge.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#F7F2F6]/85">
                CIE MLRIT creates an ecosystem where ambitious students transform theoretical ideas into viable ventures through hands-on mentorship, seed funding, prototype support, and direct access to angel investors.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[#33FF67]/25 bg-[#101010] p-4">
              <span className="font-mono text-xs font-black text-[#33FF67] uppercase">
                Flagship Hackathon Series
              </span>
              <p className="mt-1 font-bold text-[#F7F2F6] text-sm">
                MetaLoop (National AR/VR) &amp; Inventron (36-Hour Build Challenge)
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* what is THE EQUINOX 2.0 */}
        <div className="program-card mt-8 flex flex-col gap-8 rounded-3xl border border-[#7484FE]/30 bg-[#151515] p-8 text-[#F7F2F6] shadow-xl sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:max-w-xl">
            <h3 className="text-3xl font-black text-[#F7F2F6] sm:text-4xl">
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

        {/* Summit scale: 6-column dense bento. Row one is 3+3, row two is 2+2+2,
            so every cell is filled at every breakpoint. */}
        <ScrollReveal className="mt-20 grid grid-flow-dense gap-4 sm:grid-cols-6" stagger={0.06}>
          {highlights.map((item, idx) => {
            // 4+2 then 2+4: both rows total exactly 6 columns, so no cell is left empty.
            const wide = idx === 0 || idx === 3;
            const accent = idx % 2 === 0 ? "#7484FE" : "#33FF67";
            return (
              <div
                key={item.label}
                className={`group rounded-3xl border border-white/10 bg-[#151515] p-7 transition-colors duration-500 hover:border-white/25 ${
                  wide ? "sm:col-span-4" : "sm:col-span-2"
                }`}
              >
                <p
                  className="font-mono font-black leading-none"
                  style={{ color: accent, fontSize: wide ? "clamp(2.75rem, 5vw, 4.5rem)" : "clamp(2.25rem, 3.4vw, 3.25rem)" }}
                >
                  {item.value}
                </p>
                <p className="mt-3 text-base font-bold text-[#F7F2F6]">{item.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#F7F2F6]/70">{item.detail}</p>
                <span
                  className="mt-5 block h-px w-0 transition-all duration-700 ease-out group-hover:w-full"
                  style={{ backgroundColor: accent }}
                />
              </div>
            );
          })}
        </ScrollReveal>

      </section>


      {/* Ten sub-events, running as one continuous strip */}
      <div id="events" className="border-y border-white/10">
        <LogoMarquee slugs={subEvents.map((e) => e.slug)} names={subEvents.map((e) => e.name)} />
      </div>

      {/* =========================================================================
          IMPACT
          ========================================================================= */}
      <section
        id="impact"
        className="relative mx-auto max-w-[1400px] px-4 py-32 sm:px-8 md:py-48"
      >
        <PinnedSplit
          aside={
            <div>
              <h2
                className="font-display-title font-black uppercase leading-[0.92] tracking-tight text-[#F7F2F6] break-words"
                style={{ fontSize: "clamp(2.5rem, 4.4vw, 4.75rem)" }}
              >
                Our impact
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#F7F2F6]/90">
                The Equinox connects the brightest engineering and business minds with early-stage venture ecosystems. Sponsoring Equinox places your brand at the epicentre of student entrepreneurship across southern India.
              </p>
            </div>
          }
        >
          <ScrollReveal className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#151515] p-6">
              <h4 className="text-lg font-bold text-[#7484FE]">Direct Campus Engagement</h4>
              <p className="mt-1 text-sm text-[#F7F2F6]/85">
                Direct visibility before 2,000+ top engineering and MBA students, coders, and startup innovators.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#151515] p-6">
              <h4 className="text-lg font-bold text-[#7484FE]">Talent &amp; Startup Scouting</h4>
              <p className="mt-1 text-sm text-[#F7F2F6]/85">
                Immediate access to hiring pipelines via Internship Drive and pre-screened student ventures in Pitch Deck and Startup Expo.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal className="mt-4 grid grid-cols-2 gap-4" stagger={0.06}>
            <div className="rounded-3xl border border-[#7484FE]/30 bg-[#151515] p-8 text-[#F7F2F6]">
              <span className="font-mono text-xs font-black uppercase text-[#7484FE]">Audience Reach</span>
              <p className="mt-2 font-mono text-5xl font-black text-[#7484FE] sm:text-6xl">2,000+</p>
              <p className="mt-2 font-bold text-base text-[#F7F2F6]">Footfall</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#151515] p-8">
              <span className="font-mono text-xs font-black uppercase text-[#33FF67]">Active Delegates</span>
              <p className="mt-2 font-mono text-5xl font-black text-[#33FF67] sm:text-6xl">600+</p>
              <p className="mt-2 font-bold text-[#F7F2F6] text-base">Participants</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#151515] p-8">
              <span className="font-mono text-xs font-black uppercase text-[#7484FE]">Ecosystem</span>
              <p className="mt-2 font-mono text-5xl font-black text-[#7484FE] sm:text-6xl">15+</p>
              <p className="mt-2 font-bold text-[#F7F2F6] text-base">Startups</p>
            </div>

            <div className="rounded-3xl border border-[#33FF67]/30 bg-[#151515] p-8 text-[#F7F2F6]">
              <span className="font-mono text-xs font-black uppercase text-[#33FF67]">Competitions</span>
              <p className="mt-2 font-mono text-5xl font-black text-[#33FF67] sm:text-6xl">10</p>
              <p className="mt-2 text-base font-bold text-[#F7F2F6]">Sub-Events</p>
            </div>
          </ScrollReveal>
        </PinnedSplit>
      </section>

      {/* =========================================================================
          SECTION 5.5: EVENT GALLERY / ARCHIVES (Above Contact Us)
          ========================================================================= */}
      <GallerySection />

      {/* =========================================================================
          SECTION 6: CONTACT US (Page 12)
          ========================================================================= */}
      <section
        id="contact"
        className="relative mx-auto max-w-[1400px] px-4 py-32 sm:px-8 md:py-48"
      >
        {/* Dark Editorial Heading Replicating Page 12 */}
        <div className="max-w-3xl">
          <h2
            className="font-display-title font-black leading-[0.9] tracking-tighter text-[#F7F2F6]"
            style={{ fontSize: "clamp(3.25rem, 7vw, 7rem)" }}
          >
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

          <ScrollReveal className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
            {studentCoordinators.map((coordinator) => (
              <a
                key={coordinator.name}
                href={`tel:${coordinator.phoneRaw}`}
                className="program-card group flex items-center justify-between rounded-2xl border border-white/10 bg-[#151515] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#7484FE]"
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
          </ScrollReveal>
        </div>

        {/* Official Contact Box */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-[#151515] p-8 sm:p-10">
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
            <div className="flex items-start gap-4 border-t border-white/10 pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
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
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-center gap-4">
              {contact.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-[#101010] px-4 py-2 text-xs font-bold text-[#F7F2F6] transition hover:border-[#7484FE] hover:bg-[#7484FE]"
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

          </div>
        </div>

      </section>
    </div>
  );
}
