import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Leaf, CheckCircle, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PortfolioChart } from "./_components/portfolio-chart";
import { ProjectsMapView } from "@/components/projects-map-view";
import { mockProjects } from "@/lib/mock-data";

export default function BuyerDashboardPage() {
  // Simulating portfolio projects by taking a slice of mock data
  const portfolioProjects = mockProjects.slice(0, 3);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-headline font-bold mb-6">
        Sustainability Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total CO₂ Offset
            </CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250 Tonnes</div>
            <p className="text-xs text-muted-foreground">
              +150 Tonnes from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Investment
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25,600</div>
            <p className="text-xs text-muted-foreground">
              +10% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Projects
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5</div>
            <p className="text-xs text-muted-foreground">
              2 new projects added this year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Credit Price
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$20.48</div>
            <p className="text-xs text-muted-foreground">
              Price stable this quarter
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Global Project Portfolio</CardTitle>
            <CardDescription>
              Locations of your supported carbon capture projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 w-full">
              <ProjectsMapView projects={portfolioProjects} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Carbon Offset Over Time</CardTitle>
            <CardDescription>
              Your organization's total CO₂ offset in the last 12 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <PortfolioChart />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Discover New Projects</CardTitle>
            <CardDescription>
              Browse verified projects and purchase new carbon credits to enhance your sustainability impact.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
            <Leaf className="h-16 w-16 text-accent mb-4" />
             <p className="text-muted-foreground mb-4">
              Invest in high-impact projects from around the globe.
            </p>
          </CardContent>
           <CardContent>
            <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/project-registry">
                Go to Project Registry
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
