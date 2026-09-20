import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { event } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyTeam } from "@/lib/teams/service";
import type { TeamView } from "@/lib/teams/types";
import { PageTransition } from "../ui";
import { SignOutButton } from "./SignOutButton";
import { TeamPanel } from "./TeamPanel";
import { VerifyEmailBanner } from "./VerifyEmailBanner";

export const metadata: Metadata = {
  title: `Dashboard - ${event.name} ${event.year}`,
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  let team: TeamView | null = null;
  let loadError = false;
  try {
    team = await getMyTeam(user.id);
  } catch (err) {
    console.error("[dashboard] could not load team", err);
    loadError = true;
  }

  return (
    <PageTransition>
      <section className="riso-texture brochure-grid relative min-h-screen overflow-hidden bg-[#2A2A2A] pt-28 pb-24 text-[#F7F2F6] sm:pt-40">
        <div className="relative mx-auto mb-8 flex w-full max-w-3xl items-center justify-between gap-3 px-4 sm:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-[#151515] px-4 py-2 font-mono text-xs font-black uppercase tracking-wider text-[#F7F2F6] shadow-[3px_3px_0px_#7484FE] transition-all hover:border-[#33FF67] hover:bg-[#202020] hover:text-[#33FF67] hover:shadow-[3px_3px_0px_#33FF67] active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 text-[#33FF67] transition-transform group-hover:-translate-x-1" />
            <span>Home</span>
          </Link>
          <SignOutButton />
        </div>

        <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-8">
          <p className="font-mono text-xs font-black uppercase tracking-[0.3em] text-[#33FF67]">Dashboard</p>
          <h1 className="heading mt-3 text-3xl font-black sm:text-5xl">Hi, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 text-sm text-[#F7F2F6]/60">{user.email}</p>

          <div className="mt-8">
            {!user.emailVerified && <VerifyEmailBanner email={user.email} />}
            {loadError ? (
              <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-sm text-red-300">
                Could not load your team right now. If this keeps happening, the team tables may not be set up yet
                (run <code className="font-mono">supabase/teams.sql</code>). Otherwise, try again in a moment.
              </p>
            ) : (
              <TeamPanel initialTeam={team} canManage={user.emailVerified} />
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
