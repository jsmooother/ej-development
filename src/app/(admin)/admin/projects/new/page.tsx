"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea, Select } from "@/components/admin/form-field";
import { Toggle } from "@/components/admin/toggle";
import { HeroImageManager } from "@/components/admin/hero-image-manager";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Parse facts from JSON input
      let facts = {};
      const factsInput = formData.get('facts') as string;
      if (factsInput) {
        try {
          facts = JSON.parse(factsInput);
        } catch (error) {
          alert('Invalid JSON in facts field');
          setIsSaving(false);
          return;
        }
      }
      
      // Create project object
      const projectData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        summary: formData.get('summary') as string || '',
        content: formData.get('content') as string || '',
        year: formData.get('year') ? parseInt(formData.get('year') as string) : new Date().getFullYear(),
        facts,
        heroImagePath: heroImageUrl || '',
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
      
      // Redirect to projects list
      router.push('/admin/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error instanceof Error ? error.message : 'Failed to create project');
      setIsSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader 
        title="New Project" 
        description="Create a new portfolio project to showcase your work"
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

            <div className="grid gap-4 md:grid-cols-2">
              <FormField 
                label="Square Meters" 
                id="sqm"
                description="Total built area"
              >
                <Input 
                  id="sqm" 
                  name="sqm" 
                  type="number"
                  placeholder="420"
                />
              </FormField>

              <FormField 
                label="Bedrooms" 
                id="bedrooms"
              >
                <Input 
                  id="bedrooms" 
                  name="bedrooms" 
                  type="number"
                  placeholder="6"
                />
              </FormField>

              <FormField 
                label="Bathrooms" 
                id="bathrooms"
              >
                <Input 
                  id="bathrooms" 
                  name="bathrooms" 
                  type="number"
                  placeholder="5"
                />
              </FormField>

              <FormField 
                label="Plot Size (m²)" 
                id="plotSqm"
              >
                <Input 
                  id="plotSqm" 
                  name="plotSqm" 
                  type="number"
                  placeholder="1200"
                />
              </FormField>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Project Images
            </h2>

            <HeroImageManager
              imageUrl={heroImageUrl}
              onChange={setHeroImageUrl}
              label="Hero Image"
              description="Main project image displayed on cards and detail pages"
              required
            />

            <MultiImageUpload
              images={galleryImages}
              onChange={setGalleryImages}
              label="Gallery Images"
              description="Upload additional images for the project gallery"
              maxImages={12}
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
              defaultChecked={true}
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
    </div>
  );
}

