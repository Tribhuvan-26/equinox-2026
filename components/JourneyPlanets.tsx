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
  { index: 0, x: 1600, y: 320, cardTop: 480, badge: "01 · SPOTLIGHT" },
  { index: 1, x: 3000, y: 760, cardTop: 160, badge: "02 · CROSS ROADS" },
  { index: 2, x: 4400, y: 300, cardTop: 480, badge: "03 · STARTUP EXPO" },
  { index: 3, x: 5800, y: 740, cardTop: 160, badge: "04 · BRAND BATTLES" },
  { index: 4, x: 7200, y: 320, cardTop: 480, badge: "05 · IPL AUCTION" },
  { index: 5, x: 8600, y: 760, cardTop: 160, badge: "06 · HUSTLE MANIA" },
  { index: 6, x: 10000, y: 300, cardTop: 480, badge: "07 · INTERNSHIP DRIVE" },
  { index: 7, x: 11400, y: 740, cardTop: 160, badge: "08 · STARTUP POLY" },
  { index: 8, x: 12800, y: 320, cardTop: 480, badge: "09 · E-CELL MEET" },
  { index: 9, x: 14200, y: 720, cardTop: 160, badge: "10 · PITCH DECK" },
];

// Single continuous squiggly path connecting Earth launch to all 10 planets with tightened spacing (~1400px apart)
export const JOURNEY_SQUIGGLY_PATH =
  "M 350,780 " +
  "C 700,780 1100,320 1600,320 " +
  "C 2100,320 2500,760 3000,760 " +
  "C 3500,760 3900,300 4400,300 " +
  "C 4900,300 5300,740 5800,740 " +
  "C 6300,740 6700,320 7200,320 " +
  "C 7700,320 8100,760 8600,760 " +
  "C 9100,760 9500,300 10000,300 " +
  "C 10500,300 10900,740 11400,740 " +
  "C 11900,740 12300,320 12800,320 " +
  "C 13300,320 13700,720 14200,720 " +
  "C 14750,720 15300,540 15800,540";

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
  return (
    <g
      transform={`translate(${x}, ${y})`}
      id={`planet-node-${index}`}
    >
      <Link href={`/events/${event.slug}`} className="group pointer-events-auto cursor-pointer">
        <g
          transform="scale(1.45)"
          className="transition-transform duration-300 ease-out group-hover:scale-105"
          style={{ transformOrigin: "0px 0px" }}
        >
        {/* ========================================================
            01. SPOTLIGHT — Visionary Keynotes & Beams
            ======================================================== */}
        {index === 0 && (
          <g>
            <circle cx="0" cy="0" r="140" fill="none" stroke="#7484FE" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
            <circle cx="0" cy="0" r="115" fill="none" stroke="#F7F2F6" strokeWidth="0.8" opacity="0.3" />
            <ellipse cx="0" cy="0" rx="130" ry="40" fill="none" stroke="#7484FE" strokeWidth="1.5" transform="rotate(-25)" opacity="0.7" />
            
            <defs>
              <clipPath id={`planet-clip-${index}`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="drop-shadow(0 0 35px rgba(116,132,254,0.45))">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={`/planets/${event.slug}.svg`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={`url(#planet-clip-${index})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#7484FE" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ========================================================
            02. CROSS ROADS — Strategic Case Matrix
            ======================================================== */}
        {index === 1 && (
          <g>
            <circle cx="0" cy="0" r="135" fill="none" stroke="#7484FE" strokeWidth="1" strokeDasharray="6 6" opacity="0.35" />
            <ellipse cx="0" cy="0" rx="130" ry="38" fill="none" stroke="#F7F2F6" strokeWidth="1.2" transform="rotate(35)" opacity="0.6" />
            <ellipse cx="0" cy="0" rx="130" ry="38" fill="none" stroke="#7484FE" strokeWidth="1.2" transform="rotate(-35)" opacity="0.6" />
            <defs>
              <clipPath id={`planet-clip-${index}`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="drop-shadow(0 0 30px rgba(116,132,254,0.3))">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={`/planets/${event.slug}.svg`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={`url(#planet-clip-${index})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#7484FE" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ========================================================
            03. STARTUP EXPO — Modular Innovation Satellite System
            ======================================================== */}
        {index === 2 && (
          <g>
            <circle cx="0" cy="0" r="145" fill="none" stroke="#33FF67" strokeWidth="1" strokeDasharray="2 8" opacity="0.4" />
            <circle cx="0" cy="0" r="120" fill="none" stroke="#7484FE" strokeWidth="1.2" opacity="0.5" />
            <ellipse cx="0" cy="0" rx="140" ry="42" fill="none" stroke="#33FF67" strokeWidth="1.5" transform="rotate(-15)" opacity="0.7" />
            <defs>
              <clipPath id={`planet-clip-${index}`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="drop-shadow(0 0 35px rgba(51,255,103,0.35))">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={`/planets/${event.slug}.svg`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={`url(#planet-clip-${index})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#33FF67" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ========================================================
            04. BRAND BATTLES — Master Template Green Gas Giant
            ======================================================== */}
        {index === 3 && (
          <g>
            <circle cx="0" cy="0" r="140" fill="none" stroke="#33FF67" strokeWidth="1" strokeDasharray="3 6" opacity="0.35" />
            <ellipse cx="0" cy="0" rx="135" ry="40" fill="none" stroke="#33FF67" strokeWidth="2.5" opacity="0.65" transform="rotate(-18)" />
            <defs>
              <clipPath id={`planet-clip-${index}`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="drop-shadow(0 0 45px rgba(51,255,103,0.45))">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={`/planets/${event.slug}.svg`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={`url(#planet-clip-${index})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#33FF67" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ========================================================
            05. IPL AUCTION — Golden Arena Stadium & Ring
            ======================================================== */}
        {index === 4 && (
          <g>
            <circle cx="0" cy="0" r="145" fill="none" stroke="#FFB800" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            <ellipse cx="0" cy="0" rx="140" ry="44" fill="none" stroke="#FFB800" strokeWidth="2" transform="rotate(22)" opacity="0.75" />
            <defs>
              <clipPath id={`planet-clip-${index}`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="drop-shadow(0 0 40px rgba(255,184,0,0.4))">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={`/planets/${event.slug}.svg`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={`url(#planet-clip-${index})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#FFB800" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ========================================================
            06. HUSTLE MANIA — Dynamic Duotone Speed Stripes
            ======================================================== */}
        {index === 5 && (
          <g>
            <circle cx="0" cy="0" r="140" fill="none" stroke="#33FF67" strokeWidth="1" strokeDasharray="5 5" opacity="0.4" />
            <ellipse cx="0" cy="0" rx="130" ry="36" fill="none" stroke="#7484FE" strokeWidth="2" transform="rotate(-30)" opacity="0.7" />
            <defs>
              <clipPath id={`planet-clip-${index}`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="drop-shadow(0 0 35px rgba(51,255,103,0.35))">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={`/planets/${event.slug}.svg`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={`url(#planet-clip-${index})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#33FF67" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ========================================================
            07. INTERNSHIP DRIVE — Blueprint Architecture
            ======================================================== */}
        {index === 6 && (
          <g>
            <circle cx="0" cy="0" r="140" fill="none" stroke="#7484FE" strokeWidth="1" strokeDasharray="4 8" opacity="0.4" />
            <ellipse cx="0" cy="0" rx="135" ry="35" fill="none" stroke="#F7F2F6" strokeWidth="1.5" transform="rotate(10)" opacity="0.6" />
            <defs>
              <clipPath id={`planet-clip-${index}`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="drop-shadow(0 0 30px rgba(116,132,254,0.35))">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={`/planets/${event.slug}.svg`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={`url(#planet-clip-${index})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#7484FE" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ========================================================
            08. STARTUP POLY — Monopoly Faceted Matrix
            ======================================================== */}
        {index === 7 && (
          <g>
            <circle cx="0" cy="0" r="140" fill="none" stroke="#FF7043" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            <rect x="-95" y="-95" width="190" height="190" fill="none" stroke="#7484FE" strokeWidth="1" strokeDasharray="4 8" transform="rotate(45)" opacity="0.3" />
            <ellipse cx="0" cy="0" rx="135" ry="42" fill="none" stroke="#FF7043" strokeWidth="2" transform="rotate(-20)" opacity="0.7" />
            <defs>
              <clipPath id={`planet-clip-${index}`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="drop-shadow(0 0 35px rgba(255,112,67,0.35))">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={`/planets/${event.slug}.svg`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={`url(#planet-clip-${index})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#FF7043" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ========================================================
            09. E-CELL MEET — Network Mesh Federation
            ======================================================== */}
        {index === 8 && (
          <g>
            <circle cx="0" cy="0" r="145" fill="none" stroke="#A78BFA" strokeWidth="1" strokeDasharray="3 6" opacity="0.4" />
            <ellipse cx="0" cy="0" rx="135" ry="40" fill="none" stroke="#A78BFA" strokeWidth="1.8" transform="rotate(28)" opacity="0.75" />
            <defs>
              <clipPath id={`planet-clip-${index}`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="drop-shadow(0 0 35px rgba(167,139,250,0.35))">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={`/planets/${event.slug}.svg`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={`url(#planet-clip-${index})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#A78BFA" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ========================================================
            10. PITCH DECK — Crown Summit Grand Finale
            ======================================================== */}
        {index === 9 && (
          <g>
            <circle cx="0" cy="0" r="155" fill="none" stroke="#33FF67" strokeWidth="1" strokeDasharray="3 8" opacity="0.4" />
            <circle cx="0" cy="0" r="135" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5" />
            <ellipse cx="0" cy="0" rx="145" ry="46" fill="none" stroke="#33FF67" strokeWidth="2.5" transform="rotate(-15)" opacity="0.8" />
            <ellipse cx="0" cy="0" rx="145" ry="46" fill="none" stroke="#FFD700" strokeWidth="1" transform="rotate(-15)" opacity="0.5" />
            <defs>
              <clipPath id={`planet-clip-${index}`}>
                <circle cx="0" cy="0" r="85" />
              </clipPath>
            </defs>
            <g filter="drop-shadow(0 0 50px rgba(51,255,103,0.5))">
              <circle cx="0" cy="0" r="85" fill="#0A0A0A" />
              <image 
                href={`/planets/${event.slug}.svg`}
                x="-125"
                y="-125"
                width="250"
                height="250"
                clipPath={`url(#planet-clip-${index})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="0" cy="0" r="85" fill="none" stroke="#33FF67" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>
        )}

        {/* Editorial Pill Tag Under Planet */}
        <g transform="translate(0, 115)">
          <rect
            x="-75"
            y="-12"
            width="150"
            height="24"
            rx="12"
            fill="#2A2A2A"
            stroke={index % 2 === 0 ? "#7484FE" : "#33FF67"}
            strokeWidth="1.2"
            opacity="0.95"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill={index % 2 === 0 ? "#7484FE" : "#33FF67"}
            fontFamily="monospace"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="1.5"
          >
            {badge}
          </text>
        </g>
        </g>
      </Link>
    </g>
  );
};

export const PlanetGradients: React.FC = () => {
  return (
    <defs>
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
        <stop offset="0%" stopColor="#FFF2B2" />
        <stop offset="35%" stopColor="#FFB800" />
        <stop offset="75%" stopColor="#8A5800" />
        <stop offset="100%" stopColor="#241800" />
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
        <stop offset="0%" stopColor="#FFB199" />
        <stop offset="40%" stopColor="#FF7043" />
        <stop offset="80%" stopColor="#7F2314" />
        <stop offset="100%" stopColor="#260C07" />
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
        <stop offset="65%" stopColor="#FFD700" />
        <stop offset="85%" stopColor="#1B4D28" />
        <stop offset="100%" stopColor="#0B2111" />
      </radialGradient>
    </defs>
  );
};
