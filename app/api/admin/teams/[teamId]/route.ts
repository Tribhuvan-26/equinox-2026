import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { emailApproval } from "@/lib/teams/notify";
import type { RegistrationRecord, RegistrationStatus } from "@/lib/registration/types";

const VALID_STATUSES: RegistrationStatus[] = ["pending", "approved", "rejected"];
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Set one status for every registration on a team, in a single click. */
export async function PATCH(request: Request, ctx: { params: Promise<{ teamId: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { teamId } = await ctx.params;
  if (!UUID_REGEX.test(teamId)) {
    return NextResponse.json({ error: "Invalid team id." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const status = body?.status as RegistrationStatus | undefined;
  const note = typeof body?.note === "string" ? body.note : null;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  // Rows already at this status are left alone, so re-clicking cannot send a
  // second approval email to someone who was approved earlier.
  const { data, error } = await supabase
    .from("pass_registrations")
    .update({ status, admin_note: note, updated_at: new Date().toISOString() })
    .eq("team_id", teamId)
    .neq("status", status)
    .select();

  if (error) {
    console.error("[admin] team status update failed", error);
    return NextResponse.json({ error: "Could not update the team." }, { status: 500 });
  }

  const changed = (data ?? []) as RegistrationRecord[];

  if (status === "approved") {
    for (const registration of changed) {
      try {
        await emailApproval(registration);
      } catch (err) {
        console.error("[admin] team approval email failed", registration.id, err);
      }
    }
  }

  return NextResponse.json({ registrations: changed, changed: changed.length });
}
