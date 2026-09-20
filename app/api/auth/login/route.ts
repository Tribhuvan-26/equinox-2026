import { ApiError, readJson, respond, str } from "@/lib/api";
import { verifyAgainstDummy, verifyPassword } from "@/lib/auth/password";
import { clientIp, rateLimitClear, rateLimitHit, rateLimitPeek } from "@/lib/auth/rate-limit";
import { createUserSession } from "@/lib/auth/session";
import { normalizeEmail } from "@/lib/auth/validation";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BAD_CREDENTIALS = "Incorrect email or password.";
const WINDOW_SECONDS = 15 * 60;
const MAX_PER_ACCOUNT = 8; // failed attempts per (ip, email)
const MAX_PER_IP = 40; // failed attempts per ip across all emails

export async function POST(request: Request) {
  return respond(async () => {
    const body = await readJson(request);
    const email = normalizeEmail(str(body.email));
    const password = str(body.password);
    if (!email || !password) throw new ApiError(400, "Enter your email and password.");

    const ip = clientIp(request);
    const accountKey = `login:${ip}:${email}`;
    const ipKey = `login-ip:${ip}`;

    const [accountFails, ipFails] = await Promise.all([rateLimitPeek(accountKey), rateLimitPeek(ipKey)]);
    if (accountFails >= MAX_PER_ACCOUNT || ipFails >= MAX_PER_IP) {
      throw new ApiError(429, "Too many attempts. Please wait a few minutes and try again.");
    }

    const fail = async () => {
      await Promise.all([rateLimitHit(accountKey, WINDOW_SECONDS), rateLimitHit(ipKey, WINDOW_SECONDS)]);
      return new ApiError(401, BAD_CREDENTIALS);
    };

    const { data: user, error } = await supabaseAdmin()
      .from("platform_users")
      .select("id, name, email, password_hash, session_version")
      .eq("email", email)
      .maybeSingle();
    if (error) {
      console.error("[auth] login", error);
      throw new ApiError(500, "Could not sign you in. Please try again.");
    }

    // Same work and same message whether the account exists or not.
    if (!user) {
      await verifyAgainstDummy(password);
      throw await fail();
    }
    if (!(await verifyPassword(password, user.password_hash))) throw await fail();

    await rateLimitClear(accountKey);
    await createUserSession(user.id, user.session_version);
    return { user: { id: user.id, name: user.name, email: user.email } };
  });
}
