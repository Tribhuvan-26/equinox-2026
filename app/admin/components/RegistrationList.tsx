"use client";

import { useState } from "react";
import type { RegistrationStatus } from "@/lib/registration/types";
import type { RegistrationWithUrls } from "../AdminDashboard";

export function RegistrationList({
  registrations,
  busyId,
  onSetStatus,
}: {
  registrations: RegistrationWithUrls[];
  busyId: string | null;
  onSetStatus: (id: string, status: RegistrationStatus) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (registrations.length === 0) {
    return <p className="text-[#F7F2F6]/60">No registrations in this view.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {registrations.map((r) => (
        <div key={r.id} className="rounded-2xl border border-white/15 bg-black/20 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm font-bold text-[#33FF67]">
                {`EQ-${String(r.team_seq).padStart(3, "0")}`} · {r.confirmation_number}
              </p>
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
              {r.screenshotUrl && (
                <button type="button" onClick={() => setPreviewUrl(r.screenshotUrl)} className="mt-3 block w-fit">
                  <img
                    src={r.screenshotUrl}
                    alt="Payment screenshot"
                    className="h-32 w-auto rounded-lg border border-white/15 object-contain transition hover:border-[#7484FE]"
                  />
                </button>
              )}
              <div className="mt-3 flex flex-wrap gap-3">
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
              onClick={() => onSetStatus(r.id, "approved")}
              className="rounded-lg bg-[#33FF67] px-4 py-2 text-sm font-black text-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Approve
            </button>
            <button
              disabled={busyId === r.id || r.status === "rejected"}
              onClick={() => onSetStatus(r.id, "rejected")}
              className="rounded-lg border border-red-400/60 px-4 py-2 text-sm font-black text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      {previewUrl && (
        <div
          onClick={() => setPreviewUrl(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-6"
        >
          <img
            src={previewUrl}
            alt="Payment screenshot preview"
            className="max-h-[85vh] max-w-[90vw] rounded-lg border border-white/20 object-contain"
          />
          <button
            type="button"
            onClick={() => setPreviewUrl(null)}
            className="absolute top-4 right-4 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-sm font-bold text-[#F7F2F6] hover:bg-black/60"
          >
            Close
          </button>
        </div>
      )}
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
