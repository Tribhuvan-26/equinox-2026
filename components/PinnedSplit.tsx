import type { ReactNode } from "react";

/**
 * Left column holds still while the right column scrolls past it.
 * Native sticky does this without a ScrollTrigger pin, so there is no pinned
 * spacer to fight with the journey's triggers. Below 1024px the columns stack.
 */
export default function PinnedSplit({
  aside,
  children,
}: {
  aside: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">{aside}</div>
      <div>{children}</div>
    </div>
  );
}
