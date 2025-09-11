"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Leaf, Building, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThemeSwitch } from "@/components/theme-switch";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = React.useState("ngo");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "ngo") {
      router.push("/ngo-dashboard");
    } else {
      router.push("/buyer-dashboard");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      <div className="flex items-center justify-center mb-8 text-primary">
        <Droplets className="h-10 w-10 mr-3 text-accent" />
        <h1 className="text-4xl font-headline font-bold">Carbon Capture</h1>
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Select your role to sign in to your dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                defaultValue="demo@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="password" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <RadioGroup
                defaultValue="ngo"
                className="grid grid-cols-2 gap-4"
                value={role}
                onValueChange={setRole}
              >
                <div>
                  <RadioGroupItem
                    value="ngo"
                    id="ngo"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="ngo"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Leaf className="mb-3 h-6 w-6" />
                    NGO / Field Worker
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="buyer"
                    id="buyer"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="buyer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Building className="mb-3 h-6 w-6" />
                    Corporate Buyer
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="text-sm text-muted-foreground mt-6">
        Don't have an account?{" "}
        <a href="#" className="underline text-primary hover:text-accent">
          Sign Up
        </a>
      </p>
    </main>
  );
}
