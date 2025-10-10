"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/admin/toggle";

interface ComingSoonProject {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function ComingSoonPage() {
  const [project, setProject] = useState<ComingSoonProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>(['', '', '']);
  const [isActive, setIsActive] = useState(false);

  // Fetch current coming soon project
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch('/api/admin/coming-soon');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setProject(data);
            setTitle(data.title);
            setDescription(data.description);
            setHighlights([...data.highlights, '', '', ''].slice(0, 3));
            setIsActive(data.isActive);
          }
        }
      } catch (error) {
        console.error('Error fetching coming soon project:', error);
        setMessage('Error loading coming soon project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Filter out empty highlights
      const filteredHighlights = highlights.filter(h => h.trim() !== '');
      
      if (filteredHighlights.length === 0) {
        setMessage('At least one highlight is required');
        setSaving(false);
        return;
      }

      const projectData = {
        title: title.trim(),
        description: description.trim(),
        highlights: filteredHighlights,
        isActive,
      };

      let response;
      if (project) {
        // Update existing project
        response = await fetch('/api/admin/coming-soon', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: project.id, ...projectData })
        });
      } else {
        // Create new project
        response = await fetch('/api/admin/coming-soon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
      }

      if (response.ok) {
        const updatedProject = await response.json();
        setProject(updatedProject);
        setMessage('Coming soon project saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving coming soon project');
      }
    } catch (error) {
      console.error('Error saving coming soon project:', error);
      setMessage('Error saving coming soon project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading coming soon project...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coming Soon Project</h1>
        <p className="text-muted-foreground mt-2">
          Manage the upcoming project showcase on your homepage
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Coming Soon Project Details
            {isActive && <Badge variant="default">Active</Badge>}
          </CardTitle>
          <CardDescription>
            This project will be displayed in the "Next Release" section on your homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Casa Serrana"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Our flagship 700 sqm villa in Sierra Blanca is in final detailing..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Project Highlights</Label>
            <div className="space-y-3">
              {highlights.map((highlight, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`highlight-${index}`} className="text-sm text-muted-foreground">
                    Highlight {index + 1}
                  </Label>
                  <Input
                    id={`highlight-${index}`}
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    placeholder="Double-height great room opening to an 18m infinity pool."
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Add 1-3 key features or highlights for the project
            </p>
          </div>

          <Toggle
            id="isActive"
            name="isActive"
            label="Show on Homepage"
            description="When enabled, this project will be displayed in the coming soon section"
            checked={isActive}
            onChange={setIsActive}
          />

          <div className="pt-4 border-t">
            <Button onClick={handleSave} disabled={saving || !title.trim() || !description.trim()}>
              {saving ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {project && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              How this will look on your homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-3xl border border-border bg-card p-6 md:p-12">
              <div className="grid gap-10 md:grid-cols-[1.4fr,1fr] md:items-center">
                <div className="space-y-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Next Release</p>
                  <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">{title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 p-6">
                  <h3 className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">
                    Brochure Highlights to Come
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {highlights.filter(h => h.trim()).map((highlight, index) => (
                      <li key={index}>• {highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
