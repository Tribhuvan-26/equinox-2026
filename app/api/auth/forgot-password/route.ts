import { after } from "next/server";
import { ApiError, readJson, respond, str } from "@/lib/api";
import { clientIp, overLimit } from "@/lib/auth/rate-limit";
import { normalizeEmail } from "@/lib/auth/validation";
import { sendResetLink } from "@/lib/auth/verification";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isValidEmail } from "@/lib/registration/validation";

// Same answer whether or not the address has an account, so this can't be used
// to find out who is registered.
const GENERIC = { message: "If an account exists for that email, we've sent a link to reset the password." };

export async function POST(request: Request) {
  return respond(async () => {
    const body = await readJson(request);
    const email = normalizeEmail(str(body.email));
    if (!isValidEmail(email)) throw new ApiError(400, "Enter a valid email address.", "email");

    if (
      await overLimit([
        { key: `forgot:ip:${clientIp(request)}`, max: 10, windowSeconds: 3600 },
        { key: `forgot:email:${email}`, max: 3, windowSeconds: 3600 },
      ])
    ) {
      throw new ApiError(429, "Too many reset requests. Please try again in an hour.");
    }

    // Lookup and mail both happen after the response, so response time doesn't
    // reveal whether the account exists.
    after(async () => {
      const { data: user, error } = await supabaseAdmin()
        .from("platform_users")
        .select("id, name, email")
        .eq("email", email)
        .maybeSingle();
      if (error) return console.error("[auth] forgot-password lookup", error);
      if (user) await sendResetLink(user);
    });

    return GENERIC;
  });
}
