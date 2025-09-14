
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building, Globe, Mail, Phone, User, FileText, Landmark } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/db";
import type { UserProfile } from "@/lib/types";

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined | null }) => (
    <div className="grid grid-cols-3 gap-4 items-start">
        <div className="col-span-1 flex items-center text-sm text-muted-foreground">
            <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{label}</span>
        </div>
        <div className="col-span-2 text-sm text-primary break-words">
            {value || "-"}
        </div>
    </div>
);


export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        setLoadingProfile(true);
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [user]);

  if (authLoading || loadingProfile) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user || !profile) {
       return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Could not load user profile.</p>
      </div>
    );
  }

  const isNgo = profile.role === "ngo";
  const userRole = isNgo ? "NGO / Field Worker" : "Corporate Buyer";
  const userInitials = profile.displayName ? profile.displayName.substring(0, 2).toUpperCase() : "NA";
  
  // Mock data for buyer - this would be fetched from the DB in a real app
   const buyerData = {
      name: "Global Tech Inc.",
      role: "Sustainability Lead",
      department: "Corporate Social Responsibility",
      address: "456 Innovation Drive, Silicon Valley, CA",
      website: "https://globaltech.com",
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
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
            <AvatarImage src={`https://picsum.photos/seed/${isNgo ? 'ngo_logo' : 'avatar'}/64/64`} alt="User avatar" data-ai-hint="avatar" />
            <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-2xl">{isNgo ? profile.displayName : buyerData.name}</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="mt-2">{userRole}</Badge>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
            <Separator />
            <div className="space-y-1 pt-2">
                <p className="text-sm font-medium text-muted-foreground">Account Information</p>
            </div>
             <DetailRow icon={Mail} label="Email Address" value={user.email!} />
             <DetailRow icon={FileText} label="Account Status" value={user.emailVerified ? 'Verified' : 'Not Verified'} />
             <DetailRow icon={User} label="User ID" value={user.uid} />
            <Separator />
             <div className="space-y-1 pt-2">
                <p className="text-sm font-medium text-muted-foreground">Organization Details</p>
            </div>
            {isNgo ? (
                <div className="space-y-4">
                    <DetailRow icon={Building} label="Organization Type" value={profile.ngoType} />
                    <DetailRow icon={FileText} label="Registration No." value={profile.registrationNumber} />
                    <DetailRow icon={Landmark} label="PAN" value={profile.pan} />
                    <DetailRow icon={Phone} label="Registered Address" value={profile.address} />
                    <DetailRow icon={Globe} label="Website" value={profile.website} />
                    <DetailRow icon={User} label="Key Contact" value={profile.keyPerson} />
                </div>
            ) : (
                 <div className="space-y-4">
                    <DetailRow icon={User} label="Your Role" value={buyerData.role} />
                    <DetailRow icon={Building} label="Department" value={buyerData.department} />
                    <DetailRow icon={Phone} label="Office Address" value={buyerData.address} />
                    <DetailRow icon={Globe} label="Company Website" value={buyerData.website} />
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
