import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { event } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/session";
import { PageTransition } from "../ui";
import { AuthForm } from "../login/AuthForm";

export const metadata: Metadata = {
  title: `Create account - ${event.name} ${event.year}`,
};

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/dashboard");

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
        <div className="relative mx-auto flex max-w-[1400px] justify-center px-4 sm:px-8">
          <AuthForm mode="signup" />
        </div>
      </section>
    </PageTransition>
  );
}
