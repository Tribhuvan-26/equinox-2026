-- Drop the leftover prototype tables from Sep 7 (solo/duo/trio/quadrant passes).
-- The app never reads them. They held only seed rows, and their policies let
-- anyone with the anon key read and insert into them. Also drops the anon
-- upload policy for the old "payment-screenshots" bucket, which no longer exists.
-- Idempotent.

drop table if exists public.registration_members;
drop table if exists public.registrations;
drop policy if exists "Public Upload payment-screenshots" on storage.objects;

notify pgrst, 'reload schema';
