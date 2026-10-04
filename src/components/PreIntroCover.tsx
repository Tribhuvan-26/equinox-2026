"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * SpiderIntro only paints its own full-screen cover after it mounts client-side
 * (it portals into document.body). Until then, Next.js's server-rendered HTML —
 * navbar, hero, footer — is visible as-is, so slow hydration flashes the real
 * site before the intro ever starts. This renders the same solid backdrop
 * synchronously in the initial HTML (no client state needed for that first
 * paint) and only lifts once SpiderIntro's timeline actually finishes.
 *
 * Only the homepage ("/") ever mounts SpiderIntro / fires the done event, so
 * this only renders there — everywhere else it would just black out the page
 * until the failsafe timeout.
 *
 * A timeout fallback guards against the intro never firing its done event
 * (e.g. a JS error) leaving the page permanently blacked out.
 */
export default function PreIntroCover() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reveal = () => setHidden(true);
    window.addEventListener("equinox:intro-done", reveal);
    const failsafe = setTimeout(reveal, 8000);
    return () => {
      window.removeEventListener("equinox:intro-done", reveal);
      clearTimeout(failsafe);
    };
  }, []);

  if (pathname !== "/" || hidden) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[2147483647] bg-[#2A2A2A]"
    />
  );
}
