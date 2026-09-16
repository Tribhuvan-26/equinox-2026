"use client";

/**
 * Continuous row of the ten sub-event logos. The track holds two identical
 * halves and shifts by exactly 50%, so the loop has no visible seam.
 */
export default function LogoMarquee({ slugs, names }: { slugs: string[]; names: string[] }) {
  const row = [...slugs, ...slugs];

  return (
    <div
      className="relative overflow-hidden py-10"
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div className="marquee-track flex w-max items-center gap-16">
        {row.map((slug, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- fixed-ratio logo strip
          <img
            key={`${slug}-${i}`}
            src={`/logos/${slug}.png`}
            alt={i < slugs.length ? names[i] : ""}
            aria-hidden={i >= slugs.length}
            className="h-12 w-auto shrink-0 opacity-55 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0 sm:h-16"
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
