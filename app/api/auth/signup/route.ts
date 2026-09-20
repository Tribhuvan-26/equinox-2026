import { after } from "next/server";
import { ApiError, readJson, respond, str } from "@/lib/api";
import { hashPassword } from "@/lib/auth/password";
import { clientIp, overLimit } from "@/lib/auth/rate-limit";
import { createUserSession } from "@/lib/auth/session";
import { normalizeEmail, normalizePersonName, validateSignup } from "@/lib/auth/validation";
import { sendVerificationLink } from "@/lib/auth/verification";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  return respond(async () => {
    if (await overLimit([{ key: `signup:ip:${clientIp(request)}`, max: 10, windowSeconds: 3600 }])) {
      throw new ApiError(429, "Too many sign-ups from this network. Please try again later.");
    }

    const body = await readJson(request);
    const input = { name: str(body.name), email: str(body.email), password: str(body.password) };

    const errors = validateSignup(input);
    const firstField = Object.keys(errors)[0] as keyof typeof errors | undefined;
    if (firstField) throw new ApiError(400, errors[firstField]!, firstField);

    const { data, error } = await supabaseAdmin()
      .from("platform_users")
      .insert({
        name: normalizePersonName(input.name),
        email: normalizeEmail(input.email),
        password_hash: await hashPassword(input.password),
      })
      .select("id, name, email, session_version")
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new ApiError(409, "An account with this email already exists. Try signing in.", "email");
      }
      console.error("[auth] signup", error);
      throw new ApiError(500, "Could not create your account. Please try again.");
    }

    await createUserSession(data.id, data.session_version);
    // Send the confirmation mail once the response is out; signup shouldn't wait on it.
    after(() => sendVerificationLink(data));
    return { user: { id: data.id, name: data.name, email: data.email } };
  }, 201);
}
