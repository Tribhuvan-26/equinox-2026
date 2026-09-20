import type { Metadata } from "next";
import { event } from "@/lib/content";
import { AuthPageShell } from "../login/AuthPageShell";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: `Reset password - ${event.name} ${event.year}`,
  // Keep the one-time token out of Referer headers sent to other sites.
  referrer: "no-referrer",
};

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthPageShell>
      <ResetPasswordForm token={typeof token === "string" ? token : ""} />
    </AuthPageShell>
  );
}
