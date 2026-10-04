import { bearerToken, respond } from "@/lib/api";
import { authenticate, getMyRegistration, leaveTeam } from "@/lib/teams/service";

export async function POST(request: Request) {
  return respond(async () => {
    const reg = await authenticate(bearerToken(request));
    await leaveTeam(reg);
    return getMyRegistration({ ...reg, team_id: null, team_role: null });
  });
}
