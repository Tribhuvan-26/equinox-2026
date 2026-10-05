import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { emailApproval } from "@/lib/teams/notify";
import type { RegistrationRecord, RegistrationStatus } from "@/lib/registration/types";

const VALID_STATUSES: RegistrationStatus[] = ["pending", "approved", "rejected"];

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const status = body?.status as RegistrationStatus | undefined;
  const note = typeof body?.note === "string" ? body.note : null;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  // Solo registrations (no team) are approvable; teams are optional for now.
  const supabase = supabaseAdmin();

  // A rejected registration stays rejected; undoing that is a manual fix.
  const { data: current } = await supabase.from("pass_registrations").select("status").eq("id", id).maybeSingle();
  if (current?.status === "rejected") {
    return NextResponse.json({ error: "This registration was marked Not Approved and can't be changed here." }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("pass_registrations")
    .update({ status, admin_note: note, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  const registration = data as RegistrationRecord;

  if (status === "approved") {
    try {
      await emailApproval(registration);
    } catch (err) {
      console.error("[admin] approval email failed", err);
    }
  }

  return NextResponse.json({ registration });
}
