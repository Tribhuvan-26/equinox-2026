import "server-only";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AuthTokenPurpose } from "@/lib/teams/types";

export const VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/**
 * Issue a fresh one-time token and return the raw value (only ever emailed,
 * never stored). Any earlier unused token of the same purpose is voided, so
 * only the newest link works.
 */
export async function issueToken(userId: string, purpose: AuthTokenPurpose, ttlMs: number): Promise<string> {
  const supabase = supabaseAdmin();

  const { error: voidError } = await supabase
    .from("auth_tokens")
    .delete()
    .eq("user_id", userId)
    .eq("purpose", purpose)
    .is("used_at", null);
  if (voidError) throw voidError;

  const raw = crypto.randomBytes(32).toString("base64url");
  const { error } = await supabase.from("auth_tokens").insert({
    user_id: userId,
    purpose,
    token_hash: hashToken(raw),
    expires_at: new Date(Date.now() + ttlMs).toISOString(),
  });
  if (error) throw error;
  return raw;
}

/**
 * Spend a token. One UPDATE both checks (right purpose, unused, unexpired) and
 * marks it used, so a link can never be redeemed twice, even concurrently.
 * Returns the owning user id, or null if the token is not valid.
 */
export async function consumeToken(raw: string, purpose: AuthTokenPurpose): Promise<string | null> {
  if (!raw || raw.length > 200) return null;

  const { data, error } = await supabaseAdmin()
    .from("auth_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", hashToken(raw))
    .eq("purpose", purpose)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("user_id")
    .maybeSingle();
  if (error) throw error;
  return data?.user_id ?? null;
}

/** Void every unused token of a purpose for a user (e.g. after a reset). */
export async function voidTokens(userId: string, purpose: AuthTokenPurpose): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("auth_tokens")
    .delete()
    .eq("user_id", userId)
    .eq("purpose", purpose)
    .is("used_at", null);
  if (error) throw error;
}
