export type Participant = {
  name: string;
  rollNumber: string;
  college: string;
  collegeOther: string;
  department: string;
  departmentOther: string;
  mobile: string;
  email: string;
};

export type RegistrationStatus = "pending" | "approved" | "rejected";

export type StoredParticipant = {
  name: string;
  rollNumber: string;
  college: string;
  department: string;
  mobile: string;
  email: string;
};

export type RegistrationRecord = {
  id: string;
  participants: StoredParticipant[];
  participant_count: number;
  total_amount: number;
  payment_screenshot_path: string;
  utr_number: string;
  utr_proof_path: string | null;
  status: RegistrationStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  team_seq: number;
  confirmation_number: string;
  /** Set once the person has a team; null while they have only paid. */
  team_id: string | null;
  team_role: "leader" | "member" | null;
  /** The team they have asked to join, if any. One column, so one ask at a time. */
  requested_team_id: string | null;
};

export function emptyParticipant(): Participant {
  return {
    name: "",
    rollNumber: "",
    college: "",
    collegeOther: "",
    department: "",
    departmentOther: "",
    mobile: "",
    email: "",
  };
}

/**
 * Participants arrive as JSON from the browser, so a field can be missing or of
 * the wrong type. Read every one through this instead of assuming a string.
 */
export function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function resolvedCollege(p: Participant): string {
  const college = asText(p.college);
  return college === "Other" ? asText(p.collegeOther).trim() : college.trim();
}

export function resolvedDepartment(p: Participant): string {
  const department = asText(p.department);
  return department === "Other" ? asText(p.departmentOther).trim() : department.trim();
}
