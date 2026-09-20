import { readJson, requireUser, requireUuid, respond } from "@/lib/api";
import { deleteTeam, updateTeam } from "@/lib/teams/service";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  return respond(async () => {
    const user = await requireUser();
    const teamId = requireUuid((await ctx.params).id, "team id");
    const body = await readJson(request);
    return {
      team: await updateTeam(user.id, teamId, {
        name: typeof body.name === "string" ? body.name : undefined,
        maxMembers: body.maxMembers,
      }),
    };
  });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  return respond(async () => {
    const user = await requireUser();
    await deleteTeam(user.id, requireUuid((await ctx.params).id, "team id"));
    return { ok: true };
  });
}
