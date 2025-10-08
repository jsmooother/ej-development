"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea, Select, Toggle } from "@/components/admin/form-field";

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

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockEditorial: Editorial = {
      id: params.id,
      slug: 'marbella-market-reframed',
      title: 'Marbella Market, Reframed',
      excerpt: 'Design-led developments are resetting expectations along the Golden Mile.',
      content: 'The Marbella property market has undergone a significant transformation in recent years, with design-led developments setting new standards for luxury living along the Golden Mile...',
      tags: ['Market Insight'],
      coverImagePath: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      ],
      isPublished: true,
      publishDate: new Date('2025-10-01'),
      createdAt: new Date('2025-10-01'),
    };
    
    setEditorial(mockEditorial);
    setIsLoading(false);
  }, [params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorial) return;

    setIsSaving(true);
    
    try {
      // TODO: Replace with actual API call
      console.log('Saving editorial:', editorial);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      router.push('/admin/editorials');
    } catch (error) {
      console.error('Failed to save editorial:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editorial || !confirm('Are you sure you want to delete this editorial?')) return;

    try {
      // TODO: Replace with actual API call
      console.log('Deleting editorial:', editorial.id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      router.push('/admin/editorials');
    } catch (error) {
      console.error('Failed to delete editorial:', error);
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

      <form onSubmit={handleSave} className="p-8">
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
                    onChange={(e) => setEditorial({ ...editorial, title: e.target.value })}
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
                    onChange={(e) => setEditorial({ ...editorial, slug: e.target.value })}
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
                  onChange={(e) => setEditorial({ ...editorial, excerpt: e.target.value })}
                  placeholder="Brief description of the editorial"
                />
              </FormField>

              <FormField
                label="Tags"
                description="Categories for organizing content (comma-separated)"
              >
                <Input
                  value={editorial.tags.join(', ')}
                  onChange={(e) => setEditorial({ 
                    ...editorial, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
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
                rows={12}
              />
            </FormField>
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
                  onChange={(e) => setEditorial({ ...editorial, coverImagePath: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </FormField>

              <FormField
                label="Additional Images"
                description="Additional image URLs (one per line)"
              >
                <Textarea
                  value={editorial.additionalImages.join('\n')}
                  onChange={(e) => setEditorial({ 
                    ...editorial, 
                    additionalImages: e.target.value.split('\n').filter(url => url.trim())
                  })}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={4}
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
                  checked={editorial.isPublished}
                  onCheckedChange={(checked) => setEditorial({ ...editorial, isPublished: checked })}
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

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/admin/editorials')}
                className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-2 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
