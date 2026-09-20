import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { RegistrationRecord } from "@/lib/registration/types";
import type {
  AuthRateLimitRow,
  AuthTokenRow,
  PlatformUserRow,
  TeamMemberRow,
  TeamRow,
} from "@/lib/teams/types";

export interface Database {
  public: {
    Tables: {
      pass_registrations: {
        Row: RegistrationRecord;
        Insert: Omit<RegistrationRecord, "created_at" | "updated_at" | "admin_note" | "team_seq" | "team_id"> & {
          created_at?: string;
          updated_at?: string;
          admin_note?: string | null;
          team_seq?: number;
          team_id?: string | null;
        };
        Update: Partial<RegistrationRecord>;
        Relationships: [];
      };
      platform_users: {
        Row: PlatformUserRow;
        Insert: Pick<PlatformUserRow, "name" | "email" | "password_hash"> & Partial<PlatformUserRow>;
        Update: Partial<PlatformUserRow>;
        Relationships: [];
      };
      teams: {
        Row: TeamRow;
        Insert: Pick<TeamRow, "name" | "code" | "leader_id"> & Partial<TeamRow>;
        Update: Partial<TeamRow>;
        Relationships: [];
      };
      auth_tokens: {
        Row: AuthTokenRow;
        Insert: Pick<AuthTokenRow, "user_id" | "purpose" | "token_hash" | "expires_at"> & Partial<AuthTokenRow>;
        Update: Partial<AuthTokenRow>;
        Relationships: [];
      };
      auth_rate_limits: {
        Row: AuthRateLimitRow;
        Insert: AuthRateLimitRow;
        Update: Partial<AuthRateLimitRow>;
        Relationships: [];
      };
      team_members: {
        Row: TeamMemberRow;
        Insert: Pick<TeamMemberRow, "team_id" | "user_id"> & Partial<TeamMemberRow>;
        Update: Partial<TeamMemberRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      auth_rate_limit_hit: {
        Args: { p_key: string; p_window_seconds: number };
        Returns: number;
      };
      create_team_with_leader: {
        Args: { p_user_id: string; p_name: string; p_code: string; p_max_members: number };
        Returns: TeamRow;
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
