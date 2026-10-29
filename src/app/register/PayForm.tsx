"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Trophy,
  User,
  Users,
  CheckCircle2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  MAX_TEAM_SIZE,
  PASS_OPTIONS,
  type PassOption,
  type PassType,
  TOKEN_STORAGE_KEY,
} from "@/lib/registration/constants";
import { emptyParticipant, type Participant } from "@/lib/registration/types";
import { isParticipantValid, validateParticipant } from "@/lib/registration/validation";
import { validateTeamName } from "@/lib/teams/validation";
import { currency, FileField, filterTouchedErrors, ParticipantFields, TextField } from "./RegisterForm";

const card = "rounded-2xl border border-white/15 bg-black/20 p-6";
const primary =
  "press w-full rounded-xl bg-[#33FF67] px-6 py-4 text-lg font-black text-[#2A2A2A] shadow-md transition-all hover:scale-[1.01] hover:bg-[#5aff87] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto";
const secondary =
  "press inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-[#151515] px-4 py-2 text-sm font-black text-[#F7F2F6] transition-all hover:border-[#33FF67] hover:text-[#33FF67]";

type Done = {
  confirmationNumber: string;
  accessToken: string;
  team?: {
    id: string;
    name: string;
    code: string;
  } | null;
};

type RegistrationMode = "team" | "individual";

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

function PaymentPanel({ totalAmount }: { totalAmount: number }) {
  const upiId = process.env.NEXT_PUBLIC_UPI_ID;
  const payeeName = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "Equinox 2026";
  const upiLink = useMemo(() => {
    if (!upiId) return null;
    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      am: String(totalAmount),
      cu: "INR",
      tn: "Equinox 2026 Registration",
    });
    return `upi://pay?${params.toString()}`;
  }, [upiId, payeeName, totalAmount]);

  return (
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
      <p className="max-w-[12rem] text-center text-xs text-[#F7F2F6]/70">
        Scan the QR code and pay <strong className="text-[#33FF67] font-bold">{currency(totalAmount)}</strong>.
      </p>
    </div>
  );
}

