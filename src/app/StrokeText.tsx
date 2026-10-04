/* Per-character stroke-then-fill, driven entirely by CSS so it plays on first
   paint (no client JS, no hydration wait).

   Plain text, not SVG. An <svg> has an intrinsic aspect ratio, and every way of
   making one fit a fluid column — viewBox height from guessed font metrics,
   textLength, preserveAspectRatio — is a bet on numbers that change with the
   resolved face. Lose the bet and the letters stretch, crop, or overflow. Text
   has no aspect ratio to get wrong: it is laid out by the same font metrics
   that draw it, so it is correct by construction at every width. */

import "./StrokeText.css";

/* Syne caps average ~1.09em of advance (measured, at the tracking below), so
   `chars * EM_PER_CAP` ems is the run's width. FILL keeps it just inside the
   column: a face whose caps run wider than Syne's eats the slack instead of
   spilling, and 3% of under-fill is invisible where an overflow is not. */
const EM_PER_CAP = 1.09;
const FILL = 0.97;

/* Ceiling for short, wide windows, where a width-driven size would otherwise
   grow the wordmark into the tagline. */
const MAX_HEIGHT = "26vh";

export default function StrokeText({
  text,
  strokeColor = "#4b5cff",
  fillColor = "#ffffff",
  drawDuration = 0.7,
  fillDelay = 0.1,
  stagger = 0.03,
  ease = "cubic-bezier(0.33, 1, 0.68, 1)",
  className = "",
}: {
  text: string;
  strokeColor?: string;
  fillColor?: string;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  className?: string;
}) {
  const chars = [...text];
  const width = (100 * FILL) / (EM_PER_CAP * chars.length);

  return (
    /* The outer span is the query container the size below resolves against,
       so the wordmark tracks its column without page.tsx having to declare it. */
    <span
      role="img"
      aria-label={text}
      className={`stroke-text ${className}`}
      style={
        {
          "--stroke-color": strokeColor,
          "--fill-color": fillColor,
          "--draw-dur": `${drawDuration}s`,
          "--fill-delay": `${fillDelay}s`,
          "--stagger": `${stagger}s`,
          "--stroke-ease": ease,
        } as React.CSSProperties
      }
    >
      <span
        aria-hidden
        className="stroke-text-line"
        style={{ fontSize: `min(${width}cqw, ${MAX_HEIGHT})` }}
      >
        {chars.map((char, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
