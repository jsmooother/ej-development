"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea, Select } from "@/components/admin/form-field";
import { Toggle } from "@/components/admin/toggle";
import { ProjectImagesManager } from "@/components/admin/project-images-manager";
import { FactsEditor } from "@/components/admin/facts-editor";
import { ProjectPreviewModal } from "@/components/admin/project-preview-modal";
import { Eye } from "lucide-react";
// Using simple alerts instead of toast system

type ImageTag = "before" | "after" | "gallery";

interface ProjectImage {
  id: string;
  url: string;
  tags: ImageTag[];
  caption?: string;
  pairId?: string;
}

interface ImagePair {
  id: string;
  label: string;
  beforeImageId?: string;
  afterImageId?: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // Simple alert functions instead of toast system
  const showSuccess = (message: string) => alert(`✅ ${message}`);
  const showError = (message: string) => alert(`❌ ${message}`);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]); // Legacy
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [imagePairs, setImagePairs] = useState<ImagePair[]>([]);
  const [projectFacts, setProjectFacts] = useState<Record<string, string | number | null>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Create project object
      const projectData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        summary: formData.get('summary') as string || '',
        content: formData.get('content') as string || '',
        year: formData.get('year') ? parseInt(formData.get('year') as string) : new Date().getFullYear(),
        facts: projectFacts,
        heroImagePath: heroImageUrl || '',
        additionalImages: galleryImages, // Legacy
        projectImages: projectImages, // New system
        imagePairs: imagePairs, // New system
        isHero: formData.get('isHero') === 'on',
        isPublished: formData.get('isPublished') === 'on',
      };
      
      // Call API to create project
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }
      
      const result = await response.json();
      console.log('Created project:', result);
      
      // Show success and redirect
        // Project created successfully - redirect immediately
        router.push('/admin/projects');
    } catch (err) {
      console.error('Failed to create project:', err);
      setIsSaving(false);
    }
  };

  // Create preview project object
  const previewProject = {
    id: 'preview',
    slug: slug || 'preview',
    title: title || 'Untitled Project',
    summary: summary || 'No summary provided',
    content: content || '',
    year: year,
    facts: projectFacts,
    heroImagePath: heroImageUrl,
    projectImages,
    imagePairs,
    isPublished,
    createdAt: new Date()
  };

  return (
    <div>
      <AdminHeader 
        title="New Project" 
        description="Create a new portfolio project to showcase your work"
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
      <ProjectPreviewModal
        project={previewProject}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />

      <div className="mx-auto max-w-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Basic Information
            </h2>
            
            <FormField 
              label="Project Title" 
              id="title" 
              required
              description="The name of your project"
            >
              <Input 
                id="title" 
                name="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Sierra Horizon" 
                required 
              />
            </FormField>

            <FormField 
              label="Slug" 
              id="slug"
              required
              description="URL-friendly identifier (e.g., sierra-horizon)"
            >
              <Input 
                id="slug" 
                name="slug" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="sierra-horizon" 
                pattern="[a-z0-9-]+"
                required 
              />
            </FormField>

            <FormField 
              label="Summary" 
              id="summary"
              description="Brief one-line description"
            >
              <Input 
                id="summary" 
                name="summary" 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="La Zagaleta · 2023"
              />
            </FormField>

            <FormField 
              label="Year" 
              id="year"
              description="Year the project was completed"
            >
              <Input 
                id="year" 
                name="year" 
                type="number"
                value={year || ''}
                onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : null)}
                min="2000"
                max="2030"
                placeholder="2023"
              />
            </FormField>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Content
            </h2>

            <FormField 
              label="Description" 
              id="content"
              description="Detailed project description and case study"
            >
              <Textarea 
                id="content" 
                name="content" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder="Describe your project in detail..."
                className="resize-y min-h-[200px]"
              />
            </FormField>
          </div>

          {/* Project Facts */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Project Details
            </h2>

            <FactsEditor
              facts={projectFacts}
              onChange={setProjectFacts}
              label="Project Facts"
              description="Required for frontpage display: 'sqm' (size badge) and 'bedrooms' (rooms badge). Add other details as needed."
            />
          </div>

          {/* Images */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 mb-2">
                Project Images
              </h2>
              <p className="text-sm text-muted-foreground">
                Upload your images, then select one as the hero image for project cards and detail pages.
              </p>
            </div>

            <ProjectImagesManager
              images={projectImages}
              pairs={imagePairs}
              heroImageUrl={heroImageUrl}
              onImagesChange={setProjectImages}
              onPairsChange={setImagePairs}
              onHeroImageChange={setHeroImageUrl}
              label="Upload & Organize Images"
              description="Upload images, tag them as before/after/gallery, and create pairs."
              maxImages={50}
              maxPairs={10}
            />
          </div>

          {/* Publishing */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Visibility & Publishing
            </h2>

            <Toggle
              id="isPublished"
              name="isPublished"
              label="Publish to Site"
              description="When enabled, this project will be visible on the public site"
              defaultChecked={isPublished}
              onChange={setIsPublished}
            />

            <Toggle
              id="isHero"
              name="isHero"
              label="Hero Project"
              description="When enabled, this project will be featured prominently on the homepage. Only one project can be the hero at a time."
              defaultChecked={false}
            />

            <div className="rounded-lg border border-border/30 bg-muted/10 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-muted-foreground/70">
                  <p className="font-medium text-foreground/80">Publishing tip</p>
                  <p className="mt-1">Turn off to keep this project in draft mode while you work on it. You can publish it later when ready.</p>
                </div>
              </div>
            </div>
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
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md disabled:opacity-50"
              >
                {isSaving ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Toast Notifications */}
      {/* Simple alerts used instead of toast notifications */}
    </div>
  );
}

