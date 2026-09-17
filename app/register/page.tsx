import type { Metadata } from "next";
import { board, event, registration, tickets } from "@/lib/content";
import { REGISTRATION_FEE } from "@/lib/registration/constants";
import { ContactCard, PageTransition, SectionHeading } from "../ui";
import { RegisterForm } from "./RegisterForm";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: `Register - ${event.name} ${event.year}`,
  description: registration.body,
};

export default function RegisterPage() {
  return (
    <PageTransition>
      <section className="brochure-grid relative min-h-screen overflow-hidden bg-[#2A2A2A] text-[#F7F2F6] pt-40 pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(116,132,254,0.22),transparent)] blur-3xl"
        />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8">
          <SectionHeading
            eyebrow={registration.eyebrow}
            heading={registration.heading}
          />
          <p className="mt-8 max-w-2xl leading-relaxed text-white/85 text-lg">
            {registration.body}
          </p>

          <ScrollReveal className="mt-16 grid auto-rows-[9rem] grid-flow-dense gap-4 overflow-hidden sm:grid-cols-4">
            {registration.steps.map((step, i) => (
              <div
                key={step.title}
                className={`group flex flex-col justify-between gap-3 rounded-2xl border border-white/20 bg-[#2A2A2A]/90 p-6 backdrop-blur-md transition-all hover:border-[#33FF67] hover:bg-[#333333] ${i === 0 ? "sm:col-span-2 sm:row-span-2" : i === 1 ? "sm:col-span-2" : "sm:col-span-1"
                  }`}
              >
                <span className="text-xs font-black uppercase tracking-wider text-[#33FF67]">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className={`heading text-[#F7F2F6] ${i === 0 ? "text-2xl" : "text-xl"}`}>
                    {step.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-[#F7F2F6]/80 text-sm transition-transform duration-300 group-hover:translate-x-1">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </ScrollReveal>

          <div id="register-form" className="mt-16 scroll-mt-28">
            <RegisterForm />
          </div>

          <h2 id="passes" className="mt-20 scroll-mt-28 heading text-3xl font-black text-[#F7F2F6]">Passes</h2>
          <ScrollReveal className="mt-6 flex flex-col gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.name}
                className="group grid overflow-hidden rounded-3xl border-2 border-white/20 shadow-xl transition-all duration-300 hover:border-[#33FF67]/60 hover:shadow-2xl lg:grid-cols-[1fr_22rem]"
              >
                <div className="flex flex-col gap-6 bg-[#0B2D6D]/95 p-8 text-white">
                  <div className="flex flex-col gap-3">
                    <h3 className="heading text-2xl font-black text-white">{ticket.name}</h3>
                    <p className="max-w-xl leading-relaxed text-white/80">
                      {ticket.description}
                    </p>
                  </div>
                  <div>
                    <p className="data text-5xl font-black text-[#33FF67]">₹{REGISTRATION_FEE}</p>
                    <p className="label mt-1 text-[#F7F2F6]/90 font-medium">per participant · {ticket.unit}</p>
                  </div>
                </div>
                {/* Coral pass card face matching brochure visual style */}
                <div className="relative flex flex-col justify-between gap-10 bg-gradient-to-br from-[#EB547C] to-[#E03260] p-8 text-white">
                  <div className="flex flex-col gap-4">
                    <span className="label w-max rounded-full border border-white/50 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#F7F2F6]">
                      What You Get
                    </span>
                    <ul className="flex flex-col gap-3">
                      {ticket.perks.map((perk) => (
                        <li key={perk} className="border-l-2 border-[#33FF67] pl-3 text-[#F7F2F6]/90">
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </ScrollReveal>

          <h2 className="mt-20 heading text-3xl font-black text-[#F7F2F6]">Stuck on registration?</h2>
          <ScrollReveal className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {board.map((member) => (
              <ContactCard key={member.name} {...member} />
            ))}
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}
