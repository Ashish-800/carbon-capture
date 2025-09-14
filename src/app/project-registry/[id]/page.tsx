import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/db";
import { MapPin, Leaf, Calendar, Sprout, ShieldCheck, HardHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseCredits } from "./_components/purchase-credits";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MapView = dynamic(() => import('./_components/map-view').then(mod => mod.MapView), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});


export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          {/* Main Content */}
          <div className="relative h-64 md:h-80 w-full mb-6 rounded-lg overflow-hidden shadow-lg">
             <Image
                src={project.imageUrl}
                alt={project.name}
                fill
                className="object-cover"
                data-ai-hint={project.imageHint}
              />
          </div>
          <Badge variant="secondary">{project.restorationType}</Badge>
          <h1 className="font-headline text-3xl md:text-4xl font-bold mt-2">{project.name}</h1>
          <div className="flex items-center text-muted-foreground mt-2 mb-6">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{project.locationName}</span>
            <Separator orientation="vertical" className="h-5 mx-4" />
            <Calendar className="h-5 w-5 mr-2" />
            <span>Planted on {project.plantationDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
          </div>
          <p className="text-lg leading-relaxed">{project.description}</p>
          
          <div className="mt-8">
            <h2 className="font-headline text-2xl font-semibold mb-4">Project Details</h2>
            <Card>
                <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-4">
                        <HardHat className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold">Implementing Partner</h3>
                            <p className="text-muted-foreground">{project.ngo.name}</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <ShieldCheck className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold">Verification Status</h3>
                            <p className="text-muted-foreground">Verified by Carbon Capture</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6 mt-8 lg:mt-0">
          {/* Sidebar */}
           <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Project Location</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                 <div className="h-64 w-full">
                    <MapView center={project.location} />
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Data & Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center"><Leaf className="h-4 w-4 mr-2"/>Est. Carbon Capture</span>
                <span className="font-bold">{project.estimatedCarbonCapture.toFixed(1)} tCO₂/ha/yr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Vegetation Index (NDVI)</span>
                <span className="font-bold">{project.ndvi.toFixed(2)}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center"><Sprout className="h-4 w-4 mr-2"/>Credits Available</span>
                <span className="font-bold">{project.creditsAvailable.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          
          <PurchaseCredits project={project} />
        </div>
      </div>
    </div>
  );
}
