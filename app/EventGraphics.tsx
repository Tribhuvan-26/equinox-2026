"use client";

import React from "react";

// 1. Institutional Lockup (Top of Brochure Cover)
export function InstitutionalHeader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 py-4 text-white ${className}`}>
      {/* Left: MLR CIE */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-white/10 p-1 backdrop-blur-xs">
          <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8 text-white">
            <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
            <text x="8" y="19" fill="currentColor" fontSize="10" fontWeight="900" fontFamily="sans-serif">MLR</text>
            <text x="8" y="30" fill="currentColor" fontSize="8" fontWeight="800" fontFamily="sans-serif">CIE</text>
          </svg>
        </div>
        <div className="border-l border-white/30 pl-3 leading-tight">
          <p className="text-xs font-bold tracking-wider uppercase">Centre for</p>
          <p className="text-xs font-bold tracking-wider uppercase">Innovation &amp; Entrepreneurship</p>
          <p className="text-[9px] text-white/70 italic">Making Ideas Happen</p>
        </div>
      </div>

      {/* Right: MLRIT */}
      <div className="flex items-center gap-2 text-right">
        <div>
          <p className="text-sm font-black tracking-widest uppercase">MLRIT</p>
          <p className="text-[10px] text-white/80 font-medium italic">Engineering Ideas, Engineering Careers</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/15">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// 2. Hanging "2.0" Tag from the Cover
export function HangingTag({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-block animate-tag-sway ${className}`}>
      {/* Twin Suspension Strings */}
      <div className="flex justify-around px-3">
        <div className="h-6 w-[2px] bg-white/80" />
        <div className="h-6 w-[2px] bg-white/80" />
      </div>
      {/* White Card with Heavy Black Border */}
      <div className="relative rounded-md border-[3px] border-[#0d0e15] bg-white px-3 py-1 text-center shadow-[4px_4px_0px_#0d0e15]">
        <div className="absolute top-1 left-2 h-1.5 w-1.5 rounded-full bg-[#0d0e15]" />
        <div className="absolute top-1 right-2 h-1.5 w-1.5 rounded-full bg-[#0d0e15]" />
        <span className="font-mono text-2xl font-black tracking-tighter text-[#0d0e15] sm:text-3xl">
          2.0
        </span>
      </div>
    </div>
  );
}

