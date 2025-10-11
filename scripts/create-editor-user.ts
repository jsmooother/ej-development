#!/usr/bin/env tsx

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

// Load environment variables
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DATABASE_URL = process.env.SUPABASE_DB_URL!;

async function createEditorUser() {
  console.log('🔧 Creating editor user...');

  // Create Supabase admin client
  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Database connection
  const sql = postgres(DATABASE_URL, { ssl: "require", max: 1 });

  const email = 'editor@ejproperties.com';
  const password = 'EditorPass123!';
  const role = 'editor';

  try {
    // 1. Create user in Supabase Auth
    console.log('📧 Creating user in Supabase Auth...');
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email verification
      user_metadata: {
        role: role,
        email_verified: true,
      },
    });

    if (authError) {
      if (authError.message.includes('already been registered') || authError.message.includes('already registered')) {
        console.log('⚠️  User already exists in Supabase Auth, updating...');
        
        // Get existing user
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = existingUsers.users.find(u => u.email === email);
        if (!existingUser) throw new Error('User not found');
        
        // Update user metadata
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            user_metadata: {
              role: role,
              email_verified: true,
            }
          }
        );
        
        if (updateError) throw updateError;
        
        console.log('✅ Updated existing user metadata');
        
        // Create/update profile in database
        console.log('💾 Creating/updating profile in database...');
        await sql`
          INSERT INTO profiles (user_id, role, created_at, updated_at)
          VALUES (${existingUser.id}, ${role}, NOW(), NOW())
          ON CONFLICT (user_id) 
          DO UPDATE SET 
            role = ${role},
            updated_at = NOW()
        `;
        
        console.log('✅ Profile created/updated in database');
        console.log(`🎉 Editor user ready!`);
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log(`👤 Role: ${role}`);
        
        return;
      }
      throw authError;
    }

    console.log('✅ User created in Supabase Auth');

    // 2. Create profile in database
    console.log('💾 Creating profile in database...');
    await sql`
      INSERT INTO profiles (user_id, role, created_at, updated_at)
      VALUES (${authUser.user.id}, ${role}, NOW(), NOW())
    `;

    console.log('✅ Profile created in database');
    console.log(`🎉 Editor user created successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Role: ${role}`);
    console.log(`🆔 User ID: ${authUser.user.id}`);

  } catch (error) {
    console.error('❌ Error creating editor user:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

createEditorUser();
