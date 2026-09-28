"use client";

import { useMemo, useState } from "react";
import type { RegistrationRecord, RegistrationStatus } from "@/lib/registration/types";
import { Sidebar, type AdminView } from "./components/Sidebar";
import { MobileMenu } from "./components/MobileMenu";
import { DashboardStats } from "./components/DashboardStats";
import { FilterPanel } from "./components/FilterPanel";
import { RegistrationChart } from "./components/RegistrationChart";
import { RegistrationList } from "./components/RegistrationList";

export interface RegistrationWithUrls extends RegistrationRecord {
  screenshotUrl: string | null;
  utrProofUrl: string | null;
  /** Name of the team this registration belongs to, if any. */
  teamName?: string | null;
}

const VIEW_TITLES: Record<AdminView, string> = {
  dashboard: "Dashboard",
  participants: "All Teams",
  analytics: "Analytics",
  pending: "Pending Verification",
  "no-team": "Paid, No Team Yet",
  approved: "Approved",
  rejected: "Not Approved",
};

export function AdminDashboard({ registrations }: { registrations: RegistrationWithUrls[] }) {
  const [items, setItems] = useState(registrations);
  const [view, setView] = useState<AdminView>("dashboard");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filtered, setFiltered] = useState(registrations);
  const [collapsed, setCollapsed] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  /** Show why the server refused, instead of silently doing nothing. */
  async function reportFailure(res: Response) {
    const body = await res.json().catch(() => null);
    setActionError(body?.error ?? `Update failed (${res.status}). Please try again.`);
  }

  const statusFilteredForView: RegistrationWithUrls[] = useMemo(() => {
    if (view === "pending") return filtered.filter((r) => r.status === "pending");
    // Paid, but still deciding on a team. They can't be approved until they pick one.
    if (view === "no-team") return filtered.filter((r) => !r.team_id && r.status !== "rejected");
    if (view === "approved") return filtered.filter((r) => r.status === "approved");
    if (view === "rejected") return filtered.filter((r) => r.status === "rejected");
    return filtered;
  }, [filtered, view]);

  const recent = useMemo(
    () => [...items].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 5),
    [items]
  );

  /**
   * How many registrations each team has, and how many still need approving.
   * Counted over every registration, not just the ones in the current view.
   */
  const teamCounts = useMemo(() => {
    const counts = new Map<string, { total: number; unapproved: number }>();
    for (const r of items) {
      if (!r.team_id) continue;
      const entry = counts.get(r.team_id) ?? { total: 0, unapproved: 0 };
      entry.total += 1;
      if (r.status !== "approved") entry.unapproved += 1;
      counts.set(r.team_id, entry);
    }
    return counts;
  }, [items]);

  /** Merge server rows back into both lists, keeping the signed preview URLs. */
  function applyUpdates(updated: RegistrationRecord[]) {
    const byId = new Map(updated.map((r) => [r.id, r]));
    const merge = (prev: RegistrationWithUrls[]) =>
      prev.map((r) => (byId.has(r.id) ? { ...r, ...byId.get(r.id)! } : r));
    setItems(merge);
    setFiltered(merge);
  }

  async function setStatus(id: string, status: RegistrationStatus) {
    setBusyId(id);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const { registration } = await res.json();
        applyUpdates([registration]);
      } else {
        await reportFailure(res);
      }
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  /** Same call, but for every registration sharing this team. */
  async function setTeamStatus(teamId: string, status: RegistrationStatus) {
    setBusyId(teamId);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const { registrations: updated } = await res.json();
        applyUpdates(updated as RegistrationRecord[]);
      } else {
        await reportFailure(res);
      }
    } catch {
      setActionError("Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <Sidebar
        activeView={view}
        onViewChange={setView}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
      />
      <MobileMenu activeView={view} onViewChange={setView} />

      <div className={`mx-auto max-w-6xl transition-[padding] duration-300 ${collapsed ? "lg:pl-24" : "lg:pl-60"}`}>
        <div className="flex items-center justify-between">
          <h1 className="heading text-3xl font-black">Registration Verification</h1>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-bold hover:bg-white/10"
            >
              Sign out
            </button>
          </form>
        </div>

        <h2 className="heading mt-8 text-2xl font-black text-[#F7F2F6]">{VIEW_TITLES[view]}</h2>

        {actionError && (
          <div
            role="alert"
            className="sticky top-4 z-10 mt-4 flex items-start justify-between gap-4 rounded-xl border border-red-400/40 bg-[#2A1414] p-4 text-sm text-red-300"
          >
            <p>{actionError}</p>
            <button type="button" onClick={() => setActionError(null)} className="font-bold hover:text-red-100">
              Dismiss
            </button>
          </div>
        )}

        {view === "dashboard" && (
          <div className="mt-6 flex flex-col gap-6">
            <DashboardStats registrations={items} />
            <RegistrationChart registrations={items} />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F7F2F6]/60">Recent Registrations</h3>
              <div className="mt-4">
                <RegistrationList
                  registrations={recent}
                  busyId={busyId}
                  onSetStatus={setStatus}
                  onSetTeamStatus={setTeamStatus}
                  teamCounts={teamCounts}
                />
              </div>
            </div>
          </div>
        )}

        {view === "analytics" && (
          <div className="mt-6">
            <RegistrationChart registrations={items} />
          </div>
        )}

        {(view === "participants" || view === "pending" || view === "no-team" || view === "approved" || view === "rejected") && (
          <div className="mt-6 flex flex-col gap-6">
            <FilterPanel registrations={items} onFilterChange={setFiltered} />
            <RegistrationList
              registrations={statusFilteredForView}
              busyId={busyId}
              onSetStatus={setStatus}
              onSetTeamStatus={setTeamStatus}
              teamCounts={teamCounts}
            />
          </div>
        )}
      </div>
    </div>
  );
}
