"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { projectImages, projects } from "@/lib/db/schema";
import type { ProjectImage } from "@/lib/db/types";
import { slugify } from "@/lib/utils";
import { optionalTrimmed, type ActionResponse } from "../utils";

const projectInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(320, "Summary should stay under 320 characters"),
  content: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  year: z
    .number()
    .int("Year must be a whole number")
    .gte(1900, "Year must be 1900 or later")
    .lte(2100, "Year must be 2100 or earlier")
    .optional(),
  heroImagePath: z.string().min(1, "Hero image is required"),
  beforeImagePath: z.string().optional(),
  beforeCaption: z.string().optional(),
  afterImagePath: z.string().optional(),
  afterCaption: z.string().optional(),
  isPublished: z.boolean().default(true),
});

export type ProjectFormInput = z.input<typeof projectInputSchema>;

export async function createProject(input: ProjectFormInput): Promise<
  ActionResponse<
    | "title"
    | "slug"
    | "summary"
    | "content"
    | "location"
    | "year"
    | "heroImagePath"
    | "beforeImagePath"
    | "afterImagePath"
    | "beforeCaption"
    | "afterCaption"
  >
> {
  const sanitizedInput = {
    title: input.title.trim(),
    slug: optionalTrimmed(input.slug ?? undefined),
    summary: input.summary.trim(),
    content: optionalTrimmed(input.content ?? undefined),
    location: input.location.trim(),
    year: input.year ?? undefined,
    heroImagePath: input.heroImagePath.trim(),
    beforeImagePath: optionalTrimmed(input.beforeImagePath ?? undefined),
    beforeCaption: optionalTrimmed(input.beforeCaption ?? undefined),
    afterImagePath: optionalTrimmed(input.afterImagePath ?? undefined),
    afterCaption: optionalTrimmed(input.afterCaption ?? undefined),
    isPublished: input.isPublished,
  };

  const parseResult = projectInputSchema.safeParse(sanitizedInput);

  if (!parseResult.success) {
    const fieldErrors = parseResult.error.flatten().fieldErrors;
    const mappedErrors: Record<string, string> = {};
    for (const key of Object.keys(fieldErrors)) {
      const messages = fieldErrors[key as keyof typeof fieldErrors];
      if (messages && messages.length > 0) {
        mappedErrors[key] = messages[0];
      }
    }
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: mappedErrors,
    };
  }

  const data = parseResult.data;
  const db = getDb();

  try {
    await db.transaction(async (tx) => {
      const [project] = await tx
        .insert(projects)
        .values({
          slug: slugify(data.slug ?? data.title),
          title: data.title,
          summary: data.summary,
          content: data.content ?? null,
          location: data.location,
          year: data.year ?? null,
          heroImagePath: data.heroImagePath,
          beforeImagePath: data.beforeImagePath ?? null,
          afterImagePath: data.afterImagePath ?? null,
          isPublished: data.isPublished,
        })
        .returning();

      if (!project) {
        throw new Error("Project was not created");
      }

      const imagesToInsert: Omit<ProjectImage, "id" | "createdAt">[] = [
        {
          projectId: project.id,
          imagePath: data.heroImagePath,
          altText: `${data.title} hero image`,
          sortOrder: -10,
          variant: "hero",
        },
      ];

      if (data.beforeImagePath) {
        imagesToInsert.push({
          projectId: project.id,
          imagePath: data.beforeImagePath,
          altText: data.beforeCaption ?? `${data.title} before renovation`,
          sortOrder: 0,
          variant: "before",
        });
      }

      if (data.afterImagePath) {
        imagesToInsert.push({
          projectId: project.id,
          imagePath: data.afterImagePath,
          altText: data.afterCaption ?? `${data.title} after renovation`,
          sortOrder: 1,
          variant: "after",
        });
      }

      if (imagesToInsert.length > 0) {
        await tx.insert(projectImages).values(imagesToInsert);
      }
    });
  } catch (error) {
    console.error("Failed to create project", error);
    return {
      status: "error",
      message: "We couldn't save the project. Please try again.",
    };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return {
    status: "success",
    message: "Project created successfully.",
  };
}
