import type { Route } from "next";
import Link from "next/link";

export default function ListingEditorPlaceholder({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light">Listing Editor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The inline listing editor is still under construction. Manage listing&nbsp;
          <span className="font-medium">{params.id}</span> through Supabase Studio for now or use the seed script.
        </p>
      </div>
      <Link
        href={"/admin/listings" as Route}
        className="inline-flex w-fit items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
      >
        Back to listings
      </Link>
    </div>
  );
}
