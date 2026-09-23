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
const starsForeground = generateStarfield(3, 40, 2.0, [0.6, 1], "200, 230, 255");

export default function NebulaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0A0A0C] pointer-events-none z-[-10]">
      
      {/* 1. Distant Background Stars */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[2px] h-[2px] rounded-full" style={{ boxShadow: starsBackground }} />
      </div>

      {/* 2. Soft, Elongated Diffuse Cosmic Clouds (Restored Original Intent) */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        {/* Deep Teal / Navy Base - Localized to the center diagonal */}
        <div 
          className="absolute"
          style={{ width: "800px", height: "400px", background: "radial-gradient(ellipse at center, #0F766E 0%, transparent 60%)", top: "70%", left: "30%", transform: "translate(-50%, -50%) rotate(-35deg)" }}
        />
        <div 
          className="absolute"
          style={{ width: "1000px", height: "500px", background: "radial-gradient(ellipse at center, #1E3A8A 0%, transparent 60%)", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-35deg)" }}
        />
        <div 
          className="absolute"
          style={{ width: "800px", height: "400px", background: "radial-gradient(ellipse at center, #115E59 0%, transparent 60%)", top: "30%", left: "70%", transform: "translate(-50%, -50%) rotate(-35deg)" }}
        />

        {/* Soft Cyan / Violet Hints - Boosted opacity to define the clouds */}
        <div 
          className="absolute"
          style={{ width: "600px", height: "300px", background: "radial-gradient(ellipse at center, #0891B2 0%, transparent 60%)", top: "60%", left: "40%", transform: "translate(-50%, -50%) rotate(-35deg)" }}
        />
        <div 
          className="absolute"
          style={{ width: "600px", height: "250px", background: "radial-gradient(ellipse at center, #4C1D95 0%, transparent 60%)", top: "40%", left: "60%", transform: "translate(-50%, -50%) rotate(-35deg)" }}
        />
        <div 
          className="absolute"
          style={{ width: "400px", height: "200px", background: "radial-gradient(ellipse at center, #0284C7 0%, transparent 60%)", top: "25%", left: "75%", transform: "translate(-50%, -50%) rotate(-35deg)" }}
        />
      </div>

      {/* 3. Midground Stars */}
      <div className="absolute inset-0 z-10" style={{ mixBlendMode: "screen" }}>
        <div className="absolute top-0 left-0 w-[3px] h-[3px] rounded-full" style={{ boxShadow: starsMidground }} />
      </div>

      {/* 4. Large Foreground Stars */}
      <div className="absolute inset-0 z-20 will-change-[opacity]" style={{ mixBlendMode: "screen", transform: "translateZ(0)" }}>
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
