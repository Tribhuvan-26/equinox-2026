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
}

const VIEW_TITLES: Record<AdminView, string> = {
  dashboard: "Dashboard",
  participants: "All Teams",
  analytics: "Analytics",
  pending: "Pending Verification",
  approved: "Approved",
  rejected: "Rejected",
};

export function AdminDashboard({ registrations }: { registrations: RegistrationWithUrls[] }) {
  const [items, setItems] = useState(registrations);
  const [view, setView] = useState<AdminView>("dashboard");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filtered, setFiltered] = useState(registrations);
  const [collapsed, setCollapsed] = useState(false);

  const statusFilteredForView: RegistrationWithUrls[] = useMemo(() => {
    if (view === "pending") return filtered.filter((r) => r.status === "pending");
    if (view === "approved") return filtered.filter((r) => r.status === "approved");
    if (view === "rejected") return filtered.filter((r) => r.status === "rejected");
    return filtered;
  }, [filtered, view]);

  const recent = useMemo(
    () => [...items].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 5),
    [items]
  );

  async function setStatus(id: string, status: RegistrationStatus) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const { registration } = await res.json();
        setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...registration } : r)));
        setFiltered((prev) => prev.map((r) => (r.id === id ? { ...r, ...registration } : r)));
      }
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

        {view === "dashboard" && (
          <div className="mt-6 flex flex-col gap-6">
            <DashboardStats registrations={items} />
            <RegistrationChart registrations={items} />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#F7F2F6]/60">Recent Registrations</h3>
              <div className="mt-4">
                <RegistrationList registrations={recent} busyId={busyId} onSetStatus={setStatus} />
              </div>
            </div>
          </div>
        )}

        {view === "analytics" && (
          <div className="mt-6">
            <RegistrationChart registrations={items} />
          </div>
        )}

        {(view === "participants" || view === "pending" || view === "approved" || view === "rejected") && (
          <div className="mt-6 flex flex-col gap-6">
            <FilterPanel registrations={items} onFilterChange={setFiltered} />
            <RegistrationList registrations={statusFilteredForView} busyId={busyId} onSetStatus={setStatus} />
          </div>
        )}
      </div>
    </div>
  );
}
