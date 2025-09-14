
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
import { completeBuyerOnboardingAction } from "@/app/actions";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const fileSchema = z.any()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => !file || ACCEPTED_FILE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .pdf files are accepted."
  ).optional();

const formSchema = z.object({
  // Step 1: Basic Info
  companyName: z.string().min(3, "Company Name is required"),
  companyType: z.enum(["Private Limited", "Public Limited", "LLP", "Partnership", "Other"]),
  cin: z.string().length(21, "CIN must be 21 characters").optional().or(z.literal('')),
  incorporationDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  registeredAddress: z.string().min(10, "Registered address is required"),
  companyPan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  gstNumber: z.string().optional(),
  industry: z.string().min(3, "Industry sector is required"),

  // Step 2: Contact
  corporateEmail: z.string().email(),
  corporatePhone: z.string().min(10, "A valid phone number is required"),
  website: z.string().url().optional().or(z.literal('')),

  // Step 3: Authorized Person
  authPersonName: z.string().min(3, "Name is required"),
  authPersonDesignation: z.string().min(2, "Designation is required"),
  authPersonEmail: z.string().email(),
  authPersonPhone: z.string().min(10, "Contact number is required"),

  // Step 4: Documents (simplified for now)
  certificateOfIncorporation: fileSchema,
  companyPanCard: fileSchema,
  authLetter: fileSchema,
});

const steps = [
    { id: 1, title: "Company Information", fields: ["companyName", "companyType", "cin", "incorporationDate", "registeredAddress", "companyPan", "gstNumber", "industry"] },
    { id: 2, title: "Contact Details", fields: ["corporateEmail", "corporatePhone", "website"] },
    { id: 3, title: "Authorized Personnel", fields: ["authPersonName", "authPersonDesignation", "authPersonEmail", "authPersonPhone"] },
    { id: 4, title: "Document Upload", fields: ["certificateOfIncorporation", "companyPanCard", "authLetter"] },
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


export function BuyerDetailsForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyType: "Private Limited",
      cin: "",
      incorporationDate: "",
      registeredAddress: "",
      companyPan: "",
      gstNumber: "",
      industry: "",
      corporateEmail: user?.email || "",
      corporatePhone: "",
      website: "",
      authPersonName: "",
      authPersonDesignation: "",
      authPersonEmail: "",
      authPersonPhone: "",
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
            toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to submit this form." });
            return;
        }
        
        // Exclude file fields as we are not handling uploads yet
        const { certificateOfIncorporation, companyPanCard, authLetter, ...formData } = values;

        const result = await completeBuyerOnboardingAction(user.uid, formData);

        if (result.success) {
            toast({ title: "Profile Submitted!", description: "Your company details have been submitted for verification.", action: <CheckCircle className="text-green-500" /> });
            router.push('/buyer-dashboard');
        } else {
             toast({ variant: "destructive", title: "Submission Failed", description: result.error });
        }
    });
  }
  
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Corporate Buyer Profile Submission</CardTitle>
          <CardDescription>Please provide the following details for your company's verification.</CardDescription>
           <Progress value={progress} className="w-full mt-4" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 0 && (
                     <div className="space-y-4">
                        <FormField control={form.control} name="companyName" render={({ field }) => (
                            <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="companyType" render={({ field }) => (
                            <FormItem><FormLabel>Type of Company</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Private Limited">Private Limited</SelectItem>
                                        <SelectItem value="Public Limited">Public Limited</SelectItem>
                                        <SelectItem value="LLP">LLP</SelectItem>
                                        <SelectItem value="Partnership">Partnership</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )} />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField control={form.control} name="cin" render={({ field }) => (
                                <FormItem><FormLabel>Corporate Identification Number (CIN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="incorporationDate" render={({ field }) => (
                                <FormItem><FormLabel>Date of Incorporation</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                         </div>
                        <FormField control={form.control} name="registeredAddress" render={({ field }) => (
                            <FormItem><FormLabel>Registered Office Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField control={form.control} name="companyPan" render={({ field }) => (
                                <FormItem><FormLabel>Corporate PAN</FormLabel><FormControl><Input placeholder="ABCDE1234F" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="gstNumber" render={({ field }) => (
                                <FormItem><FormLabel>GST Number (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="industry" render={({ field }) => (
                            <FormItem><FormLabel>Industry / Sector</FormLabel><FormControl><Input placeholder="e.g., Information Technology" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                )}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="corporateEmail" render={({ field }) => (
                                <FormItem><FormLabel>Corporate Email</FormLabel><FormControl><Input type="email" {...field} disabled /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="corporatePhone" render={({ field }) => (
                                <FormItem><FormLabel>Corporate Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="website" render={({ field }) => (
                            <FormItem><FormLabel>Website / Social Media</FormLabel><FormControl><Input placeholder="https://" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField control={form.control} name="authPersonName" render={({ field }) => (
                                <FormItem><FormLabel>Authorized Person's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="authPersonDesignation" render={({ field }) => (
                                <FormItem><FormLabel>Designation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField control={form.control} name="authPersonEmail" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="authPersonPhone" render={({ field }) => (
                                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                         </div>
                    </div>
                )}
                {currentStep === 3 && (
                     <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Please upload the following documents for verification. You can proceed without them for now and upload later from your profile.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FileUploadField name="certificateOfIncorporation" label="Certificate of Incorporation" control={form.control} />
                            <FileUploadField name="companyPanCard" label="Company PAN Card" control={form.control} />
                            <FileUploadField name="authLetter" label="Board Resolution / Auth. Letter" control={form.control} />
                        </div>
                    </div>
                )}

              <div className="flex justify-between items-center pt-4">
                  {currentStep > 0 ? (
                      <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                          <ArrowLeft className="mr-2" /> Previous
                      </Button>
                  ) : <div></div>}
                  {currentStep < steps.length - 1 ? (
                        <Button type="button" onClick={nextStep}>
                          Next <ArrowRight className="ml-2" />
                      </Button>
                  ) : (
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
