import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupStorage() {
  try {
    console.log("🗂️ Setting up Supabase Storage...");

    // Check if images bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return;
    }

    const imagesBucket = buckets.find(bucket => bucket.name === "images");

    if (!imagesBucket) {
      console.log("📦 Creating 'images' bucket...");
      
      const { data, error } = await supabase.storage.createBucket("images", {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
        fileSizeLimit: 10485760, // 10MB
      });

      if (error) {
        console.error("Error creating bucket:", error);
        return;
      }

      console.log("✅ Images bucket created successfully!");
    } else {
      console.log("✅ Images bucket already exists");
    }

    // Create uploads folder structure
    console.log("📁 Creating folder structure...");
    
    const folders = ["uploads", "projects", "editorials", "listings", "instagram"];
    
    for (const folder of folders) {
      // Create a dummy file to ensure folder exists
      const dummyFile = new Blob([""], { type: "text/plain" });
      const { error } = await supabase.storage
        .from("images")
        .upload(`${folder}/.gitkeep`, dummyFile);

      if (error && !error.message.includes("already exists")) {
        console.warn(`Warning creating folder ${folder}:`, error.message);
      } else {
        console.log(`✅ Folder ${folder} ready`);
      }
    }

    console.log("\n🎉 Storage setup complete!");
    console.log("📋 Next steps:");
    console.log("1. Go to Supabase Dashboard > Storage");
    console.log("2. Verify the 'images' bucket exists and is public");
    console.log("3. Check that all folders are created");
    console.log("4. Test file upload in the admin panel");

  } catch (error) {
    console.error("❌ Storage setup failed:", error);
  }
}

setupStorage();
