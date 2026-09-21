-- OPTIONAL clean-up. Only run this if you already ran the earlier ACCOUNT-BASED
-- team files (teams.sql, auth-hardening.sql, registration-team-link.sql).
-- That design was dropped: teams now come from registrations, no logins.
--
-- WARNING: this permanently deletes the tables below and every row in them
-- (user accounts, old teams, memberships, email tokens), and removes the old
-- team_id link from pass_registrations. The registrations themselves are kept.
-- Do not run it if any of that data matters to you.

drop trigger if exists team_members_guard_roster on public.team_members;
drop trigger if exists teams_guard_delete on public.teams;
drop function if exists public.guard_registered_team_roster();
drop function if exists public.guard_registered_team_delete();

drop index if exists public.pass_registrations_active_team_key;
drop index if exists public.pass_registrations_team_id_idx;
alter table public.pass_registrations drop column if exists team_id;

drop function if exists public.create_team_with_leader(uuid, text, text, int);
drop table if exists public.team_members cascade;
drop table if exists public.teams cascade;
drop table if exists public.auth_tokens cascade;
drop table if exists public.platform_users cascade;
drop function if exists public.touch_team_updated_at();
drop function if exists public.enforce_team_capacity();
drop function if exists public.enforce_team_size_change();
