import { after } from "next/server";
import { bearerToken, readJson, requireUuid, respond } from "@/lib/api";
import { emailJoinDecision } from "@/lib/teams/notify";
import { authenticate, decideJoinRequest, getMyRegistration } from "@/lib/teams/service";

/** The leader accepts or declines one request. Body: { accept: boolean }. */
export async function POST(request: Request, ctx: { params: Promise<{ registrationId: string }> }) {
  return respond(async () => {
    const reg = await authenticate(bearerToken(request));
    const accept = (await readJson(request)).accept === true;
    const id = requireUuid((await ctx.params).registrationId, "registration id");
    const decided = await decideJoinRequest(reg, id, accept);

    after(() => emailJoinDecision(decided));

    return getMyRegistration(reg);
  });
}
