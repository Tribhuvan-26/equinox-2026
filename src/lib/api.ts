import "server-only";
import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public field?: string
  ) {
    super(message);
  }
}

/**
 * Run a route handler body, turning ApiError into a JSON error response and
 * anything unexpected into a generic 500 (details go to the server log only).
 */
export async function respond<T>(fn: () => Promise<T>, okStatus = 200): Promise<NextResponse> {
  try {
    const data = await fn();
    return NextResponse.json(data ?? { ok: true }, { status: okStatus });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message, field: err.field }, { status: err.status });
    }
    console.error("[api] unexpected error", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

/** Parse a JSON body (must be sent as application/json). */
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) {
    throw new ApiError(415, "Content-Type must be application/json.");
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "Invalid request body.");
  }
  return body as Record<string, unknown>;
}

/** The secret access token from "Authorization: Bearer <token>". */
export function bearerToken(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+([A-Za-z0-9_-]{20,200})$/.exec(header);
  if (!match) throw new ApiError(401, "Open your personal registration link to continue.");
  return match[1];
}

export function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Ids come from the URL / body; reject junk before it reaches Postgres. */
export function requireUuid(value: string, what = "id"): string {
  if (!UUID_REGEX.test(value)) throw new ApiError(400, `Invalid ${what}.`);
  return value;
}
