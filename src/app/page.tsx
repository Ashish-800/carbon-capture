

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Leaf, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { Badge } from "@/components/ui/badge";
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
        <section className="relative py-20 md:py-32 text-center bg-secondary/30">
           <div 
                className="absolute inset-0 bg-cover bg-center opacity-10" 
                style={{backgroundImage: "url('https://picsum.photos/seed/hero-bg/1800/800')"}}
                data-ai-hint="forest landscape"
            ></div>
          <div className="container relative flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-4">
              A Transparent Marketplace for <span className="text-accent">Carbon Transformation</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
              We connect high-impact environmental projects with organizations committed to sustainability, making carbon offsetting verifiable, transparent, and effective.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* For NGOs Section */}
        <section id="for-ngos" className="py-16 md:py-24">
          <div className="container grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Badge variant="secondary" className="mb-2">For Project Developers</Badge>
              <h2 className="text-3xl font-headline font-bold mb-4">From Project to Planet's Progress</h2>
              <p className="text-muted-foreground mb-6">
                Our platform provides the tools you need to get your carbon capture projects verified, funded, and recognized. Showcase your impact and connect with a global network of supporters.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Streamlined Verification:</strong> Submit your project details through our guided process for transparent verification.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">AI-Powered Insights:</strong> Leverage our AI tools to get preliminary estimates on your project's carbon capture potential.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Access Funding:</strong> List your verified projects on our registry to sell carbon credits to corporate buyers worldwide.</span>
                </li>
              </ul>
            </div>
             <div className="order-1 md:order-2">
                <Image 
                    src="https://picsum.photos/seed/ngo-feature/600/400" 
                    alt="NGOs planting trees" 
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                    data-ai-hint="people planting trees"
                />
            </div>
          </div>
        </section>
        
        {/* For Buyers Section */}
        <section id="for-buyers" className="py-16 md:py-24 bg-secondary/30">
          <div className="container grid md:grid-cols-2 gap-12 items-center">
             <div>
                <Image 
                    src="https://picsum.photos/seed/buyer-feature/600/400" 
                    alt="Sustainable corporate building" 
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                    data-ai-hint="sustainable business"
                />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">For Corporate Buyers</Badge>
              <h2 className="text-3xl font-headline font-bold mb-4">Invest in a Sustainable Future</h2>
              <p className="text-muted-foreground mb-6">
                Achieve your sustainability goals by supporting high-quality, verified carbon projects. Our platform makes it easy to find, fund, and track your environmental impact.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Verified Project Registry:</strong> Browse a diverse portfolio of thoroughly vetted carbon capture projects.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Transparent Reporting:</strong> Receive digital certificates for every credit purchased and track your organization's total CO₂ offset.</span>
                </li>
                 <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-primary">Tangible Impact:</strong> Confidently invest in projects that make a real difference for the planet and local communities.</span>
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
