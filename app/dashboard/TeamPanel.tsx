"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, Crown, Search, Users } from "lucide-react";
import { MIN_TEAM_SIZE } from "@/lib/registration/constants";
import { TEAM_MAX_MEMBERS, TEAM_MIN_MEMBERS_LIMIT, TEAM_NAME_MAX } from "@/lib/teams/constants";
import type { TeamSearchResult, TeamView } from "@/lib/teams/types";

type Result<T> = { ok: true; data: T } | { ok: false; error: string; field?: string };

// Every mutation goes through the API; the server re-checks all permissions.
async function call<T>(url: string, init?: RequestInit): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    });
    const body = await res.json().catch(() => null);
    if (res.ok) return { ok: true, data: body as T };
    return { ok: false, error: body?.error ?? "Something went wrong.", field: body?.field };
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again." };
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

const MIN_TO_REGISTER = MIN_TEAM_SIZE;

export function TeamPanel({ initialTeam, canManage }: { initialTeam: TeamView | null; canManage: boolean }) {
  const [team, setTeam] = useState<TeamView | null>(initialTeam);
  const [justCreated, setJustCreated] = useState(false);

  if (team) {
    return (
      <TeamDashboard
        team={team}
        justCreated={justCreated}
        onDismissCreated={() => setJustCreated(false)}
        onChange={setTeam}
        onGone={() => {
          setTeam(null);
          setJustCreated(false);
        }}
      />
    );
  }

  return (
    <NoTeam
      onCreated={(t) => {
        setTeam(t);
        setJustCreated(true);
      }}
      onJoined={setTeam}
      canManage={canManage}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Copy button                                                         */
/* ------------------------------------------------------------------ */

function CopyCodeButton({ code, className }: { code: string; className: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard API can be unavailable (insecure context / denied); fall back.
      const el = document.createElement("textarea");
      el.value = code;
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
    <button type="button" onClick={copy} className={className} aria-label="Copy team code">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span>{copied ? "Copied!" : "Copy Team Code"}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* No team yet: create or join                                         */
/* ------------------------------------------------------------------ */

function NoTeam({
  onCreated,
  onJoined,
  canManage,
}: {
  onCreated: (t: TeamView) => void;
  onJoined: (t: TeamView) => void;
  canManage: boolean;
}) {
  const [tab, setTab] = useState<"create" | "join">("create");

  return (
    <div className={card}>
      <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-[#33FF67]">My Team</p>
      <h2 className="heading mt-2 text-2xl font-black sm:text-3xl">You are not in a team yet</h2>
      <p className="mt-2 text-sm text-[#F7F2F6]/70">
        Create a team and share its code, or join a team with its name or code. Your team works across every Equinox
        event.
      </p>

      <div role="tablist" className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-white/15 bg-black/20 p-1">
        {(["create", "join"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-2.5 text-sm font-black transition ${
              tab === t ? "bg-[#7484FE] text-[#2A2A2A]" : "text-[#F7F2F6]/80 hover:bg-white/10"
            }`}
          >
            {t === "create" ? "Create Team" : "Join Team"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {!canManage && (
          <p className="mb-4 text-sm text-[#7484FE]">Verify your email (see above) to create or join a team.</p>
        )}
        {tab === "create" ? (
          <CreateTeamForm onCreated={onCreated} disabled={!canManage} />
        ) : (
          <JoinTeamForm onJoined={onJoined} disabled={!canManage} />
        )}
      </div>
    </div>
  );
}

function CreateTeamForm({ onCreated, disabled }: { onCreated: (t: TeamView) => void; disabled: boolean }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await call<{ team: TeamView }>("/api/teams", { method: "POST", body: JSON.stringify({ name }) });
    if (res.ok) onCreated(res.data.team);
    else {
      setError(res.error);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <h3 className="text-lg font-black">Create Your Team</h3>
      <label htmlFor="team-name" className={`${labelClass} mt-4`}>
        Team Name
      </label>
      <input
        id="team-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={TEAM_NAME_MAX}
        placeholder="Code Crusaders"
        autoComplete="off"
        className={inputClass}
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <button type="submit" disabled={disabled || busy || name.trim().length < 3} className={`${primaryBtn} mt-5 w-full sm:w-auto`}>
        {busy ? "Creating…" : "Create Team"}
      </button>
    </form>
  );
}

function JoinTeamForm({ onJoined, disabled }: { onJoined: (t: TeamView) => void; disabled: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TeamSearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    setError(null);
    setResults(null);
    const res = await call<{ teams: TeamSearchResult[] }>(`/api/teams/search?q=${encodeURIComponent(query.trim())}`);
    if (res.ok) setResults(res.data.teams);
    else setError(res.error);
    setSearching(false);
  }

  async function join(teamId: string) {
    setJoiningId(teamId);
    setError(null);
    const res = await call<{ team: TeamView }>("/api/teams/join", {
      method: "POST",
      body: JSON.stringify({ teamId }),
    });
    if (res.ok) onJoined(res.data.team);
    else {
      setError(res.error);
      setJoiningId(null);
    }
  }

  return (
    <div>
      <form onSubmit={search}>
        <h3 className="text-lg font-black">Join a Team</h3>
        <label htmlFor="team-query" className={`${labelClass} mt-4`}>
          Enter Team Name or Team Code
        </label>
        <input
          id="team-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Code Crusaders or CC7X29"
          autoComplete="off"
          className={inputClass}
        />
        <button type="submit" disabled={searching || query.trim().length < 3} className={`${primaryBtn} mt-5 w-full sm:w-auto`}>
          <Search className="h-4 w-4" />
          {searching ? "Searching…" : "Search Team"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {results && results.length === 0 && (
        <p className="mt-4 rounded-xl border border-white/15 bg-black/20 p-4 text-sm text-[#F7F2F6]/80">
          No team found with that name or code. Check the spelling, or ask your team leader to share the code again.
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
                onClick={() => join(t.id)}
                disabled={disabled || t.isFull || t.isRegistered || joiningId !== null}
                className={`${primaryBtn} mt-4 w-full sm:w-auto`}
              >
                {t.isRegistered ? "Team Registered" : t.isFull ? "Team Full" : joiningId === t.id ? "Joining…" : "Join Team"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Team dashboard                                                      */
/* ------------------------------------------------------------------ */

type Confirm = { kind: "leave" } | { kind: "delete" } | { kind: "remove"; userId: string; name: string } | null;

function TeamDashboard({
  team,
  justCreated,
  onDismissCreated,
  onChange,
  onGone,
}: {
  team: TeamView;
  justCreated: boolean;
  onDismissCreated: () => void;
  onChange: (t: TeamView) => void;
  onGone: () => void;
}) {
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The team can change under us (leader deleted it, or removed this user).
  // Re-read it so the screen never shows stale data.
  async function resync() {
    const res = await call<{ team: TeamView | null }>("/api/teams/mine");
    if (!res.ok) return;
    if (res.data.team) onChange(res.data.team);
    else onGone();
  }

  async function run(action: () => Promise<Result<unknown>>, after?: () => void) {
    setBusy(true);
    setError(null);
    const res = await action();
    setBusy(false);
    setConfirm(null);
    if (res.ok) {
      after?.();
    } else {
      setError(res.error);
      await resync();
    }
  }

  const leave = () => run(() => call("/api/teams/leave", { method: "POST" }), onGone);
  const remove = (userId: string) =>
    run(
      () => call(`/api/teams/${team.id}/members/${userId}`, { method: "DELETE" }),
      () => onChange({ ...team, members: team.members.filter((m) => m.userId !== userId), memberCount: team.memberCount - 1 })
    );
  const destroy = () => run(() => call(`/api/teams/${team.id}`, { method: "DELETE" }), onGone);

  // A live registration freezes the roster (the server enforces this too).
  const locked = team.registration !== null && team.registration.status !== "rejected";

  return (
    <div className="space-y-5">
      {justCreated && (
        <div role="status" className="rounded-2xl border-2 border-[#33FF67]/60 bg-[#33FF67]/10 p-5 sm:p-6">
          <p className="text-lg font-black text-[#33FF67]">Team Created Successfully!</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">Team Name</p>
          <p className="text-xl font-black">{team.name}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">Team Code</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span className="font-mono text-3xl font-black tracking-[0.2em] text-[#33FF67]">{team.code}</span>
            <CopyCodeButton code={team.code} className={`${secondaryBtn} !px-4 !py-2`} />
          </div>
          <p className="mt-3 text-sm text-[#F7F2F6]/80">Share this code with your teammates.</p>
          <button onClick={onDismissCreated} className="mt-3 text-sm font-bold text-[#F7F2F6]/70 underline">
            Dismiss
          </button>
        </div>
      )}

      <div className={card}>
        <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-[#33FF67]">My Team</p>

        {editing ? (
          <EditTeamForm
            team={team}
            onCancel={() => setEditing(false)}
            onSaved={(t) => {
              onChange(t);
              setEditing(false);
            }}
          />
        ) : (
          <>
            <h2 className="heading mt-2 break-words text-2xl font-black sm:text-4xl">{team.name}</h2>
            <p className="mt-2 font-mono text-sm text-[#F7F2F6]/80">
              Team Code: <span className="font-black tracking-[0.15em] text-[#33FF67]">{team.code}</span>
            </p>
          </>
        )}

        <h3 className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">
          <Users className="h-4 w-4" /> Members
        </h3>
        <ul className="mt-3 divide-y divide-white/10 rounded-xl border border-white/15 bg-black/20">
          {team.members.map((m) => (
            <li key={m.userId} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
              <span className="min-w-0 break-words font-bold">{m.name}</span>
              <span className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[11px] font-black uppercase ${
                    m.role === "leader" ? "bg-[#33FF67] text-[#2A2A2A]" : "border border-white/25 text-[#F7F2F6]/80"
                  }`}
                >
                  {m.role === "leader" && <Crown className="h-3 w-3" />}
                  {m.role === "leader" ? "Team Leader" : "Member"}
                </span>
                {team.isLeader && m.role !== "leader" && !locked && (
                  <button
                    onClick={() => setConfirm({ kind: "remove", userId: m.userId, name: m.name })}
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

        {confirm && (
          <div role="alertdialog" className="mt-6 rounded-xl border-2 border-red-400/50 bg-red-500/10 p-4">
            <p className="text-sm font-bold text-red-200">
              {confirm.kind === "leave" && "Leave this team? You can join another team afterwards."}
              {confirm.kind === "delete" &&
                "Delete this team? All members are removed and the team name and code are released. This cannot be undone."}
              {confirm.kind === "remove" && `Remove ${confirm.name} from the team?`}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  confirm.kind === "leave" ? leave() : confirm.kind === "delete" ? destroy() : remove(confirm.userId)
                }
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

        <RegistrationStatus team={team} locked={locked} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <CopyCodeButton code={team.code} className={secondaryBtn} />
          {team.isLeader ? (
            <>
              <button onClick={() => setEditing(true)} disabled={editing || busy} className={secondaryBtn}>
                Edit Team
              </button>
              {!locked && (
                <button onClick={() => setConfirm({ kind: "delete" })} disabled={busy} className={dangerBtn}>
                  Delete Team
                </button>
              )}
            </>
          ) : (
            !locked && (
              <button onClick={() => setConfirm({ kind: "leave" })} disabled={busy} className={dangerBtn}>
                Leave Team
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-[#7484FE] text-[#2A2A2A]",
  approved: "bg-[#33FF67] text-[#2A2A2A]",
  rejected: "bg-red-400 text-[#2A2A2A]",
};

function RegistrationStatus({ team, locked }: { team: TeamView; locked: boolean }) {
  const reg = team.registration;
  const canRegister = team.isLeader && team.memberCount >= MIN_TO_REGISTER;

  return (
    <div className="mt-6 rounded-xl border border-white/15 bg-black/20 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">Event Registration</p>

      {reg ? (
        <>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 font-mono text-[11px] font-black uppercase ${STATUS_STYLE[reg.status]}`}
            >
              {reg.status}
            </span>
            <span className="font-mono text-sm font-bold text-[#33FF67]">
              {reg.teamNumber} · {reg.confirmationNumber}
            </span>
          </div>
          <p className="mt-2 text-sm text-[#F7F2F6]/70">
            {reg.status === "pending" && "Your payment is being verified by the organisers."}
            {reg.status === "approved" && `Confirmed for ${reg.participantCount} participants. See you at Equinox!`}
            {reg.status === "rejected" &&
              (team.isLeader
                ? "This registration was rejected. You can submit a new one."
                : "This registration was rejected. Your team leader can submit a new one.")}
          </p>
          {locked && (
            <p className="mt-2 text-xs text-[#F7F2F6]/50">The roster is locked while the registration is active.</p>
          )}
        </>
      ) : (
        <p className="mt-2 text-sm text-[#F7F2F6]/70">
          {team.isLeader
            ? canRegister
              ? "Your team is ready to register."
              : `Add ${MIN_TO_REGISTER - team.memberCount} more member${MIN_TO_REGISTER - team.memberCount === 1 ? "" : "s"} to register (minimum ${MIN_TO_REGISTER}).`
            : "Your team leader registers the team for the event."}
        </p>
      )}

      {team.isLeader && canRegister && (!reg || reg.status === "rejected") && (
        <Link href="/register" className={`${primaryBtn} mt-3 w-full sm:w-auto`}>
          Register Your Team
        </Link>
      )}
    </div>
  );
}

function EditTeamForm({
  team,
  onCancel,
  onSaved,
}: {
  team: TeamView;
  onCancel: () => void;
  onSaved: (t: TeamView) => void;
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
    const res = await call<{ team: TeamView }>(`/api/teams/${team.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name, maxMembers }),
    });
    if (res.ok) onSaved(res.data.team);
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
      <select
        id="edit-team-size"
        value={maxMembers}
        onChange={(e) => setMaxMembers(Number(e.target.value))}
        className={inputClass}
      >
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
