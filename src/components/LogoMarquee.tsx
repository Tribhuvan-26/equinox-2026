"use client";

import Link from "next/link";

/**
 * Continuous row of the ten sub-event logos. The track holds two identical
 * halves and shifts by exactly 50%, so the loop has no visible seam.
 * Each logo is interactive and navigates to its corresponding event page.
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
        {row.map((slug, i) => {
          const eventName = names[i % slugs.length] || slug;
          return (
            <Link
              key={`${slug}-${i}`}
              href={`/events/${slug}`}
              aria-label={`View ${eventName} details`}
              title={`View ${eventName}`}
              className="group relative flex shrink-0 items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#33FF67] rounded-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed-ratio logo strip */}
              <img
                src={`/logos/${slug}.png`}
                alt={eventName}
                className="h-12 w-auto shrink-0 opacity-55 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0 sm:h-16"
                draggable={false}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
