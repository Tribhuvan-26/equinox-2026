import { requireUser, respond } from "@/lib/api";
import { searchTeams } from "@/lib/teams/service";

export async function GET(request: Request) {
  return respond(async () => {
    await requireUser();
    const q = new URL(request.url).searchParams.get("q") ?? "";
    return { teams: await searchTeams(q) };
  });
}
