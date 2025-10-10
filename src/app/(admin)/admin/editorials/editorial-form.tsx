"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createEditorial, generateEditorialDraft } from "./actions";
import type { EditorialFormInput, EditorialDraft, EditorialDraftResponse } from "./actions";
import { type ActionResponse } from "../utils";
import { slugify } from "@/lib/utils";

type EditorialFormValues = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImagePath: string;
  secondaryImagePath: string;
  isPublished: boolean;
};

const defaultValues: EditorialFormValues = {
  title: "",
  slug: "",
  category: "Insights",
  excerpt: "",
  content: "",
  coverImagePath: "",
  secondaryImagePath: "",
  isPublished: true,
};

type AIPromptState = {
  coverImagePrompt: string;
  secondaryImagePrompt?: string;
  soraVideoPrompt?: string;
};

export function EditorialForm() {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionResponse | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isGenerating, startGenerating] = useTransition();
  const [aiPrompts, setAiPrompts] = useState<AIPromptState | null>(null);
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("Magazine editorial");
  const [aiKeywords, setAiKeywords] = useState("Marbella, architecture, lifestyle");
  const [aiError, setAiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<EditorialFormValues>({
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && value.title && value.title.length > 0) {
        const currentSlug = watch("slug");
        if (!currentSlug) {
          setValue("slug", slugify(value.title));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  const onSubmit = handleSubmit((values) => {
    setFormMessage(null);
    startSaving(async () => {
      const payload: EditorialFormInput = {
        title: values.title,
        slug: values.slug || undefined,
        category: values.category,
        excerpt: values.excerpt,
        content: values.content,
        coverImagePath: values.coverImagePath,
        secondaryImagePath: values.secondaryImagePath || undefined,
        isPublished: values.isPublished,
      };

      const result = await createEditorial(payload);
      setActionState(result);

      if (result.status === "success") {
        setFormMessage(result.message ?? "Editorial saved.");
        router.push("/admin/editorials");
        return;
      }

      setFormMessage(result.message);
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (!message) continue;
          setError(field as keyof EditorialFormValues, { message });
        }
      }
    });
  });

  const handleGenerateDraft = () => {
    setAiError(null);
    setAiPrompts(null);
    if (!aiTopic.trim()) {
      setAiError("Add a topic before generating a draft.");
      return;
    }
    startGenerating(async () => {
      const keywords = aiKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);

      const response: EditorialDraftResponse = await generateEditorialDraft({
        topic: aiTopic,
        tone: aiTone,
        keywords,
        requestVideoPrompt: true,
      });

      if (response.status === "error") {
        setAiError(response.message);
        return;
      }

      const draft: EditorialDraft = response.draft;
      setValue("title", draft.title, { shouldDirty: true });
      setValue("slug", slugify(draft.title), { shouldDirty: true });
      setValue("excerpt", draft.excerpt, { shouldDirty: true });
      setValue("content", draft.content, { shouldDirty: true });
      setAiPrompts({
        coverImagePrompt: draft.coverImagePrompt,
        secondaryImagePrompt: draft.secondaryImagePrompt,
        soraVideoPrompt: draft.soraVideoPrompt,
      });
    });
  };

  const isSubmitting = isSaving;

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-light">Editorial details</h2>
          <p className="text-sm text-muted-foreground">
            Keep entries concise so they drop into the homepage stream without manual trimming.
          </p>
          {formMessage && actionState?.status === "error" && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formMessage}
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Title</span>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="Marbella Market, Reframed"
            />
            {errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Slug</span>
            <input
              type="text"
              {...register("slug")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="marbella-market-reframed"
            />
            {errors.slug && <span className="text-xs text-destructive">{errors.slug.message}</span>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Category tag</span>
            <input
              type="text"
              {...register("category", { required: "Category is required" })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="Market Insight"
            />
            {errors.category && <span className="text-xs text-destructive">{errors.category.message}</span>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Excerpt</span>
            <textarea
              {...register("excerpt", { required: "Excerpt is required", maxLength: 240 })}
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="Design-led developments are resetting expectations along the Golden Mile."
            />
            {errors.excerpt && <span className="text-xs text-destructive">{errors.excerpt.message}</span>}
          </label>

          <label className="md:col-span-2 flex flex-col gap-2">
            <span className="text-sm font-medium">Body copy</span>
            <textarea
              {...register("content", { required: "Content is required", minLength: 60 })}
              rows={8}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="Write three short paragraphs..."
            />
            {errors.content && <span className="text-xs text-destructive">{errors.content.message}</span>}
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-serif text-xl font-light">Images</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Primary image URL</span>
            <input
              type="url"
              {...register("coverImagePath", { required: "Primary image is required" })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="https://..."
            />
            {errors.coverImagePath && (
              <span className="text-xs text-destructive">{errors.coverImagePath.message}</span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Secondary image URL</span>
            <input
              type="url"
              {...register("secondaryImagePath")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="Optional supporting image"
            />
            {errors.secondaryImagePath && (
              <span className="text-xs text-destructive">{errors.secondaryImagePath.message}</span>
            )}
          </label>
        </div>

        {aiPrompts && (
          <div className="rounded-lg border border-dashed border-border/80 bg-muted/30 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">AI prompts</p>
            <p className="mt-2">
              <span className="font-medium">Cover image:</span> {aiPrompts.coverImagePrompt}
            </p>
            {aiPrompts.secondaryImagePrompt && (
              <p className="mt-2">
                <span className="font-medium">Secondary image:</span> {aiPrompts.secondaryImagePrompt}
              </p>
            )}
            {aiPrompts.soraVideoPrompt && (
              <p className="mt-2">
                <span className="font-medium">Sora video prompt:</span> {aiPrompts.soraVideoPrompt}
              </p>
            )}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-light">Generate with AI</h3>
            <p className="text-sm text-muted-foreground">
              Outline a topic and we will draft the editorial, image prompts, and a Sora-friendly shot description.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerateDraft}
            disabled={isGenerating}
            className="rounded-md border border-border px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition hover:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? "Generating..." : "Draft with AI"}
          </button>
        </div>

        {aiError && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{aiError}</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Topic</span>
            <input
              type="text"
              value={aiTopic}
              onChange={(event) => setAiTopic(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="Next flagship villa reveal"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Tone</span>
            <input
              type="text"
              value={aiTone}
              onChange={(event) => setAiTone(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="Magazine editorial"
            />
          </label>

          <label className="md:col-span-2 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Keywords</span>
            <input
              type="text"
              value={aiKeywords}
              onChange={(event) => setAiKeywords(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="Marbella, Andalusian light, penthouse"
            />
          </label>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" {...register("isPublished")} className="h-4 w-4 rounded border-border" />
          <span>Publish immediately</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background shadow-sm transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Save editorial"}
        </button>
      </div>
    </form>
  );
}
