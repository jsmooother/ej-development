import Link from "next/link";

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light">Create Listing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Listing creation is coming soon. In the meantime you can manage existing listings
          or seed data via the Supabase dashboard.
        </p>
      </div>
      <Link href="/admin/listings" className="inline-flex w-fit items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted">
        Back to listings
      </Link>
    </div>
  );
}
