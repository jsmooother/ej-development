import type { Route } from "next";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function ListingsPage() {
  const db = getDb();
  const listings = await db.query.listings.findMany({
    orderBy: (listings, { desc }) => [desc(listings.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light">Listings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your property listings here.
          </p>
        </div>
        <Link
          href={"/admin/listings/new" as Route}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add New Listing
        </Link>
      </div>

      <div className="rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{listing.title}</div>
                      {listing.subtitle && (
                        <div className="text-xs text-muted-foreground">{listing.subtitle}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={listing.isPublished ? "text-green-600" : "text-yellow-600"}>
                      {listing.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(listing.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/listings/${listing.id}` as Route}
                        className="text-xs text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/listings/${listing.slug}`}
                        className="text-xs text-muted-foreground hover:underline"
                        target="_blank"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No listings found. Create your first listing to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
