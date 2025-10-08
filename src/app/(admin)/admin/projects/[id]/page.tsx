import type { Route } from "next";
import Link from "next/link";

export default function ProjectEditorPlaceholder({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light">Project Editor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The case study editor is being assembled. For now, adjust project&nbsp;
          <span className="font-medium">{params.id}</span> directly in Supabase Studio or through migrations.
        </p>
      </div>
      <Link
        href={"/admin/projects" as Route}
        className="inline-flex w-fit items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
      >
        Back to projects
      </Link>
    </div>
  );
}
