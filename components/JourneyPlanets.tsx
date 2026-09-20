"use client";

import React from "react";
import Link from "next/link";
import { SubEvent } from "@/lib/content";

export interface PlanetLayout {
  index: number;
  x: number;
  y: number;
  cardTop: number;
  badge: string;
}

export const PLANET_LAYOUTS: PlanetLayout[] = [
  { index: 0, x: 1600, y: 382, cardTop: 415, badge: "01 · SPOTLIGHT" },
  { index: 1, x: 3000, y: 698, cardTop: 300, badge: "02 · CROSS ROADS" },
  { index: 2, x: 4400, y: 367, cardTop: 415, badge: "03 · STARTUP EXPO" },
  { index: 3, x: 5800, y: 684, cardTop: 300, badge: "04 · BRAND BATTLES" },
  { index: 4, x: 7200, y: 382, cardTop: 415, badge: "05 · IPL AUCTION" },
  { index: 5, x: 8600, y: 698, cardTop: 300, badge: "06 · HUSTLE MANIA" },
  { index: 6, x: 10000, y: 367, cardTop: 415, badge: "07 · INTERNSHIP DRIVE" },
  { index: 7, x: 11400, y: 684, cardTop: 300, badge: "08 · STARTUP POLY" },
  { index: 8, x: 12800, y: 382, cardTop: 415, badge: "09 · E-CELL MEET" },
  { index: 9, x: 14200, y: 670, cardTop: 300, badge: "10 · PITCH DECK" },
];

// Dramatic, large sinusoidal S-curve routing across all 10 planets matching reference:
// - Rocket launches from Earth (360,690) ascending into a high arc apex at (920, 260)
// - Upper-half planets (0 Spotlight, 2 Startup Expo, 4 IPL Auction, 6 Internship Drive, 8 E-Cell Meet):
//   Path sweeps into deep valleys BELOW them (~Y=770, clearance > 340px)
// - Lower-half planets (1 Crossroads, 3 Brand Battles, 5 Hustle Mania, 7 Startup Poly, 9 Pitch Deck):
//   Path sweeps into high crests ABOVE them (~Y=260, clearance > 400px)
// - Summit Gateway smoothly entered at (15800, 540)
export const JOURNEY_SQUIGGLY_PATH =
  "M 360,690 " +
  "C 550,480 720,260 920,260 " +
  "C 1182,260 1338,770 1600,770 " +
  "C 2139,770 2461,260 3000,260 " +
  "C 3539,260 3861,770 4400,770 " +
  "C 4939,770 5261,260 5800,260 " +
  "C 6339,260 6661,770 7200,770 " +
  "C 7739,770 8061,260 8600,260 " +
  "C 9139,260 9461,770 10000,770 " +
  "C 10539,770 10861,260 11400,260 " +
  "C 11939,260 12261,770 12800,770 " +
  "C 13339,770 13661,260 14200,260 " +
  "C 14840,260 15160,540 15800,540";

export const TOTAL_WORLD_WIDTH = 16500;

interface PlanetSVGProps {
  index: number;
  event: SubEvent;
  x: number;
  y: number;
  badge: string;
}

