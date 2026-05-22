#!/usr/bin/env tsx
/**
 * Create Supabase Storage buckets required by the app.
 * Run: npx tsx scripts/setup-supabase-storage.ts
 */
import * as dotenv from "dotenv";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey } from "../src/lib/supabase/keys";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = getSupabaseSecretKey();

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

const BUCKETS = [
  { name: "images", public: true, fileSizeLimit: 5242880 },
  { name: "project-images", public: true, fileSizeLimit: 5242880 },
  { name: "media", public: true, fileSizeLimit: 52428800 },
];

async function main() {
  console.log("\n=== Supabase Storage Setup ===\n");

  const { data: existing } = await supabase.storage.listBuckets();
  const existingNames = new Set((existing || []).map((b) => b.name));

  for (const bucket of BUCKETS) {
    if (existingNames.has(bucket.name)) {
      const { error } = await supabase.storage.updateBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
      });
      if (error) {
        console.log(`✓ Bucket "${bucket.name}" already exists (limit update skipped: ${error.message})`);
      } else {
        console.log(`✓ Bucket "${bucket.name}" already exists (limits verified)`);
      }
      continue;
    }
    const { data, error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimit,
    });
    if (error) {
      console.error(`✗ Failed to create "${bucket.name}":`, error.message);
    } else {
      console.log(`✓ Created bucket "${bucket.name}" (public: ${bucket.public})`);
    }
  }

  console.log("\nDone.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
