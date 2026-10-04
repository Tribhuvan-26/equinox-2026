import "server-only";

/**
 * Base URL used in emailed links. Taken from config, never from the request:
 * a forged Host header must not be able to point a password-reset link at an
 * attacker's site.
 */
export function siteUrl(): string | null {
  const configured = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  return null;
}
