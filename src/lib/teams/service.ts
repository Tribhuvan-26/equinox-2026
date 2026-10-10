import "server-only";
import { ApiError } from "@/lib/api";
import {
  emailsAlreadyRegistered,
  EMAIL_IN_TEAM_MESSAGE,
  insertTeamBatchRegistration,
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

const COLS =
  "id, team_id, team_role, requested_team_id, status, participants, confirmation_number, team_seq, admin_note, created_at";
export type Reg = Pick<
  RegistrationRow,
  | "id"
  | "team_id"
  | "team_role"
  | "requested_team_id"
  | "status"
  | "participants"
  | "confirmation_number"
  | "team_seq"
  | "admin_note"
  | "created_at"
>;

type PgError = { code?: string; message: string; details?: string | null };
const isUnique = (err: PgError, constraint: string) =>
  err.code === "23505" && `${err.message} ${err.details ?? ""}`.includes(constraint);

export const APPROVED_LOCK =
  "This registration is already approved. Contact the organisers if something needs to change.";

export const REJECTED_LOCK =
  "This registration was not approved, so it cannot join a team. Contact the organisers.";

export const nameOf = (reg: Pick<Reg, "participants">) => reg.participants[0]?.name ?? "Unknown";

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

export async function loadTeam(teamId: string): Promise<RegistrationTeamRow | null> {
  const { data, error } = await supabaseAdmin().from("registration_teams").select("*").eq("id", teamId).maybeSingle();
  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------ */
/* Create / join                                                       */
/* ------------------------------------------------------------------ */

/**
 * Step one: pay for yourself (Option B) or your team together (Option A).
 */
export async function registerPaid(parsed: ParsedRegistrationForm): Promise<InsertedRegistration> {
  const emails = parsed.participants.map((p) => p.email);
  const already = await emailsAlreadyRegistered(emails);
  if (already.length > 0) {
    throw new ApiError(
      409,
      already.length === 1
        ? EMAIL_IN_TEAM_MESSAGE
        : `These emails are already registered: ${already.join(", ")}. Each participant must use an unregistered email.`,
      "email"
    );
  }

  if (parsed.registrationType === "team") {
    if (!parsed.teamName || !parsed.teamName.trim()) {
      throw new ApiError(400, "Team name is required.", "teamName");
    }
    const team = await reserveTeam(parsed.teamName);
    try {
      return await insertTeamBatchRegistration({ parsed, team });
    } catch (err) {
      await supabaseAdmin().from("registration_teams").delete().eq("id", team.id);
      throw err;
    }
  }

  return insertTeamRegistration({ parsed, teamId: null, role: null });
}

/** Reserve a team name + code. The caller decides who becomes its leader. */
export async function reserveTeam(rawName: string): Promise<RegistrationTeamRow> {
  const nameError = validateTeamName(rawName);
  if (nameError) throw new ApiError(400, nameError, "teamName");
  const name = normalizeTeamName(rawName);

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
  return team;
}

/**
 * An already-paid, teamless person starts a team and leads it. If claiming the
 * team fails, the name and code are released rather than left reserved.
 */
export async function createTeamFor(reg: Reg, rawName: string): Promise<{ id: string; name: string; code: string }> {
  if (reg.team_id) throw new ApiError(409, "You are already on a team.");
  if (reg.status === "rejected") throw new ApiError(409, REJECTED_LOCK);
  const team = await reserveTeam(rawName);

  const { data: claimed, error } = await supabaseAdmin()
    .from("pass_registrations")
    .update({ team_id: team.id, team_role: "leader", requested_team_id: null })
    .eq("id", reg.id)
    .is("team_id", null)
    .select("id");

  // No error but no row means a leader accepted their outstanding request
  // between authenticate() and this write: they are on a team already, so the
  // reserved name and code must go back rather than hang off a team nobody leads.
  if (error || (claimed ?? []).length === 0) {
    await supabaseAdmin().from("registration_teams").delete().eq("id", team.id);
    if (!error) throw new ApiError(409, "You are already on a team.");
    console.error("[teams] createTeamFor", error);
    throw new ApiError(500, "Could not create the team. Please try again.");
  }

  return { id: team.id, name: team.name, code: team.code };
}

export async function liveCount(teamId: string): Promise<number> {
  const { count, error } = await supabaseAdmin()
    .from("pass_registrations")
    .select("id", { count: "exact", head: true })
    .eq("team_id", teamId)
    .neq("status", "rejected");
  if (error) throw error;
  return count ?? 0;
}

/**
 * Ask a team to take you in. A request holds no seat: the seat is taken only
 * when the leader accepts, so several people may queue for the same last place.
 */
export async function requestToJoin(
  reg: Reg,
  teamId: string
): Promise<{ team: RegistrationTeamRow; changed: boolean }> {
  if (reg.team_id) throw new ApiError(409, "You are already on a team. Leave it before asking to join another.");
  // A rejected registration never reaches the leader's inbox (it filters them
  // out), so letting it queue would park the person on "waiting" for ever.
  if (reg.status === "rejected") throw new ApiError(409, REJECTED_LOCK);
  const team = await loadTeam(teamId);
  if (!team) throw new ApiError(404, "Team not found.");
  if ((await liveCount(team.id)) >= team.max_members) throw new ApiError(409, "This team is full.");

  // Only write when the request actually moves. Postgres re-checks the filter
  // after the row lock clears, so of two simultaneous clicks exactly one
  // matches -- and a repeat click on the same team matches nothing at all.
  const { data: asked, error } = await supabaseAdmin()
    .from("pass_registrations")
    .update({ requested_team_id: team.id })
    .eq("id", reg.id)
    .or(`requested_team_id.is.null,requested_team_id.neq.${team.id}`)
    .select("id");
  if (error) {
    console.error("[teams] requestToJoin", error);
    throw new ApiError(500, "Could not send your request. Please try again.");
  }
  return { team, changed: (asked ?? []).length > 0 };
}

/** Withdraw the outstanding request, whoever it was to. */
export async function cancelJoinRequest(reg: Reg): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("pass_registrations")
    .update({ requested_team_id: null })
    .eq("id", reg.id);
  if (error) throw error;
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

  // A full team can't take anyone, so it isn't a search result at all.
  return teams
    .map((t) => {
      const members = (regs ?? []).filter((r) => r.team_id === t.id);
      const leader = members.find((r) => r.team_role === "leader");
      return {
        id: t.id,
        name: t.name,
        leaderName: leader ? nameOf(leader) : "—",
        memberCount: members.length,
        maxMembers: t.max_members,
      };
    })
    .filter((t) => t.memberCount < t.maxMembers);
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

      // Only the leader answers requests, so only the leader is shown them.
      if (isLeader) {
        const { data: asking, error: askError } = await supabaseAdmin()
          .from("pass_registrations")
          .select("id, participants, created_at")
          .eq("requested_team_id", row.id)
          .neq("status", "rejected")
          .order("created_at", { ascending: true });
        if (askError) throw askError;
        team.joinRequests = (asking ?? []).map((r) => ({
          registrationId: r.id,
          name: nameOf(r),
          requestedAt: r.created_at,
        }));
      }
    }
  }

  let requestedTeam: MyRegistrationView["requestedTeam"] = null;
  if (!reg.team_id && reg.requested_team_id) {
    const row = await loadTeam(reg.requested_team_id);
    if (row) {
      const { data: leader } = await supabaseAdmin()
        .from("pass_registrations")
        .select("participants")
        .eq("team_id", row.id)
        .eq("team_role", "leader")
        .maybeSingle();
      requestedTeam = { id: row.id, name: row.name, leaderName: leader ? nameOf(leader) : "—" };
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
    requestedTeam,
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

export type DecidedRequest = {
  team: RegistrationTeamRow;
  accepted: boolean;
  person: { name: string; email: string };
  /** Others whose request was dropped because the team filled up. */
  crowdedOut: { name: string; email: string }[];
};

/**
 * The leader answers one request. Accepting moves the person into the team; the
 * capacity trigger is what actually guarantees the seat exists, so two leaders
 * (or two clicks) racing for the last place cannot both win.
 */
export async function decideJoinRequest(
  reg: Reg,
  targetRegistrationId: string,
  accept: boolean
): Promise<DecidedRequest> {
  const teamId = requireLeader(reg);
  const team = await loadTeam(teamId);
  if (!team) throw new ApiError(404, "Team not found.");

  const supabase = supabaseAdmin();
  const { data: target, error: findError } = await supabase
    .from("pass_registrations")
    .select("id, participants, member_email")
    .eq("id", targetRegistrationId)
    .eq("requested_team_id", teamId)
    .maybeSingle();
  if (findError) throw findError;
  if (!target) throw new ApiError(404, "That request is no longer open.");

  const person = { name: nameOf(target), email: target.member_email ?? "" };

  if (!accept) {
    const { error } = await supabase
      .from("pass_registrations")
      .update({ requested_team_id: null })
      .eq("id", target.id);
    if (error) throw error;
    return { team, accepted: false, person, crowdedOut: [] };
  }

  const { data: moved, error } = await supabase
    .from("pass_registrations")
    .update({ team_id: teamId, team_role: "member", requested_team_id: null })
    .eq("id", target.id)
    .is("team_id", null)
    .select("id");
  if (error) {
    if (error.message.includes("team_full")) throw new ApiError(409, "This team is full.");
    if (error.code === "23505") throw new ApiError(409, "That person is already on a team.");
    console.error("[teams] decideJoinRequest", error);
    throw new ApiError(500, "Could not accept the request. Please try again.");
  }
  // No error but no row means they landed somewhere else between the read and
  // the write. Nothing happened, so don't tell the leader (or them) otherwise.
  if ((moved ?? []).length === 0) throw new ApiError(409, "That person has already joined another team.");

  // A full team can't answer anyone else, so withdraw the rest rather than
  // leave them waiting on a seat that no longer exists.
  let crowdedOut: { name: string; email: string }[] = [];
  if ((await liveCount(teamId)) >= team.max_members) {
    // Same filter as the leader's inbox: a rejected registration was never a
    // real applicant, so it must not be told its payment still stands.
    const { data: waiting } = await supabase
      .from("pass_registrations")
      .select("id, participants, member_email")
      .eq("requested_team_id", teamId)
      .neq("status", "rejected");
    crowdedOut = (waiting ?? []).map((r) => ({ name: nameOf(r), email: r.member_email ?? "" }));
    if (crowdedOut.length > 0) {
      await supabase
        .from("pass_registrations")
        .update({ requested_team_id: null })
        .eq("requested_team_id", teamId)
        .neq("status", "rejected");
    }
  }

  return { team, accepted: true, person, crowdedOut };
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
