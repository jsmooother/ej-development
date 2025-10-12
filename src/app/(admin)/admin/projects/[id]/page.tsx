"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea, Select } from "@/components/admin/form-field";
import { Toggle } from "@/components/admin/toggle";
import { ProjectImagesManager } from "@/components/admin/project-images-manager";
import { FactsEditor } from "@/components/admin/facts-editor";
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

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  year: number | null;
  facts: Record<string, string | number | null>;
  heroImagePath: string;
  additionalImages: string[]; // Legacy - will be migrated
  projectImages: ProjectImage[]; // All project images with tags
  imagePairs: ImagePair[]; // Before/after pairs
  isPublished: boolean;
  createdAt: Date;
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  // Silent save - no popups needed

  // Fetch project data from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        
        const data = await response.json();
        if (data.success) {
          // Map database fields to component state
          const fetchedProject: Project = {
            id: data.project.id,
            slug: data.project.slug,
            title: data.project.title,
            summary: data.project.summary || '',
            content: data.project.content || '',
            year: data.project.year,
            facts: data.project.facts || {},
            heroImagePath: data.project.heroImagePath || '',
            additionalImages: Array.isArray(data.project.additionalImages) ? data.project.additionalImages : [], // Legacy
            projectImages: Array.isArray(data.project.projectImages) ? data.project.projectImages : [], // All project images with tags
            imagePairs: Array.isArray(data.project.imagePairs) ? data.project.imagePairs : [], // Before/after pairs
            isPublished: data.project.isPublished,
            createdAt: new Date(data.project.createdAt),
          };
          
          setProject(fetchedProject);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        // Project loading failed - user can try refreshing the page
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [params.id]);

  // Auto-save function for basic fields
  const autoSave = async (updatedProject: Project, skipContent = false) => {
    if (!updatedProject?.id) return;

    setIsAutoSaving(true);
    
    try {
      const response = await fetch(`/api/projects/${updatedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedProject.title,
          slug: updatedProject.slug,
          summary: updatedProject.summary,
          content: skipContent ? project?.content : updatedProject.content, // Keep existing content if skipping
          year: updatedProject.year,
          facts: updatedProject.facts,
          heroImagePath: updatedProject.heroImagePath,
          additionalImages: updatedProject.additionalImages, // Legacy
          projectImages: updatedProject.projectImages, // All project images with tags
          imagePairs: updatedProject.imagePairs, // Before/after pairs
          isPublished: updatedProject.isPublished,
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
      return (updatedProject: Project) => {
        if (!updatedProject?.id) return; // Safety check
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          autoSave(updatedProject, true); // Skip content for auto-save
        }, 1000); // 1 second delay
      };
    },
    [project?.id]
  );

  // Manual save function for description
  const handleSaveDescription = async () => {
    if (!project) return;

    setIsSaving(true);
    
    try {
      await autoSave(project, false); // Include content for manual save
    } catch (err) {
      console.error('Failed to save description:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project || !confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      const data = await response.json();
      if (data.success) {
        showSuccess('Project deleted successfully!');
        // Auto-redirect after showing success message
        setTimeout(() => router.push('/admin/projects'), 1500);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
      showError('Failed to delete project. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Project not found</div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader 
        title="Edit Project" 
        description={`Modify "${project.title}"`}
        action={{
          label: "Back to Projects",
          href: "/admin/projects"
        }}
      />

      <div className="p-8">
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
              Changes save automatically • Description saves manually
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
                  label="Project Title"
                  description="The main title displayed on the project"
                  required
                >
                  <Input
                    value={project.title}
                    onChange={(e) => {
                      const updated = { ...project, title: e.target.value };
                      setProject(updated);
                      if (project?.id) debouncedAutoSave(updated);
                    }}
                    placeholder="Enter project title"
                  />
                </FormField>

                <FormField
                  label="Project Slug"
                  description="URL-friendly identifier (auto-generated)"
                  required
                >
                  <Input
                    value={project.slug}
                    onChange={(e) => {
                      const updated = { ...project, slug: e.target.value };
                      setProject(updated);
                      if (project?.id) debouncedAutoSave(updated);
                    }}
                    placeholder="project-slug"
                  />
                </FormField>
              </div>

              <FormField
                label="Summary"
                description="Brief description shown on cards and listings"
                required
              >
                <Input
                  value={project.summary}
                  onChange={(e) => {
                    const updated = { ...project, summary: e.target.value };
                    setProject(updated);
                    if (project?.id) debouncedAutoSave(updated);
                  }}
                  placeholder="Location · Year"
                />
              </FormField>

              <FormField
                label="Year"
                description="Year the project was completed"
              >
                <Input
                  type="number"
                  value={project.year || ''}
                  onChange={(e) => {
                    const updated = { ...project, year: e.target.value ? parseInt(e.target.value) : null };
                    setProject(updated);
                    if (project?.id) debouncedAutoSave(updated);
                  }}
                  placeholder="2023"
                  min="2000"
                  max="2030"
                />
              </FormField>
            </div>
          </div>

          {/* Content */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Project Description</h2>
            <FormField
              label="Content"
              description="Detailed project description and case study"
            >
              <Textarea
                value={project.content}
                onChange={(e) => setProject({ ...project, content: e.target.value })}
                placeholder="Describe your project in detail..."
                rows={12}
                className="resize-y min-h-[200px]"
              />
            </FormField>
            <div className="mt-4 flex items-center justify-end gap-3">
              {isSaving && (
                <span className="text-sm text-muted-foreground">Saving...</span>
              )}
              <button
                type="button"
                onClick={handleSaveDescription}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Description'}
              </button>
            </div>
          </div>

          {/* Project Details */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Project Details</h2>
            
            <FactsEditor
              facts={project.facts}
              onChange={(facts) => {
                const updated = { ...project, facts };
                setProject(updated);
                if (project?.id) debouncedAutoSave(updated);
              }}
              label="Project Facts"
              description="Required for frontpage display: 'sqm' (size badge) and 'bedrooms' (rooms badge). Add other details as needed."
            />
          </div>

          {/* Images */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <div className="mb-6">
              <h2 className="font-sans text-lg font-medium text-foreground">Project Images</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your images, then select one as the hero image for project cards and detail pages.
              </p>
            </div>
            
            <div className="grid gap-6">
              <ProjectImagesManager
                images={project.projectImages}
                pairs={project.imagePairs}
                onImagesChange={(images) => {
                  const updated = { ...project, projectImages: images };
                  setProject(updated);
                  if (project?.id) debouncedAutoSave(updated);
                }}
                onPairsChange={(pairs) => {
                  const updated = { ...project, imagePairs: pairs };
                  setProject(updated);
                  if (project?.id) debouncedAutoSave(updated);
                }}
                label="Upload & Organize Images"
                description="Upload images, tag them as before/after/gallery, and create pairs."
                maxImages={30}
                maxPairs={10}
              />
            </div>
          </div>

          {/* Publishing */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Publishing</h2>
            <Toggle
              id="isPublished"
              name="isPublished"
              label="Publish to Site"
              description="When enabled, this project will be visible on the public site"
              defaultChecked={project.isPublished}
              onChange={(checked) => {
                const updated = { ...project, isPublished: checked };
                setProject(updated);
                if (project?.id) debouncedAutoSave(updated);
              }}
            />
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
              Delete Project
            </button>

            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
              className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted/50"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
      
      {/* Simple alerts used instead of toast notifications */}
    </div>
  );
}
