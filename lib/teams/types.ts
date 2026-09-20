export type TeamRole = "leader" | "member";

// Raw table rows.
export type PlatformUserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  email_verified_at: string | null;
  session_version: number;
};

export type AuthTokenPurpose = "verify_email" | "reset_password";

export type AuthTokenRow = {
  id: string;
  user_id: string;
  purpose: AuthTokenPurpose;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
};

export type AuthRateLimitRow = {
  key: string;
  attempts: number;
  reset_at: string;
};

export type TeamRow = {
  id: string;
  name: string;
  code: string;
  leader_id: string;
  max_members: number;
  created_at: string;
  updated_at: string;
};

export type TeamMemberRow = {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  joined_at: string;
};

// Shapes sent to the browser.
export type TeamMemberView = {
  userId: string;
  name: string;
  role: TeamRole;
  joinedAt: string;
};

export type TeamRegistrationStatus = "pending" | "approved" | "rejected";

/** The team's pass registration, if it has one. */
export type TeamRegistrationView = {
  status: TeamRegistrationStatus;
  confirmationNumber: string;
  teamNumber: string;
  participantCount: number;
};

export type TeamView = {
  id: string;
  name: string;
  code: string;
  maxMembers: number;
  memberCount: number;
  leaderId: string;
  createdAt: string;
  members: TeamMemberView[];
  /** True when the viewing user is this team's leader. */
  isLeader: boolean;
  /** Latest pass registration for this team; null if it never registered. */
  registration: TeamRegistrationView | null;
};

// Search results deliberately leave out the team code.
export type TeamSearchResult = {
  id: string;
  name: string;
  leaderName: string;
  memberCount: number;
  maxMembers: number;
  isFull: boolean;
  /** Has a live registration; its roster is locked, so nobody can join. */
  isRegistered: boolean;
};
