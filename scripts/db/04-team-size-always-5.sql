-- Every team seats 5. Leaders can no longer pick a smaller size.
update public.registration_teams set max_members = 5 where max_members <> 5;
