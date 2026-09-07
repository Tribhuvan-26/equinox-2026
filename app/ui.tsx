import { ViewTransition } from "react";
import Link from "next/link";
import { SubEventBadge } from "./EventGraphics";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={`h-4 w-4 ${className}`}>
      <path
        d="M4 12L12 4M12 4H5.5M12 4v6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* A disc lit on one side — the terminator drawn on a sphere. The site's mark.
   Used as the nav's active marker and as the eyebrow's rule cap. */
export function Disc({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full border border-[#F7CA50] bg-[linear-gradient(90deg,#F7CA50_50%,transparent_50%)] ${className}`}
    />
  );
}

/* The crossing between the two grounds. */
export function Terminator({
  into,
  label,
}: {
  into: "day" | "night";
  label: string;
}) {
  return (
    <div
      className={`terminator ${
        into === "day" ? "terminator--rising day" : "terminator--setting night"
      }`}
    >
      <p className="label data text-center text-white/80">{label}</p>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* Placeholder portrait: gradient tile with initials. */
export function Avatar({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={`grid place-items-center rounded-full bg-[#0B2D6D] border border-white/30 text-[#F7CA50] font-bold ${className}`}
    >
      <span className="display text-[0.7em] tracking-normal">
        {initials(name)}
      </span>
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="label flex items-center gap-3 text-[#F7CA50] font-mono font-bold text-xs uppercase tracking-wider">
      <Disc className="h-2.5 w-2.5" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
}: {
  eyebrow: string;
  heading: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display-title max-w-4xl text-4xl sm:text-5xl lg:text-6xl text-white">
        {heading}
      </h2>
    </div>
  );
}

export function Person({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} className="h-11 w-11 shrink-0 rounded-full text-lg" />
      <div className="min-w-0">
        <p className="truncate font-bold text-white text-base">{name}</p>
        <p className="truncate font-mono text-xs text-[#F7CA50]">{role}</p>
      </div>
    </div>
  );
}

/* SPOC / board contact card — the email and phone are meant to be tapped. */
export function ContactCard({
  name,
  role,
  email,
  phone,
}: {
  name: string;
  role: string;
  email: string;
  phone?: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-white/30 bg-white/10 p-6 backdrop-blur-xs transition hover:border-[#F7CA50] hover:bg-white/15">
      <Person name={name} role={role} />
      <div className="data flex flex-col gap-1 text-sm">
        <a href={`mailto:${email}`} className="text-[#F7CA50] font-medium hover:underline">
          {email}
        </a>
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="text-white/80 font-mono hover:text-[#F7CA50]"
          >
            {phone}
          </a>
        )}
      </div>
    </div>
  );
}

export function EventCard({
  event,
}: {
  event: {
    slug: string;
    name: string;
    tagline: string;
    category: string;
    day: string;
  };
}) {
  return (
    <Link
      href={`/events/${event.slug}`}
      transitionTypes={["nav-forward"]}
      className="press group flex flex-col gap-4 rounded-3xl border-2 border-white/30 bg-white/10 p-6 backdrop-blur-xs transition hover:border-white hover:bg-white/15"
    >
      {/* The tile is the morph target: it grows into the event page's hero. */}
      <ViewTransition name={`event-${event.slug}`} share="morph" default="none">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-white bg-[#FF4D79] p-4 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition duration-200 group-hover:bg-[#f03867]">
          <SubEventBadge slug={event.slug} />
          <span className="label absolute top-3 left-3 rounded-full border border-white/40 bg-[#0B2D6D]/80 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-md">
            {event.category}
          </span>
          <span className="absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full bg-white text-[#0d0e15] opacity-0 transition duration-200 group-hover:opacity-100">
            <Arrow />
          </span>
        </div>
      </ViewTransition>
      <div>
        <h3 className="heading text-xl font-bold text-white">{event.name}</h3>
        <p className="text-white/85 text-sm mt-1">{event.tagline}</p>
        <p className="label mt-2 font-mono text-xs font-bold text-[#F7CA50]">{event.day}</p>
      </div>
    </Link>
  );
}

/* Wraps a route's content so forward/back navigations slide in the matching
   direction. Untyped navigations (back button, refresh) get no slide. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const directions = {
    "nav-forward": "nav-forward",
    "nav-back": "nav-back",
    "nav-fade": "nav-fade",
    default: "none",
  };

  return (
    <ViewTransition enter={directions} exit={directions} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
