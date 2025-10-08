import type { Route } from "next";
import Link from "next/link";

export default function PostEditorPlaceholder({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light">Blog Post Editor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The on-site article editor is planned for a future sprint. Update post&nbsp;
          <span className="font-medium">{params.id}</span> using Supabase Studio or your preferred CMS tooling for now.
        </p>
      </div>
      <Link
        href={"/admin/posts" as Route}
        className="inline-flex w-fit items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
      >
        Back to posts
      </Link>
    </div>
  );
}