export const PlanetSVG: React.FC<PlanetSVGProps> = ({
  index,
  event,
  x,
  y,
  badge,
}) => {
  const pillWidth = badge.length > 18 ? 200 : 150;
  const pillX = -pillWidth / 2;
  const pillStroke = index === 9 ? "#7484FE" : index % 2 === 0 ? "#7484FE" : "#33FF67";

  // Individual scale factors to remove transparent/black boundaries baked into the PNGs
  const IMAGE_SCALES: Record<number, number> = {
    0: 1.3,  // Spotlight (increased to hide bottom gap)
    3: 1.25, // Brand Battles
    4: 1.25, // IPL Auction
    5: 1.2,  // Hustle Mania
    6: 1.3,  // Internship Drive
    7: 1.45, // Startup Poly
  };
  const scale = IMAGE_SCALES[index] || 1.05;
  const imgSize = 250 * scale;
  const imgOffset = -125 * scale;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      id={`planet-node-${index}`}
    >
      <Link href={`/events/${event.slug}`} className="group pointer-events-auto cursor-pointer">
        <g
          transform="scale(1.75)"
          className="transition-transform duration-300 ease-out group-hover:scale-105"
          style={{ transformOrigin: "0px 0px" }}
        >
          {/* ========================================================
            01. SPOTLIGHT — Visionary Keynotes & Beams
            ======================================================== */}
          {index === 0 && (
            <g>
              <ellipse cx="0" cy="0" rx="131" ry="39" fill="none" stroke="#7484FE" strokeWidth="1.5" transform="rotate(24)" opacity="0.7" />

              <defs>
                <clipPath id={`planet-clip-${index}`}>
                  <circle cx="0" cy="0" r="85" />
                </clipPath>
              </defs>
              <g filter="drop-shadow(0 0 35px rgba(116,132,254,0.45))">
                <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
                <image
                  href={`/planets/${event.slug}.png`}
                  x={imgOffset}
                  y={imgOffset}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#planet-clip-${index})`}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="0" cy="0" r="85" fill="none" stroke="#7484FE" strokeWidth="1.5" opacity="0.8" />
              </g>
              <g clipPath="url(#front-orbit-clip)">
                <ellipse cx="0" cy="0" rx="131" ry="39" fill="none" stroke="#7484FE" strokeWidth="1.5" transform="rotate(24)" opacity="0.7" />
              </g>
            </g>
          )}

          {/* ========================================================
            02. CROSS ROADS — Strategic Case Matrix
            ======================================================== */}
          {index === 1 && (
            <g>
              <ellipse cx="0" cy="0" rx="141" ry="48" fill="none" stroke="#F7F2F6" strokeWidth="1.5" transform="rotate(30)" opacity="0.7" />
              <defs>
                <clipPath id={`planet-clip-${index}`}>
                  <circle cx="0" cy="0" r="85" />
                </clipPath>
              </defs>
              <g filter="drop-shadow(0 0 30px rgba(116,132,254,0.3))">
                <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
                <image
                  href={`/planets/${event.slug}.png`}
                  x={imgOffset}
                  y={imgOffset}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#planet-clip-${index})`}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="0" cy="0" r="85" fill="none" stroke="#7484FE" strokeWidth="1.5" opacity="0.8" />
              </g>
              <g clipPath="url(#front-orbit-clip)">
                <ellipse cx="0" cy="0" rx="141" ry="48" fill="none" stroke="#F7F2F6" strokeWidth="1.5" transform="rotate(30)" opacity="0.7" />
              </g>
            </g>
          )}

          {/* ========================================================
            03. STARTUP EXPO — Modular Innovation Satellite System
            ======================================================== */}
          {index === 2 && (
            <g>
              <ellipse cx="0" cy="0" rx="120" ry="44" fill="none" stroke="#33FF67" strokeWidth="1.5" transform="rotate(27)" opacity="0.7" />
              <defs>
                <clipPath id={`planet-clip-${index}`}>
                  <circle cx="0" cy="0" r="85" />
                </clipPath>
              </defs>
              <g filter="drop-shadow(0 0 35px rgba(51,255,103,0.35))">
                <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
                <image
                  href={`/planets/${event.slug}.png`}
                  x={imgOffset}
                  y={imgOffset}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#planet-clip-${index})`}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="0" cy="0" r="85" fill="none" stroke="#33FF67" strokeWidth="1.5" opacity="0.8" />
              </g>
              <g clipPath="url(#front-orbit-clip)">
                <ellipse cx="0" cy="0" rx="120" ry="44" fill="none" stroke="#33FF67" strokeWidth="1.5" transform="rotate(27)" opacity="0.7" />
              </g>
            </g>
          )}

          {/* ========================================================
            04. BRAND BATTLES — Master Template Green Gas Giant
            ======================================================== */}
          {index === 3 && (
            <g>
              <ellipse cx="0" cy="0" rx="135" ry="40" fill="none" stroke="#33FF67" strokeWidth="2.5" opacity="0.65" transform="rotate(22)" />
              <defs>
                <clipPath id={`planet-clip-${index}`}>
                  <circle cx="0" cy="0" r="85" />
                </clipPath>
              </defs>
              <g filter="drop-shadow(0 0 45px rgba(51,255,103,0.45))">
                <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
                <image
                  href={`/planets/${event.slug}.png`}
                  x={imgOffset}
                  y={imgOffset}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#planet-clip-${index})`}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="0" cy="0" r="85" fill="none" stroke="#33FF67" strokeWidth="1.5" opacity="0.8" />
              </g>
              <g clipPath="url(#front-orbit-clip)">
                <ellipse cx="0" cy="0" rx="135" ry="40" fill="none" stroke="#33FF67" strokeWidth="2.5" opacity="0.65" transform="rotate(22)" />
              </g>
            </g>
          )}

          {/* ========================================================
            05. IPL AUCTION — Ice & Cyan Arena Stadium & Ring
            ======================================================== */}
          {index === 4 && (
            <g>
              <ellipse cx="0" cy="0" rx="127" ry="42" fill="none" stroke="#38BDF8" strokeWidth="2" transform="rotate(23)" opacity="0.75" />
              <defs>
                <clipPath id={`planet-clip-${index}`}>
                  <circle cx="0" cy="0" r="85" />
                </clipPath>
              </defs>
              <g filter="drop-shadow(0 0 40px rgba(56,189,248,0.4))">
                <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
                <image
                  href={`/planets/${event.slug}.png`}
                  x={imgOffset}
                  y={imgOffset}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#planet-clip-${index})`}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="0" cy="0" r="85" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
              </g>
              <g clipPath="url(#front-orbit-clip)">
                <ellipse cx="0" cy="0" rx="127" ry="42" fill="none" stroke="#38BDF8" strokeWidth="2" transform="rotate(23)" opacity="0.75" />
              </g>
            </g>
          )}

          {/* ========================================================
            06. HUSTLE MANIA — Dynamic Duotone Speed Stripes
            ======================================================== */}
          {index === 5 && (
            <g>
              <ellipse cx="0" cy="0" rx="129" ry="38" fill="none" stroke="#7484FE" strokeWidth="2" transform="rotate(26)" opacity="0.7" />
              <defs>
                <clipPath id={`planet-clip-${index}`}>
                  <circle cx="0" cy="0" r="85" />
                </clipPath>
              </defs>
              <g filter="drop-shadow(0 0 35px rgba(51,255,103,0.35))">
                <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
                <image
                  href={`/planets/${event.slug}.png`}
                  x={imgOffset}
                  y={imgOffset}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#planet-clip-${index})`}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="0" cy="0" r="85" fill="none" stroke="#33FF67" strokeWidth="1.5" opacity="0.8" />
              </g>
              <g clipPath="url(#front-orbit-clip)">
                <ellipse cx="0" cy="0" rx="129" ry="38" fill="none" stroke="#7484FE" strokeWidth="2" transform="rotate(26)" opacity="0.7" />
              </g>
            </g>
          )}

          {/* ========================================================
            07. INTERNSHIP DRIVE — Blueprint Architecture
            ======================================================== */}
          {index === 6 && (
            <g>
              <ellipse cx="0" cy="0" rx="125" ry="47" fill="none" stroke="#F7F2F6" strokeWidth="1.5" transform="rotate(26)" opacity="0.6" />
              <defs>
                <clipPath id={`planet-clip-${index}`}>
                  <circle cx="0" cy="0" r="85" />
                </clipPath>
              </defs>
              <g filter="drop-shadow(0 0 30px rgba(116,132,254,0.35))">
                <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
                <image
                  href={`/planets/${event.slug}.png`}
                  x={imgOffset}
                  y={imgOffset}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#planet-clip-${index})`}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="0" cy="0" r="85" fill="none" stroke="#7484FE" strokeWidth="1.5" opacity="0.8" />
              </g>
              <g clipPath="url(#front-orbit-clip)">
                <ellipse cx="0" cy="0" rx="125" ry="47" fill="none" stroke="#F7F2F6" strokeWidth="1.5" transform="rotate(26)" opacity="0.6" />
              </g>
            </g>
          )}

          {/* ========================================================
            08. STARTUP POLY — Purple & Electric Blue Faceted Matrix
            ======================================================== */}
          {index === 7 && (
            <g>
              <ellipse cx="0" cy="0" rx="142" ry="44" fill="none" stroke="#A78BFA" strokeWidth="2" transform="rotate(25)" opacity="0.7" />
              <defs>
                <clipPath id={`planet-clip-${index}`}>
                  <circle cx="0" cy="0" r="85" />
                </clipPath>
              </defs>
              <g filter="drop-shadow(0 0 35px rgba(167,139,250,0.35))">
                <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
                <image
                  href={`/planets/${event.slug}.png`}
                  x={imgOffset}
                  y={imgOffset}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#planet-clip-${index})`}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="0" cy="0" r="85" fill="none" stroke="#A78BFA" strokeWidth="1.5" opacity="0.8" />
              </g>
              <g clipPath="url(#front-orbit-clip)">
                <ellipse cx="0" cy="0" rx="142" ry="44" fill="none" stroke="#A78BFA" strokeWidth="2" transform="rotate(25)" opacity="0.7" />
              </g>
            </g>
          )}

          {/* ========================================================
            09. E-CELL MEET — Network Mesh Federation
            ======================================================== */}
          {index === 8 && (
            <g>
              <ellipse cx="0" cy="0" rx="140" ry="48" fill="none" stroke="#A78BFA" strokeWidth="1.8" transform="rotate(29)" opacity="0.75" />
              <defs>
                <clipPath id={`planet-clip-${index}`}>
                  <circle cx="0" cy="0" r="85" />
                </clipPath>
              </defs>
              <g filter="drop-shadow(0 0 35px rgba(167,139,250,0.35))">
                <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
                <image
                  href={`/planets/${event.slug}.png`}
                  x={imgOffset}
                  y={imgOffset}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#planet-clip-${index})`}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="0" cy="0" r="85" fill="none" stroke="#A78BFA" strokeWidth="1.5" opacity="0.8" />
              </g>
              <g clipPath="url(#front-orbit-clip)">
                <ellipse cx="0" cy="0" rx="140" ry="48" fill="none" stroke="#A78BFA" strokeWidth="1.8" transform="rotate(29)" opacity="0.75" />
              </g>
            </g>
          )}

          {/* ========================================================
            10. PITCH DECK — Crown Summit Grand Finale
            ======================================================== */}
          {index === 9 && (
            <g>
              <ellipse cx="0" cy="0" rx="137" ry="48" fill="none" stroke="#7484FE" strokeWidth="2.5" transform="rotate(30)" opacity="0.8" />
              <defs>
                <clipPath id={`planet-clip-${index}`}>
                  <circle cx="0" cy="0" r="85" />
                </clipPath>
              </defs>
              <g filter="drop-shadow(0 0 50px rgba(116,132,254,0.55))">
                <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
                <image
                  href="/planets/pitch-deck.svg"
                  x={imgOffset}
                  y={imgOffset}
                  width={imgSize}
                  height={imgSize}
                  clipPath={`url(#planet-clip-${index})`}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="0" cy="0" r="85" fill="none" stroke="#7484FE" strokeWidth="1.5" opacity="0.85" />
              </g>
              <g clipPath="url(#front-orbit-clip)">
                <ellipse cx="0" cy="0" rx="137" ry="48" fill="none" stroke="#7484FE" strokeWidth="2.5" transform="rotate(30)" opacity="0.8" />
              </g>
            </g>
          )}

          {/* Editorial Pill Tag Under Planet */}
          {badge && (
            <g transform="translate(0, 115)">
              <rect
                x={pillX}
                y="-12"
                width={pillWidth}
                height="24"
                rx="12"
                fill="#2A2A2A"
                stroke={pillStroke}
                strokeWidth="1.2"
                opacity="0.95"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill={pillStroke}
                fontFamily="monospace"
                fontSize="10"
                fontWeight="bold"
                letterSpacing="1.5"
              >
                {badge}
              </text>
            </g>
          )}
        </g>
      </Link>
    </g>
  );
};

