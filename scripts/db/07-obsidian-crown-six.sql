-- One-off exception: "Obsidian crown" (CVUR3D) may hold 6 so "obsidian crowns"
-- (WQM2XE) can merge into it. Every other team stays at 5.
-- Run once in the Supabase SQL Editor. Idempotent.

alter table public.registration_teams
  drop constraint if exists registration_teams_max_members_is_5;

alter table public.registration_teams
  add constraint registration_teams_max_members_is_5
  check (max_members = 5 or (code = 'CVUR3D' and max_members = 6));

update public.registration_teams set max_members = 6 where code = 'CVUR3D';
