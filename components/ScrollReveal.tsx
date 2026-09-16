"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Entrance motion for the chapters below the journey, which were static.
 * Direct children animate in on their own, staggered, and stay put afterwards.
 */
export default function ScrollReveal({
  children,
  className = "",
  stagger = 0.08,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const targets = Array.from(el.children);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [stagger, y]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
