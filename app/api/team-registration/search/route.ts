import { ApiError, respond } from "@/lib/api";
import { clientIp, overLimit } from "@/lib/security/rate-limit";
import { searchTeams } from "@/lib/teams/service";

export async function GET(request: Request) {
  return respond(async () => {
    // Stops someone from walking through team names/codes.
    if (await overLimit([{ key: `team-search:ip:${clientIp(request)}`, max: 60, windowSeconds: 900 }])) {
      throw new ApiError(429, "Too many searches. Please wait a few minutes.");
    }
    const q = new URL(request.url).searchParams.get("q") ?? "";
    return { teams: await searchTeams(q) };
  });
}
