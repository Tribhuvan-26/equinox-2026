"use client";

import { useEffect, useRef, useState } from "react";
import { formatTeamNumber } from "@/lib/registration/team-number";
import type { RegistrationStatus } from "@/lib/registration/types";
import type { RegistrationWithUrls } from "../AdminDashboard";

function getPassBadge(r: { total_amount: number; admin_note: string | null }) {
  const note = r.admin_note ?? "";
  if (r.total_amount === 299 || note.includes("Single Pass")) {
    const isComedy = note.includes("Stand-Up Comedy");
    const isMusic = note.includes("Musical Night");
    const show = isComedy ? "Comedy" : isMusic ? "Music" : "";
    return {
      label: show ? `Single Pass (${show})` : "Single Pass",
      color: "bg-[#7484FE]/20 text-[#7484FE] border border-[#7484FE]/30",
    };
  }
  if (r.total_amount === 499 || note.includes("Combo Pass")) {
    return {
      label: "Combo Pass",
      color: "bg-[#FFBE33]/20 text-[#FFBE33] border border-[#FFBE33]/30",
    };
  }
  if (r.total_amount === 569 || note.includes("Entertainment Pass") || note.includes("IPL Pass")) {
    return {
      label: "Entertainment Pass",
      color: "bg-[#33FF67]/20 text-[#33FF67] border border-[#33FF67]/30",
    };
  }
  return {
    label: "Summit Pass",
    color: "bg-white/10 text-[#F7F2F6] border border-white/20",
  };
}

export function RegistrationList({
  registrations,
  busyId,
  onSetStatus,
  onSetTeamStatus,
  teamCounts,
}: {
  registrations: RegistrationWithUrls[];
  busyId: string | null;
  onSetStatus: (id: string, status: RegistrationStatus) => void;
  onSetTeamStatus: (teamId: string, status: RegistrationStatus) => void;
  teamCounts: Map<string, { total: number; unapproved: number }>;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (registrations.length === 0) {
    return <p className="text-[#F7F2F6]/60">No registrations in this view.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {registrations.map((r) => {
        const team = r.team_id ? teamCounts.get(r.team_id) : undefined;
        const teamBusy = r.team_id !== null && busyId === r.team_id;
        return (
        <div key={r.id} className="rounded-2xl border border-white/15 bg-black/20 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm font-bold text-[#33FF67]">
                {formatTeamNumber(r.team_seq)} · {r.confirmation_number}
              </p>
              <p className="mt-1 text-sm text-[#F7F2F6]/70">
                Submitted {new Date(r.created_at).toLocaleString("en-IN")}
              </p>
              {r.teamName && (
                <p className="mt-1 text-sm font-bold text-[#7484FE]">
                  Team: {r.teamName}
                  {r.team_role ? ` · ${r.team_role === "leader" ? "Leader" : "Member"}` : ""}
                </p>
              )}
              {r.requestedTeamName && (
                <p className="mt-1 text-sm font-bold text-yellow-400">Wants to join: {r.requestedTeamName}</p>
              )}
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
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm">
                  Total: <span className="font-black text-[#33FF67]">₹{r.total_amount.toLocaleString("en-IN")}</span>
                </span>
                {(() => {
                  const pass = getPassBadge(r);
                  return (
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${pass.color}`}>
                      {pass.label}
                    </span>
                  );
                })()}
              </div>
              <p className="text-sm">UTR / Txn No: <span className="font-mono">{r.utr_number}</span></p>
              {r.screenshotUrl && (
                <button type="button" onClick={() => setPreviewUrl(r.screenshotUrl)} className="mt-3 block w-fit">
                  {isPdf(r.screenshotUrl) ? (
                    <span className="flex h-32 w-24 items-center justify-center rounded-lg border border-white/15 text-sm font-black text-[#F7F2F6]/80 transition hover:border-[#7484FE]">
                      PDF
                    </span>
                  ) : (
                    <img
                      src={r.screenshotUrl}
                      alt="Payment screenshot"
                      loading="lazy"
                      decoding="async"
                      className="h-32 w-auto rounded-lg border border-white/15 object-contain transition hover:border-[#7484FE]"
                    />
                  )}
                </button>
              )}
              <div className="mt-3 flex flex-wrap gap-3">
                {r.utrProofUrl && (
                  <button type="button" onClick={() => setPreviewUrl(r.utrProofUrl)} className="text-sm text-[#7484FE] underline">
                    View UTR proof
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {/* Decided either way: no buttons. Undoing a decision is done by hand. */}
            {r.status === "pending" && (
              <>
            <button
              disabled={busyId === r.id || teamBusy}
              onClick={() => onSetStatus(r.id, "approved")}
              className="rounded-lg bg-[#33FF67] px-4 py-2 text-sm font-black text-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Approve
            </button>
            <button
              disabled={busyId === r.id || teamBusy}
              onClick={() => onSetStatus(r.id, "rejected")}
              className="rounded-lg border border-red-400/60 px-4 py-2 text-sm font-black text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Mark Not Approved
            </button>
              </>
            )}

            {r.team_id && team && team.total > 1 && team.unapproved > 0 && (
              <button
                disabled={busyId !== null}
                onClick={() => {
                  if (
                    confirm(
                      `Approve all ${team.total} registrations on "${r.teamName ?? "this team"}"? ` +
                        `${team.unapproved} still need approving, and each one gets a confirmation email.`
                    )
                  ) {
                    onSetTeamStatus(r.team_id!, "approved");
                  }
                }}
                className="rounded-lg border-2 border-[#33FF67] px-4 py-2 text-sm font-black text-[#33FF67] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {teamBusy ? "Approving team..." : `Approve whole team (${team.unapproved} of ${team.total})`}
              </button>
            )}
          </div>
        </div>
        );
      })}

      {previewUrl && (
        <div
          onClick={() => setPreviewUrl(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-6"
        >
          {isPdf(previewUrl) ? (
            <PdfPreview url={previewUrl} />
          ) : (
            <img
              src={previewUrl}
              alt="Payment screenshot preview"
              className="max-h-[85vh] max-w-[90vw] rounded-lg border border-white/20 object-contain"
            />
          )}
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

/** Signed URLs keep the stored path, which ends in the upload's extension. */
function isPdf(url: string) {
  return new URL(url).pathname.toLowerCase().endsWith(".pdf");
}

/**
 * Draws each PDF page onto a canvas with pdf.js. An iframe would rely on the
 * browser's own PDF viewer, which shows blank in some browsers and all of mobile Chrome.
 */
function PdfPreview({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      const pdf = await pdfjs.getDocument({ url }).promise;
      for (let n = 1; n <= pdf.numPages && !cancelled; n++) {
        const page = await pdf.getPage(n);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.className = "w-full rounded-lg";
        await page.render({ canvas, viewport }).promise;
        if (!cancelled) ref.current?.appendChild(canvas);
      }
    })().catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className="flex max-h-[85vh] w-[90vw] max-w-2xl flex-col gap-4 overflow-y-auto rounded-lg border border-white/20"
    >
      {error && (
        <a href={url} target="_blank" rel="noreferrer" className="p-6 text-[#7484FE] underline">
          Could not render PDF — open it in a new tab
        </a>
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
    rejected: "Not Approved",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
