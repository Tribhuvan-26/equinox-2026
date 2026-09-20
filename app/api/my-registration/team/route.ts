import { bearerToken, readJson, respond } from "@/lib/api";
import { authenticate, deleteTeam, getMyRegistration, updateTeam } from "@/lib/teams/service";

export async function PATCH(request: Request) {
  return respond(async () => {
    const reg = await authenticate(bearerToken(request));
    const body = await readJson(request);
    await updateTeam(reg, {
      name: typeof body.name === "string" ? body.name : undefined,
      maxMembers: body.maxMembers,
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
