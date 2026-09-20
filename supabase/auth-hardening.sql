-- Equinox 2026 — email verification, password reset, shared rate limiting.
--
-- Run AFTER supabase/teams.sql, in the Supabase SQL Editor. Idempotent.

-- ---------------------------------------------------------------------------
-- Accounts: verified email + session version
-- ---------------------------------------------------------------------------
alter table public.platform_users
  add column if not exists email_verified_at timestamptz,
  -- Bumped on password reset. Session cookies carry the version they were
  -- issued at, so a reset signs out every other device.
  add column if not exists session_version int not null default 0;

-- ---------------------------------------------------------------------------
-- One-time email tokens (verify address / reset password)
-- Only the SHA-256 of the token is stored, so a database leak can't be used
-- to take over accounts.
-- ---------------------------------------------------------------------------
create table if not exists public.auth_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.platform_users (id) on delete cascade,
  purpose text not null check (purpose in ('verify_email', 'reset_password')),
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint auth_tokens_token_hash_key unique (token_hash)
);

create index if not exists auth_tokens_user_purpose_idx
  on public.auth_tokens (user_id, purpose);

-- ---------------------------------------------------------------------------
-- Rate limiting shared by every server instance (login, signup, reset mails)
-- ---------------------------------------------------------------------------
create table if not exists public.auth_rate_limits (
  key text primary key,
  attempts int not null,
  reset_at timestamptz not null
);

-- Atomically count one hit for p_key in a rolling fixed window and return the
-- number of hits so far in that window.
create or replace function public.auth_rate_limit_hit(p_key text, p_window_seconds int)
returns int
language plpgsql
as $$
declare
  v_attempts int;
begin
  insert into public.auth_rate_limits (key, attempts, reset_at)
  values (p_key, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (key) do update
    set attempts = case
          when public.auth_rate_limits.reset_at <= now() then 1
          else public.auth_rate_limits.attempts + 1
        end,
        reset_at = case
          when public.auth_rate_limits.reset_at <= now() then now() + make_interval(secs => p_window_seconds)
          else public.auth_rate_limits.reset_at
        end
  returning attempts into v_attempts;

  -- Housekeeping: now and then drop windows that ended long ago.
  if random() < 0.02 then
    delete from public.auth_rate_limits where reset_at < now() - interval '1 day';
  end if;

  return v_attempts;
end;
$$;

revoke all on function public.auth_rate_limit_hit(text, int) from public, anon, authenticated;
grant execute on function public.auth_rate_limit_hit(text, int) to service_role;

alter table public.auth_tokens enable row level security;
alter table public.auth_rate_limits enable row level security;
