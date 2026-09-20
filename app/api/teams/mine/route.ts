import { requireUser, respond } from "@/lib/api";
import { getMyTeam } from "@/lib/teams/service";

export async function GET() {
  return respond(async () => {
    const user = await requireUser();
    return { team: await getMyTeam(user.id) };
  });
}
