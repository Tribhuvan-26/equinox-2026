-- Equinox 2026 — teams built from registrations (no user accounts).
--
-- How it works
--   * The team leader registers and pays their own ₹ fee; that creates the team
--     and its code. Teammates join with the code/name, fill their own details
--     and pay their own fee. Every person is one row in pass_registrations, and
--     a team is just the rows that share a team_id.
--   * Nobody logs in. Each registration gets a secret link (only its SHA-256 is
--     stored). The leader's link also manages the team.
--
-- Run once in the Supabase SQL Editor AFTER database/01-schema.sql. Idempotent.
--
-- If you ran the earlier account-based files (teams.sql, auth-hardening.sql,
-- registration-team-link.sql), run database/02-drop-account-teams.sql FIRST.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public' and table_name = 'pass_registrations' and column_name = 'team_id'
  ) and exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.confrelid
    where c.conrelid = 'public.pass_registrations'::regclass
      and c.contype = 'f'
      and t.relname = 'teams'
  ) then
    raise exception 'pass_registrations.team_id still points at the old account-based teams table. Run database/02-drop-account-teams.sql first.';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Teams
-- ---------------------------------------------------------------------------
create table if not exists public.registration_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 40),
  code text not null check (code ~ '^[A-Z0-9]{6,8}$'),
  max_members int not null default 5 check (max_members between 2 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Canonical form (trimmed, single spaces) so "Code  Crusaders" can't slip past
  -- the case-insensitive unique index below.
  constraint registration_teams_name_canonical check (name = regexp_replace(btrim(name), '\s+', ' ', 'g')),
  constraint registration_teams_name_key unique (name),
  constraint registration_teams_code_key unique (code)
);

-- "Code Crusaders" == "code crusaders".
create unique index if not exists registration_teams_name_lower_key
  on public.registration_teams (lower(name));

create or replace function public.touch_registration_team()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists registration_teams_touch on public.registration_teams;
create trigger registration_teams_touch
  before update on public.registration_teams
  for each row execute function public.touch_registration_team();

-- ---------------------------------------------------------------------------
-- Registrations: team membership + the person's secret link
-- ---------------------------------------------------------------------------
alter table public.pass_registrations
  add column if not exists team_id uuid references public.registration_teams (id) on delete set null,
  add column if not exists team_role text check (team_role in ('leader', 'member')),
  -- Lower-cased email of the one person on a team registration.
  add column if not exists member_email text,
  -- SHA-256 of the secret access token. The raw token is only in the person's link.
  add column if not exists access_token_hash text;

create index if not exists pass_registrations_team_id_idx
  on public.pass_registrations (team_id);

create unique index if not exists pass_registrations_access_token_key
  on public.pass_registrations (access_token_hash)
  where access_token_hash is not null;

-- Exactly one leader per team.
create unique index if not exists pass_registrations_one_leader_key
  on public.pass_registrations (team_id)
  where team_role = 'leader';

-- A person (by email) is in at most one team at a time. A rejected registration
-- doesn't count, so they can try again.
create unique index if not exists pass_registrations_one_team_per_email_key
  on public.pass_registrations (member_email)
  where team_id is not null and member_email is not null and status <> 'rejected';

-- ---------------------------------------------------------------------------
-- Capacity: a team never holds more live (not rejected) registrations than
-- max_members. Locking the team row serialises two people taking the last seat.
-- ---------------------------------------------------------------------------
create or replace function public.enforce_registration_team_capacity()
returns trigger
language plpgsql
as $$
declare
  v_max int;
  v_live int;
begin
  if new.team_id is null or new.status = 'rejected' then
    return new;
  end if;

  -- On UPDATE only care when the row is newly entering a team / coming back
  -- from rejected; other edits (e.g. approving) don't change the head count.
  if tg_op = 'UPDATE'
     and old.team_id is not distinct from new.team_id
     and old.status <> 'rejected' then
    return new;
  end if;

  select max_members into v_max
    from public.registration_teams where id = new.team_id for update;

  if v_max is null then
    raise exception 'team_not_found' using errcode = 'P0002';
  end if;

  select count(*) into v_live
    from public.pass_registrations
    where team_id = new.team_id and status <> 'rejected' and id <> new.id;

  if v_live >= v_max then
    raise exception 'team_full' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists pass_registrations_team_capacity on public.pass_registrations;
create trigger pass_registrations_team_capacity
  before insert or update of team_id, status on public.pass_registrations
  for each row execute function public.enforce_registration_team_capacity();

-- A team can't be shrunk below the people already in it.
create or replace function public.enforce_registration_team_size()
returns trigger
language plpgsql
as $$
declare
  v_live int;
begin
  if new.max_members < old.max_members then
    select count(*) into v_live
      from public.pass_registrations
      where team_id = new.id and status <> 'rejected';
    if new.max_members < v_live then
      raise exception 'team_size_below_members' using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists registration_teams_size on public.registration_teams;
create trigger registration_teams_size
  before update of max_members on public.registration_teams
  for each row execute function public.enforce_registration_team_size();

-- ---------------------------------------------------------------------------
-- Rate limiting shared by every server instance (registration spam, link
-- recovery). Counters live here so limits hold across serverless instances.
-- ---------------------------------------------------------------------------
create table if not exists public.auth_rate_limits (
  key text primary key,
  attempts int not null,
  reset_at timestamptz not null
);

-- Atomically count one hit for p_key in a fixed window; returns hits so far.
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

  if random() < 0.02 then
    delete from public.auth_rate_limits where reset_at < now() - interval '1 day';
  end if;

  return v_attempts;
end;
$$;

revoke all on function public.auth_rate_limit_hit(text, int) from public, anon, authenticated;
grant execute on function public.auth_rate_limit_hit(text, int) to service_role;

-- Service role only (RLS on, zero policies), like pass_registrations.
alter table public.registration_teams enable row level security;
alter table public.auth_rate_limits enable row level security;
