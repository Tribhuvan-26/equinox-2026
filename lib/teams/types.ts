import type { RegistrationStatus } from "@/lib/registration/types";

export type TeamRole = "leader" | "member";

export type RegistrationTeamRow = {
  id: string;
  name: string;
  code: string;
  max_members: number;
  created_at: string;
  updated_at: string;
};

export type AuthRateLimitRow = {
  key: string;
  attempts: number;
  reset_at: string;
};

// ---- Shapes sent to the browser -----------------------------------------

/** What someone sees when they search for a team to join. No emails, no code. */
export type TeamSearchResult = {
  id: string;
  name: string;
  leaderName: string;
  memberCount: number;
  maxMembers: number;
  isFull: boolean;
};

export type TeamMemberView = {
  registrationId: string;
  name: string;
  role: TeamRole;
  /** Payment review status. Only sent to the team leader. */
  status?: RegistrationStatus;
  /** True for the registration whose link is being used. */
  isYou: boolean;
};

export type TeamView = {
  id: string;
  name: string;
  code: string;
  maxMembers: number;
  memberCount: number;
  members: TeamMemberView[];
};

export type MyRegistrationView = {
  registration: {
    id: string;
    name: string;
    status: RegistrationStatus;
    confirmationNumber: string;
    adminNote: string | null;
    createdAt: string;
  };
  /** null once the person has left / been removed / the team was deleted. */
  team: TeamView | null;
  isLeader: boolean;
};
