export type Participant = {
  name: string;
  rollNumber: string;
  college: string;
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
};

export function emptyParticipant(): Participant {
  return {
    name: "",
    rollNumber: "",
    college: "",
    department: "",
    departmentOther: "",
    mobile: "",
    email: "",
  };
}

export function resolvedCollege(p: Participant): string {
  return p.college.trim();
}

export function resolvedDepartment(p: Participant): string {
  return p.department === "Other" ? p.departmentOther.trim() : p.department;
}
