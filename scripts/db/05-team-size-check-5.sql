-- Run after 04-team-size-always-5.sql: the DB now refuses any team size but 5.
alter table public.registration_teams
  add constraint registration_teams_max_members_is_5 check (max_members = 5);
