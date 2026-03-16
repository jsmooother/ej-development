#!/usr/bin/env tsx
/**
 * Create Supabase Storage buckets required by the app.
 * Run: npx tsx scripts/setup-supabase-storage.ts
 */
import * as dotenv from "dotenv";
import path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

const BUCKETS = [
  { name: "images", public: true },
  { name: "project-images", public: true },
];

async function main() {
  console.log("\n=== Supabase Storage Setup ===\n");

  const { data: existing } = await supabase.storage.listBuckets();
  const existingNames = new Set((existing || []).map((b) => b.name));

  for (const bucket of BUCKETS) {
    if (existingNames.has(bucket.name)) {
      console.log(`✓ Bucket "${bucket.name}" already exists`);
      continue;
    }
    const { data, error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
      fileSizeLimit: 5242880, // 5MB
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
