-- Equinox 2026 — tie a pass registration to a team.
--
-- Run AFTER supabase/schema.sql (pass_registrations) and supabase/teams.sql.
-- Idempotent. Registrations made without an account keep team_id = null.

alter table public.pass_registrations
  add column if not exists team_id uuid references public.teams (id) on delete set null;

-- A team can hold one live registration. A rejected one doesn't count, so a
-- team can register again after a rejection.
create unique index if not exists pass_registrations_active_team_key
  on public.pass_registrations (team_id)
  where team_id is not null and status <> 'rejected';

create index if not exists pass_registrations_team_id_idx
  on public.pass_registrations (team_id);

-- While a team has a live registration its roster is frozen (no joins, leaves
-- or removals), so the people who were registered (and paid for) can't drift
-- from the team. Backstops the same rule the API enforces.
create or replace function public.guard_registered_team_roster()
returns trigger
language plpgsql
as $$
declare
  v_team_id uuid := coalesce(new.team_id, old.team_id);
begin
  if exists (
    select 1 from public.pass_registrations
    where team_id = v_team_id and status <> 'rejected'
  ) then
    raise exception 'team_registered' using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists team_members_guard_roster on public.team_members;
create trigger team_members_guard_roster
  before insert or delete on public.team_members
  for each row execute function public.guard_registered_team_roster();

create or replace function public.guard_registered_team_delete()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1 from public.pass_registrations
    where team_id = old.id and status <> 'rejected'
  ) then
    raise exception 'team_registered' using errcode = 'P0001';
  end if;
  return old;
end;
$$;

drop trigger if exists teams_guard_delete on public.teams;
create trigger teams_guard_delete
  before delete on public.teams
  for each row execute function public.guard_registered_team_delete();