function SuccessCard({
  done,
  count,
  mode,
  pass,
}: {
  done: Done;
  count: number;
  mode: RegistrationMode;
  pass: PassOption;
}) {
  const link = `${typeof window === "undefined" ? "" : window.location.origin}/my-registration#token=${done.accessToken}`;
  const isTeam = mode === "team" && Boolean(done.team);

  return (
    <div className="rounded-3xl border-2 border-[#33FF67]/50 bg-[#33FF67]/10 p-6 text-left sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-wider text-[#33FF67]">
          {isTeam ? "Team Registration Received" : "Payment Received"}
        </p>
        <span className="rounded-full border border-[#33FF67]/40 bg-[#33FF67]/20 px-3 py-1 font-mono text-[11px] font-black uppercase tracking-wider text-[#33FF67]">
          {pass.name} (₹{pass.price})
        </span>
      </div>
      <h3 className="heading mt-3 text-2xl font-black sm:text-3xl">
        {isTeam
          ? `Team "${done.team?.name}" is registered!`
          : "You're registered. Now pick a team."}
      </h3>
      <p className="mt-3 text-[#F7F2F6]/85">
        {isTeam
          ? `All ${count} members have been registered together under ${pass.name} and associated with team "${done.team?.name}". We have emailed each member their own private link to view and manage their registration.`
          : `Your payment proof for ${pass.name} is with the organisers. Next, open your registration and either start your own team or request to join an existing team.`}
      </p>

      <div className="mt-6 flex flex-col gap-2 font-mono text-sm text-[#F7F2F6]/80">
        <p>
          Confirmation Number: <span className="font-bold text-[#33FF67]">{done.confirmationNumber}</span>
        </p>
        <p>
          Pass Tier: <span className="font-bold text-[#F7F2F6]">{pass.name}</span> (₹{pass.price} / person)
        </p>
        <p>
          Access Scope: <span className="font-bold text-[#33FF67]">{pass.accessScope}</span>
        </p>
        {done.team && (
          <div className="flex flex-wrap items-center gap-2">
            <span>
              Team Code: <strong className="font-mono text-[#33FF67] tracking-wider">{done.team.code}</strong>
            </span>
            <CopyButton text={done.team.code} label="Copy Team Code" />
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-white/15 bg-black/20 p-5">
        <p className="text-sm font-bold text-[#F7F2F6]">
          {isTeam ? "Lead's Private Dashboard Link" : "Your Private Link"}
        </p>
        <p className="mt-1 text-sm text-[#F7F2F6]/70">
          {isTeam
            ? "Use this link to manage your team, view members, and handle any join requests. We also emailed individual links to each registered teammate."
            : "This is where you create or join a team, and check your status. We also emailed it to you. Keep it private: anyone with it can act as you."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <CopyButton text={link} label="Copy my link" />
          <Link href={`/my-registration#token=${done.accessToken}`} className={secondary}>
            {isTeam ? "Open team dashboard" : "Create or join a team"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PayForm() {
  const passType: PassType = "ipl";
  const selectedPass = PASS_OPTIONS.ipl;
  const [mode, setMode] = useState<RegistrationMode>("team");
  const [teamName, setTeamName] = useState("");
  const [teamNameTouched, setTeamNameTouched] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([emptyParticipant()]);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [utr, setUtr] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const lock = useRef(false);

  const activeParticipants = mode === "team" ? participants : [participants[0]];
  const totalAmount = activeParticipants.length * selectedPass.price;

  const teamNameError = mode === "team" ? validateTeamName(teamName) : null;
  const isTeamNameValid = mode === "individual" || !teamNameError;

  const utrValid = utr.trim().length >= 6;
  const allParticipantsValid = activeParticipants.every(isParticipantValid);

  // Check for duplicate emails within the current submission
  const emails = activeParticipants.map((p) => p.email.trim().toLowerCase()).filter(Boolean);
  const hasDuplicateEmails = new Set(emails).size !== emails.length;

  const valid =
    isTeamNameValid && allParticipantsValid && !hasDuplicateEmails && screenshot !== null && utrValid;

  function handleModeChange(nextMode: RegistrationMode) {
    setMode(nextMode);
    setError(null);
  }

  function updateParticipant(index: number, patch: Partial<Participant>) {
    setParticipants((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  function addParticipant() {
    if (participants.length >= MAX_TEAM_SIZE) return;
    setParticipants((prev) => [...prev, emptyParticipant()]);
  }

  function removeParticipant(index: number) {
    if (participants.length <= 1) return;
    setParticipants((prev) => prev.filter((_, i) => i !== index));
    setTouched((prev) => {
      const next = new Set<string>();
      for (const item of prev) {
        const dotIndex = item.indexOf(".");
        if (dotIndex === -1) continue;
        const i = Number(item.slice(0, dotIndex));
        const field = item.slice(dotIndex + 1);
        if (i < index) next.add(item);
        else if (i > index) next.add(`${i - 1}.${field}`);
      }
      return next;
    });
  }

  const getParticipantErrors = (index: number) => {
    const errs = validateParticipant(participants[index]);
    return attempted ? errs : filterTouchedErrors(errs, touched, index);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    setTeamNameTouched(true);
    setError(null);
    if (!valid || lock.current) return;
    lock.current = true;
    setSubmitting(true);

    const body = new FormData();
    body.set("registrationType", mode);
    body.set("passType", passType);
    body.set("includedEvents", JSON.stringify(selectedPass.includedEvents));

    if (mode === "team") {
      body.set("teamName", teamName.trim());
    }
    body.set("participants", JSON.stringify(activeParticipants));
    body.set("utrNumber", utr.trim());
    body.set("paymentScreenshot", screenshot as File);

    try {
      const res = await fetch("/api/register", { method: "POST", body });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        try {
          localStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
        } catch {
          // Storage can be blocked (private mode); the link still works.
        }
        setDone(data);
        return;
      }
      setError(data?.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Network error. Please check your connection and try again.");
    }
    lock.current = false;
    setSubmitting(false);
  }

  if (done) {
    return (
      <SuccessCard
        done={done}
        count={activeParticipants.length}
        mode={mode}
        pass={selectedPass}
      />
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      {/* 1. Official Pass */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-wider text-[#33FF67]">
              Step 1
            </p>
            <h2 className="heading text-xl font-black text-[#F7F2F6]">
              Registration Pass
            </h2>
          </div>
          <span className="text-xs text-[#F7F2F6]/60">All-in-one entertainment pass</span>
        </div>

        {/* Single Pass Card: IPL Auction Pass — ₹569 */}
        <div className="group relative flex flex-col justify-between rounded-2xl border-2 border-[#33FF67] bg-[#33FF67]/10 p-6 text-left shadow-[0_0_24px_rgba(51,255,103,0.18)] transition-all">
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#33FF67]/40 bg-[#33FF67]/20 px-3 py-1 font-mono text-[11px] font-black uppercase tracking-wider text-[#33FF67]">
                <Trophy className="size-3.5" />
                {selectedPass.badge}
              </span>
              <span className="font-mono text-2xl font-black text-[#33FF67] sm:text-3xl">
                ₹{selectedPass.price}
                <span className="text-xs font-normal text-[#F7F2F6]/60"> / person</span>
              </span>
            </div>

            <div>
              <h3 className="heading text-2xl font-black text-[#F7F2F6]">
                {selectedPass.name}
              </h3>
              <p className="mt-1 text-sm font-bold text-[#33FF67]">
                {selectedPass.tagline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#F7F2F6]/85">
                {selectedPass.description}
              </p>
            </div>

            {/* Included Events Checklist */}
            <div className="mt-2 space-y-2 border-t border-white/10 pt-4 text-xs sm:text-sm">
              <p className="font-mono text-[11px] font-black uppercase tracking-wider text-[#F7F2F6]/60">
                Included Events (All 3 Included):
              </p>
              {selectedPass.includedEvents.map((evt, i) => (
                <div key={i} className="flex items-start gap-2 text-[#F7F2F6]/95">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#33FF67]" />
                  <span className="font-semibold">{evt}</span>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="mt-1 space-y-1.5 text-xs text-[#F7F2F6]/75">
              {selectedPass.highlights.map((h, i) => (
                <p key={i} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-[#33FF67]" />
                  <span>{h}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6 flex w-full items-center justify-between border-t border-white/10 pt-4 text-xs">
            <span className="text-[#F7F2F6]/60">Access Scope</span>
            <span className="rounded-md bg-[#33FF67]/20 px-2.5 py-1 font-mono text-[11px] font-black text-[#33FF67]">
              {selectedPass.accessScope}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Registration Format: Team vs Individual */}
      <section className="flex flex-col gap-3">
        <p className="font-mono text-xs font-black uppercase tracking-wider text-[#33FF67]">
          Step 2
        </p>
        <h2 className="heading text-xl font-black text-[#F7F2F6]">
          Select Registration Format
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleModeChange("team")}
            className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left transition-all ${
              mode === "team"
                ? "border-[#33FF67] bg-[#33FF67]/10 shadow-[0_0_20px_rgba(51,255,103,0.15)]"
                : "border-white/15 bg-black/20 hover:border-white/30 hover:bg-black/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-8 items-center justify-center rounded-xl font-bold ${
                  mode === "team" ? "bg-[#33FF67] text-[#2A2A2A]" : "bg-white/10 text-[#F7F2F6]"
                }`}
              >
                <Users className="size-4" />
              </span>
              <p className="font-mono text-xs font-black uppercase tracking-wider text-[#33FF67]">
                Option A
              </p>
            </div>
            <h3 className="heading text-lg font-black text-[#F7F2F6]">
              Register a Team Together
            </h3>
            <p className="text-xs leading-relaxed text-[#F7F2F6]/70">
              Enter 1–5 members together in one session and associate everyone with the same team.
            </p>
            <span className="mt-1 font-mono text-xs font-bold text-[#33FF67]">
              ₹{selectedPass.price} / person · {selectedPass.name}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("individual")}
            className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left transition-all ${
              mode === "individual"
                ? "border-[#7484FE] bg-[#7484FE]/10 shadow-[0_0_20px_rgba(116,132,254,0.15)]"
                : "border-white/15 bg-black/20 hover:border-white/30 hover:bg-black/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-8 items-center justify-center rounded-xl font-bold ${
                  mode === "individual" ? "bg-[#7484FE] text-[#2A2A2A]" : "bg-white/10 text-[#F7F2F6]"
                }`}
              >
                <User className="size-4" />
              </span>
              <p className="font-mono text-xs font-black uppercase tracking-wider text-[#7484FE]">
                Option B
              </p>
            </div>
            <h3 className="heading text-lg font-black text-[#F7F2F6]">
              Register Individually
            </h3>
            <p className="text-xs leading-relaxed text-[#F7F2F6]/70">
              Pay for yourself now. Receive your private team link to create or join a team later.
            </p>
            <span className="mt-1 font-mono text-xs font-bold text-[#7484FE]">
              ₹{selectedPass.price} solo pass · {selectedPass.name}
            </span>
          </button>
        </div>
      </section>

      {/* Team Details (Option A) */}
      {mode === "team" && (
        <section className={card}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="heading text-xl font-black">Team Information</h3>
            <span className="font-mono text-xs font-bold text-[#33FF67]">
              1–5 Members
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#F7F2F6]/70">
            Give your team a unique name. All participants registered in this form will be added to this team.
          </p>

          <div className="mt-4">
            <TextField
              label="Team Name"
              required
              value={teamName}
              onChange={(val) => {
                setTeamName(val);
                setTeamNameTouched(true);
              }}
              error={(attempted || teamNameTouched) ? (teamNameError ?? undefined) : undefined}
              placeholder="e.g. Code Crusaders"
            />
            <p className="mt-1.5 text-xs text-[#F7F2F6]/50">
              A unique team code will be generated automatically and emailed to all teammates.
            </p>
          </div>
        </section>
      )}

      {/* Participant details list */}
      <div className="flex flex-col gap-6">
        {activeParticipants.map((p, idx) => (
          <ParticipantFields
            key={idx}
            index={idx}
            title={
              mode === "individual"
                ? "Your Details"
                : `Participant ${idx + 1} ${idx === 0 ? "(Team Leader / Primary Contact)" : ""}`
            }
            participant={p}
            errors={getParticipantErrors(idx)}
            onChange={(patch) => updateParticipant(idx, patch)}
            onBlurField={(field) => setTouched((t) => new Set(t).add(`${idx}.${field}`))}
            onRemove={mode === "team" && participants.length > 1 ? () => removeParticipant(idx) : undefined}
          />
        ))}

        {hasDuplicateEmails && (
          <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
            Each participant in this transaction must have a unique email address.
          </p>
        )}

        {mode === "team" && participants.length < MAX_TEAM_SIZE && (
          <button
            type="button"
            onClick={addParticipant}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 bg-black/10 py-4 text-sm font-black text-[#F7F2F6] transition-all hover:border-[#33FF67] hover:bg-black/20 hover:text-[#33FF67]"
          >
            <Users className="h-4 w-4" />
            <span>+ Add Team Member ({participants.length}/{MAX_TEAM_SIZE})</span>
          </button>
        )}
      </div>

      {/* Payment details section */}
      <section className={card}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h3 className="heading text-xl font-black">Your Payment</h3>
            <p className="mt-1 text-xs text-[#F7F2F6]/60">
              Pass: <span className="font-bold text-[#33FF67]">{selectedPass.name}</span>
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-[#F7F2F6]/70">
              {mode === "team"
                ? `Total (${activeParticipants.length} × ₹${selectedPass.price} · ${selectedPass.name}):`
                : "Total to Pay:"}
            </span>
            <span className="text-2xl font-black text-[#33FF67]">
              {currency(totalAmount)}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-8 sm:grid-cols-[auto_1fr]">
          <PaymentPanel totalAmount={totalAmount} />
          <div className="flex flex-col gap-5">
            <FileField
              label="Upload Payment Screenshot"
              required
              file={screenshot}
              onChange={setScreenshot}
              error={attempted && !screenshot ? "Payment screenshot is required." : undefined}
            />
            <TextField
              label="UTR / Transaction Number"
              required
              value={utr}
              onChange={setUtr}
              error={attempted && !utrValid ? "Enter a valid UTR / transaction number." : undefined}
              placeholder="e.g. 402812345678"
            />
          </div>
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <button type="submit" disabled={!valid || submitting} className={primary}>
        {submitting
          ? "Submitting..."
          : mode === "team"
          ? `Pay & Register Team (${currency(totalAmount)})`
          : `Pay & Register (${currency(totalAmount)})`}
      </button>

      <p className="text-sm text-[#F7F2F6]/70">
        Already registered?{" "}
        <Link href="/my-registration" className="font-bold text-[#33FF67] hover:underline">
          Open your registration
        </Link>
      </p>
    </form>
  );
}
