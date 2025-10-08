import Link from "next/link";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light">Create Post</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Our in-app markdown editor is being finalised. Publish via Supabase Studio or the seed
          script until the authoring experience ships.
        </p>
      </div>
      <Link href="/admin/posts" className="inline-flex w-fit items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted">
        Back to posts
      </Link>
    </div>
  );
}
