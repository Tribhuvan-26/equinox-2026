import { requireUser, requireUuid, respond } from "@/lib/api";
import { removeMember } from "@/lib/teams/service";

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string; userId: string }> }) {
  return respond(async () => {
    const user = await requireUser();
    const { id, userId } = await ctx.params;
    await removeMember(user.id, requireUuid(id, "team id"), requireUuid(userId, "member id"));
    return { ok: true };
  });
}
