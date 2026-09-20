// Small seeded PRNG (mulberry32). Math.random() gave the server and the client
// different star positions, which is what caused the hydration mismatch.
function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate a dense, static starfield using CSS box-shadow
function generateStarfield(
  seed: number,
  count: number,
  maxSize: number,
  opacityRange: [number, number],
  color = "255, 255, 255"
) {
  const random = seededRandom(seed);
  let shadow = "";
  for (let i = 0; i < count; i++) {
    const x = Math.floor(random() * 100);
    const y = Math.floor(random() * 100);
    const opacity = (random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0]).toFixed(2);
    const size = (random() * maxSize).toFixed(2);
    shadow += `${x}vw ${y}vh 0 ${size}px rgba(${color}, ${opacity})${i < count - 1 ? "," : ""}`;
  }
  return shadow;
}

// Deterministic, so computed once at module load and identical on server + client.
const starsBackground = generateStarfield(1, 400, 0.5, [0.1, 0.4]);
const starsMidground = generateStarfield(2, 150, 1.2, [0.4, 0.8]);
const starsForeground = generateStarfield(3, 40, 2, [0.6, 1], "200, 230, 255");

export default function NebulaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0A0A0C] pointer-events-none z-[-10]">
      
      {/* 1. Distant Background Stars */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[2px] h-[2px] rounded-full" style={{ boxShadow: starsBackground }} />
      </div>

      {/* 2. Very Subtle, Localized Diagonal Nebula Band */}
      {/* Global opacity bumped up slightly so the structure is visible */}
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full z-0 opacity-55">
        <defs>
          <filter id="heavy-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="80" />
          </filter>
          <filter id="medium-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
          <filter id="dust-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.6 -0.05" />
          </filter>
        </defs>

        {/* Deep Teal / Navy Base - Localized to the center diagonal */}
        <g filter="url(#heavy-blur)" opacity="0.75">
          <ellipse cx="300" cy="700" rx="200" ry="80" fill="#0F766E" transform="rotate(-35 300 700)" />
          <ellipse cx="500" cy="500" rx="300" ry="100" fill="#1E3A8A" transform="rotate(-35 500 500)" />
          <ellipse cx="700" cy="300" rx="200" ry="80" fill="#115E59" transform="rotate(-35 700 300)" />
        </g>

        {/* Soft Cyan / Violet Hints - Boosted opacity to define the clouds */}
        <g filter="url(#medium-blur)" opacity="0.6">
          <ellipse cx="400" cy="600" rx="150" ry="50" fill="#0891B2" transform="rotate(-35 400 600)" />
          <ellipse cx="600" cy="400" rx="150" ry="40" fill="#4C1D95" transform="rotate(-35 600 400)" />
          <ellipse cx="750" cy="250" rx="100" ry="30" fill="#0284C7" transform="rotate(-35 750 250)" />
        </g>

        {/* Wispy dust texture overlay - increased intensity to make clouds read as dust */}
        <rect width="1000" height="1000" filter="url(#dust-texture)" opacity="0.3" style={{ mixBlendMode: "screen" }} />
      </svg>

      {/* 3. Midground Stars */}
      <div className="absolute inset-0 z-10" style={{ mixBlendMode: "screen" }}>
        <div className="absolute top-0 left-0 w-[3px] h-[3px] rounded-full" style={{ boxShadow: starsMidground }} />
      </div>

      {/* 4. Large Foreground Stars */}
      <div className="absolute inset-0 z-20" style={{ mixBlendMode: "screen" }}>
        <div className="absolute top-0 left-0 w-[4px] h-[4px] rounded-full animate-pulse" style={{ boxShadow: starsForeground }} />
      </div>

      {/* Atmospheric deep haze mask for the very bottom transition */}
      <div 
        className="absolute inset-0 z-30"
        style={{
          background: "linear-gradient(to bottom, rgba(10, 10, 12, 0) 0%, rgba(10, 10, 12, 0) 70%, rgba(10, 10, 12, 0.9) 100%)",
        }}
      />
    </div>
  );
}
