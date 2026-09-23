import { after } from "next/server";
import { ApiError, bearerToken, readJson, requireUuid, respond, str } from "@/lib/api";
import { clientIp, overLimit } from "@/lib/security/rate-limit";
import { emailJoinRequested } from "@/lib/teams/notify";
import { authenticate, cancelJoinRequest, getMyRegistration, requestToJoin } from "@/lib/teams/service";

/** Ask a team to take you in. Replaces any request already outstanding. */
export async function POST(request: Request) {
  return respond(async () => {
    if (await overLimit([{ key: `team-join:ip:${clientIp(request)}`, max: 20, windowSeconds: 900 }])) {
      throw new ApiError(429, "Too many join requests. Please try again in a few minutes.");
    }

    const reg = await authenticate(bearerToken(request));
    const teamId = requireUuid(str((await readJson(request)).teamId), "team id");
    const { team, changed } = await requestToJoin(reg, teamId);

    // Asking the same team again is a no-op, so the leader isn't mailed twice.
    if (changed) after(() => emailJoinRequested({ team, applicant: reg }));

    return getMyRegistration({ ...reg, requested_team_id: team.id });
  });
}

/** Withdraw it. */
export async function DELETE(request: Request) {
  return respond(async () => {
    const reg = await authenticate(bearerToken(request));
    await cancelJoinRequest(reg);
    return getMyRegistration({ ...reg, requested_team_id: null });
  });
}
