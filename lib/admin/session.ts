import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "equinox_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not set.");
  return s;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

function issueToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function createAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, issueToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}

export { COOKIE_NAME as ADMIN_COOKIE_NAME, verifyToken as verifyAdminToken };
