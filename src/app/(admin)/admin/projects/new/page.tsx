import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light">Add Project</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The project editor is in progress. Please use the Supabase dashboard or seed scripts
          to add projects until the inline editor is ready.
        </p>
      </div>
      <Link href="/admin/projects" className="inline-flex w-fit items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted">
        Back to projects
      </Link>
    </div>
  );
}
