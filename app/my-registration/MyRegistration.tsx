"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Crown, Users } from "lucide-react";
import { TEAM_MAX_MEMBERS, TEAM_MIN_MEMBERS_LIMIT, TEAM_NAME_MAX } from "@/lib/teams/constants";
import type { MyRegistrationView } from "@/lib/teams/types";
import { TOKEN_STORAGE_KEY } from "../register/TeamForms";

type Result<T> = { ok: true; data: T } | { ok: false; error: string; status: number };

async function api<T>(token: string, url: string, init?: RequestInit): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, ...(init?.body ? { "Content-Type": "application/json" } : {}) },
    });
    const body = await res.json().catch(() => null);
    if (res.ok) return { ok: true, data: body as T };
    return { ok: false, error: body?.error ?? "Something went wrong.", status: res.status };
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again.", status: 0 };
  }
}

const card = "rounded-2xl border-2 border-white/20 bg-[#151515]/90 p-5 shadow-[6px_6px_0px_#7484FE] sm:p-8";
const inputClass =
  "mt-2 w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-[#F7F2F6] outline-none transition focus:border-[#7484FE]";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70";
const primaryBtn =
  "press inline-flex items-center justify-center gap-2 rounded-xl bg-[#33FF67] px-5 py-3 text-sm font-black text-[#2A2A2A] transition-all hover:bg-[#5aff87] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryBtn =
  "press inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-[#151515] px-5 py-3 text-sm font-black text-[#F7F2F6] transition-all hover:border-[#33FF67] hover:text-[#33FF67] disabled:cursor-not-allowed disabled:opacity-50";
const dangerBtn =
  "press inline-flex items-center justify-center gap-2 rounded-xl border-2 border-red-400/60 bg-transparent px-5 py-3 text-sm font-black text-red-300 transition-all hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-[#7484FE] text-[#2A2A2A]",
  approved: "bg-[#33FF67] text-[#2A2A2A]",
  rejected: "bg-red-400 text-[#2A2A2A]",
};

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function MyRegistration() {
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<MyRegistrationView | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "no-link" | "bad-link">("loading");

  const load = useCallback(async (t: string) => {
    const res = await api<MyRegistrationView>(t, "/api/my-registration");
    if (res.ok) {
      setView(res.data);
      setState("ready");
    } else if (res.status === 401) {
      try {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } catch {}
      setState("bad-link");
    } else {
      setState("bad-link");
    }
  }, []);

  useEffect(() => {
    // The private token arrives in the URL fragment (#token=...). Keep it on this
    // device, then clear it from the address bar so it isn't shared by accident.
    const init = () => {
      const fromHash = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("token");
      let t = fromHash;
      if (fromHash) {
        try {
          localStorage.setItem(TOKEN_STORAGE_KEY, fromHash);
        } catch {}
        history.replaceState(null, "", window.location.pathname);
      } else {
        t = readStoredToken();
      }
      if (!t) {
        setState("no-link");
        return;
      }
      setToken(t);
      load(t);
    };
    // Deferred one tick: it reads browser-only state, then starts the fetch.
    const timer = setTimeout(init, 0);
    // Opening a link while already on this page only changes the hash.
    const onHash = () => {
      if (window.location.hash.includes("token=")) init();
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", onHash);
    };
  }, [load]);

  function forget() {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {}
    setToken(null);
    setView(null);
    setState("no-link");
  }

  if (state === "loading") return <p className="text-[#F7F2F6]/70">Loading…</p>;
  if (state === "no-link" || state === "bad-link" || !token || !view) {
    return <FindMyRegistration expired={state === "bad-link"} />;
  }

  return <Ready token={token} view={view} onChange={setView} onForget={forget} reload={() => load(token)} />;
}

/* ------------------------------------------------------------------ */

