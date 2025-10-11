"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export interface UserInfo {
  userId: string;
  email: string;
  role: "admin" | "editor" | null;
}

export function useUserRole() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: "",
    email: "",
    role: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setIsLoading(false);
          return;
        }

        const userId = session.user.id;
        const email = session.user.email || "";

        // Get role from user metadata first (set during creation)
        const metadataRole = session.user.user_metadata?.role;

        if (metadataRole) {
          setUserInfo({
            userId,
            email,
            role: metadataRole as "admin" | "editor",
          });
          setIsLoading(false);
          return;
        }

        // Fallback: Fetch from database via API
        const response = await fetch("/api/admin/current-user", {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            userId: data.userId,
            email: data.email,
            role: data.role,
          });
        } else {
          // If API fails but we have a session, assume editor for safety
          setUserInfo({
            userId,
            email,
            role: "editor",
          });
        }
      } catch (error) {
        console.error("Failed to load user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserRole();
  }, []);

  return { ...userInfo, isLoading };
}

