"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { env } from "@/lib/env";
import { getDb } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { optionalTrimmed, type ActionResponse } from "../utils";

type EditorialFields =
  | "title"
  | "slug"
  | "category"
  | "excerpt"
  | "content"
  | "coverImagePath"
  | "secondaryImagePath";

const editorialSchema = z.object({
  title: z.string().min(5, "Title should be at least 5 characters"),
  slug: z.string().min(2, "Slug should be at least 2 characters").optional(),
  category: z.string().min(2, "Category is required"),
  excerpt: z.string().min(16, "Excerpt should be at least 16 characters"),
  content: z.string().min(60, "Editorial content should be at least 60 characters"),
  coverImagePath: z.string().min(1, "Primary image is required"),
  secondaryImagePath: z.string().optional(),
  isPublished: z.boolean().default(true),
});

export type EditorialFormInput = z.input<typeof editorialSchema>;

export async function createEditorial(input: EditorialFormInput): Promise<ActionResponse<EditorialFields>> {
  const sanitized = {
    title: input.title.trim(),
    slug: optionalTrimmed(input.slug ?? undefined),
    category: input.category.trim(),
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    coverImagePath: input.coverImagePath.trim(),
    secondaryImagePath: optionalTrimmed(input.secondaryImagePath ?? undefined),
    isPublished: input.isPublished,
  };

  const parseResult = editorialSchema.safeParse(sanitized);

  if (!parseResult.success) {
    const { fieldErrors } = parseResult.error.flatten();
    const errors: Partial<Record<EditorialFields, string>> = {};
    for (const key of Object.keys(fieldErrors)) {
      const message = fieldErrors[key as keyof typeof fieldErrors]?.[0];
      if (message) {
        errors[key as EditorialFields] = message;
      }
    }
    return {
      status: "error",
      message: "Please address the highlighted fields.",
      fieldErrors: errors,
    };
  }

  const data = parseResult.data;
  const db = getDb();

  try {
    await db.insert(posts).values({
      slug: slugify(data.slug ?? data.title),
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImagePath: data.coverImagePath,
      secondaryImagePath: data.secondaryImagePath ?? null,
      tags: [data.category],
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? new Date() : null,
    });
  } catch (error) {
    console.error("Failed to create editorial", error);
    return {
      status: "error",
      message: "We couldn't save the editorial. Please try again.",
    };
  }

  revalidatePath("/admin/editorials");
  revalidatePath("/");
  return {
    status: "success",
    message: "Editorial saved.",
  };
}

const aiRequestSchema = z.object({
  topic: z.string().min(5, "Please provide a topic"),
  tone: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  requestVideoPrompt: z.boolean().optional(),
});

export type EditorialDraft = {
  title: string;
  excerpt: string;
  content: string;
  coverImagePrompt: string;
  secondaryImagePrompt?: string;
  soraVideoPrompt?: string;
};

export type EditorialDraftResponse =
  | { status: "success"; draft: EditorialDraft }
  | { status: "error"; message: string };

export async function generateEditorialDraft(input: z.input<typeof aiRequestSchema>): Promise<EditorialDraftResponse> {
  const parsed = aiRequestSchema.safeParse({
    ...input,
    tone: optionalTrimmed(input.tone ?? undefined),
    keywords: input.keywords?.map((keyword) => keyword.trim()).filter((keyword) => keyword.length > 0),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.errors[0]?.message ?? "Invalid request",
    };
  }

  if (!env.OPENAI_API_KEY) {
    return {
      status: "error",
      message: "Add an OpenAI API key to enable editorial generation.",
    };
  }

  const { topic, tone, keywords, requestVideoPrompt } = parsed.data;

  const prompt = [
    `Write an editorial for EJ Development's homepage stream.`,
    `Topic: ${topic}.`,
    tone ? `Tone: ${tone}.` : undefined,
    keywords && keywords.length > 0 ? `Incorporate the following keywords: ${keywords.join(", ")}.` : undefined,
    `Return JSON with fields: title, excerpt (<=220 characters), content (3 short paragraphs), cover_image_prompt, secondary_image_prompt.`,
    requestVideoPrompt
      ? "Also include sora_video_prompt describing a 12-second cinematic shot suitable for Sora video generation."
      : "Include a sora_video_prompt suggesting a short cinematic shot, even if Sora is not available.",
  ]
    .filter(Boolean)
    .join("\n");

  let jsonContent: string | null = null;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a content strategist for a luxury property developer in Marbella. Keep language editorial and succinct.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI response", text);
      return {
        status: "error",
        message: "OpenAI could not generate the editorial. Check your quota and try again.",
      };
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    jsonContent = payload.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    console.error("OpenAI request failed", error);
    return {
      status: "error",
      message: "OpenAI request failed. Please try again later.",
    };
  }

  if (!jsonContent) {
    return {
      status: "error",
      message: "OpenAI returned an empty response.",
    };
  }

  try {
    const parsedJson = JSON.parse(jsonContent) as {
      title?: string;
      excerpt?: string;
      content?: string;
      cover_image_prompt?: string;
      secondary_image_prompt?: string;
      sora_video_prompt?: string;
    };

    if (!parsedJson.title || !parsedJson.excerpt || !parsedJson.content || !parsedJson.cover_image_prompt) {
      throw new Error("Missing required fields in AI response");
    }

    const draft: EditorialDraft = {
      title: parsedJson.title,
      excerpt: parsedJson.excerpt,
      content: parsedJson.content,
      coverImagePrompt: parsedJson.cover_image_prompt,
      secondaryImagePrompt: parsedJson.secondary_image_prompt,
      soraVideoPrompt: parsedJson.sora_video_prompt,
    };

    return {
      status: "success",
      draft,
    };
  } catch (error) {
    console.error("Failed to parse OpenAI JSON", error, jsonContent);
    return {
      status: "error",
      message: "AI response was malformed. Try again with a simpler brief.",
    };
  }
}
