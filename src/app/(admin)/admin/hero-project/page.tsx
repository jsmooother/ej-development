"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  summary: string;
  heroImagePath: string | null;
  isPublished: boolean;
  isHero: boolean;
  createdAt: Date;
}

export default function HeroProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [heroProject, setHeroProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
          
          // Find the current hero project
          const currentHero = data.find((p: Project) => p.isHero);
          setHeroProject(currentHero || null);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setMessage('Error loading projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSetHero = async (projectId: string) => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/hero-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });

      if (response.ok) {
        // Update local state
        const newHeroProject = projects.find(p => p.id === projectId);
        setHeroProject(newHeroProject || null);
        
        // Update projects array
        setProjects(prev => prev.map(p => ({
          ...p,
          isHero: p.id === projectId
        })));
        
        setMessage('Hero project updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error updating hero project');
      }
    } catch (error) {
      console.error('Error setting hero project:', error);
      setMessage('Error updating hero project');
    } finally {
      setSaving(false);
    }
  };

  const publishedProjects = projects.filter(p => p.isPublished);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hero Project</h1>
        <p className="text-muted-foreground mt-2">
          Choose which project appears as the main hero on the homepage
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {heroProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Hero Project
              <Badge variant="default">Active</Badge>
            </CardTitle>
            <CardDescription>
              This project is currently displayed as the hero on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-32 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {heroProject.heroImagePath ? (
                  <Image
                    src={heroProject.heroImagePath}
                    alt={heroProject.title}
                    width={128}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{heroProject.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {heroProject.summary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Projects</CardTitle>
          <CardDescription>
            Select a project to make it the hero project. Only published projects are shown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {publishedProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No published projects available
            </div>
          ) : (
            <div className="grid gap-4">
              {publishedProjects.map((project) => (
                <div
                  key={project.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    project.isHero 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="w-20 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                    {project.heroImagePath ? (
                      <Image
                        src={project.heroImagePath}
                        alt={project.title}
                        width={80}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{project.title}</h3>
                      {project.isHero && (
                        <Badge variant="default" className="text-xs">Current Hero</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.summary}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleSetHero(project.id)}
                    disabled={saving || project.isHero}
                    variant={project.isHero ? "secondary" : "default"}
                    size="sm"
                  >
                    {project.isHero ? 'Current Hero' : 'Set as Hero'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Only one project can be the hero project at a time</p>
          <p>• The hero project appears prominently on the homepage</p>
          <p>• Only published projects are available for selection</p>
          <p>• Changes take effect immediately on the frontend</p>
        </CardContent>
      </Card>
    </div>
  );
}
