#!/usr/bin/env tsx
/**
 * Upload investor hero video to Supabase Storage.
 *
 * Usage:
 *   npx tsx scripts/upload-investor-hero-video.ts [local-file]
 *
 * Default local file: tmp/investor-video/hero.mp4
 * Storage path: investor/elysia/hero.mp4 (public `media` bucket)
 */
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey } from "../src/lib/supabase/keys";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const BUCKET = "media";
const STORAGE_PATH = "investor/elysia/hero.mp4";
const DEFAULT_LOCAL = path.resolve(process.cwd(), "tmp/investor-video/hero.mp4");

async function ensureBucket(supabase: ReturnType<typeof createClient>) {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (exists) return;

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 52428800, // 50MB (Supabase free tier max per object)
  });
  if (error) throw new Error(`Failed to create bucket "${BUCKET}": ${error.message}`);
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = getSupabaseSecretKey();
  const localFile = path.resolve(process.argv[2] ?? DEFAULT_LOCAL);

  if (!url || !secretKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
    process.exit(1);
  }

  if (!fs.existsSync(localFile)) {
    console.error(`Local file not found: ${localFile}`);
    console.error("Download the AMES hero video first, then re-run this script.");
    process.exit(1);
  }

  const stat = fs.statSync(localFile);
  const supabase = createClient(url, secretKey);

  console.log("\n=== Upload investor hero video ===\n");
  console.log(`Local:  ${localFile} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`Target: ${BUCKET}/${STORAGE_PATH}\n`);

  await ensureBucket(supabase);

  const buffer = fs.readFileSync(localFile);
  const { error } = await supabase.storage.from(BUCKET).upload(STORAGE_PATH, buffer, {
    contentType: "video/mp4",
    upsert: true,
    cacheControl: "3600",
  });

  if (error) {
    console.error("Upload failed:", error.message);
    process.exit(1);
  }

  const publicUrl = `${url}/storage/v1/object/public/${BUCKET}/${STORAGE_PATH}`;
  console.log("✅ Uploaded successfully\n");
  console.log("Public URL:");
  console.log(publicUrl);
  console.log("\nAdd to .env.local (optional):");
  console.log(`NEXT_PUBLIC_INVESTOR_HERO_VIDEO_URL=${publicUrl}`);
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
