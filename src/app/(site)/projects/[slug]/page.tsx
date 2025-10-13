import { notFound } from "next/navigation";
import { ProjectDetailClient } from "./project-detail-client";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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
  // Fetch project directly from database
  try {
    const [project] = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.slug, params.slug),
          eq(projects.isPublished, true)
        )
      )
      .limit(1);

    if (!project) {
      console.error('❌ Project not found or not published:', params.slug);
      notFound();
    }

    return <ProjectDetailClient project={project as Project} />;
  } catch (error) {
    console.error('❌ Error fetching project:', error);
    notFound();
  }
}