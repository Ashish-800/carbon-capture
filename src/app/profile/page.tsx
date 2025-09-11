
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const isNgo = user.displayName?.includes("NGO");
  const userRole = isNgo ? "NGO / Field Worker" : "Corporate Buyer";
  const userName = isNgo ? "NGO Admin" : "Sustainability Lead";
  const userInitials = isNgo ? "NA" : "SL";

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          View and manage your account details.
        </p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
           <Avatar className="h-16 w-16">
            <AvatarImage src="https://picsum.photos/seed/avatar/64/64" alt="User avatar" data-ai-hint="avatar" />
            <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-2xl">{userName}</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="mt-2">{userRole}</Badge>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                <p className="text-primary">{user.email}</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                <p className="text-primary">{user.emailVerified ? 'Verified' : 'Not Verified'}</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="text-primary text-xs font-mono">{user.uid}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
