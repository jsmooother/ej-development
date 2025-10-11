import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/db/index";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type UserRole = "admin" | "editor";

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Get the current authenticated user with their role
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = createSupabaseServerClient();
    
    
    // Get the user from the access token in cookies
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError.message);
      return null;
    }

    if (!user) {
      console.log("No authenticated user found");
      return null;
    }

    const userId = user.id;
    const email = user.email || "unknown@example.com";

    // Get user profile from database
    const db = getDb();
    const userProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (userProfiles.length === 0) {
      console.log("No profile found for user:", userId);
      return null;
    }

    return {
      userId,
      email,
      role: userProfiles[0].role,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

/**
 * Check if the current user is an admin or editor
 */
export async function isAdminOrEditor(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin" || user?.role === "editor";
}

/**
 * Require admin role or throw error
 * Use in API routes that should only be accessible to admins
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }

  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }

  return user;
}

/**
 * Require admin or editor role or throw error
 * Use in API routes that should be accessible to both admins and editors
 */
export async function requireAdminOrEditor(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }

  if (user.role !== "admin" && user.role !== "editor") {
    throw new Error("Admin or editor access required");
  }

  return user;
}
