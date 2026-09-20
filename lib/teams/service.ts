import "server-only";
import { ApiError } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateTeamCode } from "./code";
import { getTeamRegistration, hasLiveRegistration, registeredTeamIds } from "./registration";
import { DEFAULT_MAX_MEMBERS, NAME_TAKEN_MESSAGE } from "./constants";
import type { TeamRow, TeamSearchResult, TeamView } from "./types";
import {
  escapeLike,
  looksLikeTeamCode,
  normalizeTeamCode,
  normalizeTeamName,
  validateMaxMembers,
  validateTeamName,
} from "./validation";

type PgError = { code?: string; message: string; details?: string | null };

// Postgres unique violations name the constraint; use it to say what collided.
function isUniqueViolation(err: PgError, constraint: string): boolean {
  return err.code === "23505" && `${err.message} ${err.details ?? ""}`.includes(constraint);
}

function hasMessage(err: PgError, text: string): boolean {
  return err.message.includes(text);
}

const ALREADY_IN_TEAM = "You are already in a team. Leave it before joining or creating another.";
const TEAM_FULL = "This team is full.";
const TEAM_REGISTERED =
  "This team has a registration, so its roster is locked. Contact the organisers if something needs to change.";
const TEAM_REGISTERED_JOIN = "This team is already registered and is not taking new members.";

async function assertRosterOpen(teamId: string): Promise<void> {
  if (await hasLiveRegistration(teamId)) throw new ApiError(409, TEAM_REGISTERED);
}

/**
 * Translate database constraint failures into user-facing errors. Every rule
 * is enforced in Postgres; this only picks the wording.
 */
function mapMembershipError(err: PgError): ApiError {
  if (isUniqueViolation(err, "team_members_team_user_key")) {
    return new ApiError(409, "You are already a member of this team.");
  }
  if (isUniqueViolation(err, "team_members_user_key")) return new ApiError(409, ALREADY_IN_TEAM);
  if (hasMessage(err, "team_full")) return new ApiError(409, TEAM_FULL);
  if (hasMessage(err, "team_registered")) return new ApiError(409, TEAM_REGISTERED_JOIN);
  if (hasMessage(err, "team_not_found")) return new ApiError(404, "Team not found.");
  console.error("[teams] membership error", err);
  return new ApiError(500, "Something went wrong. Please try again.");
}

async function loadTeam(teamId: string): Promise<TeamRow> {
  const { data, error } = await supabaseAdmin().from("teams").select("*").eq("id", teamId).maybeSingle();
  if (error) {
    console.error("[teams] loadTeam", error);
    throw new ApiError(500, "Something went wrong. Please try again.");
  }
  if (!data) throw new ApiError(404, "Team not found.");
  return data;
}

async function loadLeaderTeam(userId: string, teamId: string): Promise<TeamRow> {
  const team = await loadTeam(teamId);
  if (team.leader_id !== userId) {
    throw new ApiError(403, "Only the team leader can do this.");
  }
  return team;
}

async function buildTeamView(team: TeamRow, viewerId: string): Promise<TeamView> {
  const supabase = supabaseAdmin();
  const { data: members, error } = await supabase
    .from("team_members")
    .select("user_id, role, joined_at")
    .eq("team_id", team.id)
    .order("joined_at", { ascending: true });
  if (error) throw error;

  const ids = (members ?? []).map((m) => m.user_id);
  const { data: users, error: usersError } = await supabase
    .from("platform_users")
    .select("id, name")
    .in("id", ids);
  if (usersError) throw usersError;
  const names = new Map((users ?? []).map((u) => [u.id, u.name]));

  const list = (members ?? [])
    .map((m) => ({
      userId: m.user_id,
      name: names.get(m.user_id) ?? "Unknown",
      role: m.role,
      joinedAt: m.joined_at,
    }))
    // Leader first, then by join time.
    .sort((a, b) => (a.role === b.role ? 0 : a.role === "leader" ? -1 : 1));

  return {
    id: team.id,
    name: team.name,
    code: team.code,
    maxMembers: team.max_members,
    memberCount: list.length,
    leaderId: team.leader_id,
    createdAt: team.created_at,
    members: list,
    isLeader: team.leader_id === viewerId,
    registration: await getTeamRegistration(team.id),
  };
}

