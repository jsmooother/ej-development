import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light">Add project</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pair before and after photography so the public site can automatically tell the renovation story.
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
