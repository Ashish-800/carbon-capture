
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building, Globe, Mail, Phone, User, FileText, Landmark } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
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
  const userInitials = isNgo ? "NA" : "SL";

  // Mock data - in a real app, this would be fetched from a 'users' or 'organizations' collection in Firestore.
  const ngoData = {
    name: "Amazonas Alive",
    type: "Non-Governmental Organization",
    regNumber: "REG/2021/XYZ/123",
    pan: "ABCDE1234F",
    address: "123 Rainforest Lane, Manaus, Brazil",
    website: "https://amazonasalive.org",
    keyPerson: "Dr. Elena Vasquez",
  };

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
            <CardTitle className="font-headline text-2xl">{isNgo ? ngoData.name : buyerData.name}</CardTitle>
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
                    <DetailRow icon={Building} label="Organization Type" value={ngoData.type} />
                    <DetailRow icon={FileText} label="Registration No." value={ngoData.regNumber} />
                    <DetailRow icon={Landmark} label="PAN" value={ngoData.pan} />
                    <DetailRow icon={Phone} label="Registered Address" value={ngoData.address} />
                    <DetailRow icon={Globe} label="Website" value={ngoData.website} />
                    <DetailRow icon={User} label="Key Contact" value={ngoData.keyPerson} />
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
