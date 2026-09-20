import { requireUser, respond } from "@/lib/api";
import { leaveTeam } from "@/lib/teams/service";

export async function POST() {
  return respond(async () => {
    const user = await requireUser();
    await leaveTeam(user.id);
    return { ok: true };
  });
}
