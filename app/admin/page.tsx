import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { supabaseAdmin, PAYMENT_PROOFS_BUCKET } from "@/lib/supabase/admin";
import type { RegistrationRecord } from "@/lib/registration/types";
import { AdminDashboard, type RegistrationWithUrls } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("pass_registrations")
    .select("*")
    .order("created_at", { ascending: false });

  const registrations = (data ?? []) as RegistrationRecord[];

  const withUrls: RegistrationWithUrls[] = await Promise.all(
    registrations.map(async (r) => ({
      ...r,
      screenshotUrl: await signedUrl(r.payment_screenshot_path),
      utrProofUrl: r.utr_proof_path ? await signedUrl(r.utr_proof_path) : null,
    }))
  );

  return (
    <main className="min-h-screen bg-[#2A2A2A] px-4 py-12 text-[#F7F2F6] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="heading text-3xl font-black">Registration Verification</h1>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-bold hover:bg-white/10"
            >
              Sign out
            </button>
          </form>
        </div>
        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 p-4 text-red-400">
            Could not load registrations: {error.message}
          </p>
        )}
        <AdminDashboard registrations={withUrls} />
      </div>
    </main>
  );

  async function signedUrl(path: string) {
    const { data } = await supabase.storage
      .from(PAYMENT_PROOFS_BUCKET)
      .createSignedUrl(path, 3600);
    return data?.signedUrl ?? null;
  }
}
