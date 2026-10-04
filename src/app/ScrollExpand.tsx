/* A framed panel that expands to full-bleed as the section scrolls past,
   built on CSS scroll-driven animations (view-timeline) so it needs no client
   JS, no scroll listeners and no rAF loop. Browsers without scroll timelines —
   and anyone on prefers-reduced-motion — get the expanded state, static.

   `smoothing` and `useWindowScroll` from the reference API are not props here:
   the native timeline is already frame-synced and follows the nearest scroller. */

import Image from "next/image";
import "./ScrollExpand.css";

export default function ScrollExpand({
  src,
  alt = "",
  title,
  scrollHint,
  children,
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 0.55,
  holdDistance = 0.1,
  overlayScrim = 0.45,
  enabled = true,
  className = "",
}: {
  src?: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  children?: React.ReactNode;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  overlayScrim?: number;
  enabled?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`scroll-expand ${enabled ? "" : "is-static"} ${className}`}
      style={
        {
          "--sx-w": `${startWidth}%`,
          "--sx-h": `${startHeight}%`,
          "--sx-r": `${startRadius}px`,
          "--sx-r-end": `${endRadius}px`,
          "--sx-zoom": mediaZoom,
          "--sx-scrim": overlayScrim,
          "--sx-height": `${(1 + scrollDistance + holdDistance) * 100}svh`,
          "--sx-range": `${((scrollDistance / (scrollDistance + holdDistance)) * 100).toFixed(1)}%`,
        } as React.CSSProperties
      }
    >
      <div className="scroll-expand-frame">
        <div className="scroll-expand-media">
          {src ? (
            <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
          ) : (
            /* Placeholder until a venue photo lands in /public — pass src then. */
            <div className="scroll-expand-placeholder" />
          )}
          <div className="scroll-expand-scrim" />
          {(title || children) && (
            <div className="scroll-expand-copy">
              {title && <h2>{title}</h2>}
              {children}
            </div>
          )}
        </div>
        {scrollHint && <p className="scroll-expand-hint">{scrollHint}</p>}
      </div>
    </section>
  );
}
