"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { formatTeamNumber } from "@/lib/registration/team-number";
import type { RegistrationStatus } from "@/lib/registration/types";
import type { AdminTeam, RegistrationWithUrls } from "../AdminDashboard";

type TeamEntry = AdminTeam & {
  members: RegistrationWithUrls[];
  requests: RegistrationWithUrls[];
  live: number;
  unapproved: number;
};

export function TeamList({
  teams,
  registrations,
  busyId,
  onSetTeamStatus,
}: {
  teams: AdminTeam[];
  registrations: RegistrationWithUrls[];
  busyId: string | null;
  onSetTeamStatus: (teamId: string, status: RegistrationStatus) => void;
}) {
  const [search, setSearch] = useState("");

  const entries: TeamEntry[] = useMemo(
    () =>
      teams.map((t) => {
        // Leader first, then members in the order they joined.
        const members = registrations
          .filter((r) => r.team_id === t.id)
          .sort(
            (a, b) =>
              Number(b.team_role === "leader") - Number(a.team_role === "leader") ||
              +new Date(a.created_at) - +new Date(b.created_at)
          );
        return {
          ...t,
          members,
          requests: registrations.filter((r) => r.requested_team_id === t.id && r.status !== "rejected"),
          // Rejected registrations don't hold a seat.
          live: members.filter((m) => m.status !== "rejected").length,
          unapproved: members.filter((m) => m.status !== "approved").length,
        };
      }),
    [teams, registrations]
  );

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        t.code.toLowerCase().includes(term) ||
        t.members.some((m) =>
          m.participants.some(
            (p) =>
              p.name.toLowerCase().includes(term) ||
              p.email.toLowerCase().includes(term) ||
              p.mobile.includes(term) ||
              p.college.toLowerCase().includes(term)
          )
        )
    );
  }, [entries, search]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F7F2F6]/40" />
        <input
          type="text"
          placeholder="Search by team name, code, member name, email, mobile or college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/20 bg-black/20 py-3 pl-10 pr-4 text-sm text-[#F7F2F6] outline-none focus:border-[#7484FE]"
        />
      </div>

      <p className="text-sm text-[#F7F2F6]/60">
        {shown.length} of {entries.length} teams
      </p>

      {shown.length === 0 && <p className="text-[#F7F2F6]/60">No teams found.</p>}

      {shown.map((t) => {
        const teamBusy = busyId === t.id;
        return (
          <div key={t.id} className="rounded-2xl border border-white/15 bg-black/20 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="heading text-xl font-black text-[#F7F2F6]">{t.name}</p>
                <p className="mt-1 text-sm text-[#F7F2F6]/70">
                  Code <span className="font-mono font-bold text-[#33FF67]">{t.code}</span> · Created{" "}
                  {new Date(t.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
                <span className="rounded-full border border-[#7484FE]/40 bg-[#7484FE]/10 px-3 py-1 text-[#7484FE]">
                  {t.live} / {t.max_members} members
                </span>
                <span
                  className={`rounded-full border px-3 py-1 ${
                    t.members.length > 0 && t.unapproved === 0
                      ? "border-[#33FF67]/40 bg-[#33FF67]/10 text-[#33FF67]"
                      : "border-yellow-400/40 bg-yellow-400/10 text-yellow-300"
                  }`}
                >
                  {t.members.length - t.unapproved} approved
                </span>
              </div>
            </div>

            {t.members.length === 0 ? (
              <p className="mt-4 text-sm text-[#F7F2F6]/60">No members yet.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wider text-[#F7F2F6]/50">
                    <tr>
                      <th className="py-2 pr-3">Name</th>
                      <th className="py-2 pr-3">Role</th>
                      <th className="py-2 pr-3">Roll No</th>
                      <th className="py-2 pr-3">College · Dept</th>
                      <th className="py-2 pr-3">Contact</th>
                      <th className="py-2 pr-3">Reg No</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.members.flatMap((m) =>
                      m.participants.map((p, i) => (
                        <tr key={`${m.id}-${i}`} className="border-t border-white/10 align-top">
                          <td className="py-2 pr-3 font-bold">{p.name}</td>
                          <td className="py-2 pr-3">{m.team_role === "leader" ? "Leader" : "Member"}</td>
                          <td className="py-2 pr-3 font-mono">{p.rollNumber}</td>
                          <td className="py-2 pr-3 text-[#F7F2F6]/70">
                            {p.college} · {p.department}
                          </td>
                          <td className="py-2 pr-3 text-[#F7F2F6]/70">
                            {p.mobile}
                            <br />
                            {p.email}
                          </td>
                          <td className="py-2 pr-3 font-mono text-[#33FF67]">{formatTeamNumber(m.team_seq)}</td>
                          <td className="py-2">
                            <StatusText status={m.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {t.requests.length > 0 && (
              <p className="mt-4 text-sm text-[#F7F2F6]/70">
                <span className="font-bold text-[#7484FE]">Waiting to join:</span>{" "}
                {t.requests.map((r) => r.participants[0]?.name ?? formatTeamNumber(r.team_seq)).join(", ")}
              </p>
            )}

            {t.members.length > 0 && (
              <div className="mt-5">
                <button
                  disabled={busyId !== null || t.unapproved === 0}
                  onClick={() => {
                    if (
                      confirm(
                        `Approve all ${t.members.length} registrations on "${t.name}"? ` +
                          `${t.unapproved} still need approving, and each one gets a confirmation email.`
                      )
                    ) {
                      onSetTeamStatus(t.id, "approved");
                    }
                  }}
                  className="rounded-lg border-2 border-[#33FF67] px-4 py-2 text-sm font-black text-[#33FF67] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {teamBusy
                    ? "Approving team..."
                    : t.unapproved === 0
                      ? "Whole team approved"
                      : `Approve whole team (${t.unapproved} of ${t.members.length})`}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatusText({ status }: { status: RegistrationStatus }) {
  const styles: Record<RegistrationStatus, string> = {
    pending: "text-yellow-300",
    approved: "text-[#33FF67]",
    rejected: "text-red-400",
  };
  const labels: Record<RegistrationStatus, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Not Approved",
  };
  return <span className={`font-bold ${styles[status]}`}>{labels[status]}</span>;
}
