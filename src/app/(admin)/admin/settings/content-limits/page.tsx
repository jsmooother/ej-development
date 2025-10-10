"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";

type ContentLimits = {
  frontpage: {
    projects: number;
    editorials: number;
    instagram: number;
  };
};

export default function ContentLimitsPage() {
  const [limits, setLimits] = useState<ContentLimits>({
    frontpage: {
      projects: 3,
      editorials: 10,
      instagram: 3,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/settings/content-limits");
        if (response.ok) {
          const data = await response.json();
          setLimits(data);
        }
      } catch (error) {
        console.error("Error fetching content limits:", error);
        setError("Failed to load content limits");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLimits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/settings/content-limits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(limits),
      });

      if (!response.ok) {
        throw new Error("Failed to save content limits");
      }

      setSuccessMessage("Content limits saved successfully");
    } catch (error) {
      console.error("Error saving content limits:", error);
      setError("Failed to save content limits");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section: keyof ContentLimits["frontpage"], value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    setLimits((prev) => ({
      ...prev,
      frontpage: {
        ...prev.frontpage,
        [section]: numValue,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Content Limits"
        description="Configure how many items to display in different sections of your site."
      />

      <div className="p-8">
        <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
          {/* Frontpage Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Frontpage Display</h3>
              <p className="text-sm text-muted-foreground">
                Control how many items appear in each section of your homepage.
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">
                  Projects
                  <input
                    type="number"
                    min="0"
                    value={limits.frontpage.projects}
                    onChange={(e) => handleChange("projects", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Number of projects to display in the feature stream
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Editorials
                  <input
                    type="number"
                    min="0"
                    value={limits.frontpage.editorials}
                    onChange={(e) => handleChange("editorials", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Number of editorial posts to display in the feature stream
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Instagram Posts
                  <input
                    type="number"
                    min="0"
                    value={limits.frontpage.instagram}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Number of Instagram posts to display in the social feed
                </p>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
