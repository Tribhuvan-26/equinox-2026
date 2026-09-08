"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

export interface AccordionGalleryItem {
  content: ReactNode;
}

interface AccordionGalleryProps {
  items: AccordionGalleryItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  expandRatio?: number;
  duration?: number;
  ease?: string;
  tilt?: number;
  gap?: number;
  trigger?: "hover" | "click";
  className?: string;
  style?: React.CSSProperties;
}

// Adapted from React Bits' AccordionGallery: same GSAP flexGrow/tilt accordion
// mechanic, but panels render arbitrary content instead of photos (this site
// has no per-event photography), and the active panel is controlled from
// outside so scroll position can drive it.
export default function AccordionGallery({
  items,
  activeIndex,
  onSelect,
  expandRatio = 0.55,
  duration = 0.7,
  ease = "power3.out",
  tilt = 6,
  gap = 12,
  trigger = "hover",
  className = "",
  style,
}: AccordionGalleryProps) {
  const panelRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const count = items.length;

  useEffect(() => {
    const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
    const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
    const tl = gsap.timeline();

    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const isActive = i === activeIndex;
      const rot = isActive ? 0 : i < activeIndex ? tilt : -tilt;
      tl.to(panel, { flexGrow: isActive ? grow : 1, rotateY: rot, duration, ease }, 0);
    });

    return () => {
      tl.kill();
    };
  }, [activeIndex, count, expandRatio, duration, ease, tilt]);

  return (
    <div
      className={`flex ${className}`}
      style={{ gap, perspective: 1400, perspectiveOrigin: "50% 50%", ...style }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          onClick={() => onSelect(i)}
          onMouseEnter={() => trigger === "hover" && onSelect(i)}
          onFocus={() => onSelect(i)}
          aria-expanded={i === activeIndex}
          style={{ transformStyle: "preserve-3d" }}
          className="relative min-h-0 min-w-0 flex-1 basis-0 overflow-hidden rounded-3xl text-left outline-none"
        >
          {item.content}
        </button>
      ))}
    </div>
  );
}
