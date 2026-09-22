"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { REGISTRATION_FEE } from "@/lib/registration/constants";
import { emptyParticipant, type Participant } from "@/lib/registration/types";
import { isParticipantValid, validateParticipant } from "@/lib/registration/validation";
import { TEAM_NAME_MAX } from "@/lib/teams/constants";
import { validateTeamName } from "@/lib/teams/validation";
import type { TeamSearchResult } from "@/lib/teams/types";
import { currency, FileField, filterTouchedErrors, ParticipantFields, TextField } from "./RegisterForm";

export const TOKEN_STORAGE_KEY = "equinox_registration_token";

const card = "rounded-2xl border border-white/15 bg-black/20 p-6";
const primary =
  "press w-full rounded-xl bg-[#33FF67] px-6 py-4 text-lg font-black text-[#2A2A2A] shadow-md transition-all hover:scale-[1.01] hover:bg-[#5aff87] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto";
const secondary =
  "press inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-[#151515] px-4 py-2 text-sm font-black text-[#F7F2F6] transition-all hover:border-[#33FF67] hover:text-[#33FF67]";

/* ------------------------------------------------------------------ */
/* One person: their details + their own payment                       */
/* ------------------------------------------------------------------ */

function usePersonRegistration() {
  const [participant, setParticipant] = useState<Participant>(emptyParticipant());
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [utr, setUtr] = useState("");
  const [attempted, setAttempted] = useState(false);

  const utrValid = utr.trim().length >= 6;
  const valid = isParticipantValid(participant) && screenshot !== null && utrValid;
  const errors = attempted
    ? validateParticipant(participant)
    : filterTouchedErrors(validateParticipant(participant), touched, 0);

  function toFormData(extra: Record<string, string>): FormData {
    const body = new FormData();
    body.set("participant", JSON.stringify(participant));
    body.set("utrNumber", utr.trim());
    body.set("paymentScreenshot", screenshot as File);
    for (const [k, v] of Object.entries(extra)) body.set(k, v);
    return body;
  }

  return {
    participant,
    update: (patch: Partial<Participant>) => setParticipant((p) => ({ ...p, ...patch })),
    touch: (field: string) => setTouched((t) => new Set(t).add(`0.${field}`)),
    errors,
    screenshot,
    setScreenshot,
    utr,
    setUtr,
    utrValid,
    attempted,
    setAttempted,
    valid,
    toFormData,
  };
}

type Person = ReturnType<typeof usePersonRegistration>;

