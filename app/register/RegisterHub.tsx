"use client";

import Link from "next/link";
import { useState } from "react";
import { CreateTeam, JoinTeam } from "./TeamForms";

const TABS = [
  { id: "create", label: "Create a Team", blurb: "You pay for yourself, get a team code, and teammates join with it." },
  { id: "join", label: "Join a Team", blurb: "Have a team name or code? Register and pay your own fee." },
] as const;

type Tab = (typeof TABS)[number]["id"];

export function RegisterHub() {
  const [tab, setTab] = useState<Tab>("create");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div>
      <div role="tablist" className="grid gap-2 rounded-2xl border border-white/15 bg-black/20 p-1.5 sm:grid-cols-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-3 text-sm font-black transition ${
              tab === t.id ? "bg-[#7484FE] text-[#2A2A2A]" : "text-[#F7F2F6]/80 hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-[#F7F2F6]/70">{active.blurb}</p>

      <div className="mt-8">
        {tab === "create" && <CreateTeam />}
        {tab === "join" && <JoinTeam />}
      </div>

      <p className="mt-8 text-sm text-[#F7F2F6]/70">
        Already registered?{" "}
        <Link href="/my-registration" className="font-bold text-[#33FF67] hover:underline">
          Check your registration or manage your team
        </Link>
      </p>
    </div>
  );
}
