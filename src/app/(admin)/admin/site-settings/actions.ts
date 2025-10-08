"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { getDb, siteSettings } from "@/lib/db";

import { siteSettingsFormSchema, type SiteSettingsFormValues } from "./schema";

export type SiteSettingsActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
  persistedId?: string;
};

const defaultState: SiteSettingsActionState = { status: "idle" };

export async function updateSiteSettings(
  values: SiteSettingsFormValues,
): Promise<SiteSettingsActionState> {
  const parsed = siteSettingsFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.formErrors.fieldErrors,
    } satisfies SiteSettingsActionState;
  }

  const data = parsed.data;
  const db = getDb();

  const payload = {
    brandName: data.brandName.trim(),
    primaryInstagramUsername: data.primaryInstagramUsername.trim(),
    instagramAccessToken: data.instagramAccessToken?.trim() ? data.instagramAccessToken.trim() : null,
    contactEmail: data.contactEmail?.trim() ? data.contactEmail.trim() : null,
    contactPhone: data.contactPhone?.trim() ? data.contactPhone.trim() : null,
    address: data.address?.trim() ? data.address.trim() : null,
    heroVideoUrl: data.heroVideoUrl?.trim() ? data.heroVideoUrl.trim() : null,
    mapboxToken: data.mapboxToken?.trim() ? data.mapboxToken.trim() : null,
    updatedAt: new Date(),
  };

  try {
    let targetId = data.id;

    if (!targetId) {
      const existing = await db.query.siteSettings.findFirst({ columns: { id: true } });
      targetId = existing?.id ?? null;
    }

    if (targetId) {
      await db.update(siteSettings).set(payload).where(eq(siteSettings.id, targetId));
    } else {
      const [inserted] = await db
        .insert(siteSettings)
        .values({ ...payload, createdAt: new Date() })
        .returning({ id: siteSettings.id });
      targetId = inserted.id;
    }

    await Promise.all([
      revalidatePath("/admin/site-settings"),
      revalidatePath("/admin/instagram"),
    ]);

    return {
      status: "success",
      message: "Settings saved successfully.",
      fieldErrors: undefined,
      persistedId: targetId ?? undefined,
    } satisfies SiteSettingsActionState;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update settings.";
    return {
      status: "error",
      message,
    } satisfies SiteSettingsActionState;
  }
}

export { defaultState as siteSettingsDefaultState };
