"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { instagramCache, siteSettings } from "@/lib/db/schema";
import { optionalTrimmed, type ActionResponse } from "../utils";

const instagramSettingsSchema = z.object({
  primaryInstagramUsername: z.string().min(1, "Username is required"),
  instagramAccessToken: z.string().optional(),
});

export type InstagramSettingsInput = z.input<typeof instagramSettingsSchema>;

type InstagramFields = "primaryInstagramUsername" | "instagramAccessToken";

export async function updateInstagramSettings(
  input: InstagramSettingsInput,
): Promise<ActionResponse<InstagramFields>> {
  const sanitized = {
    primaryInstagramUsername: input.primaryInstagramUsername.trim(),
    instagramAccessToken: optionalTrimmed(input.instagramAccessToken ?? undefined),
  };

  const parsed = instagramSettingsSchema.safeParse(sanitized);

  if (!parsed.success) {
    const errors: Partial<Record<InstagramFields, string>> = {};
    const { fieldErrors } = parsed.error.flatten();
    for (const key of Object.keys(fieldErrors)) {
      const message = fieldErrors[key as keyof typeof fieldErrors]?.[0];
      if (message) {
        errors[key as InstagramFields] = message;
      }
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: errors,
    };
  }

  const db = getDb();

  try {
    const [existing] = await db.select().from(siteSettings).limit(1);

    if (existing) {
      await db
        .update(siteSettings)
        .set({
          primaryInstagramUsername: parsed.data.primaryInstagramUsername,
          instagramAccessToken: parsed.data.instagramAccessToken ?? null,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, existing.id));
    } else {
      await db.insert(siteSettings).values({
        brandName: "EJ Development",
        primaryInstagramUsername: parsed.data.primaryInstagramUsername,
        instagramAccessToken: parsed.data.instagramAccessToken ?? null,
      });
    }
  } catch (error) {
    console.error("Failed to update Instagram settings", error);
    return {
      status: "error",
      message: "We couldn't update the Instagram settings. Please try again.",
    };
  }

  revalidatePath("/admin/instagram");
  revalidatePath("/");
  return {
    status: "success",
    message: "Instagram settings updated.",
  };
}

export async function clearInstagramCache(): Promise<ActionResponse> {
  const db = getDb();
  try {
    await db.delete(instagramCache);
  } catch (error) {
    console.error("Failed to clear Instagram cache", error);
    return {
      status: "error",
      message: "Could not clear the cached feed.",
    };
  }

  revalidatePath("/admin/instagram");
  revalidatePath("/");
  return {
    status: "success",
    message: "Cache cleared. The next visitor will pull fresh media.",
  };
}
