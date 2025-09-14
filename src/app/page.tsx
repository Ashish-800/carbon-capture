

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Leaf, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { Droplets } from "lucide-react";

export default function GetStartedPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2 text-accent">
              <Droplets className="h-8 w-8" />
              <span className="font-bold font-headline sm:inline-block">
                Carbon Capture
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeSwitch />
            <Button asChild variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-secondary/30">
           <div 
                className="absolute inset-0 bg-cover bg-center opacity-20" 
                style={{backgroundImage: "url('https://picsum.photos/seed/hero-blue-carbon/1800/800')"}}
                data-ai-hint="mangrove coastline"
            ></div>
          <div className="container relative flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-4">
              A Decentralized MRV Platform for <span className="text-accent">Blue Carbon Ecosystems</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
              Leveraging Blockchain for a transparent, accurate, and verifiable system to monitor, report, and verify blue carbon restoration projects across India.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* For Project Implementers Section */}
        <section id="for-implementers" className="py-16 md:py-24">
          <div className="container grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-headline font-bold mb-4">From Coastline to Carbon Credits</h2>
              <p className="text-muted-foreground mb-6">
                Onboard your organization—whether you're an NGO, a community group, or a coastal panchayat—and contribute to a verifiable climate solution. Our platform provides the tools to manage and monetize your blue carbon projects transparently.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Immutable Data Registry:</strong> Securely store plantation and restoration data on the blockchain, ensuring complete transparency and trust.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Seamless Field Data Upload:</strong> Integrate data from mobile apps and drones to provide accurate, real-time updates on project progress.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Tokenized Carbon Credits:</strong> Convert your verified carbon sequestration into tradable digital assets using smart contracts.</span>
                </li>
              </ul>
            </div>
             <div className="order-1 md:order-2">
                <Image 
                    src="https://picsum.photos/seed/mangrove-planting/600/400" 
                    alt="Coastal community working on a restoration project" 
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                    data-ai-hint="people planting mangroves"
                />
            </div>
          </div>
        </section>
        
        {/* For Verifiers & Buyers Section */}
        <section id="for-buyers" className="py-16 md:py-24 bg-secondary/30">
          <div className="container grid md:grid-cols-2 gap-12 items-center">
             <div>
                <Image 
                    src="https://picsum.photos/seed/blockchain-dashboard/600/400" 
                    alt="Dashboard showing verifiable carbon data" 
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                    data-ai-hint="data dashboard analytics"
                />
            </div>
            <div>
              <h2 className="text-3xl font-headline font-bold mb-4">Invest with Confidence</h2>
              <p className="text-muted-foreground mb-6">
                Support high-quality blue carbon projects with an unprecedented level of transparency. Our blockchain-powered registry ensures that every carbon credit is verifiable, accurately reported, and contributes directly to India’s climate strategy.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Verifiable Impact:</strong> Access an immutable audit trail for every project, from data collection to credit issuance.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Smart Contract Automation:</strong> Carbon credits are tokenized and managed through secure smart contracts, ensuring fair and transparent transactions.</span>
                </li>
                 <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Powerful Admin Tools:</strong> Designed to support national standards with robust administrative and reporting tools for organizations like the NCCR.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </main>

       <footer className="py-8 bg-background border-t">
          <div className="container text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} Carbon Capture. All Rights Reserved.</p>
          </div>
        </footer>
    </div>
  );
}
