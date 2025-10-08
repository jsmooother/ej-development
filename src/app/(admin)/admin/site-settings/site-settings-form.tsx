"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  siteSettingsDefaultState,
  type SiteSettingsActionState,
  updateSiteSettings,
} from "./actions";
import { siteSettingsFormSchema, type SiteSettingsFormValues } from "./schema";

type SiteSettingsFormProps = {
  initialValues?: Partial<SiteSettingsFormValues>;
};

export function SiteSettingsForm({ initialValues }: SiteSettingsFormProps) {
  const [state, setState] = useState<SiteSettingsActionState>(siteSettingsDefaultState);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues: {
      id: initialValues?.id,
      brandName: initialValues?.brandName ?? "",
      primaryInstagramUsername: initialValues?.primaryInstagramUsername ?? "",
      instagramAccessToken: initialValues?.instagramAccessToken ?? "",
      contactEmail: initialValues?.contactEmail ?? "",
      contactPhone: initialValues?.contactPhone ?? "",
      address: initialValues?.address ?? "",
      heroVideoUrl: initialValues?.heroVideoUrl ?? "",
      mapboxToken: initialValues?.mapboxToken ?? "",
    },
  });

  const {
    formState: { errors },
  } = form;

  useEffect(() => {
    form.reset({
      id: initialValues?.id,
      brandName: initialValues?.brandName ?? "",
      primaryInstagramUsername: initialValues?.primaryInstagramUsername ?? "",
      instagramAccessToken: initialValues?.instagramAccessToken ?? "",
      contactEmail: initialValues?.contactEmail ?? "",
      contactPhone: initialValues?.contactPhone ?? "",
      address: initialValues?.address ?? "",
      heroVideoUrl: initialValues?.heroVideoUrl ?? "",
      mapboxToken: initialValues?.mapboxToken ?? "",
    });
  }, [form, initialValues]);

  const submit = form.handleSubmit((values) => {
    setState(siteSettingsDefaultState);
    startTransition(async () => {
      const result = await updateSiteSettings(values);
      setState(result);
      if (result.status === "success") {
        form.reset({ ...values, id: result.persistedId ?? values.id });
      }
    });
  });

  const fieldError = (name: keyof SiteSettingsFormValues) =>
    (errors[name]?.message as string | undefined) ?? state.fieldErrors?.[name]?.[0];

  return (
    <form onSubmit={submit} className="space-y-8">
      <input type="hidden" {...form.register("id")} />

      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-light">Brand Identity</h2>
          <p className="text-sm text-muted-foreground">
            These values power the public site chrome and brochure exports.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="brandName">
              Brand name
            </label>
            <input
              id="brandName"
              type="text"
              aria-invalid={Boolean(fieldError("brandName"))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              {...form.register("brandName")}
            />
            <p className="text-xs text-muted-foreground">
              Appears in the header, metadata, and PDF brochure output.
            </p>
            {fieldError("brandName") && <p className="text-xs text-destructive">{fieldError("brandName")}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="primaryInstagramUsername">
              Instagram username
            </label>
            <input
              id="primaryInstagramUsername"
              type="text"
              aria-invalid={Boolean(fieldError("primaryInstagramUsername"))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              {...form.register("primaryInstagramUsername")}
            />
            <p className="text-xs text-muted-foreground">
              Public handle used to fetch the Basic Display feed.
            </p>
            {fieldError("primaryInstagramUsername") && (
              <p className="text-xs text-destructive">{fieldError("primaryInstagramUsername")}</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-light">Contact</h2>
          <p className="text-sm text-muted-foreground">
            Shared across enquiry autoresponders and the contact page.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="contactEmail">
              Email
            </label>
            <input
              id="contactEmail"
              type="email"
              aria-invalid={Boolean(fieldError("contactEmail"))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              {...form.register("contactEmail")}
            />
            {fieldError("contactEmail") && <p className="text-xs text-destructive">{fieldError("contactEmail")}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="contactPhone">
              Phone
            </label>
            <input
              id="contactPhone"
              type="text"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              {...form.register("contactPhone")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            rows={3}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            {...form.register("address")}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-light">Media & Integrations</h2>
          <p className="text-sm text-muted-foreground">
            Tokens feed brochure video embeds, Instagram automation, and mapping.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="heroVideoUrl">
              Hero video URL
            </label>
            <input
              id="heroVideoUrl"
              type="url"
              aria-invalid={Boolean(fieldError("heroVideoUrl"))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              {...form.register("heroVideoUrl")}
            />
            {fieldError("heroVideoUrl") && <p className="text-xs text-destructive">{fieldError("heroVideoUrl")}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="mapboxToken">
              Mapbox token
            </label>
            <input
              id="mapboxToken"
              type="text"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              {...form.register("mapboxToken")}
            />
            <p className="text-xs text-muted-foreground">Optional – unlocks interactive villa maps.</p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium" htmlFor="instagramAccessToken">
              Instagram access token
            </label>
            <input
              id="instagramAccessToken"
              type="text"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              {...form.register("instagramAccessToken")}
            />
            <p className="text-xs text-muted-foreground">
              Paste the Basic Display long-lived token. Swap accounts here without redeploying code.
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
        <div className="text-sm text-muted-foreground">
          {state.status === "success" && <span className="text-emerald-600">{state.message}</span>}
          {state.status === "error" && <span className="text-destructive">{state.message}</span>}
        </div>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
        >
          {isPending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
