import { readJson, requireVerifiedUser, requireUuid, respond, str } from "@/lib/api";
import { joinTeam } from "@/lib/teams/service";

export async function POST(request: Request) {
  return respond(async () => {
    const user = await requireVerifiedUser();
    const body = await readJson(request);
    const teamId = requireUuid(str(body.teamId), "team id");
    return { team: await joinTeam(user.id, teamId) };
  });
}
