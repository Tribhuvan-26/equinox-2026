import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Mail, ArrowRight } from "lucide-react";
import { contact, event, registration } from "@/lib/content";
import { PageTransition } from "../ui";

export const metadata: Metadata = {
  title: `Register - ${event.name} ${event.year}`,
  description: registration.body,
};

const details = [
  { icon: Calendar, label: "Dates", value: event.datesFull, accent: "#7484FE" },
  { icon: MapPin, label: "Venue", value: event.venue, accent: "#33FF67" },
  { icon: Mail, label: "Reach Us", value: contact.email, accent: "#7484FE" },
];

export default function RegisterPage() {
  return (
    <PageTransition>
      <section className="relative min-h-screen overflow-hidden bg-[#2A2A2A] pt-40 pb-24 text-[#F7F2F6]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(116,132,254,0.22),transparent)] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgba(51,255,103,0.14),transparent)] blur-3xl"
        />

        <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-4 text-center sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#7484FE,#33FF67)] px-4 py-1 text-xs font-black uppercase tracking-wider text-[#2A2A2A]">
            {event.edition} Edition
          </span>

          <p className="mt-6 font-mono text-xs font-black uppercase tracking-[0.3em] text-[#33FF67]">
            {registration.eyebrow}
          </p>
          <h1
            className="font-display-title mt-4 max-w-4xl leading-[0.95] text-[#F7F2F6]"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
          >
            Coming <span className="text-[#7484FE]">Soon</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#F7F2F6]/85">
            {registration.body}
          </p>

          <div className="mt-16 grid w-full gap-4 sm:grid-cols-3">
            {details.map(({ icon: Icon, label, value, accent }) => (
              <div
                key={label}
                className="program-card flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-[#151515] p-7 text-center"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full border"
                  style={{ borderColor: accent, color: accent }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#F7F2F6]/60">
                  {label}
                </span>
                <p className="text-sm font-bold text-[#F7F2F6]">{value}</p>
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="group mt-16 flex items-center gap-2 rounded-full border border-white/15 bg-[#101010] px-6 py-3 text-sm font-bold text-[#F7F2F6] transition hover:border-[#33FF67] hover:bg-[#33FF67] hover:text-[#2A2A2A]"
          >
            Back to Homepage
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
