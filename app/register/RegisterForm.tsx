"use client";

import { COLLEGES, DEPARTMENTS } from "@/lib/registration/constants";
import type { Participant } from "@/lib/registration/types";
import { digitsOnly } from "@/lib/registration/validation";

export const currency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function filterTouchedErrors(
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

export function ParticipantFields({
  index,
  title,
  participant,
  errors,
  onChange,
  onBlurField,
  onRemove,
}: {
  index: number;
  /** Overrides the default "Participant N (Team Lead)" heading. */
  title?: string;
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
          {title ?? <>Participant {index + 1} {index === 0 && "(Team Lead)"}</>}
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

        <SelectField
          label="College Name"
          required
          value={participant.college}
          options={COLLEGES}
          onChange={(v) => onChange({ college: v })}
          onBlur={() => onBlurField("college")}
          error={participant.college !== "Other" ? errors.college : undefined}
        />
        {participant.college === "Other" && (
          <TextField
            label="Specify College"
            required
            value={participant.collegeOther}
            onChange={(v) => onChange({ collegeOther: v })}
            onBlur={() => onBlurField("college")}
            error={errors.college}
          />
        )}

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

export function TextField({
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

export function SelectField({
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

export function FileField({
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
