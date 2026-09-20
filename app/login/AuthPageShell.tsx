import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "../ui";

export const authCard =
  "w-full max-w-md rounded-2xl border-2 border-white/20 bg-[#151515]/90 p-6 text-left shadow-[6px_6px_0px_#7484FE] sm:p-8";
export const authInput =
  "mt-2 w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-[#F7F2F6] outline-none transition focus:border-[#7484FE]";
export const authLabel = "block text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70";
export const authButton =
  "press mt-6 w-full rounded-xl bg-[#33FF67] px-5 py-3 font-black text-[#2A2A2A] transition-all hover:bg-[#5aff87] disabled:cursor-not-allowed disabled:opacity-50";

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      <section className="riso-texture brochure-grid relative min-h-screen overflow-hidden bg-[#2A2A2A] pt-28 pb-24 text-[#F7F2F6] sm:pt-40">
        <div className="relative mx-auto mb-6 flex w-full max-w-[1400px] justify-start px-4 sm:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-[#151515] px-4 py-2 font-mono text-xs font-black uppercase tracking-wider text-[#F7F2F6] shadow-[3px_3px_0px_#7484FE] transition-all hover:border-[#33FF67] hover:bg-[#202020] hover:text-[#33FF67] hover:shadow-[3px_3px_0px_#33FF67] active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 text-[#33FF67] transition-transform group-hover:-translate-x-1" />
            <span>Back to Homepage</span>
          </Link>
        </div>
        <div className="relative mx-auto flex max-w-[1400px] justify-center px-4 sm:px-8">{children}</div>
      </section>
    </PageTransition>
  );
}
