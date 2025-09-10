import Link from "next/link";
import { PlusCircle, MapPin, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockProjects } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function NgoDashboardPage() {
  const ngoProjects = mockProjects.slice(0, 2); // Simulating projects for one NGO

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-headline font-bold">My Projects</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/new-project">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Project
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ngoProjects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  fill
                  className="object-cover"
                  data-ai-hint={project.imageHint}
                />
              </div>
              <CardTitle className="font-headline">{project.name}</CardTitle>
              <CardDescription className="flex items-center pt-1">
                <MapPin className="h-4 w-4 mr-1.5" /> {project.locationName}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {project.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
               <Badge variant="secondary" className="flex items-center">
                  <Leaf className="h-3 w-3 mr-1.5 text-green-600" />
                  {project.restorationType}
                </Badge>
              <Button variant="outline" size="sm">View Details</Button>
            </CardFooter>
          </Card>
        ))}
         <Card className="flex flex-col items-center justify-center border-2 border-dashed h-full">
            <div className="text-center p-6">
              <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium font-headline">Create a new project</h3>
              <p className="mt-1 text-sm text-muted-foreground">Upload data to get your project verified and listed for carbon credits.</p>
              <Button asChild className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/new-project">
                  Start Upload
                </Link>
              </Button>
            </div>
          </Card>
      </div>
    </div>
  );
}
