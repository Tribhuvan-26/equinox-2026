import "server-only";
import { ApiError } from "@/lib/api";
import {
  emailAlreadyInTeam,
  EMAIL_IN_TEAM_MESSAGE,
  insertTeamRegistration,
  type InsertedRegistration,
  type ParsedRegistrationForm,
} from "@/lib/registration/team-submit";
import { supabaseAdmin, type RegistrationRow } from "@/lib/supabase/admin";
import { hashAccessToken, newAccessToken } from "./access";
import { generateTeamCode } from "./code";
import { DEFAULT_MAX_MEMBERS, NAME_TAKEN_MESSAGE } from "./constants";
import type { MyRegistrationView, RegistrationTeamRow, TeamSearchResult, TeamView } from "./types";
import { escapeLike, looksLikeTeamCode, normalizeTeamCode, normalizeTeamName, validateMaxMembers, validateTeamName } from "./validation";

const COLS = "id, team_id, team_role, status, participants, confirmation_number, team_seq, admin_note, created_at";
type Reg = Pick<
  RegistrationRow,
  "id" | "team_id" | "team_role" | "status" | "participants" | "confirmation_number" | "team_seq" | "admin_note" | "created_at"
>;

type PgError = { code?: string; message: string; details?: string | null };
const isUnique = (err: PgError, constraint: string) =>
  err.code === "23505" && `${err.message} ${err.details ?? ""}`.includes(constraint);

const APPROVED_LOCK =
  "This registration is already approved. Contact the organisers if something needs to change.";

const nameOf = (reg: Pick<Reg, "participants">) => reg.participants[0]?.name ?? "Unknown";

/* ------------------------------------------------------------------ */
/* Who is calling? (the secret link)                                   */
/* ------------------------------------------------------------------ */

export async function authenticate(token: string): Promise<Reg> {
  const { data, error } = await supabaseAdmin()
    .from("pass_registrations")
    .select(COLS)
    .eq("access_token_hash", hashAccessToken(token))
    .maybeSingle();
  if (error) {
    console.error("[teams] authenticate", error);
    throw new ApiError(500, "Something went wrong. Please try again.");
  }
  if (!data) {
    throw new ApiError(401, "This link is not valid any more. Use “Find my registration” to get a new one.");
  }
  return data;
}

function requireLeader(reg: Reg): string {
  if (reg.team_role !== "leader" || !reg.team_id) throw new ApiError(403, "Only the team leader can do this.");
  return reg.team_id;
}

