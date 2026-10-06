"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Check, Copy, Tag, Users } from "lucide-react";
import {
  calculateRegistrationPricing,
  GROUP_DISCOUNT_CODE,
  GROUP_DISCOUNT_PERCENT,
  isGroupDiscountCodeValid,
  REGISTRATION_FEE,
  TOKEN_STORAGE_KEY,
} from "@/lib/registration/constants";
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

function PaymentPanel({ totalAmount }: { totalAmount: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex size-40 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white p-1">
        <img
          src="/payment-qr.png"
          alt="UPI Payment QR Code"
          className="size-full object-contain"
        />
      </div>
      <p className="max-w-[10rem] text-center text-xs text-[#F7F2F6]/60">
        Scan the QR code and pay {currency(totalAmount)}.
      </p>
    </div>
  );
}

function SuccessCard({ done, count }: { done: Done; count: number }) {
  const link = `${typeof window === "undefined" ? "" : window.location.origin}/my-registration#token=${done.accessToken}`;
  return (
    <div className="rounded-3xl border-2 border-[#33FF67]/50 bg-[#33FF67]/10 p-6 text-left sm:p-10">
      <p className="text-xs font-black uppercase tracking-wider text-[#33FF67]">Payment received</p>
      <h3 className="heading mt-3 text-2xl font-black">
        {count > 1 ? `${count} participants registered. Now pick a team.` : "You're registered. Now pick a team."}
      </h3>
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
  const [participants, setParticipants] = useState<Participant[]>([emptyParticipant()]);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [utr, setUtr] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const lock = useRef(false);

  const isGroupDiscountEligibleCount =
    participants.length === 4 || participants.length === 5;

  const pricing = useMemo(
    () => calculateRegistrationPricing(participants.length, isGroupDiscountEligibleCount ? referralCode : null),
    [participants.length, isGroupDiscountEligibleCount, referralCode]
  );

  const utrValid = utr.trim().length >= 6;
  const allParticipantsValid = participants.every(isParticipantValid);

  // Check for duplicate emails within the current submission
  const emails = participants.map((p) => p.email.trim().toLowerCase()).filter(Boolean);
  const hasDuplicateEmails = new Set(emails).size !== emails.length;

  const valid = allParticipantsValid && !hasDuplicateEmails && screenshot !== null && utrValid;

  function updateParticipant(index: number, patch: Partial<Participant>) {
    setParticipants((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  function addParticipant() {
    if (participants.length >= 5) return;
    setParticipants((prev) => [...prev, emptyParticipant()]);
  }

  function removeParticipant(index: number) {
    if (participants.length <= 1) return;
    setParticipants((prev) => prev.filter((_, i) => i !== index));
    // Re-index touched field keys
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
    setError(null);
    if (!valid || lock.current) return;
    lock.current = true;
    setSubmitting(true);

    const body = new FormData();
    body.set("participants", JSON.stringify(participants));
    body.set("participant", JSON.stringify(participants[0]));
    body.set("utrNumber", utr.trim());
    body.set("paymentScreenshot", screenshot as File);
    if (isGroupDiscountEligibleCount && referralCode.trim()) {
      body.set("referralCode", referralCode.trim());
    }

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

  if (done) return <SuccessCard done={done} count={participants.length} />;

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="heading text-xl font-black">Step 1 — Register & Pay</h3>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#33FF67]">
            ₹{REGISTRATION_FEE} / person
          </span>
        </div>
        <p className="mt-2 text-sm text-[#F7F2F6]/70 leading-relaxed">
          Register for yourself or together as a group (up to 5 people). Submitting 4 or 5 people together in the same
          transaction qualifies for a 10% group discount with code <strong className="text-[#33FF67]">RTX5060</strong>.
        </p>
      </section>

      {/* Participant details list */}
      <div className="flex flex-col gap-6">
        {participants.map((p, idx) => (
          <ParticipantFields
            key={idx}
            index={idx}
            title={
              participants.length === 1
                ? "Your details"
                : `Participant ${idx + 1} ${idx === 0 ? "(Lead / Primary Contact)" : ""}`
            }
            participant={p}
            errors={getParticipantErrors(idx)}
            onChange={(patch) => updateParticipant(idx, patch)}
            onBlurField={(field) => setTouched((t) => new Set(t).add(`${idx}.${field}`))}
            onRemove={participants.length > 1 ? () => removeParticipant(idx) : undefined}
          />
        ))}

        {hasDuplicateEmails && (
          <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
            Each participant in this transaction must have a unique email address.
          </p>
        )}

        {participants.length < 5 && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={addParticipant}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 bg-black/10 py-4 text-sm font-black text-[#F7F2F6] transition-all hover:border-[#33FF67] hover:bg-black/20 hover:text-[#33FF67]"
            >
              <Users className="h-4 w-4" />
              <span>+ Add Participant ({participants.length}/5)</span>
            </button>
            {participants.length < 4 && (
              <p className="text-center text-xs text-[#F7F2F6]/50">
                Tip: Add {4 - participants.length} more participant{4 - participants.length > 1 ? "s" : ""} to unlock
                a 10% group discount with code <strong className="text-[#33FF67]">RTX5060</strong>!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Referral-code / Discount section — shown ONLY when current transaction contains 4 or 5 people */}
      {isGroupDiscountEligibleCount && (
        <section
          className={`rounded-2xl border-2 p-6 shadow-lg transition-all ${
            pricing.qualifiesForGroupDiscount
              ? "border-[#33FF67]/50 bg-gradient-to-br from-[#33FF67]/15 via-black/30 to-[#7484FE]/10"
              : "border-white/20 bg-black/30"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-black uppercase tracking-wider ${
                  pricing.qualifiesForGroupDiscount
                    ? "bg-[#33FF67] text-[#2A2A2A]"
                    : "bg-white/10 text-[#F7F2F6]/80"
                }`}
              >
                <Tag className="h-3.5 w-3.5" />
                {pricing.qualifiesForGroupDiscount
                  ? `${GROUP_DISCOUNT_PERCENT}% Group Discount Activated`
                  : `${GROUP_DISCOUNT_PERCENT}% Group Discount Available`}
              </span>
              <span className="text-xs font-bold text-[#F7F2F6]/70">
                ({participants.length} people submitted together)
              </span>
            </div>
          </div>

          {pricing.qualifiesForGroupDiscount ? (
            <p className="mt-3 text-sm text-[#F7F2F6]/90 leading-relaxed">
              Code <strong className="font-mono text-[#33FF67]">{GROUP_DISCOUNT_CODE}</strong> applied! A{" "}
              <strong className="text-[#33FF67]">10% group discount</strong> is activated because {participants.length}{" "}
              people are submitted together in this registration transaction.
            </p>
          ) : (
            <p className="mt-3 text-sm text-[#F7F2F6]/90 leading-relaxed">
              You qualify for a <strong className="text-[#33FF67]">10% group discount</strong> for submitting{" "}
              {participants.length} people together! Enter code{" "}
              <strong className="font-mono text-[#33FF67]">{GROUP_DISCOUNT_CODE}</strong> below to activate your
              savings.
            </p>
          )}

          <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-black/40 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/50">Regular Total</p>
              <p
                className={`mt-1 text-base font-bold ${
                  pricing.qualifiesForGroupDiscount ? "text-[#F7F2F6]/60 line-through" : "text-[#F7F2F6]"
                }`}
              >
                {currency(pricing.grossAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#33FF67]">
                10% Group Savings
              </p>
              <p className="mt-1 text-base font-black text-[#33FF67]">
                {pricing.qualifiesForGroupDiscount
                  ? `-${currency(pricing.discountAmount)}`
                  : `Save ${currency(Math.round((pricing.grossAmount * GROUP_DISCOUNT_PERCENT) / 100))}`}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#7484FE]">
                {pricing.qualifiesForGroupDiscount ? "Discounted Total" : "Total to Pay"}
              </p>
              <p className="mt-1 text-xl font-black text-[#F7F2F6]">
                {currency(pricing.totalAmount)}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-white/10 pt-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <TextField
                    label="Discount / Promo Code"
                    value={referralCode}
                    onChange={(val) => setReferralCode(val.toUpperCase())}
                    placeholder={`Enter code ${GROUP_DISCOUNT_CODE}`}
                  />
                </div>
                {!pricing.qualifiesForGroupDiscount && (
                  <button
                    type="button"
                    onClick={() => setReferralCode(GROUP_DISCOUNT_CODE)}
                    className="mb-0.5 rounded-xl border border-[#33FF67]/40 bg-[#33FF67]/10 px-4 py-3 text-xs font-black uppercase tracking-wider text-[#33FF67] transition-all hover:bg-[#33FF67]/20"
                  >
                    Apply {GROUP_DISCOUNT_CODE}
                  </button>
                )}
              </div>

              {referralCode.trim().length > 0 && !pricing.qualifiesForGroupDiscount && (
                <p role="alert" className="text-xs font-bold text-red-400">
                  Invalid code &ldquo;{referralCode.trim()}&rdquo;. Enter{" "}
                  <button
                    type="button"
                    onClick={() => setReferralCode(GROUP_DISCOUNT_CODE)}
                    className="font-mono underline hover:text-white"
                  >
                    {GROUP_DISCOUNT_CODE}
                  </button>{" "}
                  to activate the 10% group discount.
                </p>
              )}

              {pricing.qualifiesForGroupDiscount && (
                <p className="text-xs font-bold text-[#33FF67]">
                  ✓ Code {GROUP_DISCOUNT_CODE} is active. ₹{pricing.discountAmount} saved!
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Payment details section */}
      <section className={card}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="heading text-xl font-black">Your payment</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-[#F7F2F6]/70">You pay:</span>
            <span className="text-2xl font-black text-[#33FF67]">{currency(pricing.totalAmount)}</span>
            {pricing.qualifiesForGroupDiscount && (
              <span className="text-sm font-bold text-[#F7F2F6]/40 line-through">
                {currency(pricing.grossAmount)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-8 sm:grid-cols-[auto_1fr]">
          <PaymentPanel totalAmount={pricing.totalAmount} />
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
        {submitting ? "Submitting..." : `Pay & Register (${currency(pricing.totalAmount)})`}
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
