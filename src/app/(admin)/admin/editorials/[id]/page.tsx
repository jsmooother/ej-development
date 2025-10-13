"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea, Select } from "@/components/admin/form-field";
import { Toggle } from "@/components/admin/toggle";
import { EditorialPreviewModal } from "@/components/admin/editorial-preview-modal";
import { Eye } from "lucide-react";

interface Editorial {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImagePath: string;
  additionalImages: string[];
  isPublished: boolean;
  publishDate?: Date;
  createdAt: Date;
}

export default function EditEditorialPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [editorial, setEditorial] = useState<Editorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch editorial data from API
  useEffect(() => {
    const fetchEditorial = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/editorials/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch editorial');
        }
        
        const data = await response.json();
        
        // Map API response to Editorial interface
        const fetchedEditorial: Editorial = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt || '',
          content: data.content || '',
          tags: data.tags || [],
          coverImagePath: data.coverImagePath || '',
          additionalImages: [], // Can be extended later
          isPublished: data.isPublished,
          publishDate: data.publishedAt ? new Date(data.publishedAt) : undefined,
          createdAt: new Date(data.createdAt),
        };
        
        setEditorial(fetchedEditorial);
      } catch (error) {
        console.error('Error fetching editorial:', error);
        alert('Failed to load editorial');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEditorial();
  }, [params.id]);

  // Auto-save function for basic fields
  const autoSave = async (updatedEditorial: Editorial, skipContent = false) => {
    if (!updatedEditorial?.id) return;

    setIsAutoSaving(true);

    try {
      const response = await fetch(`/api/editorials/${updatedEditorial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedEditorial.title,
          slug: updatedEditorial.slug,
          excerpt: updatedEditorial.excerpt,
          content: skipContent ? editorial?.content : updatedEditorial.content,
          coverImagePath: updatedEditorial.coverImagePath,
          tags: updatedEditorial.tags,
          isPublished: updatedEditorial.isPublished,
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Debounced auto-save for basic fields
  const debouncedAutoSave = useMemo(
    () => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (updatedEditorial: Editorial) => {
        if (!updatedEditorial?.id) return;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          autoSave(updatedEditorial, true); // Skip content for auto-save
        }, 1000);
      };
    },
    [editorial?.id]
  );

  // Manual save function for content
  const handleSaveContent = async () => {
    if (!editorial) return;

    setIsSaving(true);

    try {
      await autoSave(editorial, false); // Include content for manual save
    } catch (err) {
      console.error('Failed to save content:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editorial || !confirm('Are you sure you want to delete this editorial? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/editorials/${editorial.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete editorial');
      }

      alert('Editorial deleted successfully!');
      router.push('/admin/editorials');
    } catch (error) {
      console.error('Failed to delete editorial:', error);
      alert('Failed to delete editorial. Please try again.');
    }
  };

  const handleGenerateAI = async () => {
    if (!editorial) return;

    try {
      const response = await fetch('/api/ai/generate-editorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editorial.title,
          keyFacts: 'Design-led developments, Golden Mile, luxury market transformation'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setEditorial({ ...editorial, content: data.content });
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!editorial) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Editorial not found</div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader 
        title="Edit Editorial" 
        description={`Modify "${editorial.title}"`}
        action={{
          label: "Back to Editorials",
          href: "/admin/editorials"
        }}
      />

      {/* Preview Button - Fixed Position */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl"
        >
          <Eye className="h-5 w-5" />
          Preview
        </button>
      </div>

      {/* Preview Modal */}
      <EditorialPreviewModal
        editorial={editorial}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />

      <div className="p-8"> {/* Changed from form to div */}
        {/* Auto-save status indicator */}
        <div className="mx-auto mb-6 max-w-4xl">
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 px-4 py-2">
            <div className="flex items-center gap-2">
              {isAutoSaving ? (
                <>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                  <span className="text-sm text-muted-foreground">Auto-saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-muted-foreground">Ready to save</span>
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              Changes save automatically • Content saves manually
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* Basic Information */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Basic Information</h2>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Editorial Title"
                  description="The main title displayed on the editorial"
                  required
                >
                  <Input
                    value={editorial.title}
                    onChange={(e) => {
                      const updated = { ...editorial, title: e.target.value };
                      setEditorial(updated);
                      if (editorial?.id) debouncedAutoSave(updated);
                    }}
                    placeholder="Enter editorial title"
                  />
                </FormField>

                <FormField
                  label="Editorial Slug"
                  description="URL-friendly identifier (auto-generated)"
                  required
                >
                  <Input
                    value={editorial.slug}
                    onChange={(e) => {
                      const updated = { ...editorial, slug: e.target.value };
                      setEditorial(updated);
                      if (editorial?.id) debouncedAutoSave(updated);
                    }}
                    placeholder="editorial-slug"
                  />
                </FormField>
              </div>

              <FormField
                label="Excerpt"
                description="Brief description shown on cards and listings"
                required
              >
                <Input
                  value={editorial.excerpt}
                  onChange={(e) => {
                    const updated = { ...editorial, excerpt: e.target.value };
                    setEditorial(updated);
                    if (editorial?.id) debouncedAutoSave(updated);
                  }}
                  placeholder="Brief description of the editorial"
                />
              </FormField>

              <FormField
                label="Tags"
                description="Categories for organizing content (comma-separated)"
              >
                <Input
                  value={editorial.tags.join(', ')}
                  onChange={(e) => {
                    const updated = { 
                      ...editorial, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    };
                    setEditorial(updated);
                    if (editorial?.id) debouncedAutoSave(updated);
                  }}
                  placeholder="Market Insight, Design Journal, Guide"
                />
              </FormField>
            </div>
          </div>

          {/* Content */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-sans text-lg font-medium text-foreground">Content</h2>
              <button
                type="button"
                onClick={handleGenerateAI}
                className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted/50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate with AI
              </button>
            </div>
            <FormField
              label="Editorial Content"
              description="The main content of the editorial"
              required
            >
              <Textarea
                value={editorial.content}
                onChange={(e) => setEditorial({ ...editorial, content: e.target.value })}
                placeholder="Write your editorial content here..."
                rows={16}
                className="resize-y min-h-[300px]"
              />
            </FormField>
            <div className="mt-4 flex items-center justify-end gap-3">
              {isSaving && (
                <span className="text-sm text-muted-foreground">Saving...</span>
              )}
              <button
                type="button"
                onClick={handleSaveContent}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Images</h2>
            <div className="grid gap-6">
              <FormField
                label="Cover Image URL"
                description="Main image displayed on editorial cards and detail pages"
                required
              >
                <Input
                  value={editorial.coverImagePath}
                  onChange={(e) => {
                    const updated = { ...editorial, coverImagePath: e.target.value };
                    setEditorial(updated);
                    if (editorial?.id) debouncedAutoSave(updated);
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </FormField>

              <FormField
                label="Additional Images"
                description="Additional image URLs (one per line)"
              >
                <Textarea
                  value={editorial.additionalImages.join('\n')}
                  onChange={(e) => {
                    const updated = { 
                      ...editorial, 
                      additionalImages: e.target.value.split('\n').filter(url => url.trim())
                    };
                    setEditorial(updated);
                    if (editorial?.id) debouncedAutoSave(updated);
                  }}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={6}
                  className="resize-y min-h-[100px]"
                />
              </FormField>
            </div>
          </div>

          {/* Publishing */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Publishing</h2>
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans text-sm font-medium text-foreground">Published</h3>
                  <p className="text-xs text-muted-foreground/60">
                    Make this editorial visible on the website
                  </p>
                </div>
                <Toggle
                  id="isPublished"
                  name="isPublished"
                  label="Publish to Site"
                  description="When enabled, this editorial will be visible on the public site"
                  defaultChecked={editorial.isPublished}
                  onChange={(checked) => {
                    const updated = { ...editorial, isPublished: checked };
                    setEditorial(updated);
                    if (editorial?.id) debouncedAutoSave(updated);
                  }}
                />
              </div>

              {editorial.isPublished && (
                <FormField
                  label="Publish Date"
                  description="When this editorial should be published"
                >
                  <Input
                    type="datetime-local"
                    value={editorial.publishDate ? new Date(editorial.publishDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditorial({ 
                      ...editorial, 
                      publishDate: e.target.value ? new Date(e.target.value) : undefined 
                    })}
                  />
                </FormField>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-6">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Editorial
            </button>

            <button
              type="button"
              onClick={() => router.push('/admin/editorials')}
              className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted/50"
            >
              Back to Editorials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
