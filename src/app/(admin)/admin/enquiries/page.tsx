import Link from "next/link";

import { getDb } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export default async function EnquiriesPage() {
  const db = getDb();
  const enquiries = await db.query.enquiries.findMany({
    orderBy: (table, { desc }) => [desc(table.createdAt)],
    limit: 50,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light">Enquiries</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every submission is captured here with contextual metadata ready for follow-up.
          </p>
        </div>
        <Link
          href="mailto:hello@ejdevelopment.com"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:border-primary"
        >
          Email team
        </Link>
      </div>

      <div className="rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{enquiry.name}</div>
                    {enquiry.message && (
                      <div className="max-w-xs overflow-hidden text-ellipsis text-xs text-muted-foreground">
                        {enquiry.message}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <div>{enquiry.email}</div>
                    {enquiry.phone && <div>{enquiry.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
                    {enquiry.source ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDateTime(enquiry.createdAt)}</td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No enquiries yet. The contact form will populate this view once launched.
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
