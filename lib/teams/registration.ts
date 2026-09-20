import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { TeamRegistrationView } from "./types";

// 42703 = undefined_column. Means supabase/registration-team-link.sql hasn't
// been run yet; treat teams as "never registered" instead of breaking them.
const UNDEFINED_COLUMN = "42703";

/** The team's live registration if it has one, otherwise its latest rejected one. */
export async function getTeamRegistration(teamId: string): Promise<TeamRegistrationView | null> {
  const { data, error } = await supabaseAdmin()
    .from("pass_registrations")
    .select("status, confirmation_number, team_seq, participant_count, created_at")
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === UNDEFINED_COLUMN) return null;
    throw error;
  }
  if (!data || data.length === 0) return null;

  const row = data.find((r) => r.status !== "rejected") ?? data[0];
  return {
    status: row.status,
    confirmationNumber: row.confirmation_number,
    teamNumber: `EQ-${String(row.team_seq).padStart(3, "0")}`,
    participantCount: row.participant_count,
  };
}

/** Which of these teams have a live (not rejected) registration. */
export async function registeredTeamIds(teamIds: string[]): Promise<Set<string>> {
  if (teamIds.length === 0) return new Set();
  const { data, error } = await supabaseAdmin()
    .from("pass_registrations")
    .select("team_id")
    .in("team_id", teamIds)
    .neq("status", "rejected");
  if (error) {
    if (error.code === UNDEFINED_COLUMN) return new Set();
    throw error;
  }
  return new Set((data ?? []).map((r) => r.team_id).filter((id): id is string => id !== null));
}

export async function hasLiveRegistration(teamId: string): Promise<boolean> {
  return (await registeredTeamIds([teamId])).has(teamId);
}

/** Names + emails of a team's members, used to prefill the leader's registration form. */
export async function getMemberContacts(teamId: string): Promise<{ name: string; email: string }[]> {
  const supabase = supabaseAdmin();
  const { data: members, error } = await supabase
    .from("team_members")
    .select("user_id, role, joined_at")
    .eq("team_id", teamId);
  if (error) throw error;

  const { data: users, error: usersError } = await supabase
    .from("platform_users")
    .select("id, name, email")
    .in("id", (members ?? []).map((m) => m.user_id));
  if (usersError) throw usersError;

  const byId = new Map((users ?? []).map((u) => [u.id, u]));
  return (members ?? [])
    .sort((a, b) => (a.role === b.role ? a.joined_at.localeCompare(b.joined_at) : a.role === "leader" ? -1 : 1))
    .map((m) => byId.get(m.user_id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u))
    .map((u) => ({ name: u.name, email: u.email }));
}
