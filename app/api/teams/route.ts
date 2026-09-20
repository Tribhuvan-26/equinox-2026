import { readJson, requireVerifiedUser, respond, str } from "@/lib/api";
import { createTeam } from "@/lib/teams/service";

export async function POST(request: Request) {
  return respond(async () => {
    const user = await requireVerifiedUser();
    const body = await readJson(request);
    return { team: await createTeam(user.id, str(body.name)) };
  }, 201);
}