export async function getMyTeam(userId: string): Promise<TeamView | null> {
  const { data: membership, error } = await supabaseAdmin()
    .from("team_members")
    .select("team_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!membership) return null;

  return buildTeamView(await loadTeam(membership.team_id), userId);
}

async function isInAnyTeam(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin()
    .from("team_members")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function createTeam(userId: string, rawName: string): Promise<TeamView> {
  const nameError = validateTeamName(rawName);
  if (nameError) throw new ApiError(400, nameError, "name");
  const name = normalizeTeamName(rawName);

  // Friendly early exit; the unique(user_id) constraint is the real guard.
  if (await isInAnyTeam(userId)) throw new ApiError(409, ALREADY_IN_TEAM);

  // A generated code can (rarely) collide with an existing one. The unique
  // constraint catches it and we simply draw a new code.
  for (let attempt = 0; attempt < 8; attempt++) {
    const { data, error } = await supabaseAdmin().rpc("create_team_with_leader", {
      p_user_id: userId,
      p_name: name,
      p_code: generateTeamCode(),
      p_max_members: DEFAULT_MAX_MEMBERS,
    });

    if (!error) return buildTeamView(data, userId);

    if (isUniqueViolation(error, "teams_name_key") || isUniqueViolation(error, "teams_name_lower_key")) {
      throw new ApiError(409, NAME_TAKEN_MESSAGE, "name");
    }
    if (isUniqueViolation(error, "team_members_user_key")) throw new ApiError(409, ALREADY_IN_TEAM);
    if (isUniqueViolation(error, "teams_code_key")) continue;

    console.error("[teams] createTeam", error);
    throw new ApiError(500, "Could not create the team. Please try again.");
  }
  throw new ApiError(500, "Could not generate a unique team code. Please try again.");
}

export async function searchTeams(query: string): Promise<TeamSearchResult[]> {
  const q = normalizeTeamName(query);
  if (q.length < 3) throw new ApiError(400, "Enter a team name or team code.");

  const supabase = supabaseAdmin();
  const found = new Map<string, TeamRow>();

  if (looksLikeTeamCode(q)) {
    const { data, error } = await supabase.from("teams").select("*").eq("code", normalizeTeamCode(q)).maybeSingle();
    if (error) throw error;
    if (data) found.set(data.id, data);
  }

  // Exact (case-insensitive) name match. Names are unique ignoring case.
  const { data: byName, error: nameError } = await supabase
    .from("teams")
    .select("*")
    .ilike("name", escapeLike(q))
    .limit(2);
  if (nameError) throw nameError;
  for (const t of byName ?? []) found.set(t.id, t);

  const teams = [...found.values()];
  if (teams.length === 0) return [];

  const teamIds = teams.map((t) => t.id);
  const { data: members, error: membersError } = await supabase
    .from("team_members")
    .select("team_id")
    .in("team_id", teamIds);
  if (membersError) throw membersError;

  const counts = new Map<string, number>();
  for (const m of members ?? []) counts.set(m.team_id, (counts.get(m.team_id) ?? 0) + 1);

  const { data: leaders, error: leadersError } = await supabase
    .from("platform_users")
    .select("id, name")
    .in("id", teams.map((t) => t.leader_id));
  if (leadersError) throw leadersError;
  const leaderNames = new Map((leaders ?? []).map((u) => [u.id, u.name]));
  const registered = await registeredTeamIds(teamIds);

  return teams.map((t) => {
    const memberCount = counts.get(t.id) ?? 0;
    return {
      id: t.id,
      name: t.name,
      leaderName: leaderNames.get(t.leader_id) ?? "Unknown",
      memberCount,
      maxMembers: t.max_members,
      isFull: memberCount >= t.max_members,
      isRegistered: registered.has(t.id),
    };
  });
}

export async function joinTeam(userId: string, teamId: string): Promise<TeamView> {
  const team = await loadTeam(teamId);
  if (await hasLiveRegistration(team.id)) throw new ApiError(409, TEAM_REGISTERED_JOIN);

  // Friendly early exits. Duplicate / one-team / capacity are all enforced by
  // the database too, so a race between these checks and the insert is safe.
  const { data: existing, error } = await supabaseAdmin()
    .from("team_members")
    .select("team_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (existing) {
    throw new ApiError(
      409,
      existing.team_id === team.id ? "You are already a member of this team." : ALREADY_IN_TEAM
    );
  }

  const { error: insertError } = await supabaseAdmin()
    .from("team_members")
    .insert({ team_id: team.id, user_id: userId, role: "member" });
  if (insertError) throw mapMembershipError(insertError);

  return buildTeamView(team, userId);
}

export async function leaveTeam(userId: string): Promise<void> {
  const { data: membership, error } = await supabaseAdmin()
    .from("team_members")
    .select("team_id, role")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!membership) throw new ApiError(404, "You are not in a team.");
  if (membership.role === "leader") {
    throw new ApiError(403, "The team leader cannot leave. Delete the team instead.");
  }
  await assertRosterOpen(membership.team_id);

  const { error: deleteError } = await supabaseAdmin()
    .from("team_members")
    .delete()
    .eq("user_id", userId)
    .eq("role", "member");
  if (deleteError) throw mapMembershipError(deleteError);
}

export async function updateTeam(
  userId: string,
  teamId: string,
  input: { name?: string; maxMembers?: unknown }
): Promise<TeamView> {
  const team = await loadLeaderTeam(userId, teamId);
  const patch: Partial<Pick<TeamRow, "name" | "max_members">> = {};

  if (input.name !== undefined) {
    const nameError = validateTeamName(input.name);
    if (nameError) throw new ApiError(400, nameError, "name");
    patch.name = normalizeTeamName(input.name);
  }

  if (input.maxMembers !== undefined) {
    const max = validateMaxMembers(input.maxMembers);
    if (max === null) throw new ApiError(400, "Choose a valid team size.", "maxMembers");
    patch.max_members = max;
  }

  if (Object.keys(patch).length === 0) throw new ApiError(400, "Nothing to update.");

  const { data, error } = await supabaseAdmin()
    .from("teams")
    .update(patch)
    .eq("id", team.id)
    .eq("leader_id", userId)
    .select("*")
    .maybeSingle();

  if (error) {
    if (isUniqueViolation(error, "teams_name_key") || isUniqueViolation(error, "teams_name_lower_key")) {
      throw new ApiError(409, NAME_TAKEN_MESSAGE, "name");
    }
    if (hasMessage(error, "team_size_below_members")) {
      throw new ApiError(409, "Team size cannot be lower than the current number of members.", "maxMembers");
    }
    console.error("[teams] updateTeam", error);
    throw new ApiError(500, "Could not update the team. Please try again.");
  }
  if (!data) throw new ApiError(403, "Only the team leader can do this.");

  return buildTeamView(data, userId);
}

export async function deleteTeam(userId: string, teamId: string): Promise<void> {
  const team = await loadLeaderTeam(userId, teamId);
  await assertRosterOpen(team.id);

  // Members go with it (ON DELETE CASCADE).
  const { error } = await supabaseAdmin().from("teams").delete().eq("id", team.id).eq("leader_id", userId);
  if (error) {
    if (hasMessage(error, "team_registered")) throw new ApiError(409, TEAM_REGISTERED);
    console.error("[teams] deleteTeam", error);
    throw new ApiError(500, "Could not delete the team. Please try again.");
  }
}

export async function removeMember(userId: string, teamId: string, targetUserId: string): Promise<void> {
  const team = await loadLeaderTeam(userId, teamId);
  if (targetUserId === team.leader_id) {
    throw new ApiError(400, "The team leader cannot be removed. Delete the team instead.");
  }
  await assertRosterOpen(team.id);

  const { data, error } = await supabaseAdmin()
    .from("team_members")
    .delete()
    .eq("team_id", team.id)
    .eq("user_id", targetUserId)
    .eq("role", "member")
    .select("id");
  if (error) {
    if (hasMessage(error, "team_registered")) throw new ApiError(409, TEAM_REGISTERED);
    console.error("[teams] removeMember", error);
    throw new ApiError(500, "Could not remove the member. Please try again.");
  }
  if (!data || data.length === 0) throw new ApiError(404, "That person is not a member of this team.");
}
