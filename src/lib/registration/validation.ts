import { COLLEGES, DEPARTMENTS } from "./constants";
import type { Participant, StoredParticipant } from "./types";
import { asText, resolvedCollege, resolvedDepartment } from "./types";

/** Keeps a hand-written request from stuffing a novel into the participants JSON. */
export const MAX_FIELD_LENGTH = 120;

const COLLEGE_SET: ReadonlySet<string> = new Set(COLLEGES);
const DEPARTMENT_SET: ReadonlySet<string> = new Set(DEPARTMENTS);

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

  const name = asText(p.name).trim();
  const rollNumber = asText(p.rollNumber).trim();
  const college = asText(p.college);
  const collegeOther = asText(p.collegeOther).trim();
  const department = asText(p.department);
  const departmentOther = asText(p.departmentOther).trim();
  const mobile = asText(p.mobile).trim();
  const email = asText(p.email).trim();

  if (!name) errors.name = "Name is required.";
  else if (name.length > MAX_FIELD_LENGTH) errors.name = `Name must be at most ${MAX_FIELD_LENGTH} characters.`;

  if (!rollNumber) errors.rollNumber = "Roll number is required.";
  else if (rollNumber.length > MAX_FIELD_LENGTH)
    errors.rollNumber = `Roll number must be at most ${MAX_FIELD_LENGTH} characters.`;

  // The dropdown is only a hint: check the value server-side too.
  if (!college) errors.college = "Select a college.";
  else if (!COLLEGE_SET.has(college)) errors.college = "Select a college from the list.";
  else if (college === "Other" && !collegeOther) errors.college = "Specify your college.";
  else if (collegeOther.length > MAX_FIELD_LENGTH)
    errors.college = `College must be at most ${MAX_FIELD_LENGTH} characters.`;

  if (!department) errors.department = "Select a department.";
  else if (!DEPARTMENT_SET.has(department)) errors.department = "Select a department from the list.";
  else if (department === "Other" && !departmentOther) errors.department = "Specify your department.";
  else if (departmentOther.length > MAX_FIELD_LENGTH)
    errors.department = `Department must be at most ${MAX_FIELD_LENGTH} characters.`;

  if (!mobile) errors.mobile = "Mobile number is required.";
  else if (!isValidMobile(mobile))
    errors.mobile = "Enter a valid 10-digit Indian mobile number starting with 6-9.";

  if (!email) errors.email = "Email is required.";
  else if (email.length > MAX_FIELD_LENGTH) errors.email = `Email must be at most ${MAX_FIELD_LENGTH} characters.`;
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";

  return errors;
}

export function isParticipantValid(p: Participant): boolean {
  return Object.keys(validateParticipant(p)).length === 0;
}

export function participantForStorage(p: Participant): StoredParticipant {
  return {
    name: asText(p.name).trim(),
    rollNumber: asText(p.rollNumber).trim(),
    college: resolvedCollege(p),
    department: resolvedDepartment(p),
    mobile: asText(p.mobile).trim(),
    email: asText(p.email).trim().toLowerCase(),
  };
}
