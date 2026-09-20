import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { event } from "@/lib/content";
import { PageTransition } from "../ui";
import { MyRegistration } from "./MyRegistration";

export const metadata: Metadata = {
  title: `My registration - ${event.name} ${event.year}`,
  // The private token lives in the URL fragment; keep it out of Referer headers anyway.
  referrer: "no-referrer",
  robots: { index: false },
};

export default function MyRegistrationPage() {
  return (
    <PageTransition>
      <section className="riso-texture brochure-grid relative min-h-screen overflow-hidden bg-[#2A2A2A] pt-28 pb-24 text-[#F7F2F6] sm:pt-40">
        <div className="relative mx-auto mb-8 flex w-full max-w-3xl items-center px-4 sm:px-8">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-[#151515] px-4 py-2 font-mono text-xs font-black uppercase tracking-wider text-[#F7F2F6] shadow-[3px_3px_0px_#7484FE] transition-all hover:border-[#33FF67] hover:bg-[#202020] hover:text-[#33FF67] hover:shadow-[3px_3px_0px_#33FF67] active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 text-[#33FF67] transition-transform group-hover:-translate-x-1" />
            <span>Register</span>
          </Link>
        </div>
        <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-8">
          <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-[#33FF67]">My Registration</p>
          <div className="mt-6">
            <MyRegistration />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
