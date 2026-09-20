-- Equinox 2026 — global user accounts + teams.
--
-- Teams are platform-wide (NOT tied to any event). A user belongs to at most one
-- team at a time. All access goes through server-side code using the
-- service-role key, so RLS is enabled with zero policies (same as
-- pass_registrations): nothing is reachable through the public anon API.
--
-- Run once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Idempotent: safe to re-run.
--
-- NOTE: if this project's Supabase instance already has its own unrelated
-- "teams" or "team_members" table, stop and rename before running this.

-- ---------------------------------------------------------------------------
-- Accounts
-- ---------------------------------------------------------------------------
create table if not exists public.platform_users (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 80),
  email text not null check (email = lower(email)),
  password_hash text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists platform_users_email_key
  on public.platform_users (email);

-- ---------------------------------------------------------------------------
-- Teams
-- ---------------------------------------------------------------------------
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 40),
  code text not null check (code ~ '^[A-Z0-9]{6,8}$'),
  leader_id uuid not null references public.platform_users (id) on delete cascade,
  max_members int not null default 5 check (max_members between 2 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Stored in canonical form (trimmed, single spaces) so "Code  Crusaders" can
  -- not sneak past the case-insensitive unique index below.
  constraint teams_name_canonical check (name = regexp_replace(btrim(name), '\s+', ' ', 'g')),
  constraint teams_name_key unique (name),
  constraint teams_code_key unique (code)
);

-- Names are unique ignoring case: "Code Crusaders" == "code crusaders".
create unique index if not exists teams_name_lower_key
  on public.teams (lower(name));

create index if not exists teams_leader_id_idx on public.teams (leader_id);

-- ---------------------------------------------------------------------------
-- Memberships
-- ---------------------------------------------------------------------------
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references public.platform_users (id) on delete cascade,
  role text not null default 'member' check (role in ('leader', 'member')),
  joined_at timestamptz not null default now(),
  -- No duplicate membership in the same team.
  constraint team_members_team_user_key unique (team_id, user_id),
  -- A user can be in only ONE team, globally.
  constraint team_members_user_key unique (user_id)
);

-- Exactly one leader per team.
create unique index if not exists team_members_one_leader_key
  on public.team_members (team_id) where role = 'leader';

create index if not exists team_members_team_id_idx on public.team_members (team_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create or replace function public.touch_team_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists teams_touch_updated_at on public.teams;
create trigger teams_touch_updated_at
  before update on public.teams
  for each row execute function public.touch_team_updated_at();

-- A team can never exceed max_members. Locking the team row serialises
-- concurrent joins so two people cannot both take the last seat.
create or replace function public.enforce_team_capacity()
returns trigger
language plpgsql
as $$
declare
  v_max int;
  v_count int;
begin
  select max_members into v_max
    from public.teams where id = new.team_id for update;

  if v_max is null then
    raise exception 'team_not_found' using errcode = 'P0002';
  end if;

  select count(*) into v_count
    from public.team_members where team_id = new.team_id;

  if v_count >= v_max then
    raise exception 'team_full' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists team_members_enforce_capacity on public.team_members;
create trigger team_members_enforce_capacity
  before insert on public.team_members
  for each row execute function public.enforce_team_capacity();

-- max_members can not be lowered below the current headcount.
create or replace function public.enforce_team_size_change()
returns trigger
language plpgsql
as $$
declare
  v_count int;
begin
  if new.max_members < old.max_members then
    select count(*) into v_count
      from public.team_members where team_id = new.id;
    if new.max_members < v_count then
      raise exception 'team_size_below_members' using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists teams_enforce_size_change on public.teams;
create trigger teams_enforce_size_change
  before update of max_members on public.teams
  for each row execute function public.enforce_team_size_change();

-- ---------------------------------------------------------------------------
-- Atomic "create team + make creator the leader"
-- ---------------------------------------------------------------------------
create or replace function public.create_team_with_leader(
  p_user_id uuid,
  p_name text,
  p_code text,
  p_max_members int
)
returns public.teams
language plpgsql
as $$
declare
  v_team public.teams;
begin
  insert into public.teams (name, code, leader_id, max_members)
  values (regexp_replace(btrim(p_name), '\s+', ' ', 'g'), p_code, p_user_id, p_max_members)
  returning * into v_team;

  insert into public.team_members (team_id, user_id, role)
  values (v_team.id, p_user_id, 'leader');

  return v_team;
end;
$$;

revoke all on function public.create_team_with_leader(uuid, text, text, int) from public, anon, authenticated;
grant execute on function public.create_team_with_leader(uuid, text, text, int) to service_role;

-- ---------------------------------------------------------------------------
-- Row level security: on, zero policies. Only the service role reaches these.
-- ---------------------------------------------------------------------------
alter table public.platform_users enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