async function loadTeam(teamId: string): Promise<RegistrationTeamRow | null> {
  const { data, error } = await supabaseAdmin().from("registration_teams").select("*").eq("id", teamId).maybeSingle();
  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------ */
/* Create / join                                                       */
/* ------------------------------------------------------------------ */

export type CreatedTeam = { registration: InsertedRegistration; team: { id: string; name: string; code: string } };

/** The leader registers + pays for themselves; that creates the team and its code. */
export async function createTeamWithLeader(parsed: ParsedRegistrationForm, rawName: string): Promise<CreatedTeam> {
  const nameError = validateTeamName(rawName);
  if (nameError) throw new ApiError(400, nameError, "teamName");
  const name = normalizeTeamName(rawName);

  if (await emailAlreadyInTeam(parsed.participant.email)) throw new ApiError(409, EMAIL_IN_TEAM_MESSAGE, "email");

  const supabase = supabaseAdmin();
  let team: RegistrationTeamRow | null = null;

  // A generated code can (rarely) collide; the unique constraint catches it and we draw again.
  for (let attempt = 0; attempt < 8 && !team; attempt++) {
    const { data, error } = await supabase
      .from("registration_teams")
      .insert({ name, code: generateTeamCode(), max_members: DEFAULT_MAX_MEMBERS })
      .select("*")
      .single();

    if (!error) {
      team = data;
      break;
    }
    if (isUnique(error, "registration_teams_name_key") || isUnique(error, "registration_teams_name_lower_key")) {
      throw new ApiError(409, NAME_TAKEN_MESSAGE, "teamName");
    }
    if (isUnique(error, "registration_teams_code_key")) continue;
    console.error("[teams] create team", error);
    throw new ApiError(500, "Could not create the team. Please try again.");
  }
  if (!team) throw new ApiError(500, "Could not generate a unique team code. Please try again.");

  try {
    const registration = await insertTeamRegistration({ parsed, teamId: team.id, role: "leader" });
    return { registration, team: { id: team.id, name: team.name, code: team.code } };
  } catch (err) {
    // No leader registration = no team. Don't leave the name/code reserved.
    await supabase.from("registration_teams").delete().eq("id", team.id);
    throw err;
  }
}

async function liveCount(teamId: string): Promise<number> {
  const { count, error } = await supabaseAdmin()
    .from("pass_registrations")
    .select("id", { count: "exact", head: true })
    .eq("team_id", teamId)
    .neq("status", "rejected");
  if (error) throw error;
  return count ?? 0;
}

/** A teammate registers + pays for themselves and takes a seat in an existing team. */
export async function joinTeamWithRegistration(
  parsed: ParsedRegistrationForm,
  teamId: string
): Promise<{ registration: InsertedRegistration; team: { id: string; name: string; code: string } }> {
  const team = await loadTeam(teamId);
  if (!team) throw new ApiError(404, "Team not found.");
  if ((await liveCount(team.id)) >= team.max_members) throw new ApiError(409, "This team is full.");
  if (await emailAlreadyInTeam(parsed.participant.email)) throw new ApiError(409, EMAIL_IN_TEAM_MESSAGE, "email");

  const registration = await insertTeamRegistration({ parsed, teamId: team.id, role: "member" });
  return { registration, team: { id: team.id, name: team.name, code: team.code } };
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export async function searchTeams(query: string): Promise<TeamSearchResult[]> {
  const q = normalizeTeamName(query);
  if (q.length < 3) throw new ApiError(400, "Enter a team name or team code.");

  const supabase = supabaseAdmin();
  const found = new Map<string, RegistrationTeamRow>();

  if (looksLikeTeamCode(q)) {
    const { data, error } = await supabase
      .from("registration_teams")
      .select("*")
      .eq("code", normalizeTeamCode(q))
      .maybeSingle();
    if (error) throw error;
    if (data) found.set(data.id, data);
  }

  // Exact (case-insensitive) name match; names are unique ignoring case.
  const { data: byName, error: nameError } = await supabase
    .from("registration_teams")
    .select("*")
    .ilike("name", escapeLike(q))
    .limit(2);
  if (nameError) throw nameError;
  for (const t of byName ?? []) found.set(t.id, t);

  const teams = [...found.values()];
  if (teams.length === 0) return [];

  const { data: regs, error } = await supabase
    .from("pass_registrations")
    .select("team_id, team_role, participants")
    .in("team_id", teams.map((t) => t.id))
    .neq("status", "rejected");
  if (error) throw error;

  return teams.map((t) => {
    const members = (regs ?? []).filter((r) => r.team_id === t.id);
    const leader = members.find((r) => r.team_role === "leader");
    return {
      id: t.id,
      name: t.name,
      leaderName: leader ? nameOf(leader) : "—",
      memberCount: members.length,
      maxMembers: t.max_members,
      isFull: members.length >= t.max_members,
    };
  });
}

/* ------------------------------------------------------------------ */
/* My registration + team                                              */
/* ------------------------------------------------------------------ */

export async function getMyRegistration(reg: Reg): Promise<MyRegistrationView> {
  const isLeader = reg.team_role === "leader";
  let team: TeamView | null = null;

  if (reg.team_id) {
    const row = await loadTeam(reg.team_id);
    if (row) {
      const { data: regs, error } = await supabaseAdmin()
        .from("pass_registrations")
        .select("id, team_role, status, participants, created_at")
        .eq("team_id", row.id)
        .neq("status", "rejected")
        .order("created_at", { ascending: true });
      if (error) throw error;

      const members = (regs ?? [])
        .map((r) => ({
          registrationId: r.id,
          name: nameOf(r),
          role: (r.team_role ?? "member") as "leader" | "member",
          // Payment status is between the person and the organisers, plus the leader.
          ...(isLeader ? { status: r.status } : {}),
          isYou: r.id === reg.id,
        }))
        .sort((a, b) => (a.role === b.role ? 0 : a.role === "leader" ? -1 : 1));

      team = { id: row.id, name: row.name, code: row.code, maxMembers: row.max_members, memberCount: members.length, members };
    }
  }

  return {
    registration: {
      id: reg.id,
      name: nameOf(reg),
      status: reg.status,
      confirmationNumber: reg.confirmation_number,
      adminNote: reg.admin_note,
      createdAt: reg.created_at,
    },
    team,
    isLeader,
  };
}

/* ------------------------------------------------------------------ */
/* Leader / member actions                                             */
/* ------------------------------------------------------------------ */

export async function updateTeam(reg: Reg, input: { name?: string; maxMembers?: unknown }): Promise<void> {
  const teamId = requireLeader(reg);
  const patch: Partial<Pick<RegistrationTeamRow, "name" | "max_members">> = {};

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

  const { error } = await supabaseAdmin().from("registration_teams").update(patch).eq("id", teamId);
  if (error) {
    if (isUnique(error, "registration_teams_name_key") || isUnique(error, "registration_teams_name_lower_key")) {
      throw new ApiError(409, NAME_TAKEN_MESSAGE, "name");
    }
    if (error.message.includes("team_size_below_members")) {
      throw new ApiError(409, "Team size cannot be lower than the current number of members.", "maxMembers");
    }
    console.error("[teams] updateTeam", error);
    throw new ApiError(500, "Could not update the team. Please try again.");
  }
}

/** Take a registration out of its team; it stays a valid, paid registration. */
async function unlink(where: { id?: string; team_id?: string }): Promise<void> {
  let query = supabaseAdmin().from("pass_registrations").update({ team_id: null, team_role: null });
  if (where.id) query = query.eq("id", where.id);
  if (where.team_id) query = query.eq("team_id", where.team_id);
  const { error } = await query;
  if (error) throw error;
}

export async function deleteTeam(reg: Reg): Promise<void> {
  const teamId = requireLeader(reg);

  const { data: approved, error } = await supabaseAdmin()
    .from("pass_registrations")
    .select("id")
    .eq("team_id", teamId)
    .eq("status", "approved")
    .limit(1);
  if (error) throw error;
  if ((approved ?? []).length > 0) {
    throw new ApiError(409, "Someone on this team is already approved, so the team can't be deleted. Contact the organisers.");
  }

  // Everyone keeps their (paid) registration; they just stop being grouped.
  await unlink({ team_id: teamId });
  const { error: deleteError } = await supabaseAdmin().from("registration_teams").delete().eq("id", teamId);
  if (deleteError) throw deleteError;
}

export async function removeMember(reg: Reg, targetRegistrationId: string): Promise<void> {
  const teamId = requireLeader(reg);

  const { data: target, error } = await supabaseAdmin()
    .from("pass_registrations")
    .select("id, team_role, status")
    .eq("id", targetRegistrationId)
    .eq("team_id", teamId)
    .maybeSingle();
  if (error) throw error;
  if (!target) throw new ApiError(404, "That person is not on this team.");
  if (target.team_role === "leader") throw new ApiError(400, "The team leader cannot be removed. Delete the team instead.");
  if (target.status === "approved") throw new ApiError(409, APPROVED_LOCK);

  await unlink({ id: target.id });
}

export async function leaveTeam(reg: Reg): Promise<void> {
  if (!reg.team_id) throw new ApiError(404, "You are not in a team.");
  if (reg.team_role === "leader") {
    throw new ApiError(403, "The team leader cannot leave. Delete the team instead.");
  }
  if (reg.status === "approved") throw new ApiError(409, APPROVED_LOCK);
  await unlink({ id: reg.id });
}

/* ------------------------------------------------------------------ */
/* Lost link                                                           */
/* ------------------------------------------------------------------ */

export type RotatedAccess = {
  token: string;
  name: string;
  email: string;
  confirmationNumber: string;
  role: "leader" | "member" | null;
  team: { name: string; code: string } | null;
};

/**
 * Someone lost their link. Proof = the email on the registration plus its
 * confirmation number. Issues a brand-new token, which cuts off the old link.
 */
export async function rotateAccessToken(email: string, confirmation: string): Promise<RotatedAccess | null> {
  const supabase = supabaseAdmin();
  const { data: reg, error } = await supabase
    .from("pass_registrations")
    .select("id, team_id, team_role, participants, confirmation_number, member_email")
    .eq("member_email", email.trim().toLowerCase())
    .eq("confirmation_number", confirmation.trim().toUpperCase())
    .maybeSingle();
  if (error) throw error;
  if (!reg || !reg.member_email) return null;

  const { token, hash } = newAccessToken();
  const { error: updateError } = await supabase.from("pass_registrations").update({ access_token_hash: hash }).eq("id", reg.id);
  if (updateError) throw updateError;

  const team = reg.team_id ? await loadTeam(reg.team_id) : null;
  return {
    token,
    name: nameOf(reg),
    email: reg.member_email,
    confirmationNumber: reg.confirmation_number,
    role: reg.team_role,
    team: team ? { name: team.name, code: team.code } : null,
  };
}
