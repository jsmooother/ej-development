"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateInstagramSettings, clearInstagramCache } from "./actions";
import type { InstagramSettingsInput } from "./actions";
import type { ActionResponse } from "../utils";

export type InstagramSettingsFormProps = {
  initialUsername: string;
  initialAccessToken?: string | null;
  lastFetchedAt?: string | null;
};

type FormValues = {
  primaryInstagramUsername: string;
  instagramAccessToken: string;
};

export function InstagramSettingsForm({ initialUsername, initialAccessToken, lastFetchedAt }: InstagramSettingsFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionResponse | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isClearing, startClearing] = useTransition();

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      primaryInstagramUsername: initialUsername,
      instagramAccessToken: initialAccessToken ?? "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setMessage(null);
    startSaving(async () => {
      const payload: InstagramSettingsInput = {
        primaryInstagramUsername: values.primaryInstagramUsername,
        instagramAccessToken: values.instagramAccessToken || undefined,
      };

      const result = await updateInstagramSettings(payload);
      setActionState(result);
      setMessage(result.message ?? null);
    });
  });

  const handleClearCache = () => {
    setMessage(null);
    startClearing(async () => {
      const result = await clearInstagramCache();
      setActionState(result);
      setMessage(result.message ?? null);
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-light">Instagram feed</h2>
        <p className="text-sm text-muted-foreground">
          Supply a long-lived token so posts refresh automatically for the homepage mosaic.
        </p>
        {message && (
          <p
            className={`rounded-md px-3 py-2 text-sm ${
              actionState?.status === "error"
                ? "border border-destructive/40 bg-destructive/10 text-destructive"
                : "border border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Instagram username</span>
          <input
            type="text"
            {...register("primaryInstagramUsername", { required: true })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
            placeholder="ejdevelopment"
          />
        </label>

        <label className="md:col-span-2 flex flex-col gap-2">
          <span className="text-sm font-medium">Long-lived access token</span>
          <textarea
            {...register("instagramAccessToken")}
            rows={4}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-foreground focus:outline-none"
            placeholder="Paste the token provided by Meta..."
          />
          <span className="text-xs text-muted-foreground">
            Store tokens securely. Editors can rotate tokens without touching deployment secrets.
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          {lastFetchedAt ? (
            <span>
              Cached {new Date(lastFetchedAt).toLocaleString()}.
              <button
                type="button"
                onClick={handleClearCache}
                disabled={isClearing}
                className="ml-2 text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isClearing ? "Clearing..." : "Clear cache"}
              </button>
            </span>
          ) : (
            <span>No cached feed yet.</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background shadow-sm transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}
