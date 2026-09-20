import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { RegistrationRecord } from "@/lib/registration/types";
import type { AuthRateLimitRow, RegistrationTeamRow } from "@/lib/teams/types";

/** The full pass_registrations row, including columns that must never reach a browser. */
export type RegistrationRow = RegistrationRecord & {
  member_email: string | null;
  access_token_hash: string | null;
};

export interface Database {
  public: {
    Tables: {
      pass_registrations: {
        Row: RegistrationRow;
        Insert: Omit<
          RegistrationRow,
          "created_at" | "updated_at" | "admin_note" | "team_seq" | "team_id" | "team_role" | "member_email" | "access_token_hash"
        > & {
          created_at?: string;
          updated_at?: string;
          admin_note?: string | null;
          team_seq?: number;
          team_id?: string | null;
          team_role?: "leader" | "member" | null;
          member_email?: string | null;
          access_token_hash?: string | null;
        };
        Update: Partial<RegistrationRow>;
        Relationships: [];
      };
      registration_teams: {
        Row: RegistrationTeamRow;
        Insert: Pick<RegistrationTeamRow, "name" | "code"> & Partial<RegistrationTeamRow>;
        Update: Partial<RegistrationTeamRow>;
        Relationships: [];
      };
      auth_rate_limits: {
        Row: AuthRateLimitRow;
        Insert: AuthRateLimitRow;
        Update: Partial<AuthRateLimitRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      auth_rate_limit_hit: {
        Args: { p_key: string; p_window_seconds: number };
        Returns: number;
      };
    };
  };
}

let cached: ReturnType<typeof createClient<Database>> | null = null;

// Service-role client: bypasses RLS. Only ever import this from server-only
// code (Route Handlers, Server Components, admin auth) — never from a
// Client Component or anything shipped to the browser.
export function supabaseAdmin() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  cached = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export const PAYMENT_PROOFS_BUCKET = "payment-proofs";
