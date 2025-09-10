import { ProjectForm } from "./_components/project-form";

export default function NewProjectPage() {
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Create a New Carbon Project
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to register your project. Accurate information is crucial for verification.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
