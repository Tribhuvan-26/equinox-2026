# Database (Supabase / Postgres)

Run these in the Supabase dashboard → SQL Editor, in order.

| Order | File | When |
|-------|------|------|
| 1 | `01-schema.sql` | Fresh project. Creates `pass_registrations`. The private `payment-proofs` storage bucket is created separately in Storage. |
| 2 | `02-drop-account-teams.sql` | Only if you ran the old account-based team files (`teams.sql`, `auth-hardening.sql`, `registration-team-link.sql`). Skip otherwise. |
| 3 | `03-team-registration.sql` | Always. Adds `registration_teams`, `member_email`, team columns, and the `auth_rate_limit_hit()` rate-limit function. Idempotent. |
| 4 | `04-pay-first.sql` | Always. Adds `requested_team_id` (join requests) and tightens the one-registration-per-email rule so it covers people who have paid but not yet picked a team. Idempotent. |

After running, reload the API schema cache if the app still reports missing tables:

```sql
notify pgrst, 'reload schema';
```
