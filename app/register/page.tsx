import type { Metadata } from "next";
import { event, registration } from "@/lib/content";
import { PageTransition } from "../ui";

export const metadata: Metadata = {
  title: `Register - ${event.name} ${event.year}`,
  description: registration.body,
};

export default function RegisterPage() {
  return (
    <PageTransition>
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#2A2A2A] px-4 text-center text-[#F7F2F6]">
        <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-[#33FF67]">
          {registration.eyebrow}
        </p>
        <h1 className="font-display-title mt-4 text-4xl text-[#F7F2F6] sm:text-6xl">
          Coming Soon
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#F7F2F6]/85">
          {registration.body}
        </p>
      </section>
    </PageTransition>
  );
}
