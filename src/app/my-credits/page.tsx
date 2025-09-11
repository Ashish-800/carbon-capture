import { getCreditsByBuyer, getProjectById } from "@/lib/db";
import { Certificate } from "./_components/certificate";

export default async function MyCreditsPage() {
    // In a real app, you'd get the buyer ID from the authenticated user's session.
    // For this prototype, we'll use a hardcoded ID.
    const buyerId = "buyer_global_tech";
    const credits = await getCreditsByBuyer(buyerId);

    const enrichedCredits = await Promise.all(credits.map(async (credit) => {
        const project = await getProjectById(credit.projectId);
        return {
            ...credit,
            locationName: project?.locationName || 'Unknown Location',
            ngoName: project?.ngo.name || 'Unknown Organization'
        };
    }));

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
            
            {enrichedCredits.length === 0 ? (
                 <div className="text-center py-10 bg-card rounded-lg">
                    <p className="text-muted-foreground">You have not purchased any carbon credits yet.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {enrichedCredits.map((credit) => (
                        <Certificate key={credit.id} credit={credit} />
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
