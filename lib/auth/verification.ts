import "server-only";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import { issueToken, RESET_TTL_MS, VERIFY_TTL_MS } from "./tokens";
import { siteUrl } from "./site-url";

// Both helpers swallow failures: they run after the response is sent, and a
// mail outage must not surface as an account error. Failures are logged.

export async function sendVerificationLink(user: { id: string; name: string; email: string }): Promise<void> {
  try {
    const base = siteUrl();
    if (!base) {
      console.error("[auth] SITE_URL is not set, cannot send verification email.");
      return;
    }
    const token = await issueToken(user.id, "verify_email", VERIFY_TTL_MS);
    await sendVerificationEmail(user.email, user.name, `${base}/verify-email?token=${token}`);
  } catch (err) {
    console.error("[auth] sendVerificationLink failed", err);
  }
}

export async function sendResetLink(user: { id: string; name: string; email: string }): Promise<void> {
  try {
    const base = siteUrl();
    if (!base) {
      console.error("[auth] SITE_URL is not set, cannot send password reset email.");
      return;
    }
    const token = await issueToken(user.id, "reset_password", RESET_TTL_MS);
    await sendPasswordResetEmail(user.email, user.name, `${base}/reset-password?token=${token}`);
  } catch (err) {
    console.error("[auth] sendResetLink failed", err);
  }
}
