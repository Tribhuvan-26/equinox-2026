import { bearerToken, readJson, respond, str } from "@/lib/api";
import { authenticate, createTeamFor, deleteTeam, getMyRegistration, updateTeam } from "@/lib/teams/service";

/** An already-paid person starts their own team and leads it. */
export async function POST(request: Request) {
  return respond(async () => {
    const reg = await authenticate(bearerToken(request));
    const team = await createTeamFor(reg, str((await readJson(request)).name));
    return getMyRegistration({ ...reg, team_id: team.id, team_role: "leader", requested_team_id: null });
  }, 201);
}

export async function PATCH(request: Request) {
  return respond(async () => {
    const reg = await authenticate(bearerToken(request));
    const body = await readJson(request);
    await updateTeam(reg, {
      name: typeof body.name === "string" ? body.name : undefined,
    });
    return getMyRegistration(reg);
  });
}

export async function DELETE(request: Request) {
  return respond(async () => {
    const reg = await authenticate(bearerToken(request));
    await deleteTeam(reg);
    return getMyRegistration({ ...reg, team_id: null, team_role: null });
  });
}
