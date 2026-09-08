import type { Metadata } from "next";
import Link from "next/link";
import { board, event, events, registration, tickets } from "@/lib/content";
import { Arrow, ContactCard, PageTransition, SectionHeading } from "../ui";

export const metadata: Metadata = {
  title: `Register — ${event.name} ${event.year}`,
  description: registration.body,
};

export default function RegisterPage() {
  return (
    <PageTransition>
      <section className="brochure-grid min-h-screen bg-[#2074D5] text-white pt-40 pb-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <SectionHeading
            eyebrow={registration.eyebrow}
            heading={registration.heading}
          />
          <p className="mt-8 max-w-2xl leading-relaxed text-white/85 text-lg">
            {registration.body}
          </p>

          <ol className="mt-16 grid gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {registration.steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-3 rounded-2xl bg-[#0B2D6D]/85 border border-white/20 p-6 backdrop-blur-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#F9D47B]">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="heading text-xl text-white">{step.title}</h2>
                <p className="leading-relaxed text-white/80 text-sm">{step.body}</p>
              </li>
            ))}
          </ol>

          <h2 className="mt-20 heading text-3xl font-black text-[#F9D47B]">Passes</h2>
          <div className="mt-6 flex flex-col gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.name}
                className="grid overflow-hidden rounded-3xl border-2 border-white/20 shadow-xl lg:grid-cols-[1fr_22rem]"
              >
                <div className="flex flex-col gap-6 bg-[#0B2D6D]/95 p-8 text-white">
                  <div className="flex flex-col gap-3">
                    <h3 className="heading text-2xl font-black text-white">{ticket.name}</h3>
                    <p className="max-w-xl leading-relaxed text-white/80">
                      {ticket.description}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {ticket.perks.map((perk) => (
                      <li key={perk} className="border-l-2 border-[#F9D47B] pl-3 text-white/90">
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Coral pass card face matching brochure visual style */}
                <div className="relative flex flex-col justify-between gap-10 bg-gradient-to-br from-[#EB547C] to-[#E03260] p-8 text-white">
                  <div className="flex flex-col gap-4">
                    <span className="label w-max rounded-full border border-white/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      {ticket.badge}
                    </span>
                    <div>
                      <p className="data text-5xl font-black text-[#F9D47B]">{ticket.price}</p>
                      <p className="label mt-1 text-white/90 font-medium">{ticket.unit}</p>
                    </div>
                  </div>
                  <a
                    href={registration.formUrl}
                    className="press flex items-center justify-between rounded-xl bg-[#F9D47B] px-5 py-4 font-black text-[#0B2D6D] shadow-md transition-all hover:bg-[#ffe082] hover:scale-[1.02]"
                  >
                    Get this pass
                    <Arrow />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-20 heading text-3xl font-black text-[#F9D47B]">Register for an event</h2>
          <p className="mt-2 max-w-2xl text-white/80">
            Each event takes its own team registration. Open the event and write to
            its SPOC to hold a slot.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((item) => (
              <Link
                key={item.slug}
                href={`/events/${item.slug}`}
                transitionTypes={["nav-forward"]}
                className="flex items-center justify-between gap-4 rounded-2xl bg-[#0B2D6D]/85 border border-white/15 p-6 text-white transition-all hover:border-[#F9D47B] hover:bg-[#0B2D6D]"
              >
                <span>
                  <span className="block font-black text-lg text-white">{item.name}</span>
                  <span className="block text-sm text-[#F9D47B]">
                    {item.fee} · {item.teamSize}
                  </span>
                </span>
                <Arrow />
              </Link>
            ))}
          </div>

          <h2 className="mt-20 heading text-3xl font-black text-[#F9D47B]">Stuck on registration?</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {board.map((member) => (
              <ContactCard key={member.name} {...member} />
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
