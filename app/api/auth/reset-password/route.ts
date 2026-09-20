import { ApiError, readJson, respond, str } from "@/lib/api";
import { hashPassword } from "@/lib/auth/password";
import { clientIp, overLimit } from "@/lib/auth/rate-limit";
import { consumeToken, voidTokens } from "@/lib/auth/tokens";
import { validatePassword } from "@/lib/auth/validation";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  return respond(async () => {
    if (await overLimit([{ key: `reset:ip:${clientIp(request)}`, max: 20, windowSeconds: 900 }])) {
      throw new ApiError(429, "Too many attempts. Please wait a few minutes and try again.");
    }

    const body = await readJson(request);
    const password = str(body.password);

    // Check the password first so a typo doesn't burn the one-time link.
    const passwordError = validatePassword(password);
    if (passwordError) throw new ApiError(400, passwordError, "password");

    const userId = await consumeToken(str(body.token), "reset_password");
    if (!userId) throw new ApiError(400, "This reset link is invalid or has expired. Request a new one.");

    const supabase = supabaseAdmin();
    const { data: user, error: readError } = await supabase
      .from("platform_users")
      .select("session_version, email_verified_at")
      .eq("id", userId)
      .maybeSingle();
    if (readError || !user) {
      console.error("[auth] reset-password read", readError);
      throw new ApiError(500, "Could not reset your password. Please request a new link.");
    }

    const { error } = await supabase
      .from("platform_users")
      .update({
        password_hash: await hashPassword(password),
        // Signs out every device that still holds an old session cookie.
        session_version: user.session_version + 1,
        // Getting the link proves the inbox is theirs.
        email_verified_at: user.email_verified_at ?? new Date().toISOString(),
      })
      .eq("id", userId);
    if (error) {
      console.error("[auth] reset-password update", error);
      throw new ApiError(500, "Could not reset your password. Please request a new link.");
    }

    await voidTokens(userId, "reset_password");
    return { ok: true };
  });
}
