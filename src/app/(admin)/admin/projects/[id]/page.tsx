"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea, Select, Toggle } from "@/components/admin/form-field";

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  facts: {
    sqm: number;
    bedrooms: number;
    bathrooms: number;
  };
  heroImagePath: string;
  additionalImages: string[];
  isPublished: boolean;
  createdAt: Date;
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
            facts: data.project.facts || { sqm: 0, bedrooms: 0, bathrooms: 0 },
            heroImagePath: data.project.heroImagePath || '',
            additionalImages: [], // Will be handled when we add image relations
            isPublished: data.project.isPublished,
            createdAt: new Date(data.project.createdAt),
          };
          
          setProject(fetchedProject);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        alert('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          content: '', // Will add content field later
          year: null, // Will add year field later
          facts: project.facts,
          heroImagePath: project.heroImagePath,
          isPublished: project.isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const data = await response.json();
      if (data.success) {
        alert('Project updated successfully!');
        router.push('/admin/projects');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try again.');
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
        alert('Project deleted successfully!');
        router.push('/admin/projects');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
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

      <form onSubmit={handleSave} className="p-8">
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
                    onChange={(e) => setProject({ ...project, title: e.target.value })}
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
                    onChange={(e) => setProject({ ...project, slug: e.target.value })}
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
                  onChange={(e) => setProject({ ...project, summary: e.target.value })}
                  placeholder="Location · Year"
                />
              </FormField>
            </div>
          </div>

          {/* Project Details */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Project Details</h2>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  label="Square Meters"
                  description="Total area in m²"
                  required
                >
                  <Input
                    type="number"
                    value={project.facts.sqm}
                    onChange={(e) => setProject({ 
                      ...project, 
                      facts: { ...project.facts, sqm: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="420"
                  />
                </FormField>

                <FormField
                  label="Bedrooms"
                  description="Number of bedrooms"
                  required
                >
                  <Input
                    type="number"
                    value={project.facts.bedrooms}
                    onChange={(e) => setProject({ 
                      ...project, 
                      facts: { ...project.facts, bedrooms: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="6"
                  />
                </FormField>

                <FormField
                  label="Bathrooms"
                  description="Number of bathrooms"
                  required
                >
                  <Input
                    type="number"
                    value={project.facts.bathrooms}
                    onChange={(e) => setProject({ 
                      ...project, 
                      facts: { ...project.facts, bathrooms: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="5"
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Images</h2>
            <div className="grid gap-6">
              <FormField
                label="Hero Image URL"
                description="Main image displayed on project cards and detail pages"
                required
              >
                <Input
                  value={project.heroImagePath}
                  onChange={(e) => setProject({ ...project, heroImagePath: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </FormField>

              <FormField
                label="Additional Images"
                description="Additional image URLs (one per line)"
              >
                <Textarea
                  value={project.additionalImages.join('\n')}
                  onChange={(e) => setProject({ 
                    ...project, 
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans text-sm font-medium text-foreground">Published</h3>
                <p className="text-xs text-muted-foreground/60">
                  Make this project visible on the website
                </p>
              </div>
              <Toggle
                checked={project.isPublished}
                onCheckedChange={(checked) => setProject({ ...project, isPublished: checked })}
              />
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
              Delete Project
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/admin/projects')}
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
