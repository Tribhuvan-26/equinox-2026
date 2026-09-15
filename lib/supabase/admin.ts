import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { RegistrationRecord } from "@/lib/registration/types";

export interface Database {
  public: {
    Tables: {
      pass_registrations: {
        Row: RegistrationRecord;
        Insert: Omit<RegistrationRecord, "created_at" | "updated_at" | "admin_note"> & {
          created_at?: string;
          updated_at?: string;
          admin_note?: string | null;
        };
        Update: Partial<RegistrationRecord>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
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
