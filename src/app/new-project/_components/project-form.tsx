"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, Wand2, UploadCloud, CheckCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCarbonCaptureEstimation } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  projectName: z.string().min(5, "Project name must be at least 5 characters."),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  restorationType: z.enum(["Afforestation", "Reforestation", "Agroforestry"]),
  plantationDate: z.date({
    required_error: "A plantation date is required.",
  }),
  description: z.string().min(20, "Please provide a more detailed description."),
  documents: z.any().optional(), // In a real app, use a file validation library
});

type EstimationResult = {
  estimatedCarbonCapture: number;
  confidenceLevel: string;
  supportingData: string;
};

export function ProjectForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimationResult, setEstimationResult] =
    useState<EstimationResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      latitude: 0,
      longitude: 0,
      restorationType: "Reforestation",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      console.log(values);
      toast({
        title: "Project Submitted!",
        description: "Your project is now pending verification.",
        action: <CheckCircle className="text-green-500" />,
      });
      form.reset();
      setEstimationResult(null);
    });
  }

  const handleEstimate = async () => {
    const values = form.getValues();
    const { latitude, longitude, restorationType, plantationDate } = values;
    if (!plantationDate) {
      form.setError("plantationDate", { message: "Date is required for estimation." });
      return;
    }
    
    setIsEstimating(true);
    setEstimationResult(null);

    try {
      const result = await getCarbonCaptureEstimation({
        ndviData: 0.75, // Using mock satellite NDVI data
        restorationType,
        plantationDate: plantationDate.toISOString(),
        projectLocation: `${latitude}, ${longitude}`,
      });
      setEstimationResult(result);
    } catch (error) {
      console.error("Estimation failed:", error);
      toast({
        variant: "destructive",
        title: "Estimation Failed",
        description: "Could not generate carbon capture estimate.",
      });
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Coastal Mangrove Restoration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="-3.4653" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="-62.2159" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="restorationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restoration Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a restoration type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Reforestation">Reforestation</SelectItem>
                      <SelectItem value="Afforestation">Afforestation</SelectItem>
                      <SelectItem value="Agroforestry">Agroforestry</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plantationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Plantation Date</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1990-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the project goals, methods, and expected impact."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="documents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supporting Documents</FormLabel>
              <FormControl>
                 <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">CSV, PNG, JPG or PDF</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" {...field} />
                    </label>
                </div> 
              </FormControl>
              <FormDescription>Upload project plans, land deeds, or photos.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-headline">
              <Wand2 className="mr-2 h-5 w-5 text-accent" />
              AI Carbon Capture Estimation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use our AI tool to get a preliminary estimate of your project's carbon capture potential based on satellite data and NCCR guidelines.
            </p>
            <Button type="button" variant="outline" onClick={handleEstimate} disabled={isEstimating}>
              {isEstimating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Estimate
            </Button>
            {isEstimating && <p className="text-sm text-muted-foreground animate-pulse">Analyzing data... This may take a moment.</p>}
            {estimationResult && (
               <div className="p-4 rounded-md bg-secondary/50 border">
                 <h4 className="font-semibold mb-2">Estimation Result:</h4>
                 <p className="text-sm">
                   <strong>Est. Carbon Capture:</strong> {estimationResult.estimatedCarbonCapture.toFixed(2)} tonnes/hectare/year
                 </p>
                 <p className="text-sm">
                   <strong>Confidence Level:</strong> {estimationResult.confidenceLevel}
                 </p>
                 <p className="text-sm mt-2 text-muted-foreground">{estimationResult.supportingData}</p>
               </div>
            )}
          </CardContent>
        </Card>
        
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Project for Verification
        </Button>
      </form>
    </Form>
  );
}
