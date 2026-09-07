// app/overlay-animations/animations/events/HustleMania/HustleManiaAnimation.tsx
"use client";

import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { AnimationComponentProps } from "../../core/animationTypes";
import {
  createHustleManiaEntranceTl,
  startHustleManiaIdleLoops,
  runHustleManiaExit,
} from "./hustleManiaTimeline";
import styles from "./HustleManiaAnimation.module.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const HustleManiaAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  isDismissed,
  skip,
  onDismiss,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  // ── Scene group refs (entrance animation) ──────────────────────────────
  const leftStallRef   = useRef<SVGGElement>(null);
  const rightStallRef  = useRef<SVGGElement>(null);
  const centerBgRef    = useRef<SVGGElement>(null);
  const buntingGroupRef = useRef<SVGGElement>(null);
  const titleGroupRef  = useRef<SVGGElement>(null);
  const titleHustleRef = useRef<SVGTextElement>(null); // for getBBox sizing
  const calloutRef     = useRef<SVGGElement>(null);
  const leftBuyerRef   = useRef<SVGGElement>(null);
  const rightBuyerRef  = useRef<SVGGElement>(null);
  const bubbleDealRef  = useRef<SVGGElement>(null);
  const bubbleYoursRef = useRef<SVGGElement>(null);
  const rightSignRef   = useRef<SVGGElement>(null);
  const steamGroupRef  = useRef<SVGGElement>(null);
  const cornerAnnotationsRef = useRef<SVGGElement>(null);

  // ── Idle loop refs ──────────────────────────────────────────────────────
  // 11 bunting flags
  const flagRefs = [
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
  ];
  // 3 steam wisps
  const steam0Ref = useRef<SVGGElement>(null);
  const steam1Ref = useRef<SVGGElement>(null);
  const steam2Ref = useRef<SVGGElement>(null);

  // ── Runtime refs ────────────────────────────────────────────────────────
  const entranceTlRef  = useRef<gsap.core.Timeline | null>(null);
  const idleLoopsRef   = useRef<gsap.core.Tween[]>([]);
  const exitingRef     = useRef(false);

  // ────────────────────────────────────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    exitingRef.current = false;
    const ctx = gsap.context(() => {
      // ── Title sizing via getBBox ──────────────────────────────────────
      // Scale down title block if rendered width exceeds 660 viewBox units
      if (titleHustleRef.current && titleGroupRef.current) {
        try {
          const bbox = titleHustleRef.current.getBBox();
          const maxW = 660;
          if (bbox.width > 0 && bbox.width > maxW) {
            const s = maxW / bbox.width;
            gsap.set(titleGroupRef.current, {
              scaleX: s,
              scaleY: s,
              transformOrigin: "960px 280px",
            });
          }
        } catch {
          // getBBox unavailable (SSR guard)
        }
      }

      // ── Entrance timeline ─────────────────────────────────────────────
      const buntingFlagEls = flagRefs
        .map((r) => r.current)
        .filter(Boolean) as SVGElement[];
      const steamEls = [steam0Ref.current, steam1Ref.current, steam2Ref.current].filter(
        Boolean
      ) as SVGElement[];

      const tl = createHustleManiaEntranceTl(
        {
          container: containerRef.current,
          skipButton: skipButtonRef.current,
          leftStall: leftStallRef.current,
          rightStall: rightStallRef.current,
          centerBg: centerBgRef.current,
          buntingGroup: buntingGroupRef.current,
          titleGroup: titleGroupRef.current,
          callout: calloutRef.current,
          leftBuyer: leftBuyerRef.current,
          rightBuyer: rightBuyerRef.current,
          bubbleDeal: bubbleDealRef.current,
          bubbleYours: bubbleYoursRef.current,
          rightSign: rightSignRef.current,
          steamGroup: steamGroupRef.current,
          cornerAnnotations: cornerAnnotationsRef.current,
          buntingFlags: buntingFlagEls,
          steamEls,
        },
        {
          onEntranceComplete: () => {
            if (exitingRef.current) return;
            const loops = startHustleManiaIdleLoops({
              buntingFlags: buntingFlagEls,
              steamEls,
              bubbleDeal: bubbleDealRef.current,
              bubbleYours: bubbleYoursRef.current,
              callout: calloutRef.current,
            });
            idleLoopsRef.current = loops;
          },
        }
      );

      entranceTlRef.current = tl;
      tl.play();
    }, containerRef);

    return () => {
      idleLoopsRef.current.forEach((tw) => tw.kill());
      idleLoopsRef.current = [];
      ctx.revert();
      entranceTlRef.current = null;
    };
  }, [onComplete]);

  // ── Dismiss / skip handler ─────────────────────────────────────────────
  useEffect(() => {
    if ((isDismissed || skip) && !exitingRef.current) {
      exitingRef.current = true;
      runHustleManiaExit(
        containerRef.current,
        idleLoopsRef.current,
        () => {
          idleLoopsRef.current = [];
          onComplete?.();
        }
      );
    }
  }, [isDismissed, skip, onComplete]);

  const handleManualDismiss = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    runHustleManiaExit(containerRef.current, idleLoopsRef.current, () => {
      idleLoopsRef.current = [];
      onComplete?.();
      onDismiss?.();
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={styles.overlayContainer}
      role="dialog"
      aria-label="Hustle Mania Event Animation"
    >
      {/* Paper grain texture */}
      <div className={styles.paperNoise}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="hm-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.09 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hm-grain)" />
        </svg>
      </div>

      {/* Skip button */}
      <button
        ref={skipButtonRef}
        type="button"
        className={styles.skipButton}
        onClick={handleManualDismiss}
        aria-label="Skip Animation"
      >
        Skip <X className="h-3 w-3" />
      </button>

      {/* ================================================================
          SVG Canvas — viewBox 1920×1080
          Drawing order (back → front):
            ground → title → centerBg → leftStall → rightStall →
            bunting → callout → buyers → bubbles →
            rightSign → steam → corners
      ================================================================ */}
      <svg
        className={styles.stageSvg}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── GROUND PLANE ─────────────────────────────────────────── */}
        <polygon points="0,750 1920,750 1920,860 0,860" fill="#ddd0be" />
        {/* Perspective radial lines from vanishing point at horizon */}
        {[0, 300, 550, 780, 960, 1140, 1370, 1620, 1920].map((x, i) => (
          <line key={i} x1={960} y1={750} x2={x} y2={860}
            stroke="#111111" strokeOpacity="0.04" strokeWidth="1" />
        ))}

        {/* ── TITLE GROUP (Rendered cleanly in sky between stalls) ──── */}
        <g ref={titleGroupRef}>
          {/* Motion-line accents — left side of title */}
          <line x1="640" y1="170" x2="665" y2="182" stroke="#111111" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <line x1="630" y1="195" x2="658" y2="202" stroke="#111111" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <line x1="638" y1="218" x2="658" y2="218" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          {/* Motion-line accents — right side */}
          <line x1="1280" y1="170" x2="1255" y2="182" stroke="#111111" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <line x1="1290" y1="195" x2="1262" y2="202" stroke="#111111" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <line x1="1282" y1="218" x2="1262" y2="218" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />

          {/* "HUSTLE" — black condensed bold */}
          <text
            ref={titleHustleRef}
            x="960"
            y="235"
            textAnchor="middle"
            className={styles.titleHustle}
            fontSize="135"
          >
            HUSTLE
          </text>

          {/* "MANIA" — electric blue */}
          <text
            x="960"
            y="355"
            textAnchor="middle"
            className={styles.titleMania}
            fontSize="135"
          >
            MANIA
          </text>

          {/* Tagline — clean horizontal band beneath title */}
          <text
            x="960"
            y="396"
            textAnchor="middle"
            className={styles.taglineText}
            fontSize="14"
          >
            SELL · PITCH · NEGOTIATE · GROW
          </text>
          <line x1="930" y1="406" x2="990" y2="406" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* ── CENTER BACKGROUND GROUP ──────────────────────────────── */}
        <g ref={centerBgRef}>
          {/* Small blue tent far back */}
          <polygon points="818,630 1102,630 960,520" fill="#1856f3" />
          <rect x="818" y="618" width="284" height="14" fill="#111111" />
          {/* Blue valance accents */}
          <rect x="818" y="618" width="48" height="14" fill="#1856f3" />
          <rect x="914" y="618" width="48" height="14" fill="#1856f3" />
          <rect x="1010" y="618" width="48" height="14" fill="#1856f3" />
          {/* Counter */}
          <rect x="826" y="630" width="268" height="100" fill="#1856f3" stroke="#111111" strokeWidth="2" />
          <rect x="826" y="630" width="268" height="10" fill="#2060e0" />
          {/* Center tent post */}
          <rect x="956" y="520" width="8" height="110" fill="#111111" opacity="0.6" />

          {/* Crowd silhouettes — 6 simplified figures */}
          {/* Person 1 */}
          <circle cx="845" cy="626" r="13" fill="#111111" />
          <rect x="832" y="639" width="26" height="52" rx="4" fill="#111111" />
          {/* Person 2 */}
          <circle cx="884" cy="620" r="13" fill="#111111" />
          <rect x="871" y="633" width="26" height="58" rx="4" fill="#111111" />
          {/* Person 3 — slightly taller, center */}
          <circle cx="960" cy="616" r="15" fill="#111111" />
          <rect x="945" y="631" width="30" height="60" rx="4" fill="#111111" />
          {/* Person 4 */}
          <circle cx="1038" cy="620" r="13" fill="#111111" />
          <rect x="1025" y="633" width="26" height="58" rx="4" fill="#111111" />
          {/* Person 5 */}
          <circle cx="1076" cy="626" r="13" fill="#111111" />
          <rect x="1063" y="639" width="26" height="52" rx="4" fill="#111111" />
          {/* Person 6 — smaller, partially behind center tent */}
          <circle cx="918" cy="630" r="11" fill="#111111" />
          <rect x="907" y="641" width="22" height="48" rx="4" fill="#111111" />

          {/* "SHOP SUPPORT HUSTLE REPEAT" A-frame sign */}
          <rect x="920" y="626" width="80" height="116" rx="3" fill="#111111" />
          <text x="960" y="648" textAnchor="middle" fill="white" fontSize="10.5"
                fontWeight="800" fontFamily="var(--font-mono),monospace" letterSpacing="0.05em">SHOP</text>
          <text x="960" y="666" textAnchor="middle" fill="white" fontSize="10.5"
                fontWeight="800" fontFamily="var(--font-mono),monospace" letterSpacing="0.05em">SUPPORT</text>
          <text x="960" y="684" textAnchor="middle" fill="white" fontSize="10.5"
                fontWeight="800" fontFamily="var(--font-mono),monospace" letterSpacing="0.05em">HUSTLE</text>
          <text x="960" y="702" textAnchor="middle" fill="white" fontSize="10.5"
                fontWeight="800" fontFamily="var(--font-mono),monospace" letterSpacing="0.05em">REPEAT</text>
          {/* A-frame legs */}
          <line x1="930" y1="742" x2="920" y2="774" stroke="#111111" strokeWidth="5" strokeLinecap="round" />
          <line x1="990" y1="742" x2="1000" y2="774" stroke="#111111" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* ── LEFT STALL GROUP ─────────────────────────────────────── */}
        <g ref={leftStallRef}>
          {/* Roof — large black triangle */}
          <polygon points="0,518 646,518 242,148" fill="#111111" />
          {/* Valance strip at roof base */}
          <rect x="0" y="504" width="646" height="20" fill="#111111" />
          {/* Blue valance accent rectangles */}
          <rect x="0" y="504" width="78" height="20" fill="#1856f3" />
          <rect x="152" y="504" width="78" height="20" fill="#1856f3" />
          <rect x="304" y="504" width="78" height="20" fill="#1856f3" />
          <rect x="456" y="504" width="78" height="20" fill="#1856f3" />
          <rect x="600" y="504" width="46" height="20" fill="#1856f3" />

          {/* Left post (structural) */}
          <rect x="28" y="148" width="18" height="380" fill="#111111" />

          {/* "GOOD IDEAS BETTER PEOPLE" blue banner on left post */}
          <rect x="28" y="265" width="94" height="263" fill="#1856f3" />
          <text x="75" y="305" textAnchor="middle" fill="white" fontSize="17"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif">GOOD</text>
          <text x="75" y="332" textAnchor="middle" fill="white" fontSize="17"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif">IDEAS</text>
          <text x="75" y="368" textAnchor="middle" fill="white" fontSize="16"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif">BETTER</text>
          <text x="75" y="404" textAnchor="middle" fill="white" fontSize="17"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif">PEOPLE</text>
          {/* Banner border accent */}
          <rect x="28" y="265" width="94" height="263" fill="none" stroke="#111111" strokeWidth="2" />

          {/* Counter body — electric blue front panel */}
          <rect x="28" y="518" width="610" height="218" fill="#1856f3" />
          {/* Counter top surface highlight */}
          <rect x="28" y="518" width="610" height="14" fill="#2060e0" />
          {/* Counter inner face shadow */}
          <rect x="44" y="538" width="578" height="174" fill="#0a3dba" opacity="0.32" />
          {/* Counter fascia bottom band (black) */}
          <rect x="28" y="702" width="610" height="32" fill="#111111" />

          {/* White display boxes — left side of counter */}
          <rect x="36" y="602" width="54" height="68" rx="2" fill="white" stroke="#111111" strokeWidth="1.5" />
          <rect x="44" y="592" width="46" height="68" rx="2" fill="white" stroke="#111111" strokeWidth="1.5" />

          {/* Mugs on counter (grouped left area) */}
          <rect x="112" y="630" width="38" height="34" rx="4" fill="white" stroke="#111111" strokeWidth="1.5" />
          <path d="M150,637 Q163,637 163,648 Q163,659 150,659"
                fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
          <rect x="102" y="623" width="38" height="34" rx="4" fill="white" stroke="#111111"
                strokeWidth="1.5" opacity="0.88" />
          <path d="M140,630 Q153,630 153,641 Q153,652 140,652"
                fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" opacity="0.88" />

          {/* Potted plant (left side of counter) */}
          <rect x="200" y="655" width="44" height="30" rx="3" fill="#1a1a1a" />
          <circle cx="218" cy="645" r="18" fill="#111111" />
          <circle cx="207" cy="652" r="13" fill="#111111" />
          <circle cx="228" cy="650" r="12" fill="#111111" />

          {/* T-shirt on hanger — displayed above counter */}
          <path d="M278,388 L278,362 Q308,346 338,362 L338,388"
                fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
          <path d="M308,346 Q308,330 320,330 Q330,330 330,338"
                fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
          <rect x="272" y="387" width="72" height="60" rx="5" fill="#111111" />
          <path d="M285,387 Q308,373 331,387" fill="#f0e6d8" stroke="#111111" strokeWidth="1.5" />
          <polygon points="272,387 250,402 260,416 272,408" fill="#111111" stroke="#111111" strokeWidth="1" />
          <polygon points="344,387 366,402 356,416 344,408" fill="#111111" stroke="#111111" strokeWidth="1" />
          <text x="308" y="422" textAnchor="middle" fill="white" fontSize="10"
                fontWeight="700" fontFamily="var(--font-mono),monospace" opacity="0.75">June</text>

          {/* "IDEAS FOR A BRIGHTER TOMORROW" standing card sign */}
          <rect x="514" y="611" width="66" height="98" rx="2" fill="white" stroke="#111111" strokeWidth="1.5" />
          <rect x="514" y="611" width="66" height="10" rx="2" fill="#1856f3" />
          <text x="547" y="633" textAnchor="middle" fill="#111111" fontSize="7.5"
                fontWeight="800" fontFamily="var(--font-mono),monospace">IDEAS</text>
          <text x="547" y="646" textAnchor="middle" fill="#111111" fontSize="7.5"
                fontWeight="800" fontFamily="var(--font-mono),monospace">FOR A</text>
          <text x="547" y="659" textAnchor="middle" fill="#111111" fontSize="7.5"
                fontWeight="800" fontFamily="var(--font-mono),monospace">BRIGHTER</text>
          <text x="547" y="672" textAnchor="middle" fill="#111111" fontSize="7.5"
                fontWeight="800" fontFamily="var(--font-mono),monospace">TOMORROW</text>

          {/* Stall support legs */}
          <rect x="44" y="730" width="18" height="58" fill="#111111" />
          <rect x="620" y="730" width="18" height="58" fill="#111111" />
          {/* Ground shadow */}
          <ellipse cx="328" cy="790" rx="290" ry="14" fill="#111111" opacity="0.08" />

          {/* LEFT SELLER FIGURE — upper body visible above counter top */}
          <circle cx="318" cy="410" r="30" fill="#111111" />
          <rect x="291" y="386" width="54" height="22" rx="10" fill="#111111" />
          <ellipse cx="320" cy="416" rx="17" ry="19" fill="#c4906a" />
          <rect x="291" y="440" width="54" height="108" rx="7" fill="#111111" />
          <rect x="299" y="453" width="38" height="86" rx="4" fill="#1856f3" />
          <path d="M291,460 Q256,444 228,434" stroke="#111111" strokeWidth="17" strokeLinecap="round" fill="none" />
          <path d="M345,462 Q393,452 434,449" stroke="#111111" strokeWidth="17" strokeLinecap="round" fill="none" />
          <rect x="432" y="436" width="26" height="28" rx="3" fill="white" stroke="#111111" strokeWidth="1.5" />
        </g>

        {/* ── RIGHT STALL GROUP (repositioned with comfortable right margin) */}
        <g ref={rightStallRef}>
          {/* Roof — triangle with safe margin from right edge */}
          <polygon points="1270,518 1840,518 1630,150" fill="#111111" />
          {/* Valance strip */}
          <rect x="1270" y="504" width="570" height="20" fill="#111111" />
          {/* Blue valance accents */}
          <rect x="1270" y="504" width="70" height="20" fill="#1856f3" />
          <rect x="1400" y="504" width="70" height="20" fill="#1856f3" />
          <rect x="1530" y="504" width="70" height="20" fill="#1856f3" />
          <rect x="1660" y="504" width="70" height="20" fill="#1856f3" />
          <rect x="1780" y="504" width="60" height="20" fill="#1856f3" />

          {/* Right post */}
          <rect x="1824" y="150" width="16" height="370" fill="#111111" />

          {/* Header banner — "STUDENTS IDEAS PRODUCTS POSSIBILITIES" */}
          <rect x="1270" y="518" width="570" height="88" fill="#111111" />
          <rect x="1270" y="518" width="570" height="88" fill="none" stroke="#1856f3" strokeWidth="1" opacity="0.4" />
          <text x="1555" y="542" textAnchor="middle" fill="white" fontSize="14"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.06em">STUDENTS</text>
          <text x="1555" y="561" textAnchor="middle" fill="#1856f3" fontSize="14"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.06em">IDEAS</text>
          <text x="1555" y="580" textAnchor="middle" fill="white" fontSize="13"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.06em">PRODUCTS</text>
          <text x="1555" y="598" textAnchor="middle" fill="#1856f3" fontSize="12"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.04em">POSSIBILITIES</text>

          {/* Counter body */}
          <rect x="1280" y="606" width="550" height="196" fill="#1856f3" />
          {/* Counter top highlight */}
          <rect x="1280" y="606" width="550" height="14" fill="#2060e0" />
          {/* Counter inner shadow */}
          <rect x="1296" y="626" width="518" height="156" fill="#0a3dba" opacity="0.32" />
          {/* Counter fascia */}
          <rect x="1280" y="772" width="550" height="30" fill="#111111" />

          {/* Product boxes on counter */}
          <rect x="1630" y="640" width="46" height="56" rx="2" fill="#1856f3" stroke="#111111" strokeWidth="2" />
          <rect x="1640" y="630" width="46" height="56" rx="2" fill="#1856f3" stroke="#111111" strokeWidth="2" />
          <rect x="1650" y="620" width="46" height="56" rx="2" fill="#1856f3" stroke="#111111" strokeWidth="2" />
          {/* Small screen/device on counter */}
          <rect x="1716" y="638" width="44" height="32" rx="4" fill="#111111" stroke="#1856f3" strokeWidth="2" />
          <rect x="1720" y="642" width="36" height="24" rx="2" fill="#1856f3" opacity="0.45" />

          {/* Potted plant */}
          <rect x="1780" y="678" width="36" height="26" rx="3" fill="#1a1a1a" />
          <circle cx="1798" cy="668" r="14" fill="#111111" />
          <circle cx="1789" cy="675" r="9" fill="#111111" />
          <circle cx="1805" cy="672" r="9" fill="#111111" />

          {/* Stall legs */}
          <rect x="1296" y="802" width="18" height="48" fill="#111111" />
          <rect x="1804" y="802" width="18" height="48" fill="#111111" />
          {/* Ground shadow */}
          <ellipse cx="1555" cy="852" rx="270" ry="13" fill="#111111" opacity="0.08" />

          {/* RIGHT SELLER FIGURE — behind right stall counter */}
          <circle cx="1520" cy="458" r="26" fill="#111111" />
          <rect x="1496" y="436" width="48" height="20" rx="9" fill="#111111" />
          <ellipse cx="1522" cy="463" rx="14" ry="16" fill="#c4906a" />
          <rect x="1496" y="484" width="48" height="124" rx="7" fill="#111111" />
          <path d="M1520,484 L1515,518" stroke="#1856f3" strokeWidth="3" strokeLinecap="round" />
          <rect x="1506" y="516" width="18" height="13" rx="2" fill="#1856f3" />
          <path d="M1496,506 Q1450,498 1406,500" stroke="#111111" strokeWidth="16" strokeLinecap="round" fill="none" />
          <rect x="1378" y="478" width="32" height="42" rx="4" fill="white" stroke="#111111" strokeWidth="2" />
          <path d="M1386,478 Q1388,466 1394,466 Q1400,466 1402,478"
                fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M1544,510 Q1565,520 1567,540" stroke="#111111" strokeWidth="14" strokeLinecap="round" fill="none" />
        </g>

        {/* ── BUNTING GROUP ─────────────────────────────────────────── */}
        {/* String dips below tagline, flags hang cleanly */}
        <g ref={buntingGroupRef}>
          <path
            d="M570,440 Q960,515 1350,440"
            fill="none"
            stroke="#111111"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Flag 0 — (617, 448) — blue */}
          <g ref={flagRefs[0]} transform="translate(617, 448)">
            <polygon points="-12,0 12,0 0,24" fill="#1856f3" />
          </g>
          {/* Flag 1 — (687, 459) — black */}
          <g ref={flagRefs[1]} transform="translate(687, 459)">
            <polygon points="-12,0 12,0 0,24" fill="#111111" />
          </g>
          {/* Flag 2 — (757, 467) — blue */}
          <g ref={flagRefs[2]} transform="translate(757, 467)">
            <polygon points="-12,0 12,0 0,24" fill="#1856f3" />
          </g>
          {/* Flag 3 — (827, 473) — black */}
          <g ref={flagRefs[3]} transform="translate(827, 473)">
            <polygon points="-12,0 12,0 0,24" fill="#111111" />
          </g>
          {/* Flag 4 — (890, 476) — blue */}
          <g ref={flagRefs[4]} transform="translate(890, 476)">
            <polygon points="-12,0 12,0 0,24" fill="#1856f3" />
          </g>
          {/* Flag 5 — center (960, 477) — black */}
          <g ref={flagRefs[5]} transform="translate(960, 477)">
            <polygon points="-12,0 12,0 0,24" fill="#111111" />
          </g>
          {/* Flag 6 — (1030, 476) — blue */}
          <g ref={flagRefs[6]} transform="translate(1030, 476)">
            <polygon points="-12,0 12,0 0,24" fill="#1856f3" />
          </g>
          {/* Flag 7 — (1093, 473) — black */}
          <g ref={flagRefs[7]} transform="translate(1093, 473)">
            <polygon points="-12,0 12,0 0,24" fill="#111111" />
          </g>
          {/* Flag 8 — (1163, 467) — blue */}
          <g ref={flagRefs[8]} transform="translate(1163, 467)">
            <polygon points="-12,0 12,0 0,24" fill="#1856f3" />
          </g>
          {/* Flag 9 — (1233, 459) — black */}
          <g ref={flagRefs[9]} transform="translate(1233, 459)">
            <polygon points="-12,0 12,0 0,24" fill="#111111" />
          </g>
          {/* Flag 10 — (1303, 448) — blue */}
          <g ref={flagRefs[10]} transform="translate(1303, 448)">
            <polygon points="-12,0 12,0 0,24" fill="#1856f3" />
          </g>
        </g>

        {/* ── "SMALL IDEAS BIG MOVES" CALLOUT ──────────────────────── */}
        <g ref={calloutRef}>
          <ellipse
            cx="1450"
            cy="200"
            rx="115"
            ry="70"
            fill="none"
            stroke="#111111"
            strokeWidth="2.5"
            strokeDasharray="5 2.5"
            transform="rotate(-4, 1450, 200)"
          />
          <text x="1450" y="182" textAnchor="middle" fill="#111111" fontSize="18"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.04em">
            SMALL
          </text>
          <text x="1450" y="204" textAnchor="middle" fill="#1856f3" fontSize="18"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.04em">
            IDEAS
          </text>
          <text x="1450" y="226" textAnchor="middle" fill="#111111" fontSize="18"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.04em">
            BIG MOVES
          </text>
        </g>

        {/* ── LEFT BUYER FIGURE ─────────────────────────────────────── */}
        <g ref={leftBuyerRef}>
          {/* Legs */}
          <rect x="737" y="592" width="20" height="168" rx="4" fill="#111111" />
          <rect x="765" y="597" width="20" height="163" rx="4" fill="#111111" />
          {/* Shoes */}
          <rect x="730" y="758" width="32" height="14" rx="4" fill="#111111" />
          <rect x="761" y="760" width="28" height="12" rx="4" fill="#111111" />
          {/* Torso */}
          <rect x="730" y="468" width="58" height="130" rx="7" fill="#111111" />
          {/* Blue backpack */}
          <rect x="786" y="476" width="40" height="90" rx="7" fill="#1856f3" />
          <rect x="796" y="488" width="20" height="66" rx="4" fill="#1264e0" />
          <rect x="790" y="472" width="4" height="100" rx="2" fill="#0a52c0" />
          {/* Head */}
          <circle cx="758" cy="442" r="28" fill="#111111" />
          {/* Hair */}
          <rect x="732" y="418" width="52" height="20" rx="9" fill="#111111" />
          {/* Face */}
          <ellipse cx="760" cy="447" rx="16" ry="18" fill="#c4906a" />
          {/* Left arm */}
          <path d="M730,492 Q694,480 654,474" stroke="#111111" strokeWidth="17" strokeLinecap="round" fill="none" />
          {/* Right arm */}
          <path d="M788,494 Q808,506 810,530" stroke="#111111" strokeWidth="15" strokeLinecap="round" fill="none" />
        </g>

        {/* ── RIGHT BUYER FIGURE ────────────────────────────────────── */}
        <g ref={rightBuyerRef}>
          {/* Long hair */}
          <path d="M1154,430 Q1150,492 1154,524 Q1156,534 1164,532" fill="#111111" />
          <path d="M1206,430 Q1210,492 1206,522 Q1204,530 1196,528" fill="#111111" />
          {/* Head */}
          <circle cx="1180" cy="440" r="27" fill="#111111" />
          {/* Hair top */}
          <rect x="1154" y="416" width="52" height="20" rx="9" fill="#111111" />
          {/* Face */}
          <ellipse cx="1182" cy="445" rx="15" ry="17" fill="#c4906a" />
          {/* Torso */}
          <rect x="1158" y="466" width="44" height="118" rx="7" fill="#111111" />
          {/* Blue clothing accent */}
          <rect x="1166" y="476" width="28" height="68" rx="4" fill="#1856f3" opacity="0.75" />
          {/* Legs */}
          <rect x="1160" y="580" width="18" height="170" rx="4" fill="#111111" />
          <rect x="1184" y="585" width="18" height="165" rx="4" fill="#111111" />
          {/* Shoes */}
          <rect x="1156" y="750" width="28" height="13" rx="4" fill="#111111" />
          <rect x="1182" y="752" width="24" height="11" rx="4" fill="#111111" />
          {/* Tote bag */}
          <path d="M1202,510 L1204,566 Q1202,578 1178,578 L1176,520"
                fill="white" stroke="#111111" strokeWidth="2" />
          {/* Bag handle */}
          <path d="M1182,510 Q1184,497 1190,497 Q1198,497 1200,510"
                fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
          {/* Left arm reaching toward right stall */}
          <path d="M1202,488 Q1252,480 1300,477" stroke="#111111" strokeWidth="15" strokeLinecap="round" fill="none" />
          {/* Right arm */}
          <path d="M1158,486 Q1140,498 1140,520" stroke="#111111" strokeWidth="14" strokeLinecap="round" fill="none" />
        </g>

        {/* ── SPEECH BUBBLE "DEAL?" ──────────────────────────────────── */}
        <g ref={bubbleDealRef}>
          <rect x="650" y="474" width="116" height="52" rx="12" className={styles.bubble} />
          {/* Tail pointing down-right toward buyer head */}
          <polygon points="730,526 754,548 712,526" className={styles.bubble}
                   stroke="#111111" strokeWidth="2.5" strokeLinejoin="round" />
          <text x="708" y="508" textAnchor="middle" className={styles.bubbleText} fontSize="20">
            DEAL?
          </text>
        </g>

        {/* ── SPEECH BUBBLE "YOURS!" ─────────────────────────────────── */}
        <g ref={bubbleYoursRef}>
          <rect x="1540" y="474" width="124" height="52" rx="12" className={styles.bubble} />
          {/* Tail pointing down-left toward seller */}
          <polygon points="1570,526 1545,548 1590,526" className={styles.bubble}
                   stroke="#111111" strokeWidth="2.5" strokeLinejoin="round" />
          <text x="1602" y="508" textAnchor="middle" className={styles.bubbleText} fontSize="20">
            YOURS!
          </text>
        </g>

        {/* ── "BUY SELL NEGOTIATE GROW" SIGN (repositioned foreground A-frame) */}
        <g ref={rightSignRef}>
          {/* Sign board — blue board with white text matching reference */}
          <rect x="1690" y="726" width="110" height="176" rx="4" fill="#1856f3" />
          <rect x="1690" y="726" width="110" height="176" rx="4" fill="none" stroke="#111111" strokeWidth="1.5" />
          <text x="1745" y="762" textAnchor="middle" fill="white" fontSize="15"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.04em">BUY</text>
          <text x="1745" y="794" textAnchor="middle" fill="white" fontSize="15"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.04em">SELL</text>
          <text x="1745" y="824" textAnchor="middle" fill="white" fontSize="11.5"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.04em">NEGOTIATE</text>
          <text x="1745" y="856" textAnchor="middle" fill="white" fontSize="15"
                fontWeight="900" fontFamily="var(--font-syne),'Arial Black',sans-serif" letterSpacing="0.04em">GROW</text>
          {/* White separator line */}
          <line x1="1715" y1="870" x2="1775" y2="870" stroke="white" strokeWidth="2" />
          {/* Sign legs */}
          <line x1="1705" y1="902" x2="1695" y2="946" stroke="#111111" strokeWidth="5" strokeLinecap="round" />
          <line x1="1785" y1="902" x2="1795" y2="946" stroke="#111111" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* ── STEAM WISPS above mugs on left counter ─────────────────── */}
        <g ref={steamGroupRef}>
          <g ref={steam0Ref} transform="translate(120, 628)">
            <path d="M0,0 C4,-10 -4,-20 0,-32 C4,-42 -2,-52 0,-62"
                  className={styles.steam} />
          </g>
          <g ref={steam1Ref} transform="translate(138, 630)">
            <path d="M0,0 C-3,-10 3,-20 0,-32 C-3,-42 3,-52 0,-62"
                  className={styles.steam} />
          </g>
          <g ref={steam2Ref} transform="translate(155, 626)">
            <path d="M0,0 C3,-10 -3,-18 0,-30 C3,-40 -3,-50 0,-60"
                  className={styles.steam} />
          </g>
        </g>

        {/* ── CORNER ANNOTATIONS ────────────────────────────────────── */}
        <g ref={cornerAnnotationsRef}>
          {/* Top left — "THE EQUINOX 2.0" */}
          <text x="80" y="78" className={styles.cornerBrand} fontSize="26">
            THE EQUINOX{" "}
            <tspan className={styles.cornerBrandBlue}>2.0</tspan>
          </text>
          <text x="82" y="108" className={styles.cornerText} fontSize="10" opacity="0.75">
            IDEAS · PEOPLE · MARKETS · OPPORTUNITIES
          </text>

          {/* Top right — date */}
          <text x="1840" y="78" textAnchor="end" className={styles.cornerText}
                fontSize="20" fontWeight="800">
            30 - 31 OCT
          </text>
          <line x1="1710" y1="92" x2="1840" y2="92" stroke="#111111" strokeWidth="2" />
          <text x="1840" y="112" textAnchor="end" className={styles.cornerText} fontSize="13">
            MLRIT
          </text>

          {/* Bottom left — hashtag */}
          <text x="80" y="1006" fontSize="30" fill="#1856f3" fontWeight="900"
                fontFamily="var(--font-syne),'Arial Black',sans-serif">
            #
          </text>
          <text x="116" y="997" className={styles.cornerText} fontSize="10" opacity="0.82">
            WHERE PASSION
          </text>
          <text x="116" y="1014" className={styles.cornerText} fontSize="10" opacity="0.82">
            MEETS PERSEVERANCE
          </text>
          <line x1="80" y1="1030" x2="178" y2="1030" stroke="#111111" strokeWidth="2" />

          {/* Bottom right */}
          <text x="1840" y="992" textAnchor="end" className={styles.cornerText} fontSize="10">
            SMALL IDEAS
          </text>
          <text x="1840" y="1010" textAnchor="end" className={styles.cornerText} fontSize="10">
            BIG MOVES
          </text>
          <line x1="1744" y1="1022" x2="1840" y2="1022" stroke="#111111" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

export default HustleManiaAnimation;
