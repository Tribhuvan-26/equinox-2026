// One-off setup: creates the private storage bucket used for payment
// screenshots and UTR proofs. Safe to re-run — it's a no-op if the bucket
// already exists. Run with:
//   node --env-file=.env.local scripts/setup-supabase-storage.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = "payment-proofs";

const { data: existing, error: listError } = await supabase.storage.listBuckets();
if (listError) {
  console.error("Could not list buckets:", listError.message);
  process.exit(1);
}

if (existing.some((b) => b.name === BUCKET)) {
  console.log(`Bucket "${BUCKET}" already exists.`);
} else {
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: "5MB",
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "application/pdf"],
  });
  if (error) {
    console.error("Could not create bucket:", error.message);
    process.exit(1);
  }
  console.log(`Created private bucket "${BUCKET}".`);
}