export const PlanetGradients: React.FC = () => {
  return (
    <defs>
      {/* Clip path for the front half of the 3D orbit rings */}
      <clipPath id="front-orbit-clip">
        <rect x="-200" y="0" width="400" height="200" />
      </clipPath>

      {/* 01. Spotlight */}
      <radialGradient id="p01-grad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#7484FE" />
        <stop offset="75%" stopColor="#2A3066" />
        <stop offset="100%" stopColor="#15172C" />
      </radialGradient>

      {/* 02. Cross Roads */}
      <radialGradient id="p02-grad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F7F2F6" />
        <stop offset="40%" stopColor="#7484FE" />
        <stop offset="80%" stopColor="#2A2A2A" />
        <stop offset="100%" stopColor="#181818" />
      </radialGradient>

      {/* 03. Startup Expo */}
      <radialGradient id="p03-grad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#33FF67" />
        <stop offset="45%" stopColor="#7484FE" />
        <stop offset="80%" stopColor="#1C2E2A" />
        <stop offset="100%" stopColor="#121D1A" />
      </radialGradient>

      {/* 04. Brand Battles */}
      <radialGradient id="p04-grad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#33FF67" />
        <stop offset="60%" stopColor="#1E5E32" />
        <stop offset="100%" stopColor="#14291D" />
      </radialGradient>

      {/* 05. IPL Auction */}
      <radialGradient id="p05-grad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="35%" stopColor="#38BDF8" />
        <stop offset="75%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0C4A6E" />
      </radialGradient>

      {/* 06. Hustle Mania */}
      <radialGradient id="p06-grad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#33FF67" />
        <stop offset="40%" stopColor="#7484FE" />
        <stop offset="80%" stopColor="#1F2844" />
        <stop offset="100%" stopColor="#101524" />
      </radialGradient>

      {/* 07. Internship Drive */}
      <radialGradient id="p07-grad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#C7D2FE" />
        <stop offset="40%" stopColor="#7484FE" />
        <stop offset="80%" stopColor="#312E81" />
        <stop offset="100%" stopColor="#1E1B4B" />
      </radialGradient>

      {/* 08. Startup Poly */}
      <radialGradient id="p08-grad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#EDE9FE" />
        <stop offset="40%" stopColor="#A78BFA" />
        <stop offset="80%" stopColor="#6D28D9" />
        <stop offset="100%" stopColor="#2E1065" />
      </radialGradient>

      {/* 09. E-Cell Meet */}
      <radialGradient id="p09-grad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#E9D5FF" />
        <stop offset="40%" stopColor="#A78BFA" />
        <stop offset="80%" stopColor="#4C1D95" />
        <stop offset="100%" stopColor="#1E1B4B" />
      </radialGradient>

      {/* 10. Pitch Deck */}
      <radialGradient id="p10-grad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#33FF67" />
        <stop offset="65%" stopColor="#38BDF8" />
        <stop offset="85%" stopColor="#1B4D28" />
        <stop offset="100%" stopColor="#0B2111" />
      </radialGradient>
    </defs>
  );
};
