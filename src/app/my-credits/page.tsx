import { mockCredits } from "@/lib/mock-data";
import { mockProjects } from "@/lib/mock-data";
import { Certificate } from "./_components/certificate";

export default function MyCreditsPage() {
    const enrichedCredits = mockCredits.map(credit => {
        const project = mockProjects.find(p => p.id === credit.projectId);
        return {
            ...credit,
            locationName: project?.locationName || 'Unknown Location',
            ngoName: project?.ngo.name || 'Unknown Organization'
        };
    });

  return (
    <div className="bg-secondary/40">
        <div className="container mx-auto py-10">
            <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-headline font-bold tracking-tight">
                My Carbon Credits
                </h1>
                <p className="text-muted-foreground">
                Here are the certificates for your purchased carbon credits.
                </p>
            </div>

            <div className="space-y-8">
                {enrichedCredits.map((credit) => (
                    <Certificate key={credit.id} credit={credit} />
                ))}
            </div>
        </div>
    </div>
  );
}
