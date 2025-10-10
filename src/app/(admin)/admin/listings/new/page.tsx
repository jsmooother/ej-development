import Link from "next/link";

export default function NewListingPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-light">New Listing</h1>
        <p className="text-sm text-muted-foreground">
          Listing creation tools are coming soon. In the meantime, please reach
          out to the development team if you need to publish a new property.
        </p>
      </div>
      <Link
        href="/admin/listings"
        className="inline-flex w-fit items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Back to listings
      </Link>
    </div>
  );
}
