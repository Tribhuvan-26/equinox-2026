"use client";

import { useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { DEPARTMENTS, MAX_TEAM_SIZE, MIN_TEAM_SIZE, REGISTRATION_FEE } from "@/lib/registration/constants";
import { emptyParticipant, type Participant } from "@/lib/registration/types";
import { digitsOnly, isParticipantValid, validateParticipant } from "@/lib/registration/validation";

const currency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function RegisterForm() {
  const [started, setStarted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  function handleStart() {
    setStarted(true);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <div>
      <div className="flex flex-col items-start gap-4 rounded-3xl border-2 border-[#33FF67]/40 bg-gradient-to-br from-[#7484FE]/15 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#33FF67]">
            Registration is open
          </p>
          <h2 className="heading mt-2 text-xl font-black sm:text-3xl">
            Register your team for Equinox 2026
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[#F7F2F6]/80 sm:text-base">
            ₹{REGISTRATION_FEE} per participant. Register your whole team in one go.
          </p>
        </div>
        {!started && (
          <button
            onClick={handleStart}
            className="press w-full shrink-0 rounded-xl bg-[#33FF67] px-5 py-3 text-sm font-black text-[#2A2A2A] shadow-md transition-all hover:scale-[1.02] hover:bg-[#5aff87] sm:w-auto sm:px-8 sm:py-4 sm:text-base"
          >
            Register Now
          </button>
        )}
      </div>

      {started && (
        <div ref={formRef} className="mt-10 scroll-mt-24">
          <RegistrationFormBody />
        </div>
      )}
    </div>
  );
}

function RegistrationFormBody() {
  const [participants, setParticipants] = useState<Participant[]>(
    Array.from({ length: MIN_TEAM_SIZE }, emptyParticipant)
  );
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    totalAmount: number;
    confirmationNumber: string;
    teamNumber: string;
  } | null>(null);
  const submitLock = useRef(false);

  const totalAmount = participants.length * REGISTRATION_FEE;
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

  const utrValid = utrNumber.trim().length >= 6;
  const formValid =
    participants.every(isParticipantValid) && paymentScreenshot !== null && utrValid;

  function updateParticipant(index: number, patch: Partial<Participant>) {
    setParticipants((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  function markTouched(index: number, field: string) {
    setTouched((prev) => new Set(prev).add(`${index}.${field}`));
  }

  function addParticipant() {
    if (participants.length >= MAX_TEAM_SIZE) return;
    setParticipants((prev) => [...prev, emptyParticipant()]);
  }

  function removeParticipant(index: number) {
    if (participants.length <= MIN_TEAM_SIZE) return;
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttemptedSubmit(true);
    setSubmitError(null);

    if (!formValid || submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);

    try {
      const body = new FormData();
      body.set("participants", JSON.stringify(participants));
      body.set("utrNumber", utrNumber.trim());
      body.set("paymentScreenshot", paymentScreenshot as File);

      const res = await fetch("/api/register", { method: "POST", body });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setSubmitError(data?.error ?? "Something went wrong. Please try again.");
        submitLock.current = false;
        setSubmitting(false);
        return;
      }

      setResult({
        totalAmount: data.totalAmount,
        confirmationNumber: data.confirmationNumber,
        teamNumber: data.teamNumber,
      });
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-3xl border-2 border-[#33FF67]/50 bg-[#33FF67]/10 p-10 text-center">
        <p className="text-xs font-black uppercase tracking-wider text-[#33FF67]">Success</p>
        <h3 className="heading mt-3 text-2xl font-black">
          Registration submitted successfully.
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-[#F7F2F6]/85">
          You will receive a confirmation email within 24 hours after verification.
        </p>
        <div className="mt-4 flex flex-col items-center gap-1 font-mono text-sm text-[#F7F2F6]/60">
          <p>Confirmation Number: <span className="text-[#33FF67]">{result.confirmationNumber}</span></p>
          <p>Team Number: <span className="text-[#33FF67]">{result.teamNumber}</span></p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="heading text-xl font-black">Team members</h3>
          <span className="text-sm text-[#F7F2F6]/60">
            {participants.length} × {currency(REGISTRATION_FEE)}
          </span>
        </div>

        {participants.map((p, i) => (
          <ParticipantFields
            key={i}
            index={i}
            participant={p}
            errors={attemptedSubmit ? validateParticipant(p) : filterTouchedErrors(validateParticipant(p), touched, i)}
            onChange={(patch) => updateParticipant(i, patch)}
            onBlurField={(field) => markTouched(i, field)}
            onRemove={participants.length > MIN_TEAM_SIZE ? () => removeParticipant(i) : undefined}
          />
        ))}

        <button
          type="button"
          onClick={addParticipant}
          disabled={participants.length >= MAX_TEAM_SIZE}
          className="self-start rounded-lg border border-dashed border-white/30 px-5 py-3 text-sm font-bold text-[#F7F2F6]/80 transition-all hover:border-[#33FF67] hover:text-[#33FF67] disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Add Team Member
        </button>
      </section>

      <section className="rounded-2xl border border-white/15 bg-black/20 p-6">
        <h3 className="heading text-xl font-black">Payment</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm text-[#F7F2F6]/70">Total amount:</span>
          <span className="text-2xl font-black text-[#33FF67]">{currency(totalAmount)}</span>
          <span className="text-sm text-[#F7F2F6]/50">
            ({participants.length} × {currency(REGISTRATION_FEE)})
          </span>
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
              Scan the QR code and pay the total amount shown above.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <FileField
              label="Upload Payment Screenshot"
              required
              hint="One screenshot for the entire team."
              file={paymentScreenshot}
              onChange={setPaymentScreenshot}
              error={attemptedSubmit && !paymentScreenshot ? "Payment screenshot is required." : undefined}
            />

            <TextField
              label="UTR / Transaction Number"
              required
              value={utrNumber}
              onChange={setUtrNumber}
              error={attemptedSubmit && !utrValid ? "Enter a valid UTR / transaction number." : undefined}
              placeholder="e.g. 402812345678"
            />
          </div>
        </div>
      </section>

      {submitError && (
        <p className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={!formValid || submitting}
        className="press w-full rounded-xl bg-[#33FF67] px-6 py-4 text-lg font-black text-[#2A2A2A] shadow-md transition-all hover:scale-[1.01] hover:bg-[#5aff87] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto"
      >
        {submitting ? "Submitting..." : `Submit Registration (${currency(totalAmount)})`}
      </button>
    </form>
  );
}

function filterTouchedErrors(
  errors: Record<string, string | undefined>,
  touched: Set<string>,
  index: number
) {
  const out: Record<string, string | undefined> = {};
  for (const [field, message] of Object.entries(errors)) {
    if (touched.has(`${index}.${field}`)) out[field] = message;
  }
  return out;
}

function ParticipantFields({
  index,
  participant,
  errors,
  onChange,
  onBlurField,
  onRemove,
}: {
  index: number;
  participant: Participant;
  errors: Record<string, string | undefined>;
  onChange: (patch: Partial<Participant>) => void;
  onBlurField: (field: string) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/20 p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-wider text-[#7484FE]">
          Participant {index + 1} {index === 0 && "(Team Lead)"}
        </p>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-bold text-red-400 hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextField
          label="Name (as it should appear on certificate)"
          required
          value={participant.name}
          onChange={(v) => onChange({ name: v })}
          onBlur={() => onBlurField("name")}
          error={errors.name}
        />
        <TextField
          label="Roll Number"
          required
          value={participant.rollNumber}
          onChange={(v) => onChange({ rollNumber: v })}
          onBlur={() => onBlurField("rollNumber")}
          error={errors.rollNumber}
        />

        <TextField
          label="College Name"
          required
          value={participant.college}
          onChange={(v) => onChange({ college: v })}
          onBlur={() => onBlurField("college")}
          error={errors.college}
        />

        <SelectField
          label="Department"
          required
          value={participant.department}
          options={DEPARTMENTS}
          onChange={(v) => onChange({ department: v })}
          onBlur={() => onBlurField("department")}
          error={participant.department !== "Other" ? errors.department : undefined}
        />
        {participant.department === "Other" && (
          <TextField
            label="Specify Department"
            required
            value={participant.departmentOther}
            onChange={(v) => onChange({ departmentOther: v })}
            onBlur={() => onBlurField("department")}
            error={errors.department}
          />
        )}

        <TextField
          label="Mobile Number"
          required
          value={participant.mobile}
          onChange={(v) => onChange({ mobile: digitsOnly(v) })}
          onBlur={() => onBlurField("mobile")}
          error={errors.mobile}
          inputMode="numeric"
          placeholder="10-digit mobile number"
        />
        <TextField
          label="Email Address"
          required
          value={participant.email}
          onChange={(v) => onChange({ email: v })}
          onBlur={() => onBlurField("email")}
          error={errors.email}
          type="email"
          placeholder="name@example.com"
        />
      </div>
    </div>
  );
}

function Label({ children, required, optional }: { children: React.ReactNode; required?: boolean; optional?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/70">
      {children}
      {required && <span className="ml-1 text-[#33FF67]">*</span>}
      {optional && <span className="ml-1 text-[#F7F2F6]/40 normal-case">(optional)</span>}
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  type = "text",
  inputMode,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-[#F7F2F6] outline-none transition-colors ${
          error ? "border-red-400/70" : "border-white/20 focus:border-[#7484FE]"
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  onBlur,
  error,
  required,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-[#F7F2F6] outline-none transition-colors ${
          error ? "border-red-400/70" : "border-white/20 focus:border-[#7484FE]"
        }`}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#2A2A2A]">
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function FileField({
  label,
  file,
  onChange,
  error,
  required,
  optional,
  hint,
}: {
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <Label required={required} optional={optional}>
        {label}
      </Label>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="block w-full text-sm text-[#F7F2F6]/80 file:mr-3 file:rounded-lg file:border-0 file:bg-[#7484FE] file:px-4 file:py-2 file:font-bold file:text-[#F7F2F6] hover:file:bg-[#5868DF]"
      />
      {hint && <p className="mt-1 text-xs text-[#F7F2F6]/50">{hint}</p>}
      {file && <p className="mt-1 text-xs text-[#33FF67]">Selected: {file.name}</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
