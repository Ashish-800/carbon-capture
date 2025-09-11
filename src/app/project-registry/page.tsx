import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/db";
import { MapPin, Leaf, Sprout } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function ProjectRegistryPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight">
          Project Registry
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore high-impact, verified carbon projects from around the world.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No projects found. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover"
                    data-ai-hint={project.imageHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <Badge variant="secondary" className="mb-2">
                  {project.restorationType}
                </Badge>
                <CardTitle className="font-headline text-lg mb-2">{project.name}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  {project.locationName}
                </CardDescription>
                <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
                  {project.description}
                </p>
              </CardContent>
              <Separator />
              <CardFooter className="p-4 bg-secondary/30 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-accent" />
                      <div>
                          <p className="font-semibold">{project.estimatedCarbonCapture.toFixed(1)} tCO₂</p>
                          <p className="text-xs text-muted-foreground">/ha/yr</p>
                      </div>
                  </div>
                   <div className="flex items-center">
                      <Sprout className="h-5 w-5 mr-2 text-accent" />
                      <div>
                          <p className="font-semibold">{project.creditsAvailable.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Credits</p>
                      </div>
                  </div>
              </CardFooter>
              <div className="p-4">
                   <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href={`/project-registry/${project.id}`}>
                          View Project
                      </Link>
                  </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
