
import { BuyerDetailsForm } from "./_components/buyer-details-form";
import { Droplets } from "lucide-react";

export default function BuyerDetailsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 flex flex-col items-center">
       <div className="flex items-center justify-center mb-8 text-accent">
        <Droplets className="h-12 w-12 mr-3" />
        <h1 className="text-4xl font-headline font-bold">Carbon Capture</h1>
      </div>
      <BuyerDetailsForm />
    </div>
  );
}
