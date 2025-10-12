"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
// Using simple alerts instead of toast system

interface Project {
  id: string;
  title: string;
  summary: string;
  heroImagePath: string;
  isHero: boolean;
  isPublished: boolean;
}

export default function HeroProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentHero, setCurrentHero] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Simple alert functions instead of toast system
  const showSuccess = (message: string) => alert(`✅ ${message}`);
  const showError = (message: string) => alert(`❌ ${message}`);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all projects
      const projectsResponse = await fetch('/api/projects');
      if (projectsResponse.ok) {
        const allProjects = await projectsResponse.json();
        // Filter to only published projects
        const published = allProjects.filter((p: Project) => p.isPublished);
        setProjects(published);
        
        // Find current hero
        const hero = published.find((p: Project) => p.isHero);
        setCurrentHero(hero || null);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetHero = async (projectId: string) => {
    if (!confirm('Set this project as the hero project? The current hero will be replaced.')) {
      return;
    }

    setIsSaving(true);
    
    try {
      const response = await fetch('/api/admin/hero-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        throw new Error('Failed to set hero project');
      }

      // Refresh data
      await fetchData();
      showSuccess('Hero project updated successfully!');
    } catch (err) {
      console.error('Error setting hero project:', err);
      showError('Failed to set hero project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <AdminHeader 
          title="Hero Project" 
          description="Select the featured project for your homepage"
        />
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader 
        title="Hero Project" 
        description="Select the featured project for your homepage"
      />

      <div className="p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Current Hero */}
          {currentHero && (
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Current Hero Project</h2>
              
              <div className="overflow-hidden rounded-xl border border-border/30 bg-muted/20">
                <div className="flex items-center gap-6 p-6">
                  {currentHero.heroImagePath && (
                    <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <img 
                        src={currentHero.heroImagePath} 
                        alt={currentHero.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-sans text-2xl font-normal tracking-tight text-foreground">
                          {currentHero.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground/60">{currentHero.summary}</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Current Hero
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Projects */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 font-sans text-lg font-medium text-foreground">
              Select Hero Project
            </h2>
            
            {projects.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5">
                  <svg className="h-8 w-8 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">No published projects</p>
                <p className="mt-1 text-xs text-muted-foreground/60">Create and publish a project first</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`group overflow-hidden rounded-xl border transition-all ${
                      project.isHero
                        ? "border-green-200 bg-green-50"
                        : "border-border/30 bg-muted/20 hover:border-border/50"
                    }`}
                  >
                    <div className="flex items-center gap-4 p-4">
                      {project.heroImagePath && (
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                          <img 
                            src={project.heroImagePath} 
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-sans text-lg font-medium text-foreground">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground/60">{project.summary}</p>
                      </div>

                      {project.isHero ? (
                        <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                          Current Hero
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetHero(project.id)}
                          disabled={isSaving}
                          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-foreground/50 hover:bg-foreground/5 disabled:opacity-50"
                        >
                          Set as Hero
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-blue-800">
                <p className="font-medium">About Hero Projects</p>
                <ul className="mt-1 list-disc list-inside space-y-0.5">
                  <li>Only one project can be the hero at a time</li>
                  <li>The hero project is prominently featured on your homepage</li>
                  <li>Only published projects can be selected as hero</li>
                  <li>You can change the hero project at any time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      {/* Simple alerts used instead of toast notifications */}
    </div>
  );
}

