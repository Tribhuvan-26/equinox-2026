import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

const COOKIE_NAME = "equinox_user_session";
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
};

function secret(): string {
  const fromEnv = process.env.USER_SESSION_SECRET;
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error("USER_SESSION_SECRET is not set.");
  }
  return "equinox-user-secret-dev-2026";
}

// The "user:" prefix keeps these signatures distinct from the admin cookie's.
function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(`user:${payload}`).digest("hex");
}

// Cookie value: <userId>.<sessionVersion>.<expiresAt>.<signature>
function issueToken(userId: string, version: number): string {
  const payload = `${userId}.${version}.${Date.now() + SESSION_TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

// Returns who the token was issued to if it is authentic and unexpired.
function verifyToken(token: string | undefined): { userId: string; version: number } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [userId, version, expiresAt, signature] = parts;

  const expected = Buffer.from(sign(`${userId}.${version}.${expiresAt}`));
  const actual = Buffer.from(signature);
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;

  const expires = Number(expiresAt);
  const v = Number(version);
  if (!Number.isFinite(expires) || Date.now() >= expires || !Number.isInteger(v)) return null;
  return { userId, version: v };
}

export async function createUserSession(userId: string, version: number) {
  const store = await cookies();
  store.set(COOKIE_NAME, issueToken(userId, version), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroyUserSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

// The signed cookie only proves who the user was; re-read the row so a deleted
// account stops working immediately, a password reset (session_version bump)
// signs out old sessions, and name/email/verified are always current.
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const session = verifyToken(store.get(COOKIE_NAME)?.value);
  if (!session) return null;

  const { data } = await supabaseAdmin()
    .from("platform_users")
    .select("id, name, email, email_verified_at, session_version")
    .eq("id", session.userId)
    .maybeSingle();

  if (!data || data.session_version !== session.version) return null;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    emailVerified: data.email_verified_at !== null,
  };
}
