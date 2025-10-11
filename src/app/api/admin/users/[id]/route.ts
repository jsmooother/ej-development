import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";

/**
 * PATCH /api/admin/users/[id]
 * Update user role
 * ADMIN ONLY
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();
    const { role } = body;

    if (!role || !["admin", "editor"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'admin' or 'editor'" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Update profile in database
    await db
      .update(profiles)
      .set({
        role: role as "admin" | "editor",
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, id));

    // Update user metadata in Supabase Auth
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

    await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: { role },
    });

    return NextResponse.json({
      message: "User updated successfully",
      userId: id,
      role,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user
 * ADMIN ONLY
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

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

    // Delete user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      console.error("Error deleting auth user:", authError);
      throw new Error(authError.message);
    }

    // Delete profile from database
    const db = getDb();
    await db.delete(profiles).where(eq(profiles.userId, id));

    return NextResponse.json({
      message: "User deleted successfully",
      userId: id,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete user" },
      { status: 500 }
    );
  }
}

