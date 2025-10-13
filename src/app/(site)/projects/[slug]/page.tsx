import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "./project-detail-client";

type ProjectImage = {
  id: string;
  url: string;
  tags: string[];
};

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  year: number | null;
  facts: Record<string, string | number | null>;
  heroImagePath: string | null;
  projectImages: ProjectImage[];
  imagePairs: any[];
  isPublished: boolean;
};

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  // Server-side data fetching
  let project: Project | null = null;
  
  try {
    // First, get the list of projects to find the ID by slug
    const listResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/projects`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!listResponse.ok) {
      console.error('❌ Projects API failed:', listResponse.status, listResponse.statusText);
      notFound();
    }
    
    const projects = await listResponse.json();
    const foundProject = projects.find((p: any) => p.slug === params.slug && p.isPublished);
    
    if (!foundProject) {
      console.error('❌ Project not found or not published');
      notFound();
    }
    
    // Now fetch the full project data including images
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/projects/${foundProject.id}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!response.ok) {
      console.error('❌ Project detail API failed:', response.status, response.statusText);
      notFound();
    }
    
    const data = await response.json();
    if (!data.success) {
      console.error('❌ Project detail API returned error:', data.error);
      notFound();
    }
    
    project = data.project;
  } catch (error) {
    console.error('❌ Error fetching project:', error);
    notFound();
  }

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}