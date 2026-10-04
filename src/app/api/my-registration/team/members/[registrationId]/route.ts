import { bearerToken, requireUuid, respond } from "@/lib/api";
import { authenticate, getMyRegistration, removeMember } from "@/lib/teams/service";

export async function DELETE(request: Request, ctx: { params: Promise<{ registrationId: string }> }) {
  return respond(async () => {
    const reg = await authenticate(bearerToken(request));
    await removeMember(reg, requireUuid((await ctx.params).registrationId, "member id"));
    return getMyRegistration(reg);
  });
}
