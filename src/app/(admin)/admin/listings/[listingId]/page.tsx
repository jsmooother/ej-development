import Link from "next/link";

export default function EditListingPlaceholder({
  params,
}: {
  params: { listingId: string };
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Listing management</p>
        <h1 className="font-serif text-3xl font-light">Editing coming soon</h1>
        <p className="text-sm text-muted-foreground">
          The editing tools for listing <span className="font-mono">{params.listingId}</span> are
          still under construction.
        </p>
      </div>

      <div className="rounded-md border border-dashed border-border bg-muted/50 p-6 text-sm text-muted-foreground">
        Our next milestone will bring full form-driven editing, publishing controls, and media
        management for listings. Until then, please coordinate updates with the development team.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/listings"
          className="inline-flex items-center rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Back to listings
        </Link>
        <Link
          href="/admin/listings/new"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create new listing
        </Link>
      </div>
    </div>
  );
}
