
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, Building, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = React.useState("ngo");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please check your password and try again.",
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = userCredential.user;
      
      const isNgo = role === 'ngo';
      // Set displayName to distinguish between user roles
      await updateProfile(user, {
        displayName: isNgo ? 'NGO User' : 'Buyer User',
      });
      
      // Send verification email to the new user
      await sendEmailVerification(user);
      
      toast({
        title: "Account Created!",
        description: "A verification email has been sent to your address.",
      });
      
      // Redirect NGO users to the detailed profile form.
      // Redirect Buyer users to the generic email verification page.
      if (isNgo) {
        router.push("/signup/ngo-details");
      } else {
        router.push("/verify-email");
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-up Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      <div className="flex items-center justify-center mb-8 text-primary">
        <Logo className="h-12 w-12 mr-3" />
        <h1 className="text-4xl font-headline font-bold">Carbon Capture</h1>
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Join our platform to start making a difference.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label>Select Your Role</Label>
              <RadioGroup
                defaultValue="ngo"
                className="grid grid-cols-2 gap-4"
                value={role}
                onValueChange={setRole}
                disabled={loading}
              >
                <div>
                  <RadioGroupItem value="ngo" id="ngo" className="peer sr-only" />
                  <Label
                    htmlFor="ngo"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Leaf className="mb-3 h-6 w-6" />
                    NGO / Field Worker
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
                  <Label
                    htmlFor="buyer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Building className="mb-3 h-6 w-6" />
                    Corporate Buyer
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-sin" />}
              Create Account
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/login" className="underline text-primary hover:text-accent">
          Sign In
        </Link>
      </p>
    </main>
  );
}
