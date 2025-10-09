"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { InlineToggle } from "@/components/admin/inline-toggle";

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  year: number | null;
  facts: Record<string, string | number | null>;
  heroImagePath: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects from database on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        
        // Fetch status from content API
        const statusResponse = await fetch('/api/content/status');
        const statusData = await statusResponse.json();
        
        // Merge projects with their publish status
        const projectsWithStatus = data.map((project: Project) => ({
          ...project,
          isPublished: statusData.projects[project.slug]?.isPublished || project.isPublished
        }));
        
        setProjects(projectsWithStatus);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Fallback to empty array on error
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleTogglePublish = async (projectId: string, newStatus: boolean) => {
    console.log(`Toggling project ${projectId} to ${newStatus ? 'published' : 'draft'}`);
    
    try {
      // Call API to update status using slug
      const project = projects.find(p => p.id === projectId);
      if (!project) return;
      
      const response = await fetch('/api/content/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'project',
          id: project.slug,
          isPublished: newStatus
        })
      });

      if (response.ok) {
        // Update local state
        setProjects(prev => 
          prev.map(p => p.id === projectId ? { ...p, isPublished: newStatus } : p)
        );
        console.log(`Successfully updated project ${projectId} status`);
      } else {
        console.error('Failed to update project status');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      // Remove from local state
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      console.log(`Successfully deleted project ${projectId}`);
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  return (
    <div>
      <AdminHeader 
        title="Projects" 
        description={`Manage your portfolio projects (${projects.length} total)`}
        action={{
          label: "New Project",
          href: "/admin/projects/new"
        }}
      />

      <div className="p-8">
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-card p-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                <svg className="h-10 w-10 animate-spin text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="mt-6 font-sans text-2xl font-normal tracking-tight text-foreground">Loading projects...</h3>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Fetching your portfolio projects from the database.
              </p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-card p-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                <svg className="h-10 w-10 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="mt-6 font-sans text-2xl font-normal tracking-tight text-foreground">No projects yet</h3>
              <p className="mt-2 text-sm text-muted-foreground/60">
                Get started by creating your first portfolio project with imagery and case study details.
              </p>
              <Link
                href="/admin/projects/new"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="group block overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-border hover:shadow-lg"
              >
                <div className="flex items-center gap-6 p-6">
                  {/* Project Image */}
                  <div className="flex h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                    {project.heroImagePath ? (
                      <img 
                        src={project.heroImagePath} 
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg className="h-10 w-10 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-sans text-2xl font-normal tracking-tight text-foreground transition-colors group-hover:text-foreground">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground/60">{project.summary}</p>
                      </div>
                      <div className="ml-4 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <InlineToggle
                            id={project.id}
                            initialChecked={project.isPublished}
                            onToggle={(checked) => handleTogglePublish(project.id, checked)}
                          />
                          <span className={`text-[10px] font-medium uppercase tracking-wide ${
                            project.isPublished 
                              ? "text-green-700" 
                              : "text-muted-foreground/60"
                          }`}>
                            {project.isPublished ? "Live" : "Draft"}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(project.id);
                          }}
                          className="text-muted-foreground/40 transition-colors hover:text-red-600"
                          title="Delete project"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Project Meta */}
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground/60">
                      {project.facts && typeof project.facts === 'object' && 'sqm' in project.facts && (
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span>{project.facts.sqm} m²</span>
                        </div>
                      )}
                      {project.facts && typeof project.facts === 'object' && 'bedrooms' in project.facts && (
                        <div className="flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>{project.facts.bedrooms} bedrooms</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Created {new Date(project.createdAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-muted-foreground/40 transition-all group-hover:translate-x-1 group-hover:text-foreground">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

