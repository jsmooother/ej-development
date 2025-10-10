import { getDb } from "@/lib/db";
import { InstagramSettingsForm } from "./instagram-form";

export const dynamic = "force-dynamic";

export default async function InstagramPage() {
  const db = getDb();
  const settings = await db.query.siteSettings.findFirst();
  const cacheEntry = await db.query.instagramCache.findFirst({
    orderBy: (instagramCache, { desc }) => [desc(instagramCache.fetchedAt)],
  });

  return (
    <div className="space-y-10">
      <InstagramSettingsForm
        initialUsername={settings?.primaryInstagramUsername ?? ""}
        initialAccessToken={settings?.instagramAccessToken ?? undefined}
        lastFetchedAt={cacheEntry?.fetchedAt?.toISOString() ?? null}
      />

      <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
        <h2 className="font-serif text-xl font-light text-foreground">Coming soon</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Manual pinning of hero tiles to override the live feed.</li>
          <li>Automatic syncing of reels into the homepage video slot.</li>
          <li>Scheduling Instagram refresh windows to respect Meta rate limits.</li>
        </ul>
      </div>
    </div>
  );
}
