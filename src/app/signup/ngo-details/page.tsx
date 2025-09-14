
import { NgoDetailsForm } from "./_components/ngo-details-form";
import { Logo } from "@/components/logo";

export default function NgoDetailsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 flex flex-col items-center">
       <div className="flex items-center justify-center mb-8 text-primary">
        <Logo className="h-12 w-12 mr-3" />
        <h1 className="text-4xl font-headline font-bold">Carbon Capture</h1>
      </div>
      <NgoDetailsForm />
    </div>
  );
}
