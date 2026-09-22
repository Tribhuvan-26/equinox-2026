import { after } from "next/server";
import { bearerToken, readJson, requireUuid, respond, str } from "@/lib/api";
import { emailJoinRequested } from "@/lib/teams/notify";
import { authenticate, cancelJoinRequest, getMyRegistration, requestToJoin } from "@/lib/teams/service";

/** Ask a team to take you in. Replaces any request already outstanding. */
export async function POST(request: Request) {
  return respond(async () => {
    const reg = await authenticate(bearerToken(request));
    const teamId = requireUuid(str((await readJson(request)).teamId), "team id");
    const team = await requestToJoin(reg, teamId);

    after(() => emailJoinRequested({ team, applicant: reg }));

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
