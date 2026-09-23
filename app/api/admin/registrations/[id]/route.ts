import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendApprovalEmails } from "@/lib/email";
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

  const supabase = supabaseAdmin();

  // Approving freezes a registration, and a frozen one can never pick a team.
  // Someone who has only paid isn't refusable either -- they are just not ready.
  if (status === "approved") {
    const { data: current, error: lookupError } = await supabase
      .from("pass_registrations")
      .select("team_id")
      .eq("id", id)
      .maybeSingle();
    // A lookup that failed tells us nothing, so it must not read as "has a team".
    if (lookupError) {
      console.error("[admin] approval guard lookup failed", lookupError);
      return NextResponse.json({ error: "Could not check this registration. Please try again." }, { status: 503 });
    }
    if (!current) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }
    if (!current.team_id) {
      return NextResponse.json(
        { error: "This person has paid but isn't on a team yet. Approve them once they've joined one." },
        { status: 409 }
      );
    }
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
      await sendApprovalEmails(registration);
    } catch (err) {
      console.error("[admin] approval email failed", err);
    }
  }

  return NextResponse.json({ registration });
}
