"use client";

import { useMemo, useState } from "react";
import type { RegistrationRecord, RegistrationStatus } from "@/lib/registration/types";

export interface RegistrationWithUrls extends RegistrationRecord {
  screenshotUrl: string | null;
  utrProofUrl: string | null;
}

const TABS: { key: RegistrationStatus | "all"; label: string }[] = [
  { key: "pending", label: "Pending Verification" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

export function AdminDashboard({ registrations }: { registrations: RegistrationWithUrls[] }) {
  const [items, setItems] = useState(registrations);
  const [tab, setTab] = useState<RegistrationStatus | "all">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (tab === "all" ? items : items.filter((r) => r.status === tab)),
    [items, tab]
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
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-all ${
              tab === t.key
                ? "border-[#33FF67] bg-[#33FF67]/10 text-[#33FF67]"
                : "border-white/20 text-[#F7F2F6]/70 hover:border-white/40"
            }`}
          >
            {t.label} ({t.key === "all" ? items.length : items.filter((r) => r.status === t.key).length})
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {filtered.length === 0 && (
          <p className="text-[#F7F2F6]/60">No registrations in this view.</p>
        )}

        {filtered.map((r) => (
          <div key={r.id} className="rounded-2xl border border-white/15 bg-black/20 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-[#F7F2F6]/50">{r.id}</p>
                <p className="mt-1 text-sm text-[#F7F2F6]/70">
                  Submitted {new Date(r.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/50">
                  Participants ({r.participant_count})
                </p>
                <ul className="mt-2 flex flex-col gap-2">
                  {r.participants.map((p, i) => (
                    <li key={i} className="rounded-lg bg-white/5 p-3 text-sm">
                      <p className="font-bold">{p.name} — {p.rollNumber}</p>
                      <p className="text-[#F7F2F6]/70">
                        {p.college} · {p.department}
                      </p>
                      <p className="text-[#F7F2F6]/70">{p.mobile} · {p.email}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/50">Payment</p>
                <p className="mt-2 text-sm">
                  Total: <span className="font-black text-[#33FF67]">₹{r.total_amount.toLocaleString("en-IN")}</span>
                </p>
                <p className="text-sm">UTR / Txn No: <span className="font-mono">{r.utr_number}</span></p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {r.screenshotUrl && (
                    <a href={r.screenshotUrl} target="_blank" rel="noreferrer" className="text-sm text-[#7484FE] underline">
                      View payment screenshot
                    </a>
                  )}
                  {r.utrProofUrl && (
                    <a href={r.utrProofUrl} target="_blank" rel="noreferrer" className="text-sm text-[#7484FE] underline">
                      View UTR proof
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                disabled={busyId === r.id || r.status === "approved"}
                onClick={() => setStatus(r.id, "approved")}
                className="rounded-lg bg-[#33FF67] px-4 py-2 text-sm font-black text-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Approve
              </button>
              <button
                disabled={busyId === r.id || r.status === "rejected"}
                onClick={() => setStatus(r.id, "rejected")}
                className="rounded-lg border border-red-400/60 px-4 py-2 text-sm font-black text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: RegistrationStatus }) {
  const styles: Record<RegistrationStatus, string> = {
    pending: "bg-yellow-400/10 text-yellow-300 border-yellow-400/40",
    approved: "bg-[#33FF67]/10 text-[#33FF67] border-[#33FF67]/40",
    rejected: "bg-red-500/10 text-red-400 border-red-500/40",
  };
  const labels: Record<RegistrationStatus, string> = {
    pending: "Pending Verification",
    approved: "Approved",
    rejected: "Rejected",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
