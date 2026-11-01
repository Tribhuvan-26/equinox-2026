-- One-off exceptions: "DILLY DALIERS" (F9ZHJ5) and "SODIMUCHATLU" (6LH2KZ) may
-- hold 6 each. Extends 07-obsidian-crown-six.sql. Every other team stays at 5.
-- Run once in the Supabase SQL Editor. Idempotent.

alter table public.registration_teams
  drop constraint if exists registration_teams_max_members_is_5;

alter table public.registration_teams
  add constraint registration_teams_max_members_is_5
  check (max_members = 5 or (code in ('CVUR3D', 'F9ZHJ5', '6LH2KZ') and max_members = 6));

update public.registration_teams set max_members = 6 where code in ('F9ZHJ5', '6LH2KZ');
