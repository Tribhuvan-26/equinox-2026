import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { supabaseAdmin, PAYMENT_PROOFS_BUCKET } from "@/lib/supabase/admin";
import type { RegistrationRecord } from "@/lib/registration/types";
import type { RegistrationRow } from "@/lib/supabase/admin";
import { AdminDashboard, type RegistrationWithUrls } from "./AdminDashboard";

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

  // Team registrations carry the team's id; show its name.
  const teamIds = [...new Set(registrations.map((r) => r.team_id).filter((id): id is string => Boolean(id)))];
  const { data: teams } = teamIds.length
    ? await supabase.from("registration_teams").select("id, name").in("id", teamIds)
    : { data: [] };
  const teamNames = new Map((teams ?? []).map((t) => [t.id, t.name]));

  const withUrls: RegistrationWithUrls[] = await Promise.all(
    registrations.map(async (r) => ({
      ...r,
      teamName: r.team_id ? (teamNames.get(r.team_id) ?? null) : null,
      screenshotUrl: await signedUrl(r.payment_screenshot_path),
      utrProofUrl: r.utr_proof_path ? await signedUrl(r.utr_proof_path) : null,
    }))
  );

  return (
    <main className="min-h-screen bg-[#2A2A2A] px-4 py-12 text-[#F7F2F6] sm:px-8">
      {error && (
        <p className="mx-auto mb-4 max-w-6xl rounded-xl bg-red-500/10 p-4 text-red-400">
          Could not load registrations: {error.message}
        </p>
      )}
      <AdminDashboard registrations={withUrls} />
    </main>
  );

  async function signedUrl(path: string) {
    const { data } = await supabase.storage
      .from(PAYMENT_PROOFS_BUCKET)
      .createSignedUrl(path, 3600);
    return data?.signedUrl ?? null;
  }
}
