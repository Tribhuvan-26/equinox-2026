import "server-only";
import crypto from "node:crypto";

/**
 * There are no logins. Each team registration gets one secret link; the token in
 * it is the only proof of "this is my registration". Only its SHA-256 is stored,
 * so a database leak can't be turned into working links.
 */
export function newAccessToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString("base64url");
  return { token, hash: hashAccessToken(token) };
}

export function hashAccessToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
