"use client";

import { useState } from "react";
import { Crown, Search, UserPlus } from "lucide-react";
import { TEAM_NAME_MAX } from "@/lib/teams/constants";
import type { MyRegistrationView, TeamSearchResult } from "@/lib/teams/types";
import { api, card, inputClass, labelClass, primaryBtn, secondaryBtn } from "./ui";

/**
 * What a paid person sees before they belong to a team: start one, ask to join
 * one, or wait for a leader to answer. Paying is already done by this point.
 */
export function NoTeam({
  token,
  requestedTeam,
  onChange,
}: {
  token: string;
  requestedTeam: MyRegistrationView["requestedTeam"];
  onChange: (v: MyRegistrationView) => void;
}) {
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancelRequest() {
    setBusy(true);
    setError(null);
    const res = await api<MyRegistrationView>(token, "/api/my-registration/request", { method: "DELETE" });
    setBusy(false);
    if (res.ok) onChange(res.data);
    else setError(res.error);
  }

  // Waiting on a leader: there is nothing else to do until they answer.
  if (requestedTeam) {
    return (
      <div className={card}>
        <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-[#7484FE]">Waiting</p>
        <h2 className="heading mt-2 break-words text-2xl font-black sm:text-3xl">{requestedTeam.name}</h2>
        <p className="mt-2 text-sm text-[#F7F2F6]/70">
          You asked to join this team. {requestedTeam.leaderName} leads it, and will accept or decline your request.
          We&apos;ll email you either way. Your payment stays valid whatever they decide.
        </p>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}
        <button onClick={cancelRequest} disabled={busy} className={`${secondaryBtn} mt-5`}>
          {busy ? "Working…" : "Withdraw my request"}
        </button>
      </div>
    );
  }

  return (
    <div className={card}>
      <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-[#33FF67]">My Team</p>
      <h2 className="heading mt-2 text-2xl font-black sm:text-3xl">You&apos;re paid. Now pick a team.</h2>
      <p className="mt-2 text-sm text-[#F7F2F6]/70">
        Start your own team and invite people with its code, or find a team and ask its leader to let you in. No rush —
        your registration keeps until you do.
      </p>

      {mode === "choose" && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => setMode("create")} className={primaryBtn}>
            <Crown className="h-4 w-4" /> Create a team
          </button>
          <button onClick={() => setMode("join")} className={secondaryBtn}>
            <Search className="h-4 w-4" /> Find a team to join
          </button>
        </div>
      )}

      {mode === "create" && <CreateTeamForm token={token} onDone={onChange} onCancel={() => setMode("choose")} />}
      {mode === "join" && <FindTeam token={token} onDone={onChange} onCancel={() => setMode("choose")} />}
    </div>
  );
}

function CreateTeamForm({
  token,
  onDone,
  onCancel,
}: {
  token: string;
  onDone: (v: MyRegistrationView) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || busy) return;
    setBusy(true);
    setError(null);
    const res = await api<MyRegistrationView>(token, "/api/my-registration/team", {
      method: "POST",
      body: JSON.stringify({ name: name.trim() }),
    });
    setBusy(false);
    if (res.ok) onDone(res.data);
    else setError(res.error);
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <label className={labelClass} htmlFor="new-team-name">
        Team Name
      </label>
      <input
        id="new-team-name"
        className={inputClass}
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, TEAM_NAME_MAX))}
        placeholder="Code Crusaders"
      />
      <p className="mt-2 text-xs text-[#F7F2F6]/60">
        You become the team leader. You&apos;ll get a code to share, and you approve everyone who asks to join.
      </p>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" disabled={busy || !name.trim()} className={primaryBtn}>
          {busy ? "Creating…" : "Create team"}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={secondaryBtn}>
          Back
        </button>
      </div>
    </form>
  );
}

function FindTeam({
  token,
  onDone,
  onCancel,
}: {
  token: string;
  onDone: (v: MyRegistrationView) => void;
  onCancel: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TeamSearchResult[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(`/api/team-registration/search?q=${encodeURIComponent(query.trim())}`);
      const body = await res.json().catch(() => null);
      if (res.ok) setResults(body.teams);
      else setError(body?.error ?? "Something went wrong.");
    } catch {
      setError("Network error. Check your connection and try again.");
    }
    setBusy(false);
  }

  async function ask(teamId: string) {
    setBusy(true);
    setError(null);
    const res = await api<MyRegistrationView>(token, "/api/my-registration/request", {
      method: "POST",
      body: JSON.stringify({ teamId }),
    });
    setBusy(false);
    if (res.ok) onDone(res.data);
    else setError(res.error);
  }

  return (
    <div className="mt-6">
      <form onSubmit={search}>
        <label className={labelClass} htmlFor="team-search">
          Team Name or Team Code
        </label>
        <input
          id="team-search"
          className={inputClass}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Code Crusaders or CC7X29"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="submit" disabled={busy || query.trim().length < 3} className={primaryBtn}>
            <Search className="h-4 w-4" />
            {busy ? "Searching…" : "Search"}
          </button>
          <button type="button" onClick={onCancel} disabled={busy} className={secondaryBtn}>
            Back
          </button>
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {results && results.length === 0 && (
        <p className="mt-4 rounded-xl border border-white/15 bg-black/20 p-4 text-sm text-[#F7F2F6]/80">
          No team with room found under that name or code. Teams that are already full don&apos;t show up here. Check
          the spelling, or ask your team leader for the code.
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
              <button onClick={() => ask(t.id)} disabled={busy} className={`${primaryBtn} mt-4`}>
                <UserPlus className="h-4 w-4" /> Ask to join
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
