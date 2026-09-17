-- Equinox 2026 pass registrations (team-based, flat ₹869/participant flow).
-- Named "pass_registrations" deliberately — this project's Supabase instance
-- already has a separate, unrelated "registrations" table (solo/duo/trio/quad
-- event passes with its own schema and existing data). Do not merge the two.
--
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- All reads/writes go through server-side code using the service-role key, so
-- RLS is enabled with zero policies: nothing is reachable via the public
-- anon/authenticated API, only via the service role.

create table if not exists public.pass_registrations (
  id uuid primary key,
  participants jsonb not null,
  participant_count int not null check (participant_count > 0),
  total_amount int not null check (total_amount >= 0),
  payment_screenshot_path text not null,
  utr_number text not null,
  utr_proof_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  team_seq bigserial,
  confirmation_number text unique
);

create index if not exists pass_registrations_status_idx on public.pass_registrations (status);
create index if not exists pass_registrations_created_at_idx on public.pass_registrations (created_at desc);

alter table public.pass_registrations enable row level security;
