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
      <section className="brochure-grid min-h-screen bg-[#2A2A2A] text-[#F7F2F6] pt-40 pb-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <SectionHeading
            eyebrow={registration.eyebrow}
            heading={registration.heading}
          />
          <p className="mt-8 max-w-2xl leading-relaxed text-[#F7F2F6]/85 text-lg">
            {registration.body}
          </p>

          <ol className="mt-16 grid gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {registration.steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-3 rounded-2xl bg-[#2A2A2A]/90 border border-white/20 p-6 backdrop-blur-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#33FF67]">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="heading text-xl text-[#F7F2F6]">{step.title}</h2>
                <p className="leading-relaxed text-[#F7F2F6]/80 text-sm">{step.body}</p>
              </li>
            ))}
          </ol>

          <h2 className="mt-20 heading text-3xl font-black text-[#F7F2F6]">Passes</h2>
          <div className="mt-6 flex flex-col gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.name}
                className="grid overflow-hidden rounded-3xl border-2 border-white/20 shadow-xl lg:grid-cols-[1fr_22rem]"
              >
                <div className="flex flex-col gap-6 bg-[#2A2A2A]/95 p-8 text-[#F7F2F6]">
                  <div className="flex flex-col gap-3">
                    <h3 className="heading text-2xl font-black text-[#F7F2F6]">{ticket.name}</h3>
                    <p className="max-w-xl leading-relaxed text-[#F7F2F6]/80">
                      {ticket.description}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {ticket.perks.map((perk) => (
                      <li key={perk} className="border-l-2 border-[#33FF67] pl-3 text-[#F7F2F6]/90">
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Periwinkle pass card face */}
                <div className="relative flex flex-col justify-between gap-10 bg-gradient-to-br from-[#7484FE] to-[#5868DF] p-8 text-[#F7F2F6]">
                  <div className="flex flex-col gap-4">
                    <span className="label w-max rounded-full border border-white/50 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#F7F2F6]">
                      {ticket.badge}
                    </span>
                    <div>
                      <p className="data text-5xl font-black text-[#33FF67]">{ticket.price}</p>
                      <p className="label mt-1 text-[#F7F2F6]/90 font-medium">{ticket.unit}</p>
                    </div>
                  </div>
                  <a
                    href={registration.formUrl}
                    className="press flex items-center justify-between rounded-xl bg-[#33FF67] px-5 py-4 font-black text-[#2A2A2A] shadow-md transition-all hover:bg-[#5aff87] hover:scale-[1.02]"
                  >
                    Get this pass
                    <Arrow />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-20 heading text-3xl font-black text-[#F7F2F6]">Register for an event</h2>
          <p className="mt-2 max-w-2xl text-[#F7F2F6]/80">
            Each event takes its own team registration. Open the event and write to
            its SPOC to hold a slot.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((item) => (
              <Link
                key={item.slug}
                href={`/events/${item.slug}`}
                transitionTypes={["nav-forward"]}
                className="flex items-center justify-between gap-4 rounded-2xl bg-[#2A2A2A]/90 border border-white/15 p-6 text-[#F7F2F6] transition-all hover:border-[#7484FE] hover:bg-[#333333]"
              >
                <span>
                  <span className="block font-black text-lg text-[#F7F2F6]">{item.name}</span>
                  <span className="block text-sm text-[#33FF67]">
                    {item.fee} · {item.teamSize}
                  </span>
                </span>
                <Arrow />
              </Link>
            ))}
          </div>

          <h2 className="mt-20 heading text-3xl font-black text-[#F7F2F6]">Stuck on registration?</h2>
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
