import type { Participant, StoredParticipant } from "./types";
import { resolvedCollege, resolvedDepartment } from "./types";

export const MOBILE_REGEX = /^[6-9]\d{9}$/;

// Rejects: missing local/domain part, no TLD, dangling dot, spaces, double "@".
export const EMAIL_REGEX =
  /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export function isValidMobile(raw: string): boolean {
  return MOBILE_REGEX.test(raw.trim());
}

export function isValidEmail(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed.length === 0 || /\s/.test(trimmed)) return false;
  if ((trimmed.match(/@/g) ?? []).length !== 1) return false;
  return EMAIL_REGEX.test(trimmed);
}

export function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10);
}

export type ParticipantErrors = Partial<
  Record<"name" | "rollNumber" | "college" | "department" | "mobile" | "email", string>
> &
  Record<string, string | undefined>;

export function validateParticipant(p: Participant): ParticipantErrors {
  const errors: ParticipantErrors = {};

  if (!p.name.trim()) errors.name = "Name is required.";
  if (!p.rollNumber.trim()) errors.rollNumber = "Roll number is required.";

  if (!p.college) errors.college = "Select a college.";
  else if (p.college === "Other" && !p.collegeOther.trim())
    errors.college = "Specify your college name.";

  if (!p.department) errors.department = "Select a department.";
  else if (p.department === "Other" && !p.departmentOther.trim())
    errors.department = "Specify your department.";

  if (!p.mobile.trim()) errors.mobile = "Mobile number is required.";
  else if (!isValidMobile(p.mobile))
    errors.mobile = "Enter a valid 10-digit Indian mobile number starting with 6-9.";

  if (!p.email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(p.email)) errors.email = "Enter a valid email address.";

  return errors;
}

export function isParticipantValid(p: Participant): boolean {
  return Object.keys(validateParticipant(p)).length === 0;
}

export function participantForStorage(p: Participant): StoredParticipant {
  return {
    name: p.name.trim(),
    rollNumber: p.rollNumber.trim(),
    college: resolvedCollege(p),
    department: resolvedDepartment(p),
    mobile: p.mobile.trim(),
    email: p.email.trim().toLowerCase(),
  };
}
