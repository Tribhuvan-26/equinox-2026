"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import MotionPathPlugin from "gsap/dist/MotionPathPlugin";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
}

const TRAIL_LENGTH = 35;
const DURATION = 6;
const HEAD_COLOR = "#67E8F9"; // Cyan
const TAIL_COLOR = "#A78BFA"; // Purple

export default function Comet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = elementsRef.current.filter(Boolean) as HTMLDivElement[];
    if (elements.length === 0) return;

    let ctx = gsap.context(() => {
      const animateComet = () => {
        // Natural diagonal sweep from top to bottom
        const startLeft = Math.random() > 0.5;
        const startX = startLeft ? gsap.utils.random(-300, -100) : window.innerWidth + gsap.utils.random(100, 300);
        const startY = gsap.utils.random(-200, -50);
        
        const endX = startLeft ? window.innerWidth + gsap.utils.random(100, 400) : gsap.utils.random(-400, -100);
        const endY = window.innerHeight + gsap.utils.random(100, 400);
        
        // Add a slight natural curve
        const midX1 = startX + (endX - startX) * 0.3 + gsap.utils.random(-100, 100);
        const midY1 = startY + (endY - startY) * 0.3 + gsap.utils.random(-50, 50);
        
        const midX2 = startX + (endX - startX) * 0.7 + gsap.utils.random(-100, 100);
        const midY2 = startY + (endY - startY) * 0.7 + gsap.utils.random(-50, 50);

        // Hide all elements before starting
        gsap.set(elements, { opacity: 0 });

        const tl = gsap.timeline();

        // Fade in head and trail as they move
        elements.forEach((el, i) => {
          const delay = i * 0.015;
          const isHead = i === 0;
          const targetOpacity = isHead ? 1 : Math.max(0.1, 1 - i / TRAIL_LENGTH);
          
          // Animate opacity independently
          tl.to(el, {
            opacity: targetOpacity,
            duration: 0.5,
            ease: "power2.out"
          }, delay);

          // Animate out
          tl.to(el, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
          }, delay + DURATION - 0.5);
        });

        // Motion path animation
        tl.to(elements, {
          motionPath: {
            path: [
              { x: startX, y: startY },
              { x: midX1, y: midY1 },
              { x: midX2, y: midY2 },
              { x: endX, y: endY }
            ],
            type: "cubic",
          },
          duration: DURATION,
          ease: "power1.inOut",
          stagger: 0.015,
        }, 0);
      };

      // Spawn once the user actually enters the journey section
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center", // Triggers when the journey container reaches the center of the viewport
        once: true,
        onEnter: () => {
          gsap.delayedCall(gsap.utils.random(2, 6), animateComet);
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => {
        const isHead = i === 0;
        const size = isHead ? 8 : Math.max(1, 8 * (1 - i / TRAIL_LENGTH));
        const opacity = isHead ? 1 : 1 - i / TRAIL_LENGTH;
        const color = isHead ? HEAD_COLOR : TAIL_COLOR;
        
        return (
          <div
            key={i}
            ref={(el) => { elementsRef.current[i] = el; }}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              opacity: 0, // Initial GSAP handles actual opacity
              boxShadow: isHead 
                ? `0 0 12px ${color}, 0 0 24px ${color}`
                : `0 0 ${4 * opacity}px ${color}`,
              mixBlendMode: "screen",
              willChange: "transform, opacity",
              top: 0,
              left: 0,
              marginLeft: -size / 2, // Center origin
              marginTop: -size / 2
            }}
          />
        );
      })}
    </div>
  );
}
