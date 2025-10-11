import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { profiles } from "@/lib/db/schema";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/users
 * List all users with their profiles
 * ADMIN ONLY
 */
export async function GET() {
  try {
    // Check admin permission
    try {
      await requireAdmin();
    } catch (authError) {
      return NextResponse.json(
        { error: authError instanceof Error ? authError.message : "Unauthorized" },
        { status: authError instanceof Error && authError.message === "Not authenticated" ? 401 : 403 }
      );
    }

    const db = getDb();
    
    // Get all profiles from database
    const userProfiles = await db.select().from(profiles);

    // Get Supabase client for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Fetch user details from Supabase Auth
    const { data: authUsers, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching auth users:", error);
      throw new Error("Failed to fetch users from authentication service");
    }

    // Combine profile data with auth data
    const users = userProfiles.map((profile) => {
      const authUser = authUsers.users.find((u) => u.id === profile.userId);
      return {
        userId: profile.userId,
        email: authUser?.email || "unknown@example.com",
        role: profile.role,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error listing users:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list users" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Create a new user
 * ADMIN ONLY
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    try {
      await requireAdmin();
    } catch (authError) {
      return NextResponse.json(
        { error: authError instanceof Error ? authError.message : "Unauthorized" },
        { status: authError instanceof Error && authError.message === "Not authenticated" ? 401 : 403 }
      );
    }

    const body = await request.json();
    const { email, role = "editor" } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!["admin", "editor"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'admin' or 'editor'" },
        { status: 400 }
      );
    }

    // Get Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: role,
      },
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error("Failed to create user");
    }

    // Create profile in database
    const db = getDb();
    await db.insert(profiles).values({
      userId: authData.user.id,
      role: role as "admin" | "editor",
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        userId: authData.user.id,
        email: authData.user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 }
    );
  }
}

