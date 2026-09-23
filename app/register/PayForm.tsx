"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { REGISTRATION_FEE, TOKEN_STORAGE_KEY } from "@/lib/registration/constants";
import { emptyParticipant, type Participant } from "@/lib/registration/types";
import { isParticipantValid, validateParticipant } from "@/lib/registration/validation";
import { currency, FileField, filterTouchedErrors, ParticipantFields, TextField } from "./RegisterForm";

const card = "rounded-2xl border border-white/15 bg-black/20 p-6";
const primary =
  "press w-full rounded-xl bg-[#33FF67] px-6 py-4 text-lg font-black text-[#2A2A2A] shadow-md transition-all hover:scale-[1.01] hover:bg-[#5aff87] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto";
const secondary =
  "press inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-[#151515] px-4 py-2 text-sm font-black text-[#F7F2F6] transition-all hover:border-[#33FF67] hover:text-[#33FF67]";

type Done = {
  confirmationNumber: string;
  accessToken: string;
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

function PaymentPanel() {
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
  );
}

function SuccessCard({ done }: { done: Done }) {
  const link = `${typeof window === "undefined" ? "" : window.location.origin}/my-registration#token=${done.accessToken}`;
  return (
    <div className="rounded-3xl border-2 border-[#33FF67]/50 bg-[#33FF67]/10 p-6 text-left sm:p-10">
      <p className="text-xs font-black uppercase tracking-wider text-[#33FF67]">Payment received</p>
      <h3 className="heading mt-3 text-2xl font-black">You&apos;re registered. Now pick a team.</h3>
      <p className="mt-3 text-[#F7F2F6]/85">
        Your payment proof is with the organisers. Next, open your registration and either start your own team or ask
        to join one. There&apos;s no rush — your spot is paid for and it keeps.
      </p>

      <div className="mt-6 flex flex-col gap-1 font-mono text-sm text-[#F7F2F6]/70">
        <p>
          Confirmation Number: <span className="text-[#33FF67]">{done.confirmationNumber}</span>
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/15 bg-black/20 p-4">
        <p className="text-sm font-bold">Your private link</p>
        <p className="mt-1 text-sm text-[#F7F2F6]/70">
          This is where you create or join a team, and check your status. We also emailed it to you. Keep it private:
          anyone with it can act as you.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <CopyButton text={link} label="Copy my link" />
          <Link href={`/my-registration#token=${done.accessToken}`} className={secondary}>
            Create or join a team
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PayForm() {
  const [participant, setParticipant] = useState<Participant>(emptyParticipant());
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [utr, setUtr] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const lock = useRef(false);

  const utrValid = utr.trim().length >= 6;
  const valid = isParticipantValid(participant) && screenshot !== null && utrValid;
  const errors = attempted
    ? validateParticipant(participant)
    : filterTouchedErrors(validateParticipant(participant), touched, 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    setError(null);
    if (!valid || lock.current) return;
    lock.current = true;
    setSubmitting(true);

    const body = new FormData();
    body.set("participant", JSON.stringify(participant));
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

  if (done) return <SuccessCard done={done} />;

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <section className={card}>
        <h3 className="heading text-xl font-black">Step 1 — Pay for yourself</h3>
        <p className="mt-2 text-sm text-[#F7F2F6]/70">
          Everyone pays their own fee. Once you&apos;ve paid you&apos;ll get a private link, and from there you can
          start a team or ask to join one.
        </p>
      </section>

      <ParticipantFields
        index={0}
        title="Your details"
        participant={participant}
        errors={errors}
        onChange={(patch) => setParticipant((p) => ({ ...p, ...patch }))}
        onBlurField={(field) => setTouched((t) => new Set(t).add(`0.${field}`))}
      />

      <section className={card}>
        <h3 className="heading text-xl font-black">Your payment</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm text-[#F7F2F6]/70">You pay:</span>
          <span className="text-2xl font-black text-[#33FF67]">{currency(REGISTRATION_FEE)}</span>
        </div>

        <div className="mt-6 grid gap-8 sm:grid-cols-[auto_1fr]">
          <PaymentPanel />
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
        {submitting ? "Submitting..." : `Pay & Register (${currency(REGISTRATION_FEE)})`}
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
