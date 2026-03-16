#!/usr/bin/env tsx
/**
 * Upload assets from public/ to Supabase Storage.
 * Run: npx tsx scripts/upload-public-assets.ts
 */
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
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
const BUCKET = "images";

// Paths to upload: [localPath, storagePath]
const ASSETS: Array<[string, string]> = [
  // Listing images
  ["public/listing-images/casa-serrana/01-exterior.jpg", "listings/casa-serrana/01-exterior.jpg"],
  ["public/listing-images/casa-serrana/02-living.jpg", "listings/casa-serrana/02-living.jpg"],
  ["public/listing-images/casa-serrana/03-master-suite.jpg", "listings/casa-serrana/03-master-suite.jpg"],
  ["public/listing-images/casa-serrana/04-pool.jpg", "listings/casa-serrana/04-pool.jpg"],
  ["public/listing-images/casa-serrana/05-gallery.jpg", "listings/casa-serrana/05-gallery.jpg"],
  ["public/listing-images/casa-serrana/hero.jpg", "listings/casa-serrana/hero.jpg"],
  // Investor assets
  ["public/investor/plot-plan.png", "investor/plot-plan.png"],
  ["public/investor/altimetria-crop.png", "investor/altimetria-crop.png"],
  ["public/investor/altimetria-preview.png", "investor/altimetria-preview.png"],
  ["public/investor/251106-altimetria.pdf", "investor/251106-altimetria.pdf"],
  // Placeholders
  ["public/placeholder-project.jpg", "placeholders/placeholder-project.jpg"],
  ["public/placeholder-editorial.jpg", "placeholders/placeholder-editorial.jpg"],
  ["public/placeholder-instagram.jpg", "placeholders/placeholder-instagram.jpg"],
];

function getPublicUrl(storagePath: string): string {
  return `${url}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

async function main() {
  console.log("\n=== Upload Public Assets to Supabase ===\n");

  let uploaded = 0;
  let skipped = 0;

  for (const [localPath, storagePath] of ASSETS) {
    const fullPath = path.resolve(process.cwd(), localPath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⊘ Skip ${localPath} (not found)`);
      skipped++;
      continue;
    }

    const buffer = fs.readFileSync(fullPath);
    const ext = path.extname(storagePath).slice(1);
    const contentType =
      ext === "pdf" ? "application/pdf" : ext === "png" ? "image/png" : "image/jpeg";

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
      contentType,
      upsert: true,
    });

    if (error) {
      console.error(`✗ ${localPath}:`, error.message);
    } else {
      console.log(`✓ ${storagePath}`);
      uploaded++;
    }
  }

  console.log(`\nUploaded: ${uploaded}, Skipped: ${skipped}`);
  console.log("\nPublic URLs (use in app):");
  console.log(`  Investor plot: ${getPublicUrl("investor/plot-plan.png")}`);
  console.log(`  Investor PDF:  ${getPublicUrl("investor/251106-altimetria.pdf")}`);
  console.log(`  Casa Serrana:  ${getPublicUrl("listings/casa-serrana/hero.jpg")}`);
  console.log("\nDone.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
