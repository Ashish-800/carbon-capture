"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Project } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Loader2, PartyPopper } from "lucide-react";
import { sendCertificateEmailAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

export function PurchaseCredits({ project }: { project: Project }) {
  const [quantity, setQuantity] = useState(10);
  const [creditId, setCreditId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlePurchase = async () => {
    setIsPurchasing(true);
    // Simulate credit ID generation and API call
    const newCreditId = `BCC-${project.id.toUpperCase()}-${Date.now().toString().slice(-6)}`;

    // In a real app, you would get the buyer's email from their session.
    // For this prototype, we'll use a mock email.
    const buyerEmail = 'lead@globaltech.com';
    const buyerName = 'Sustainability Lead';

    const creditData = {
      id: newCreditId,
      projectId: project.id,
      projectName: project.name,
      buyer: buyerName,
      buyerId: 'mock-buyer-id-123', // Added mock buyer ID
      purchaseDate: new Date(),
      tonnesCO2: quantity,
    };

    try {
      await sendCertificateEmailAction(creditData, project, buyerEmail);
      setCreditId(newCreditId);
      setIsDialogOpen(true);
      toast({
        title: "Email Sent!",
        description: "Your certificate has been sent to your email.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Email Failed",
        description: "Could not send the certificate email.",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleViewCredits = () => {
    setIsDialogOpen(false);
    router.push('/my-credits');
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  }

  return (
    <Card className="bg-gradient-to-br from-secondary/30 to-background">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Purchase Carbon Credits</CardTitle>
        <CardDescription>
          Directly support this project and offset your carbon footprint.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (Tonnes of CO₂)</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            max={project.creditsAvailable}
            disabled={isPurchasing}
          />
        </div>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handlePurchase} disabled={isPurchasing}>
            {isPurchasing && <Loader2 className="mr-2 animate-spin" />}
            Purchase Credits
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <PartyPopper className="h-6 w-6 text-green-600" />
              </div>
              <AlertDialogTitle className="text-center font-headline">Purchase Successful!</AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                You have successfully purchased {quantity} carbon credits from the project "{project.name}".
                <br /><br />
                Your unique Credit Token ID is:
                <p className="font-mono text-primary bg-secondary p-2 rounded-md my-2 text-sm">{creditId}</p>
                A certificate has been generated and sent to your email for your records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogCancel onClick={handleCloseDialog}>Close</AlertDialogCancel>
              <AlertDialogAction onClick={handleViewCredits}>
                View My Credits
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="text-xs text-center text-muted-foreground">
          This is a simulated transaction. No real payment is required.
        </p>
      </CardContent>
    </Card>
  );
}
