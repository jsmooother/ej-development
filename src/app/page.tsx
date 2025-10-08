import { getDb } from "@/lib/db";

export default async function HomePage() {
  const db = getDb();
  const settings = await db.query.siteSettings.findFirst();
  
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl">Database Connection Test</h1>
      <pre className="whitespace-pre-wrap bg-gray-100 p-4">
        {JSON.stringify({ settings }, null, 2)}
      </pre>
    </div>
  );
}
