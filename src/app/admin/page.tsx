import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { supabaseAdmin, PAYMENT_PROOFS_BUCKET } from "@/lib/supabase/admin";
import type { RegistrationRecord } from "@/lib/registration/types";
import type { RegistrationRow } from "@/lib/supabase/admin";
import { AdminDashboard, type AdminTeam, type RegistrationWithUrls } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("pass_registrations")
    .select("*")
    .order("created_at", { ascending: false });

  // Never send the secret-link hash or member email to the browser.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const registrations: RegistrationRecord[] = ((data ?? []) as RegistrationRow[]).map(
    ({ access_token_hash, member_email, ...safe }) => safe
  );
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // Every team, including ones nobody has joined yet, for the Teams page.
  const { data: teamRows } = await supabase
    .from("registration_teams")
    .select("id, name, code, max_members, created_at")
    .order("created_at", { ascending: false });
  const teams: AdminTeam[] = teamRows ?? [];
  const teamNames = new Map(teams.map((t) => [t.id, t.name]));

  // One batched call instead of up to 2 round trips per registration.
  const paths = registrations.flatMap((r) =>
    [r.payment_screenshot_path, r.utr_proof_path].filter((p): p is string => !!p)
  );
  const { data: signed } = paths.length
    ? await supabase.storage.from(PAYMENT_PROOFS_BUCKET).createSignedUrls(paths, 3600)
    : { data: [] };
  const urls = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  const withUrls: RegistrationWithUrls[] = registrations.map((r) => ({
    ...r,
    teamName: r.team_id ? (teamNames.get(r.team_id) ?? null) : null,
    requestedTeamName: r.requested_team_id ? (teamNames.get(r.requested_team_id) ?? null) : null,
    screenshotUrl: urls.get(r.payment_screenshot_path) ?? null,
    utrProofUrl: r.utr_proof_path ? (urls.get(r.utr_proof_path) ?? null) : null,
  }));

  return (
    <main className="min-h-screen bg-[#2A2A2A] px-4 py-12 text-[#F7F2F6] sm:px-8">
      {error && (
        <p className="mx-auto mb-4 max-w-6xl rounded-xl bg-red-500/10 p-4 text-red-400">
          Could not load registrations: {error.message}
        </p>
      )}
      <AdminDashboard registrations={withUrls} teams={teams} />
    </main>
  );

  async function signedUrl(path: string) {
    const { data } = await supabase.storage
      .from(PAYMENT_PROOFS_BUCKET)
      .createSignedUrl(path, 3600);
    return data?.signedUrl ?? null;
  }
}
