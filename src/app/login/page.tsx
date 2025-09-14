"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Leaf, Building, Droplets, Loader2 } from "lucide-react";
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
import { ThemeSwitch } from "@/components/theme-switch";
import { useAuth } from "@/context/auth-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("demo@example.com");
  const [password, setPassword] = React.useState("password");
  const [loading, setLoading] = React.useState(false);
  const { user, loading: authLoading } = useAuth();

  React.useEffect(() => {
    if (!authLoading && user) {
        if (user.emailVerified) {
             // A simple way to distinguish roles without custom claims for now
            if (user.displayName?.includes("NGO")) {
                router.push("/ngo-dashboard");
            } else {
                router.push("/buyer-dashboard");
            }
        } else {
            router.push("/verify-email");
        }
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        router.push("/verify-email");
      }
      // The useEffect hook will handle redirection for verified users.
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      <div className="flex items-center justify-center mb-8 text-primary">
        <Droplets className="h-12 w-12 mr-3" />
        <h1 className="text-4xl font-headline font-bold">Carbon Capture</h1>
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to sign in to your dashboard.
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="text-sm text-muted-foreground mt-6">
        Don't have an account?{" "}
        <Link href="/signup" className="underline text-primary hover:text-accent">
          Sign Up
        </Link>
      </p>
    </main>
  );
}
