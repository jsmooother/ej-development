import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DB_URL = process.env.DIRECT_URL || process.env.SUPABASE_DB_URL;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing required environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!DB_URL) {
  console.error("❌ Missing database URL:");
  console.error("   - DIRECT_URL or SUPABASE_DB_URL required");
  process.exit(1);
}

async function createFirstAdmin() {
  console.log("🚀 Creating first admin user...\n");

  // Get email from command line or use default
  const email = process.argv[2] || "admin@ejproperties.com";
  const password = process.argv[3] || "admin123456"; // Temporary password

  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`⚠️  Make sure to change this password after first login!\n`);

  try {
    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find((u) => u.email === email);

    let userId: string;

    if (existingUser) {
      console.log("⚠️  User already exists in Supabase Auth");
      console.log(`   User ID: ${existingUser.id}`);
      userId = existingUser.id;

      // Update to ensure they're confirmed
      await supabase.auth.admin.updateUserById(userId, {
        email_confirm: true,
        user_metadata: { role: "admin" },
      });
      console.log("✅ Updated existing user");
    } else {
      // Create new user in Supabase Auth
      console.log("📝 Creating user in Supabase Auth...");
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          role: "admin",
        },
      });

      if (authError) {
        throw new Error(`Auth error: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      userId = authData.user.id;
      console.log(`✅ Created user in Supabase Auth`);
      console.log(`   User ID: ${userId}`);
    }

    // Create or update profile in database
    console.log("\n📝 Creating admin profile in database...");
    const sql = postgres(DB_URL, { ssl: "require", max: 1 });

    try {
      // Check if profile already exists
      const existingProfiles = await sql`
        SELECT * FROM profiles WHERE user_id = ${userId}
      `;

      if (existingProfiles.length > 0) {
        console.log("⚠️  Profile already exists, updating to admin role...");
        await sql`
          UPDATE profiles 
          SET role = 'admin', updated_at = NOW()
          WHERE user_id = ${userId}
        `;
      } else {
        await sql`
          INSERT INTO profiles (user_id, role)
          VALUES (${userId}, 'admin')
        `;
      }

      await sql.end();
    } catch (dbError) {
      await sql.end();
      throw dbError;
    }

    console.log("✅ Admin profile created in database\n");

    console.log("=".repeat(60));
    console.log("🎉 SUCCESS! First admin user created\n");
    console.log("📋 Login Details:");
    console.log(`   URL:      http://localhost:3000/admin`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   User ID:  ${userId}`);
    console.log("\n⚠️  IMPORTANT: Change password after first login!");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n❌ Error creating admin user:");
    console.error(error);
    process.exit(1);
  }
}

createFirstAdmin();

