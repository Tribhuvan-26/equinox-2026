import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Rate limiting shared by every server instance: counters live in Postgres
 * (auth_rate_limits), updated atomically by auth_rate_limit_hit(). If the
 * database call fails we fall back to a per-instance in-memory counter, so a
 * database hiccup neither locks everyone out nor switches limiting off.
 */

export type Limit = { key: string; max: number; windowSeconds: number };

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryHit(key: string, windowSeconds: number): number {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    if (memory.size > 5000) {
      for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
    }
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

function memoryPeek(key: string): number {
  const entry = memory.get(key);
  return entry && entry.resetAt > Date.now() ? entry.count : 0;
}

/** Client IP as set by the hosting proxy. */
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Count one hit and return the hits so far in the window. */
export async function rateLimitHit(key: string, windowSeconds: number): Promise<number> {
  const { data, error } = await supabaseAdmin().rpc("auth_rate_limit_hit", {
    p_key: key,
    p_window_seconds: windowSeconds,
  });
  if (error || typeof data !== "number") {
    console.error("[rate-limit] db hit failed, using memory", error);
    return memoryHit(key, windowSeconds);
  }
  return data;
}

/** Hits so far in the current window, without counting a new one. */
export async function rateLimitPeek(key: string): Promise<number> {
  const { data, error } = await supabaseAdmin()
    .from("auth_rate_limits")
    .select("attempts, reset_at")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    console.error("[rate-limit] db peek failed, using memory", error);
    return memoryPeek(key);
  }
  if (!data || new Date(data.reset_at).getTime() <= Date.now()) return 0;
  return data.attempts;
}

export async function rateLimitClear(key: string): Promise<void> {
  memory.delete(key);
  const { error } = await supabaseAdmin().from("auth_rate_limits").delete().eq("key", key);
  if (error) console.error("[rate-limit] db clear failed", error);
}

/**
 * Count a hit against every limit; true if any of them is now over its max.
 * Use for endpoints where every request should count (signup, mail sending).
 */
export async function overLimit(limits: Limit[]): Promise<boolean> {
  const counts = await Promise.all(limits.map((l) => rateLimitHit(l.key, l.windowSeconds)));
  return limits.some((l, i) => counts[i] > l.max);
}