// 3. Vector Pop-Up Book Editorial Art Centerpiece (Cover Page)
export function ProspectusPopUpArt({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 600 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[540px] drop-shadow-2xl"
      >
        {/* Background Graphic Shadow */}
        <ellipse cx="300" cy="450" rx="240" ry="20" fill="#081b66" opacity="0.6" />

        {/* Back Book Pages Layer */}
        <polygon points="120,240 180,180 300,200 300,420 120,380" fill="#ffffff" stroke="#0d0e15" strokeWidth="4" />
        <polygon points="480,240 420,180 300,200 300,420 480,380" fill="#f8fafc" stroke="#0d0e15" strokeWidth="4" />

        {/* Diagonal folder tab / index markers */}
        <path d="M70,220 L130,220 L130,260 L70,260 Z" fill="#ffffff" stroke="#0d0e15" strokeWidth="3" />
        <path d="M60,240 L120,240 L120,340 L60,340 Z" fill="#ffffff" stroke="#0d0e15" strokeWidth="3" />

        {/* Left Side: Editorial Block & Striped Texture */}
        <rect x="140" y="270" width="40" height="90" fill="#174ae8" stroke="#0d0e15" strokeWidth="3" />
        <path d="M80,310 C80,290 130,290 130,340" fill="none" stroke="#0d0e15" strokeWidth="3" strokeDasharray="3 3" />
        {/* Vertical stripes pattern box */}
        <g stroke="#0d0e15" strokeWidth="2.5">
          <line x1="90" y1="330" x2="90" y2="350" />
          <line x1="96" y1="326" x2="96" y2="354" />
          <line x1="102" y1="324" x2="102" y2="356" />
          <line x1="108" y1="324" x2="108" y2="354" />
          <line x1="114" y1="328" x2="114" y2="350" />
        </g>

        {/* Center Spine Pop-up Book Open Spread */}
        {/* Left page */}
        <polygon points="190,190 290,195 290,400 170,390" fill="#ffffff" stroke="#0d0e15" strokeWidth="4" strokeLinejoin="round" />
        {/* Right page */}
        <polygon points="410,190 310,195 310,400 430,390" fill="#ffffff" stroke="#0d0e15" strokeWidth="4" strokeLinejoin="round" />

        {/* Center Spine Vertical Banner: E-SUMMIT */}
        <rect x="235" y="180" width="65" height="215" fill="#ffffff" stroke="#0d0e15" strokeWidth="4" />
        <text
          x="-375"
          y="280"
          transform="rotate(-90)"
          fill="#0d0e15"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="36"
          letterSpacing="4"
        >
          E-SUMMIT
        </text>

        {/* Pop-up character on right page with blue arm & cap */}
        <g transform="translate(300, 220)">
          {/* Character Head & Cap */}
          <ellipse cx="60" cy="50" rx="18" ry="14" fill="#ffffff" stroke="#0d0e15" strokeWidth="3" />
          {/* Beanie / Cap */}
          <path d="M42,46 C42,34 78,34 78,46 Z" fill="#174ae8" stroke="#0d0e15" strokeWidth="3" />
          <ellipse cx="60" cy="34" rx="5" ry="4" fill="#174ae8" stroke="#0d0e15" strokeWidth="2" />
          {/* Eyes & Nose */}
          <circle cx="53" cy="50" r="2" fill="#0d0e15" />
          <path d="M48,53 Q44,55 48,57" fill="none" stroke="#0d0e15" strokeWidth="2" strokeLinecap="round" />
          {/* Clasped Hands in contemplation */}
          <path d="M36,65 C34,55 40,50 42,55 C44,50 48,52 46,58" fill="#ffffff" stroke="#0d0e15" strokeWidth="2.5" />
          {/* Blue Body / Sleeve */}
          <path
            d="M28,68 C28,110 50,130 90,120 C100,105 100,85 85,80 C60,82 50,75 50,68 Z"
            fill="#174ae8"
            stroke="#0d0e15"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </g>

        {/* Right side capsule with halftone dots */}
        <g transform="translate(420, 250)">
          <path d="M0,0 C25,0 40,20 40,50 C40,80 25,100 0,100 Z" fill="#174ae8" stroke="#0d0e15" strokeWidth="3" />
          <path d="M0,50 C20,50 30,70 30,95 L0,95 Z" fill="#ffffff" stroke="#0d0e15" strokeWidth="3" />
          {/* Dot pattern */}
          <circle cx="8" cy="65" r="2.5" fill="#0d0e15" />
          <circle cx="16" cy="65" r="2.5" fill="#0d0e15" />
          <circle cx="24" cy="65" r="2.5" fill="#0d0e15" />
          <circle cx="12" cy="75" r="2.5" fill="#0d0e15" />
          <circle cx="20" cy="75" r="2.5" fill="#0d0e15" />
          <circle cx="8" cy="85" r="2.5" fill="#0d0e15" />
          <circle cx="16" cy="85" r="2.5" fill="#0d0e15" />
        </g>

        {/* Blue Half-Moon graphic behind right page */}
        <path d="M460,230 C490,240 500,280 480,305 Z" fill="#174ae8" stroke="#0d0e15" strokeWidth="3" />

        {/* Flying Currency Notes (Cash bills) */}
        {/* Note 1 (Left floating) */}
        <g transform="translate(150, 360) rotate(-25)">
          <rect x="0" y="0" width="35" height="20" rx="2" fill="#ffffff" stroke="#0d0e15" strokeWidth="2.5" />
          <circle cx="17.5" cy="10" r="4" stroke="#0d0e15" strokeWidth="2" />
          <line x1="4" y1="5" x2="4" y2="15" stroke="#0d0e15" strokeWidth="2" />
          <line x1="31" y1="5" x2="31" y2="15" stroke="#0d0e15" strokeWidth="2" />
        </g>

        {/* Note 2 (Left falling) */}
        <g transform="translate(195, 395) rotate(15)">
          <rect x="0" y="0" width="35" height="20" rx="2" fill="#ffffff" stroke="#0d0e15" strokeWidth="2.5" />
          <circle cx="17.5" cy="10" r="4" stroke="#0d0e15" strokeWidth="2" />
          <line x1="4" y1="5" x2="4" y2="15" stroke="#0d0e15" strokeWidth="2" />
          <line x1="31" y1="5" x2="31" y2="15" stroke="#0d0e15" strokeWidth="2" />
        </g>

        {/* Cash fan at bottom right */}
        <g transform="translate(370, 345) rotate(12)">
          <rect x="0" y="0" width="45" height="26" rx="2" fill="#ffffff" stroke="#0d0e15" strokeWidth="3" />
          <circle cx="22.5" cy="13" r="5" stroke="#0d0e15" strokeWidth="2" />
          <line x1="6" y1="6" x2="6" y2="20" stroke="#0d0e15" strokeWidth="2" />
          <line x1="39" y1="6" x2="39" y2="20" stroke="#0d0e15" strokeWidth="2" />
        </g>
        <g transform="translate(390, 360) rotate(28)">
          <rect x="0" y="0" width="45" height="26" rx="2" fill="#ffffff" stroke="#0d0e15" strokeWidth="3" />
          <circle cx="22.5" cy="13" r="5" stroke="#0d0e15" strokeWidth="2" />
          <line x1="6" y1="6" x2="6" y2="20" stroke="#0d0e15" strokeWidth="2" />
          <line x1="39" y1="6" x2="39" y2="20" stroke="#0d0e15" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

// 4. Wireframe 3D Torus Graphic (Page 02 Contents)
export function WireframeTorus({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[280px] opacity-85"
      >
        {/* Torus Elliptical Rings */}
        <ellipse cx="160" cy="110" rx="140" ry="75" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />
        <ellipse cx="160" cy="110" rx="125" ry="65" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.7" />
        <ellipse cx="160" cy="110" rx="110" ry="55" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.6" />
        <ellipse cx="160" cy="110" rx="90" ry="42" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.5" />
        <ellipse cx="160" cy="110" rx="70" ry="30" stroke="#ffffff" strokeWidth="1.4" strokeOpacity="0.75" />
        <ellipse cx="160" cy="110" rx="50" ry="20" stroke="#ffffff" strokeWidth="1.6" strokeOpacity="0.9" />

        {/* Torus Meridians / Vertical Curve Crossings */}
        {[-70, -50, -30, -10, 10, 30, 50, 70].map((offset, i) => (
          <path
            key={i}
            d={`M${160 + offset * 1.8},${110 - 75 + Math.abs(offset) * 0.4} C${160 + offset * 1.5},80 ${160 + offset * 0.7},95 ${160 + offset * 0.6},110 C${160 + offset * 0.7},125 ${160 + offset * 1.5},140 ${160 + offset * 1.8},${110 + 75 - Math.abs(offset) * 0.4}`}
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeOpacity="0.65"
          />
        ))}

        {/* Dynamic perspective curves */}
        <path d="M20,110 C40,160 280,160 300,110" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.85" />
        <path d="M50,110 C70,145 250,145 270,110" stroke="#ffffff" strokeWidth="1.4" strokeOpacity="0.75" />
        <path d="M80,110 C100,130 220,130 240,110" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.6" />
      </svg>
    </div>
  );
}

// 5. Timeline Footer Marker (Pages 05, 06, 12)
export function PageFooterTimeline({
  pageNumber,
  className = "",
}: {
  pageNumber: string;
  className?: string;
}) {
  return (
    <div className={`mt-12 flex w-full items-center justify-between border-t border-white/40 pt-4 text-white ${className}`}>
      {/* Brand Badge */}
      <div className="flex items-center gap-2">
        <div className="leading-none">
          <span className="block text-[10px] font-black tracking-widest uppercase">THE</span>
          <span className="block text-base font-black tracking-tighter uppercase sm:text-lg">EQUINOX</span>
        </div>
        <div className="rounded border border-white bg-white px-1 py-0.5 text-[9px] font-black text-[#0d0e15]">
          2.0
        </div>
      </div>

      {/* Page Number */}
      <div className="font-mono text-xl font-bold tracking-widest text-white sm:text-2xl">
        {pageNumber}
      </div>
    </div>
  );
}

// 6. Custom Typographic Badges for the 10 Sub-Events (Pages 05 & 06)

// Page 05: SPOTLIGHT
export function BadgeSpotlight() {
  return (
    <div className="flex items-center gap-2 font-black italic tracking-wider">
      <svg viewBox="0 0 28 20" fill="none" className="h-5 w-6 text-white">
        <polygon points="2,14 10,4 12,7 4,17" fill="currentColor" />
        <polygon points="11,6 26,1 26,19 11,8" fill="currentColor" opacity="0.4" />
      </svg>
      <span className="text-xl uppercase sm:text-2xl font-black italic tracking-wide">
        SPOTLIGHT
      </span>
    </div>
  );
}

// Page 05: CROSS ROADS
export function BadgeCrossroads() {
  return (
    <div className="flex flex-col leading-none font-black uppercase tracking-wider">
      <span className="text-lg sm:text-xl font-extrabold tracking-widest">CROSS</span>
      <span className="text-lg sm:text-xl font-extrabold tracking-widest text-white/90">ROADS</span>
    </div>
  );
}

// Page 05: STARTUP EXPO
export function BadgeStartupExpo() {
  return (
    <div className="flex flex-col leading-none">
      <div className="flex items-center gap-1 font-bold text-sm tracking-wider">
        <span>ST</span>
        {/* Tiny Rocket Icon */}
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
          <path d="M8 1c2 2 3 6 3 9l-3-2-3 2c0-3 1-7 3-9zM6 11l2-1 2 1-1 3H7l-1-3z" />
        </svg>
        <span>RTUP</span>
      </div>
      <span className="text-2xl font-black tracking-widest text-white">EXPO</span>
    </div>
  );
}

// Page 05: BRAND BATTLES
export function BadgeBrandBattles() {
  return (
    <div className="relative flex flex-col items-center leading-none">
      <span className="text-[11px] font-bold tracking-widest text-white/80">BRAND</span>
      <div className="relative mt-0.5">
        <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-transparent [-webkit-text-stroke:1.2px_#ffffff]">
          BATTLES
        </span>
        <div className="absolute top-1/2 left-[-4px] right-[-4px] h-[2px] bg-white -translate-y-1/2" />
      </div>
    </div>
  );
}

// Page 05: IPL AUCTION
export function BadgeIPLAuction() {
  return (
    <div className="flex items-center gap-2">
      {/* Batsman silhouette */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white shrink-0">
        <circle cx="15" cy="5" r="2.5" />
        <path d="M12 8l4 4-2 7h-2l1-5-3-3v4h-2V9l4-1z" />
        <path d="M16 12l5 2-1 2-5-2z" />
      </svg>
      <div className="leading-none">
        <span className="block text-xs font-black tracking-wider">IPL</span>
        <span className="text-xl sm:text-2xl font-black uppercase tracking-tight">
          Aucti<span className="inline-block relative">o<span className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-white/70 rotate-45" /></span>n
        </span>
      </div>
    </div>
  );
}

// Page 06: HUSTLE MANIA
export function BadgeHustleMania() {
  return (
    <div className="flex flex-col leading-none font-black italic tracking-wider">
      <span className="text-lg sm:text-xl transform -rotate-1 font-serif font-black uppercase">
        HUSTLE
      </span>
      <span className="text-xl sm:text-2xl transform rotate-1 font-serif font-black uppercase tracking-wide">
        MANIA
      </span>
    </div>
  );
}

// Page 06: INTERNSHIP DRIVE
export function BadgeInternshipDrive() {
  return (
    <div className="flex flex-col leading-none font-black italic">
      <span className="text-lg sm:text-xl font-bold tracking-tight">Internship</span>
      <span className="text-xl sm:text-2xl font-black tracking-tighter">drive</span>
    </div>
  );
}

// Page 06: STARTUP POLY
export function BadgeStartupPoly() {
  return (
    <div className="flex flex-col leading-none font-black">
      <span className="text-xs font-black tracking-widest text-white/90">STARTUP</span>
      <div className="flex items-center gap-1">
        <span className="text-xl sm:text-2xl font-black tracking-tight">P</span>
        {/* 3D Isometric Dice for 'O' */}
        <div className="inline-block h-5 w-5 rounded-xs border border-white bg-white/20 p-0.5 shadow-xs">
          <div className="grid grid-cols-2 gap-0.5 h-full w-full place-items-center">
            <div className="h-1 w-1 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-white" />
            <div className="h-1 w-1 rounded-full bg-white" />
          </div>
        </div>
        <span className="text-xl sm:text-2xl font-black tracking-tight">LY</span>
      </div>
    </div>
  );
}

// Page 06: E-CELL MEET
export function BadgeECellMeet() {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="font-mono text-lg sm:text-xl font-black tracking-widest border-b border-dotted border-white pb-0.5">
        E-CELL
      </span>
      <span className="mt-1 font-mono text-[10px] tracking-[0.3em] font-semibold text-white/80">
        MEET
      </span>
    </div>
  );
}

// Page 06: PITCH DECK
export function BadgePitchDeck() {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="font-serif text-2xl sm:text-3xl font-black tracking-wider">
        PITCH
      </span>
      <span className="text-[11px] font-black tracking-[0.25em] text-white/90 uppercase">
        DECK
      </span>
    </div>
  );
}

// Sub-Event Badge Resolver
export function SubEventBadge({ slug }: { slug: string }) {
  switch (slug) {
    case "spotlight":
      return <BadgeSpotlight />;
    case "crossroads":
      return <BadgeCrossroads />;
    case "startup-expo":
      return <BadgeStartupExpo />;
    case "brand-battles":
      return <BadgeBrandBattles />;
    case "ipl-auction":
      return <BadgeIPLAuction />;
    case "hustle-mania":
      return <BadgeHustleMania />;
    case "internship-drive":
      return <BadgeInternshipDrive />;
    case "startup-poly":
      return <BadgeStartupPoly />;
    case "e-cell-meet":
      return <BadgeECellMeet />;
    case "pitch-deck":
      return <BadgePitchDeck />;
    default:
      return <span className="font-black text-lg">{slug}</span>;
  }
}
