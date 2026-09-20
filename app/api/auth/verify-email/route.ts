import { ApiError, readJson, respond, str } from "@/lib/api";
import { clientIp, overLimit } from "@/lib/auth/rate-limit";
import { consumeToken } from "@/lib/auth/tokens";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  return respond(async () => {
    if (await overLimit([{ key: `verify:ip:${clientIp(request)}`, max: 30, windowSeconds: 900 }])) {
      throw new ApiError(429, "Too many attempts. Please wait a few minutes and try again.");
    }

    const body = await readJson(request);
    const userId = await consumeToken(str(body.token), "verify_email");
    if (!userId) {
      throw new ApiError(400, "This verification link is invalid or has expired. Request a new one from your dashboard.");
    }

    const { error } = await supabaseAdmin()
      .from("platform_users")
      .update({ email_verified_at: new Date().toISOString() })
      .eq("id", userId)
      .is("email_verified_at", null);
    if (error) {
      console.error("[auth] verify-email", error);
      throw new ApiError(500, "Could not verify your email. Please try again.");
    }
    return { ok: true };
  });
}
