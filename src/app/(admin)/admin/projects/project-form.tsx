"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createProject } from "./actions";
import type { ActionResponse, ProjectFormInput } from "./actions";
import { slugify } from "@/lib/utils";

type ProjectFormValues = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  location: string;
  year: string;
  heroImagePath: string;
  beforeImagePath: string;
  beforeCaption: string;
  afterImagePath: string;
  afterCaption: string;
  isPublished: boolean;
};

const defaultValues: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  location: "",
  year: "",
  heroImagePath: "",
  beforeImagePath: "",
  beforeCaption: "",
  afterImagePath: "",
  afterCaption: "",
  isPublished: true,
};

export function ProjectForm() {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
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
    startTransition(async () => {
      const payload: ProjectFormInput = {
        title: values.title,
        slug: values.slug || undefined,
        summary: values.summary,
        content: values.content || undefined,
        location: values.location,
        year: values.year ? Number(values.year) : undefined,
        heroImagePath: values.heroImagePath,
        beforeImagePath: values.beforeImagePath || undefined,
        beforeCaption: values.beforeCaption || undefined,
        afterImagePath: values.afterImagePath || undefined,
        afterCaption: values.afterCaption || undefined,
        isPublished: values.isPublished,
      };

      const result = await createProject(payload);
      setActionState(result);

      if (result.status === "success") {
        setFormMessage(result.message ?? "Project saved.");
        router.push("/admin/projects");
        return;
      }

      setFormMessage(result.message);
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (!message) continue;
          setError(field as keyof ProjectFormValues, { message });
        }
      }
    });
  });

  const isSubmitting = isPending;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-light">Project details</h2>
        <p className="text-sm text-muted-foreground">
          Capture before and after imagery so the homepage stream can stay balanced without manual intervention.
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
            placeholder="Casa Serrana"
          />
          {errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Slug</span>
          <input
            type="text"
            {...register("slug")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
            placeholder="casa-serrana"
          />
          {errors.slug && <span className="text-xs text-destructive">{errors.slug.message}</span>}
        </label>

        <label className="md:col-span-2 flex flex-col gap-2">
          <span className="text-sm font-medium">Summary</span>
          <textarea
            {...register("summary", { required: "Summary is required", minLength: 10 })}
            rows={3}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
            placeholder="Adaptive reuse opening a hillside estate toward the sea..."
          />
          {errors.summary && <span className="text-xs text-destructive">{errors.summary.message}</span>}
        </label>

        <label className="md:col-span-2 flex flex-col gap-2">
          <span className="text-sm font-medium">Full description</span>
          <textarea
            {...register("content")}
            rows={6}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
            placeholder="Describe the renovation phases, material palette, and highlights..."
          />
          {errors.content && <span className="text-xs text-destructive">{errors.content.message}</span>}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Location</span>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
            placeholder="Marbella · 2024"
          />
          {errors.location && <span className="text-xs text-destructive">{errors.location.message}</span>}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Completion year</span>
          <input
            type="number"
            inputMode="numeric"
            {...register("year")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
            placeholder="2024"
          />
          {errors.year && <span className="text-xs text-destructive">{errors.year.message}</span>}
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-xl font-light">Imagery</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="md:col-span-2 flex flex-col gap-2">
            <span className="text-sm font-medium">Hero image</span>
            <input
              type="url"
              {...register("heroImagePath", { required: "Hero image is required" })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="https://..."
            />
            {errors.heroImagePath && (
              <span className="text-xs text-destructive">{errors.heroImagePath.message}</span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Before image</span>
            <input
              type="url"
              {...register("beforeImagePath")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="https://..."
            />
            {errors.beforeImagePath && (
              <span className="text-xs text-destructive">{errors.beforeImagePath.message}</span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Before caption</span>
            <input
              type="text"
              {...register("beforeCaption")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="Original villa facade"
            />
            {errors.beforeCaption && (
              <span className="text-xs text-destructive">{errors.beforeCaption.message}</span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">After image</span>
            <input
              type="url"
              {...register("afterImagePath")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="https://..."
            />
            {errors.afterImagePath && (
              <span className="text-xs text-destructive">{errors.afterImagePath.message}</span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">After caption</span>
            <input
              type="text"
              {...register("afterCaption")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
              placeholder="Reimagined courtyard"
            />
            {errors.afterCaption && (
              <span className="text-xs text-destructive">{errors.afterCaption.message}</span>
            )}
          </label>
        </div>
      </div>

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
          {isSubmitting ? "Saving..." : "Save project"}
        </button>
      </div>
    </form>
  );
}
