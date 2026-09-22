-- ---------------------------------------------------------------------------
-- Pay first, pick a team afterwards.
--
-- Registering now only takes a payment: the row lands with no team. The person
-- then creates a team (becoming its leader) or asks to join one, and a leader
-- accepts them. "Paid but teamless" already existed -- leaving a team, or a
-- leader deleting one, unlinks people exactly this way -- so nothing here is a
-- new state, only a new way to start in it and a way out of it.
-- ---------------------------------------------------------------------------

-- Who this person has asked to join. Null means "not asking anyone".
-- One column, so one outstanding request per person is structural: there is
-- nowhere to put a second one. Dropping a team withdraws its open requests.
alter table public.pass_registrations
  add column if not exists requested_team_id uuid
    references public.registration_teams(id) on delete set null;

-- The leader's inbox reads this the other way round: who is asking for my team.
create index if not exists pass_registrations_requested_team_idx
  on public.pass_registrations (requested_team_id)
  where requested_team_id is not null;

-- A registration can't ask to join the team it is already in.
alter table public.pass_registrations
  drop constraint if exists pass_registrations_request_not_own_team;
alter table public.pass_registrations
  add constraint pass_registrations_request_not_own_team
  check (requested_team_id is null or requested_team_id is distinct from team_id);

-- One live registration per email, in a team or not.
--
-- The old index only counted people who were already in a team, which was fine
-- when a registration could not exist without one. Now that paying comes first,
-- that gap would let the same person pay twice while teamless. Dropping the
-- team clause closes it and leaves a simpler rule.
-- The old rule allowed what the new one forbids, so a database with real
-- traffic may already hold duplicates (someone who left a team, or whose team
-- was deleted, could pay again under the same email). Those are real paid
-- registrations: name them and stop, rather than drop the working index or
-- delete a row on the operator's behalf. Runs before the drop so a database
-- that needs attention is left exactly as it was.
do $$
declare
  dupes text;
begin
  select string_agg(member_email || ' (' || n || ' rows)', ', ' order by member_email)
    into dupes
    from (
      select member_email, count(*) as n
        from public.pass_registrations
       where member_email is not null and status <> 'rejected'
       group by member_email
      having count(*) > 1
    ) d;

  if dupes is not null then
    raise exception
      'pass_registrations_one_live_per_email_key needs one live registration per email, but these have more: %. Reject or refund the extra rows, then re-run this file.',
      dupes;
  end if;
end $$;

drop index if exists public.pass_registrations_one_team_per_email_key;
create unique index if not exists pass_registrations_one_live_per_email_key
  on public.pass_registrations (member_email)
  where member_email is not null and status <> 'rejected';
