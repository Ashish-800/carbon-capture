import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Droplets, Leaf } from "lucide-react";

// Enriched credit type for component props
type EnrichedCredit = {
    id: string;
    projectId: string;
    projectName: string;
    buyer: string;
    purchaseDate: Date;
    tonnesCO2: number;
    locationName: string;
    ngoName: string;
};

export function Certificate({ credit }: { credit: EnrichedCredit }) {
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto border-4 border-primary">
      <div className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center text-primary mb-1">
                <Droplets className="h-10 w-10 mr-2" />
                <h1 className="text-2xl font-headline font-bold">Carbon Capture</h1>
            </div>
            <p className="text-sm text-muted-foreground">Official Certificate of Carbon Credit Retirement</p>
          </div>
          <div className="text-right">
             <Leaf className="h-10 w-10 text-green-600" />
          </div>
        </div>
        
        <Separator className="my-6" />

        <div className="text-center mb-6">
            <p className="text-lg">This certifies that</p>
            <h2 className="text-3xl font-bold font-headline text-accent my-2">{credit.buyer}</h2>
            <p className="text-lg">has retired carbon credits equivalent to</p>
            <p className="text-5xl font-bold font-headline text-primary my-4">{credit.tonnesCO2} tonnes of CO₂</p>
        </div>

        <div className="bg-secondary/50 rounded-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
                <p className="text-muted-foreground font-semibold">SUPPORTING PROJECT</p>
                <p className="font-medium text-primary">{credit.projectName}</p>
            </div>
            <div>
                <p className="text-muted-foreground font-semibold">PROJECT LOCATION</p>
                <p className="font-medium text-primary">{credit.locationName}</p>
            </div>
            <div>
                <p className="text-muted-foreground font-semibold">RETIREMENT DATE</p>
                <p className="font-medium text-primary">{credit.purchaseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
                <p className="text-muted-foreground font-semibold">IMPLEMENTING PARTNER</p>
                <p className="font-medium text-primary">{credit.ngoName}</p>
            </div>
            <div className="md:col-span-2">
                <p className="text-muted-foreground font-semibold">UNIQUE CREDIT ID</p>
                <p className="font-mono text-primary text-xs break-all">{credit.id}</p>
            </div>
        </div>

        <div className="mt-8 flex justify-end">
             <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        </div>
      </div>
    </div>
  );
}
