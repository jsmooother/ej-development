"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea, Select } from "@/components/admin/form-field";

export default function NewEditorialPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    // TODO: Replace with actual API call
    setTimeout(() => {
      alert("Editorial would be created here!");
      router.push("/admin/editorials");
    }, 1000);
  };

  return (
    <div>
      <AdminHeader 
        title="New Editorial" 
        description="Write a new article to share insights and stories"
      />

      <div className="mx-auto max-w-4xl p-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground/60">
              Basic Information
            </h2>
            
            <FormField 
              label="Title" 
              id="title" 
              required
              description="The headline of your editorial"
            >
              <Input 
                id="title" 
                name="title" 
                placeholder="e.g., Marbella Market, Reframed" 
                required 
              />
            </FormField>

            <FormField 
              label="Slug" 
              id="slug"
              required
              description="URL-friendly identifier (e.g., marbella-market-reframed)"
            >
              <Input 
                id="slug" 
                name="slug" 
                placeholder="marbella-market-reframed" 
                pattern="[a-z0-9-]+"
                required 
              />
            </FormField>

            <FormField 
              label="Excerpt" 
              id="excerpt"
              description="Brief summary that appears in previews"
            >
              <Textarea 
                id="excerpt" 
                name="excerpt" 
                rows={3}
                placeholder="A compelling summary of your article..."
              />
            </FormField>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground/60">
              Article Content
            </h2>

            <FormField 
              label="Full Content" 
              id="content"
              required
              description="The main body of your editorial article"
            >
              <Textarea 
                id="content" 
                name="content" 
                rows={16}
                placeholder="Write your article here... (Rich text editor coming soon)"
                required
              />
            </FormField>
          </div>

          {/* Categorization */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground/60">
              Categorization
            </h2>

            <FormField 
              label="Tags" 
              id="tags"
              description="Categories or topics (comma-separated)"
            >
              <Input 
                id="tags" 
                name="tags" 
                placeholder="Market Insight, Design Journal, Guide"
              />
            </FormField>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground/60">
              Cover Image
            </h2>

            <FormField 
              label="Cover Image URL" 
              id="coverImage"
              description="Featured image for the article (temporary - upload coming soon)"
            >
              <Input 
                id="coverImage" 
                name="coverImage" 
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </FormField>

            <div className="rounded-lg border border-dashed border-border/50 bg-muted/20 p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-3 text-sm font-medium text-muted-foreground">Image upload coming soon</p>
              <p className="mt-1 text-xs text-muted-foreground/60">For now, use image URLs</p>
            </div>
          </div>

          {/* Publishing */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground/60">
              Publishing
            </h2>

            <FormField 
              label="Status" 
              id="isPublished"
            >
              <Select id="isPublished" name="isPublished" defaultValue="true">
                <option value="true">Published (Live on site)</option>
                <option value="false">Draft (Hidden from site)</option>
              </Select>
            </FormField>

            <FormField 
              label="Publish Date" 
              id="publishedAt"
              description="When this article should go live"
            >
              <Input 
                id="publishedAt" 
                name="publishedAt" 
                type="datetime-local"
              />
            </FormField>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-border/20 pt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-xl border border-border/40 px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:border-border hover:bg-muted/50"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md disabled:opacity-50"
              >
                {isSaving ? "Publishing..." : "Publish Editorial"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

