import { getDb } from "@/lib/db";

import { SiteSettingsForm } from "./site-settings-form";

export default async function SiteSettingsPage() {
  const db = getDb();
  const settings = await db.query.siteSettings.findFirst({
    orderBy: (table, { desc }) => [desc(table.updatedAt)],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light">Site Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Control the essentials that power the public site experience and Instagram feed.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <SiteSettingsForm initialValues={settings ?? undefined} />
      </div>
    </div>
  );
}
