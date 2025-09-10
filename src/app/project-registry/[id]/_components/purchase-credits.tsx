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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Project } from "@/lib/types";
import { useRouter } from "next/navigation";
import { PartyPopper } from "lucide-react";

export function PurchaseCredits({ project }: { project: Project }) {
  const [quantity, setQuantity] = useState(10);
  const [creditId, setCreditId] = useState("");
  const router = useRouter();
  
  const handlePurchase = () => {
    // Simulate credit ID generation
    const newCreditId = `BCC-${project.id.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    setCreditId(newCreditId);
    // In a real app, you would call an API here.
  };

  const handleViewCredits = () => {
    // Assuming a successful purchase, navigate to the credits page
    router.push('/my-credits');
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
          />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handlePurchase}>
              Purchase Credits
            </Button>
          </AlertDialogTrigger>
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
                A certificate has been generated for your records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogCancel>Close</AlertDialogCancel>
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