function Ready({
  token,
  view,
  onChange,
  onForget,
  reload,
}: {
  token: string;
  view: MyRegistrationView;
  onChange: (v: MyRegistrationView) => void;
  onForget: () => void;
  reload: () => void;
}) {
  const { registration: reg, team, isLeader } = view;
  const [confirm, setConfirm] = useState<null | { kind: "leave" } | { kind: "delete" } | { kind: "remove"; id: string; name: string }>(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const approved = reg.status === "approved";

  async function run(fn: () => Promise<Result<MyRegistrationView>>) {
    setBusy(true);
    setError(null);
    const res = await fn();
    setBusy(false);
    setConfirm(null);
    if (res.ok) onChange(res.data);
    else {
      setError(res.error);
      reload(); // the team may have changed under us
    }
  }

  const leave = () => run(() => api(token, "/api/my-registration/leave", { method: "POST" }));
  const destroy = () => run(() => api(token, "/api/my-registration/team", { method: "DELETE" }));
  const remove = (id: string) => run(() => api(token, `/api/my-registration/team/members/${id}`, { method: "DELETE" }));

  return (
    <div className="space-y-5">
      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="heading break-words text-2xl font-black sm:text-4xl">Hi, {reg.name.split(" ")[0]}</h1>
          <span className={`rounded-full px-3 py-1 font-mono text-[11px] font-black uppercase ${STATUS_STYLE[reg.status]}`}>
            {reg.status}
          </span>
        </div>
        <p className="mt-2 font-mono text-sm font-bold text-[#33FF67]">
          {reg.teamNumber} · {reg.confirmationNumber}
        </p>
        <p className="mt-3 text-sm text-[#F7F2F6]/70">
          {reg.status === "pending" && "Your payment is being verified by the organisers. You'll get an email once it's approved."}
          {reg.status === "approved" && "You're confirmed for Equinox 2026. See you there!"}
          {reg.status === "rejected" &&
            `Your registration was rejected${reg.adminNote ? `: ${reg.adminNote}` : "."} You can register again from the register page.`}
        </p>
      </div>

      {team ? (
        <div className={card}>
          <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-[#33FF67]">My Team</p>

          {editing ? (
            <EditTeamForm
              token={token}
              team={team}
              onCancel={() => setEditing(false)}
              onSaved={(v) => {
                onChange(v);
                setEditing(false);
              }}
            />
          ) : (
            <>
              <h2 className="heading mt-2 break-words text-2xl font-black sm:text-3xl">{team.name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm text-[#F7F2F6]/80">
                  Team Code: <span className="font-black tracking-[0.15em] text-[#33FF67]">{team.code}</span>
                </span>
                <CopyButton text={team.code} label="Copy Team Code" className={`${secondaryBtn} !px-3 !py-1.5`} />
              </div>
            </>
          )}

          <h3 className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">
            <Users className="h-4 w-4" /> Members
          </h3>
          <ul className="mt-3 divide-y divide-white/10 rounded-xl border border-white/15 bg-black/20">
            {team.members.map((m) => (
              <li key={m.registrationId} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
                <span className="min-w-0 break-words font-bold">
                  {m.name}
                  {m.isYou && <span className="ml-2 text-xs font-bold text-[#7484FE]">(you)</span>}
                </span>
                <span className="flex flex-wrap items-center gap-3">
                  {m.status && (
                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-black uppercase ${STATUS_STYLE[m.status]}`}>
                      {m.status}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[11px] font-black uppercase ${
                      m.role === "leader" ? "bg-[#33FF67] text-[#2A2A2A]" : "border border-white/25 text-[#F7F2F6]/80"
                    }`}
                  >
                    {m.role === "leader" && <Crown className="h-3 w-3" />}
                    {m.role === "leader" ? "Team Leader" : "Member"}
                  </span>
                  {isLeader && m.role !== "leader" && m.status !== "approved" && (
                    <button
                      onClick={() => setConfirm({ kind: "remove", id: m.registrationId, name: m.name })}
                      disabled={busy}
                      className="text-sm font-bold text-red-300 underline disabled:opacity-50"
                    >
                      Remove Member
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-sm font-bold text-[#F7F2F6]/80">
            {team.memberCount} / {team.maxMembers} Members
          </p>
          {team.memberCount < team.maxMembers && (
            <p className="mt-1 text-sm text-[#F7F2F6]/60">
              Teammates join at <span className="font-bold">/register</span> with the team code and pay their own fee.
            </p>
          )}

          {confirm && (
            <div role="alertdialog" className="mt-6 rounded-xl border-2 border-red-400/50 bg-red-500/10 p-4">
              <p className="text-sm font-bold text-red-200">
                {confirm.kind === "leave" && "Leave this team? Your registration and payment stay valid; you just stop being on this team."}
                {confirm.kind === "delete" &&
                  "Delete this team? Everyone keeps their own registration, but the team, its name and its code are removed. This cannot be undone."}
                {confirm.kind === "remove" && `Remove ${confirm.name} from the team? Their registration stays valid.`}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  onClick={() => (confirm.kind === "leave" ? leave() : confirm.kind === "delete" ? destroy() : remove(confirm.id))}
                  disabled={busy}
                  className={dangerBtn}
                >
                  {busy ? "Working…" : "Yes, continue"}
                </button>
                <button onClick={() => setConfirm(null)} disabled={busy} className={secondaryBtn}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {isLeader ? (
              <>
                <button onClick={() => setEditing(true)} disabled={editing || busy} className={secondaryBtn}>
                  Edit Team
                </button>
                <button onClick={() => setConfirm({ kind: "delete" })} disabled={busy} className={dangerBtn}>
                  Delete Team
                </button>
              </>
            ) : (
              <button onClick={() => setConfirm({ kind: "leave" })} disabled={busy || approved} className={dangerBtn}>
                Leave Team
              </button>
            )}
          </div>
          {approved && !isLeader && (
            <p className="mt-2 text-xs text-[#F7F2F6]/50">Approved registrations can&apos;t leave a team. Contact the organisers.</p>
          )}
        </div>
      ) : (
        <div className={card}>
          <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-[#33FF67]">My Team</p>
          <p className="mt-2 text-sm text-[#F7F2F6]/70">
            You are not on a team. Your registration is still valid. To be on a team, ask a team leader for their code
            and{" "}
            <Link href="/register" className="font-bold text-[#33FF67] hover:underline">
              join from the register page
            </Link>
            .
          </p>
        </div>
      )}

      <button onClick={onForget} className="text-sm font-bold text-[#F7F2F6]/60 underline">
        Forget this registration on this device
      </button>
    </div>
  );
}

function CopyButton({ text, label, className }: { text: string; label: string; className: string }) {
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
    <button type="button" onClick={copy} className={className}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function EditTeamForm({
  token,
  team,
  onCancel,
  onSaved,
}: {
  token: string;
  team: NonNullable<MyRegistrationView["team"]>;
  onCancel: () => void;
  onSaved: (v: MyRegistrationView) => void;
}) {
  const [name, setName] = useState(team.name);
  const [maxMembers, setMaxMembers] = useState(team.maxMembers);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // A team can't be shrunk below the people already in it.
  const sizes = Array.from(
    { length: TEAM_MAX_MEMBERS - TEAM_MIN_MEMBERS_LIMIT + 1 },
    (_, i) => TEAM_MIN_MEMBERS_LIMIT + i
  ).filter((n) => n >= team.memberCount);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await api<MyRegistrationView>(token, "/api/my-registration/team", {
      method: "PATCH",
      body: JSON.stringify({ name, maxMembers }),
    });
    if (res.ok) onSaved(res.data);
    else {
      setError(res.error);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3">
      <label htmlFor="edit-team-name" className={labelClass}>
        Team Name
      </label>
      <input
        id="edit-team-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={TEAM_NAME_MAX}
        autoComplete="off"
        className={inputClass}
      />
      <label htmlFor="edit-team-size" className={`${labelClass} mt-4`}>
        Maximum Members
      </label>
      <select id="edit-team-size" value={maxMembers} onChange={(e) => setMaxMembers(Number(e.target.value))} className={inputClass}>
        {sizes.map((n) => (
          <option key={n} value={n} className="bg-[#151515]">
            {n}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="submit" disabled={busy || name.trim().length < 3} className={primaryBtn}>
          {busy ? "Saving…" : "Save Changes"}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={secondaryBtn}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* No / lost link                                                      */
/* ------------------------------------------------------------------ */

function FindMyRegistration({ expired }: { expired: boolean }) {
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/registration-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, confirmationNumber: confirmation }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok) setDone(body?.message ?? "Check your email for a new link.");
      else setError(body?.error ?? "Something went wrong.");
    } catch {
      setError("Network error. Check your connection and try again.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} noValidate className={card}>
      <h1 className="heading text-2xl font-black sm:text-3xl">Find my registration</h1>
      <p className="mt-2 text-sm text-[#F7F2F6]/70">
        {expired
          ? "This link isn't valid any more (a newer link may have replaced it). "
          : "Open the private link from your confirmation email, or get a new one here. "}
        Enter the email you registered with and your confirmation number (like CNF-1A2B3C).
      </p>

      {done ? (
        <p role="status" className="mt-6 rounded-xl border border-[#33FF67]/50 bg-[#33FF67]/10 p-4 text-sm">
          {done}
        </p>
      ) : (
        <>
          <label htmlFor="find-email" className={`${labelClass} mt-6`}>
            Email
          </label>
          <input id="find-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className={inputClass} />
          <label htmlFor="find-conf" className={`${labelClass} mt-5`}>
            Confirmation number
          </label>
          <input
            id="find-conf"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="CNF-1A2B3C"
            autoComplete="off"
            required
            className={`${inputClass} font-mono uppercase`}
          />
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-400">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy || !email || !confirmation} className={`${primaryBtn} mt-6 w-full`}>
            {busy ? "Sending…" : "Email me a new link"}
          </button>
        </>
      )}

      <p className="mt-5 text-center text-sm text-[#F7F2F6]/70">
        New here?{" "}
        <Link href="/register" className="font-bold text-[#33FF67] hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
