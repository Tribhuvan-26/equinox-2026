import type { Metadata } from "next";
import { event } from "@/lib/content";
import { AuthPageShell } from "../login/AuthPageShell";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = { title: `Forgot password - ${event.name} ${event.year}` };

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
