-- ---------------------------------------------------------------------------
-- One live registration per UTR / transaction number.
--
-- Nothing in the app can confirm a payment: the UPI QR is a deeplink, the bank
-- never calls back, and the only check on utr_number is that it is at least six
-- characters. Verification is a person opening the screenshot in /admin.
--
-- That leaves one screenshot re-usable across several registrations, which the
-- admin list will not show unless someone sorts by UTR and notices. A unique
-- index turns it into a 409 at submit time instead, the same way the one live
-- registration per email rule works.
--
-- Rejected rows are excluded, so a genuine resubmission after a rejection can
-- reuse its own UTR.
-- ---------------------------------------------------------------------------

-- Same reasoning as 04: a database with real traffic may already hold reuses,
-- and those are real paid registrations. Name them and stop rather than delete
-- anything or half-apply the file.
do $$
declare
  dupes text;
begin
  select string_agg(utr || ' (' || n || ' rows)', ', ' order by utr)
    into dupes
    from (
      select upper(utr_number) as utr, count(*) as n
        from public.pass_registrations
       where utr_number is not null and status <> 'rejected'
       group by upper(utr_number)
      having count(*) > 1
    ) d;

  if dupes is not null then
    raise exception
      'pass_registrations_one_live_per_utr_key needs one live registration per UTR, but these are reused: %. Check the payment proofs and reject the duplicates, then re-run this file.',
      dupes;
  end if;
end $$;

-- Compared case-insensitively: a UTR/RRN can be alphanumeric, and the same
-- number typed in a different case is the same payment.
create unique index if not exists pass_registrations_one_live_per_utr_key
  on public.pass_registrations (upper(utr_number))
  where utr_number is not null and status <> 'rejected';
