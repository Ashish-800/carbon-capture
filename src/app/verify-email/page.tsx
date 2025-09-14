"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // If user is logged in and verified, redirect them
    if (user && user.emailVerified) {
        // Simple role check based on displayName
        if (user.displayName?.includes("NGO")) {
            router.push("/ngo-dashboard");
        } else {
            router.push("/buyer-dashboard");
        }
    }
    // If auth is done loading and there's no user, redirect to login
    else if (!authLoading && !user) {
        router.push("/login");
    }

  }, [user, authLoading, router]);
  
   // Periodically check email verification status
  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          router.push(user.displayName?.includes("NGO") ? "/ngo-dashboard" : "/buyer-dashboard");
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user, router]);


  const handleResendVerification = async () => {
    if (user) {
      setResending(true);
      try {
        await sendEmailVerification(user);
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox (and spam folder).",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to Resend",
          description: error.message,
        });
      } finally {
        setResending(false);
      }
    }
  };
  
  if (authLoading || !user) {
     return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-4">
                    <MailCheck className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-headline">Verify Your Email</CardTitle>
                <CardDescription>
                   A verification link has been sent to <span className="font-semibold text-primary">{user.email}</span>. Please click the link to continue.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    This page will automatically redirect once you've verified your email.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={handleResendVerification}
                        disabled={resending}
                    >
                        {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Resend Email
                    </Button>
                     <Button
                        variant="secondary"
                        onClick={signOut}
                    >
                        Sign Out
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