function PersonAndPayment({ f }: { f: Person }) {
  const upiId = process.env.NEXT_PUBLIC_UPI_ID;
  const payeeName = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "Equinox 2026";
  const upiLink = useMemo(() => {
    if (!upiId) return null;
    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      am: String(REGISTRATION_FEE),
      cu: "INR",
      tn: "Equinox 2026 Registration",
    });
    return `upi://pay?${params.toString()}`;
  }, [upiId, payeeName]);

  return (
    <>
      <ParticipantFields
        index={0}
        title="Your details"
        participant={f.participant}
        errors={f.errors}
        onChange={f.update}
        onBlurField={f.touch}
      />

      <section className={card}>
        <h3 className="heading text-xl font-black">Your payment</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm text-[#F7F2F6]/70">You pay:</span>
          <span className="text-2xl font-black text-[#33FF67]">{currency(REGISTRATION_FEE)}</span>
          <span className="text-sm text-[#F7F2F6]/50">(each teammate pays their own)</span>
        </div>

        <div className="mt-6 grid gap-8 sm:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-40 items-center justify-center rounded-2xl border border-white/20 bg-white p-3">
              {upiLink ? (
                <QRCodeSVG value={upiLink} size={140} />
              ) : (
                <span className="text-center text-xs font-bold text-[#2A2A2A]/60">
                  QR code will appear here once payment details are configured
                </span>
              )}
            </div>
            <p className="max-w-[10rem] text-center text-xs text-[#F7F2F6]/60">
              Scan the QR code and pay {currency(REGISTRATION_FEE)}.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <FileField
              label="Upload Payment Screenshot"
              required
              file={f.screenshot}
              onChange={f.setScreenshot}
              error={f.attempted && !f.screenshot ? "Payment screenshot is required." : undefined}
            />
            <TextField
              label="UTR / Transaction Number"
              required
              value={f.utr}
              onChange={f.setUtr}
              error={f.attempted && !f.utrValid ? "Enter a valid UTR / transaction number." : undefined}
              placeholder="e.g. 402812345678"
            />
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Success screen                                                      */
/* ------------------------------------------------------------------ */

type Done = {
  confirmationNumber: string;
  accessToken: string;
  team: { name: string; code?: string };
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button type="button" onClick={copy} className={secondary}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function SuccessCard({ done, kind }: { done: Done; kind: "create" | "join" }) {
  const link = `${typeof window === "undefined" ? "" : window.location.origin}/my-registration#token=${done.accessToken}`;
  return (
    <div className="rounded-3xl border-2 border-[#33FF67]/50 bg-[#33FF67]/10 p-6 text-left sm:p-10">
      <p className="text-xs font-black uppercase tracking-wider text-[#33FF67]">Success</p>
      <h3 className="heading mt-3 text-2xl font-black">
        {kind === "create" ? "Team Created Successfully!" : `You joined ${done.team.name}`}
      </h3>
      <p className="mt-3 text-[#F7F2F6]/85">
        Your registration and payment proof were received. The organisers verify it and email you once it is approved.
      </p>

      {kind === "create" && done.team.code && (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">Team Name</p>
          <p className="text-xl font-black">{done.team.name}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">Team Code</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span className="font-mono text-3xl font-black tracking-[0.2em] text-[#33FF67]">{done.team.code}</span>
            <CopyButton text={done.team.code} label="Copy" />
          </div>
          <p className="mt-3 text-sm text-[#F7F2F6]/80">
            Share this code (or the team name) with your teammates. They join on this page and pay their own{" "}
            {currency(REGISTRATION_FEE)}.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-1 font-mono text-sm text-[#F7F2F6]/70">
        <p>
          Confirmation Number: <span className="text-[#33FF67]">{done.confirmationNumber}</span>
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/15 bg-black/20 p-4">
        <p className="text-sm font-bold">Your private link</p>
        <p className="mt-1 text-sm text-[#F7F2F6]/70">
          {kind === "create"
            ? "Use it to see your status and to manage the team (edit, remove members, delete). "
            : "Use it to see your status or leave the team. "}
          We also emailed it to you. Keep it private: anyone with it can act as you.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <CopyButton text={link} label="Copy my link" />
          <Link href={`/my-registration#token=${done.accessToken}`} className={secondary}>
            Open my registration
          </Link>
        </div>
      </div>
    </div>
  );
}

async function post(url: string, body: FormData): Promise<{ ok: true; data: Done } | { ok: false; error: string }> {
  try {
    const res = await fetch(url, { method: "POST", body });
    const data = await res.json().catch(() => null);
    if (res.ok) {
      try {
        localStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
      } catch {
        // Storage can be blocked (private mode); the link still works.
      }
      return { ok: true, data };
    }
    return { ok: false, error: data?.error ?? "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "Network error. Please check your connection and try again." };
  }
}

/* ------------------------------------------------------------------ */
/* Create a team                                                       */
/* ------------------------------------------------------------------ */

export function CreateTeam() {
  const f = usePersonRegistration();
  const [teamName, setTeamName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const lock = useRef(false);

  const nameError = teamName.length > 0 ? validateTeamName(teamName) : null;
  const canSubmit = f.valid && teamName.trim().length > 0 && !validateTeamName(teamName);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    f.setAttempted(true);
    setError(null);
    if (!canSubmit || lock.current) return;
    lock.current = true;
    setSubmitting(true);
    const res = await post("/api/team-registration/create", f.toFormData({ teamName }));
    if (res.ok) setDone(res.data);
    else {
      setError(res.error);
      lock.current = false;
      setSubmitting(false);
    }
  }

  if (done) return <SuccessCard done={done} kind="create" />;

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <section className={card}>
        <h3 className="heading text-xl font-black">Create Your Team</h3>
        <p className="mt-2 text-sm text-[#F7F2F6]/70">
          You register and pay for yourself first. That creates the team and its code. Then your teammates join with the
          code and each pay their own fee.
        </p>
        <div className="mt-5">
          <TextField
            label="Team Name"
            required
            value={teamName}
            onChange={(v) => setTeamName(v.slice(0, TEAM_NAME_MAX))}
            error={nameError ?? (f.attempted && !teamName.trim() ? "Enter a team name." : undefined)}
            placeholder="Code Crusaders"
          />
        </div>
      </section>

      <PersonAndPayment f={f} />

      {error && (
        <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}
      <button type="submit" disabled={!canSubmit || submitting} className={primary}>
        {submitting ? "Submitting..." : `Create Team & Pay (${currency(REGISTRATION_FEE)})`}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Join a team                                                         */
/* ------------------------------------------------------------------ */

export function JoinTeam() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TeamSearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamSearchResult | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    setSearchError(null);
    setResults(null);
    try {
      const res = await fetch(`/api/team-registration/search?q=${encodeURIComponent(query.trim())}`);
      const body = await res.json().catch(() => null);
      if (res.ok) setResults(body.teams);
      else setSearchError(body?.error ?? "Something went wrong.");
    } catch {
      setSearchError("Network error. Check your connection and try again.");
    }
    setSearching(false);
  }

  if (team) return <JoinDetails team={team} onBack={() => setTeam(null)} />;

  return (
    <div className={card}>
      <h3 className="heading text-xl font-black">Join a Team</h3>
      <form onSubmit={search} className="mt-4">
        <TextField
          label="Enter Team Name or Team Code"
          value={query}
          onChange={setQuery}
          placeholder="Code Crusaders or CC7X29"
        />
        <button
          type="submit"
          disabled={searching || query.trim().length < 3}
          className={`${primary} mt-4 !py-3 !text-base`}
        >
          <Search className="mr-2 inline h-4 w-4" />
          {searching ? "Searching…" : "Search Team"}
        </button>
      </form>

      {searchError && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {searchError}
        </p>
      )}
      {results && results.length === 0 && (
        <p className="mt-4 rounded-xl border border-white/15 bg-black/20 p-4 text-sm text-[#F7F2F6]/80">
          No team found with that name or code. Check the spelling, or ask your team leader for the code.
        </p>
      )}
      {results && results.length > 0 && (
        <ul className="mt-4 space-y-3">
          {results.map((t) => (
            <li key={t.id} className="rounded-xl border border-white/20 bg-black/20 p-4">
              <p className="text-lg font-black">{t.name}</p>
              <p className="mt-1 text-sm text-[#F7F2F6]/70">Team Leader: {t.leaderName}</p>
              <p className="text-sm text-[#F7F2F6]/70">
                Members: {t.memberCount} / {t.maxMembers}
              </p>
              <button
                onClick={() => setTeam(t)}
                disabled={t.isFull}
                className={`${primary} mt-4 !py-3 !text-base`}
              >
                {t.isFull ? "Team Full" : "Join Team"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function JoinDetails({ team, onBack }: { team: TeamSearchResult; onBack: () => void }) {
  const f = usePersonRegistration();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const lock = useRef(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    f.setAttempted(true);
    setError(null);
    if (!f.valid || lock.current) return;
    lock.current = true;
    setSubmitting(true);
    const res = await post("/api/team-registration/join", f.toFormData({ teamId: team.id }));
    if (res.ok) setDone(res.data);
    else {
      setError(res.error);
      lock.current = false;
      setSubmitting(false);
    }
  }

  if (done) return <SuccessCard done={done} kind="join" />;

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <section className={card}>
        <p className="text-xs font-black uppercase tracking-wider text-[#7484FE]">Joining</p>
        <h3 className="heading mt-1 text-2xl font-black">{team.name}</h3>
        <p className="mt-1 text-sm text-[#F7F2F6]/70">
          Team Leader: {team.leaderName} · Members: {team.memberCount} / {team.maxMembers}
        </p>
        <button type="button" onClick={onBack} className="mt-3 text-sm font-bold text-[#F7F2F6]/70 underline">
          Choose a different team
        </button>
      </section>

      <PersonAndPayment f={f} />

      {error && (
        <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}
      <button type="submit" disabled={!f.valid || submitting} className={primary}>
        {submitting ? "Submitting..." : `Join Team & Pay (${currency(REGISTRATION_FEE)})`}
      </button>
    </form>
  );
}
