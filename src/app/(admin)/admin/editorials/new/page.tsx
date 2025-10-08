import { EditorialForm } from "../editorial-form";

export default function NewEditorialPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light">Create editorial</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Drafts appear on the homepage once published. Use the AI helper to keep tone consistent.
        </p>
      </div>

      <EditorialForm />
    </div>
  );
}
