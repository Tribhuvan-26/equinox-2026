"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Images } from "lucide-react";

/* Hanging-poster popup ported from mlritcie.in's EventPopup, re-worded for
   after the event. Drops in once per browser session; on "/" it waits for the
   SpiderIntro to finish so the two don't overlap. */
const EVENT = {
  title: "The Equinox 2.0",
  tagline: "E-Summit 2K26 · Oct 30 & 31",
  href: "/gallery",
  cta: "Relive the moments",
};

const SEEN_KEY = "equinox:wrap-seen";
// Paper unrolling down from the rod; the roll, swing, shine and CTA are timed off this.
const UNROLL = { delay: 0.3, duration: 1.2, ease: [0.65, 0, 0.35, 1] as const };
const OPENED = UNROLL.delay + UNROLL.duration;
// On close the paper rolls back up into the rod before the poster lifts away.
const ROLL_UP = { duration: 0.5, ease: [0.65, 0, 0.35, 1] as const };

const PRIMARY_RGB = "116, 132, 254";

export default function ConcludedBanner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const show = () => setOpen(true);
    if (pathname !== "/") {
      const t = setTimeout(show, 600);
      return () => clearTimeout(t);
    }
    window.addEventListener("equinox:intro-done", show);
    const failsafe = setTimeout(show, 8500);
    return () => {
      window.removeEventListener("equinox:intro-done", show);
      clearTimeout(failsafe);
    };
    // First landing only; later navigations shouldn't re-arm it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const instant = reduceMotion ? { duration: 0 } : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="event-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: reduceMotion ? 0 : ROLL_UP.duration + 0.1 } }}
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 2147483000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
            background: "rgba(10, 11, 18, 0.78)",
            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
          }}
        >
          {/* Hanging poster — swings from the rod once it has unrolled */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${EVENT.title} has concluded`}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -60, opacity: 0, rotate: 0 }}
            animate={{
              y: 0, opacity: 1,
              rotate: reduceMotion ? 0 : [0, 0, 1.3, -0.9, 0.5, -0.2, 0],
              transition: instant ?? {
                y: { type: "spring", stiffness: 260, damping: 18 },
                opacity: { duration: 0.2 },
                rotate: { duration: 2.2, delay: OPENED - 0.15, times: [0, 0.01, 0.22, 0.45, 0.66, 0.84, 1], ease: "easeInOut" },
              },
            }}
            exit={{ y: -60, opacity: 0, transition: { duration: 0.3, ease: "easeIn", delay: reduceMotion ? 0 : ROLL_UP.duration } }}
            style={{
              position: "relative",
              width: "min(820px, 100%, calc((100dvh - 180px) * 1.77))",
              marginTop: 44,
              // Pivot far above the rod, as if the cords hang from the ceiling.
              transformOrigin: "50% -45vh",
            }}
          >
            <motion.button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, transition: instant ?? { delay: OPENED, duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              whileHover={{ scale: 1.08 }}
              style={{
                position: "absolute", top: -46, right: -8, zIndex: 4,
                width: 36, height: 36, borderRadius: "999px",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "rgba(22, 23, 29, 0.9)",
                border: `1px solid rgba(${PRIMARY_RGB}, 0.45)`,
                color: "#F4F5FA", cursor: "pointer",
              }}
            >
              <X size={18} />
            </motion.button>

            {/* Rod the poster hangs from, with cords up to the ceiling and end knobs */}
            <div aria-hidden="true" style={{
              position: "relative", zIndex: 3,
              width: "calc(100% + 16px)", marginLeft: -8, height: 12, borderRadius: 999,
              background: "linear-gradient(180deg, #C9CFFF 0%, #7484FE 45%, #3A4290 100%)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
            }}>
              {["10%", "90%"].map((left) => (
                <span key={left} style={{
                  position: "absolute", bottom: "50%", left, width: 1.5, height: "100vh",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(0deg, rgba(201,207,255,0.75), rgba(201,207,255,0))",
                }} />
              ))}
              {[{ left: -7 }, { right: -7 }].map((pos, i) => (
                <span key={i} style={{
                  position: "absolute", top: -3, ...pos, width: 18, height: 18, borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 30%, #F4F5FA 0%, #A5AFFE 35%, #3A4290 100%)",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
                }} />
              ))}
            </div>

            <div style={{ position: "relative", marginTop: -5 }}>
              {/* Poster — unrolls downward from the rod */}
              <motion.div
                initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: instant ?? UNROLL }}
                exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: instant ?? ROLL_UP }}
                style={{
                  position: "relative", overflow: "hidden", containerType: "inline-size",
                  borderRadius: "2px 2px 10px 10px",
                  boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(${PRIMARY_RGB}, 0.25)`,
                }}
              >
                {/* The Equinox slide from Figma, as the poster on the scroll */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/equinox-wrap-poster.webp"
                  alt={`${EVENT.title} — E-Summit 2K26, 30 & 31 October`}
                  width={1173} height={661}
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
                {/* "Concluded" stamp across the poster */}
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 1.8, rotate: 10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 10, transition: instant ?? { delay: OPENED + 0.2, type: "spring", stiffness: 420, damping: 16 } }}
                  style={{
                    position: "absolute", right: "5cqw", top: "5cqw",
                    padding: "1cqw 2.5cqw", borderRadius: 8,
                    border: "3px solid #33FF67", color: "#33FF67",
                    background: "rgba(10, 11, 18, 0.72)",
                    fontFamily: "var(--font-syne)", fontWeight: 800,
                    fontSize: "2.6cqw", letterSpacing: "0.12em",
                    textTransform: "uppercase", whiteSpace: "nowrap",
                    boxShadow: "0 0 40px rgba(51,255,103,0.35)",
                  }}
                >
                  Concluded
                </motion.div>
                {/* Shadow the rod casts on the paper */}
                <div aria-hidden="true" style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 22, pointerEvents: "none",
                  background: "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0))",
                }} />
                {/* Shine sweep once it is fully open */}
                {!reduceMotion && (
                  <motion.div
                    aria-hidden="true"
                    initial={{ x: "-130%" }}
                    animate={{ x: "130%", transition: { duration: 0.9, delay: OPENED + 0.1, ease: "easeInOut" } }}
                    style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)",
                    }}
                  />
                )}
              </motion.div>

              {/* The roll travelling down as the paper unfurls */}
              {!reduceMotion && (
                <motion.div
                  aria-hidden="true"
                  initial={{ top: "0%", opacity: 1 }}
                  animate={{
                    top: "100%", opacity: [1, 1, 0],
                    transition: { top: UNROLL, opacity: { duration: OPENED + 0.15, times: [0, 0.88, 1] } },
                  }}
                  exit={{ top: "0%", opacity: 1, transition: { top: ROLL_UP, opacity: { duration: 0 } } }}
                  style={{
                    position: "absolute", left: "-1%", width: "102%", height: 20,
                    transform: "translateY(-50%)", borderRadius: 999, pointerEvents: "none",
                    background: "linear-gradient(180deg, #F4F5FA 0%, #B9C0FF 35%, #5763BF 75%, #2A2F66 100%)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.55)",
                  }}
                />
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: instant ?? { delay: OPENED + 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
              style={{ paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{
                display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "6px 10px",
                fontFamily: "var(--font-geist-sans)", fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
              }}>
                <span style={{ color: "#33FF67" }}>Thank you · {EVENT.tagline}</span>
                <span style={{
                  padding: "4px 10px", borderRadius: 999,
                  background: `rgba(${PRIMARY_RGB}, 0.16)`, border: `1px solid rgba(${PRIMARY_RGB}, 0.4)`,
                  color: "#F7F2F6", letterSpacing: "0.1em",
                }}>
                  Registrations closed
                </span>
              </div>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -2, boxShadow: "0 10px 30px rgba(51,255,103,0.35)" }}
                whileTap={{ scale: 0.98 }}
                style={{ borderRadius: "12px" }}
              >
                <Link
                  href={EVENT.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    padding: "13px 20px", borderRadius: "12px",
                    background: "linear-gradient(90deg, #7484FE, #33FF67)", color: "#141414",
                    fontFamily: "var(--font-geist-sans)", fontSize: "15px", fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  <Images size={17} /> {EVENT.cta}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
