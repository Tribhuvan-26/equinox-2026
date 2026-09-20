import type { Metadata } from "next";
import { event } from "@/lib/content";
import { AuthPageShell } from "../login/AuthPageShell";
import { VerifyEmail } from "./VerifyEmail";

export const metadata: Metadata = {
  title: `Verify email - ${event.name} ${event.year}`,
  referrer: "no-referrer",
};

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthPageShell>
      <VerifyEmail token={typeof token === "string" ? token : ""} />
    </AuthPageShell>
  );
}
