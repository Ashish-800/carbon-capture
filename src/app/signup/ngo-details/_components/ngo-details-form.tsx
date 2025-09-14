
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Loader2, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { completeNgoOnboardingAction } from "@/app/actions";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const fileSchema = z.any()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .pdf files are accepted."
  ).optional();

const formSchema = z.object({
  // Step 1
  ngoName: z.string().min(3, "NGO Name is required"),
  ngoType: z.enum(["Trust", "Society", "Section 8 Company", "Other"]),
  registrationNumber: z.string().min(1, "Registration number is required"),
  registrationDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  registrationAct: z.string().min(3, "Act of registration is required"),
  
  // Step 2
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  taxDeductionAccount: z.string().optional(),
  fcraNumber: z.string().optional(),
  registrationCertificate: fileSchema,
  trustDeed: fileSchema,
  ngoPanCard: fileSchema,

  // Step 3
  registeredAddress: z.string().min(10, "Registered address is required"),
  addressProof: fileSchema,
  mailingAddress: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10, "A valid phone number is required"),
  website: z.string().url().optional().or(z.literal('')),

  // Step 4
  keyPersonName: z.string().min(3, "Key person's name is required"),
  keyPersonDesignation: z.string().min(2, "Designation is required"),
  keyPersonContact: z.string().min(10, "Contact number is required"),
  keyPersonIdProof: fileSchema,
});

const steps = [
    { id: 1, title: "Basic Information", fields: ["ngoName", "ngoType", "registrationNumber", "registrationDate", "registrationAct"] },
    { id: 2, title: "Legal & Tax", fields: ["pan", "taxDeductionAccount", "fcraNumber", "registrationCertificate", "trustDeed", "ngoPanCard"] },
    { id: 3, title: "Address & Contact", fields: ["registeredAddress", "addressProof", "mailingAddress", "email", "phone", "website"] },
    { id: 4, title: "Key Personnel", fields: ["keyPersonName", "keyPersonDesignation", "keyPersonContact", "keyPersonIdProof"] },
];

const FileUploadField = ({ name, label, control }: { name: keyof z.infer<typeof formSchema>, label: string, control: any }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                     <div className="flex items-center justify-center w-full">
                        <label htmlFor={name} className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-6 h-6 mb-2 text-muted-foreground" />
                            {field.value?.name ? (
                                <p className="text-xs text-green-600 font-semibold">{field.value.name}</p>
                            ) : (
                                <>
                                    <p className="mb-1 text-xs text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG (MAX. 5MB)</p>
                                </>
                            )}
                        </div>
                        <Input id={name} type="file" className="hidden" onChange={(e) => field.onChange(e.target.files?.[0])} />
                        </label>
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export function NgoDetailsForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ngoName: "",
      ngoType: "Trust",
      registrationNumber: "",
      registrationDate: "",
      registrationAct: "",
      pan: "",
      taxDeductionAccount: "",
      fcraNumber: "",
      registeredAddress: "",
      mailingAddress: "",
      email: user?.email || "",
      phone: "",
      website: "",
      keyPersonName: "",
      keyPersonDesignation: "",
      keyPersonContact: "",
    },
  });

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as (keyof z.infer<typeof formSchema>)[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
        setCurrentStep(step => step + 1);
    }
  };

  const prevStep = () => {
      if (currentStep > 0) {
          setCurrentStep(step => step - 1);
      }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Authentication Error",
                description: "You must be logged in to submit this form.",
            });
            return;
        }

        // We are not handling file uploads yet, so we'll exclude file fields.
        const { registrationCertificate, trustDeed, ngoPanCard, addressProof, keyPersonIdProof, ...formData } = values;

        const result = await completeNgoOnboardingAction(user.uid, formData);

        if (result.success) {
            toast({
                title: "Profile Submitted!",
                description: "Your NGO details have been submitted for verification.",
                action: <CheckCircle className="text-green-500" />,
            });
            router.push('/ngo-dashboard');
        } else {
             toast({
                variant: "destructive",
                title: "Submission Failed",
                description: result.error,
            });
        }
    });
  }
  
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>NGO Profile Submission</CardTitle>
          <CardDescription>Please provide the following details for verification.</CardDescription>
           <Progress value={progress} className="w-full mt-4" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 0 && (
                    <div className="space-y-4">
                      <FormField control={form.control} name="ngoName" render={({ field }) => (
                          <FormItem><FormLabel>NGO Name (as per registration certificate)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="ngoType" render={({ field }) => (
                          <FormItem><FormLabel>Type of NGO</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="Trust">Trust</SelectItem>
                                      <SelectItem value="Society">Society</SelectItem>
                                      <SelectItem value="Section 8 Company">Section 8 Company</SelectItem>
                                      <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                              </Select>
                          <FormMessage /></FormItem>
                      )} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="registrationNumber" render={({ field }) => (
                              <FormItem><FormLabel>Registration Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="registrationDate" render={({ field }) => (
                              <FormItem><FormLabel>Registration Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                      </div>
                        <FormField control={form.control} name="registrationAct" render={({ field }) => (
                          <FormItem><FormLabel>Act under which registered</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                )}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="pan" render={({ field }) => (
                              <FormItem><FormLabel>PAN of NGO</FormLabel><FormControl><Input placeholder="ABCDE1234F" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name="taxDeductionAccount" render={({ field }) => (
                              <FormItem><FormLabel>12A / 80G Details (if applicable)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                      <FormField control={form.control} name="fcraNumber" render={({ field }) => (
                              <FormItem><FormLabel>FCRA Number (if applicable)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <FileUploadField name="registrationCertificate" label="Registration Certificate" control={form.control} />
                          <FileUploadField name="trustDeed" label="Trust Deed / MoA" control={form.control} />
                          <FileUploadField name="ngoPanCard" label="NGO PAN Card" control={form.control} />
                      </div>
                    </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-4">
                        <FormField control={form.control} name="registeredAddress" render={({ field }) => (
                          <FormItem><FormLabel>Registered Office Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                        <FileUploadField name="addressProof" label="Office Address Proof" control={form.control} />
                      <FormField control={form.control} name="mailingAddress" render={({ field }) => (
                          <FormItem><FormLabel>Mailing Address (if different)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem><FormLabel>Official Email</FormLabel><FormControl><Input type="email" {...field} disabled /></FormControl><FormMessage /></FormItem>
                          )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem><FormLabel>Official Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name="website" render={({ field }) => (
                          <FormItem><FormLabel>Website / Social Media</FormLabel><FormControl><Input placeholder="https://" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                  </div>
                )}
                {currentStep === 3 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="keyPersonName" render={({ field }) => (
                              <FormItem><FormLabel>Founder / President Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                            <FormField control={form.control} name="keyPersonDesignation" render={({ field }) => (
                              <FormItem><FormLabel>Designation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                      </div>
                      <FormField control={form.control} name="keyPersonContact" render={({ field }) => (
                          <FormItem><FormLabel>Contact Details (Phone)</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FileUploadField name="keyPersonIdProof" label="Identity & Address Proof of Member" control={form.control} />
                  </div>
                )}

              <div className="flex justify-between items-center pt-4">
                  {currentStep > 0 && (
                      <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                          <ArrowLeft className="mr-2" /> Previous
                      </Button>
                  )}
                  <div className="flex-grow"></div>
                  {currentStep < steps.length - 1 && (
                        <Button type="button" onClick={nextStep}>
                          Next <ArrowRight className="ml-2" />
                      </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                          Submit for Verification
                      </Button>
                  )}
              </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
