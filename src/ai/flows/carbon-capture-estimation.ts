'use server';

/**
 * @fileOverview Carbon capture estimation flow using satellite-derived NDVI data and NCCR guidelines.
 *
 * - estimateCarbonCapture - A function that estimates carbon capture potential.
 * - EstimateCarbonCaptureInput - The input type for the estimateCarbonCapture function.
 * - EstimateCarbonCaptureOutput - The return type for the estimateCarbonCapture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateCarbonCaptureInputSchema = z.object({
  ndviData: z
    .number()
    .describe('The Normalized Difference Vegetation Index (NDVI) data for the project area.'),
  restorationType: z
    .string()
    .describe(
      'The type of restoration project, e.g., afforestation, reforestation, or agroforestry.'
    ),
  plantationDate: z.string().describe('The date of plantation in ISO format (YYYY-MM-DD).'),
  projectLocation: z
    .string()
    .describe('The location of the project, including latitude and longitude.'),
});
export type EstimateCarbonCaptureInput = z.infer<typeof EstimateCarbonCaptureInputSchema>;

const EstimateCarbonCaptureOutputSchema = z.object({
  estimatedCarbonCapture: z
    .number()
    .describe('The estimated carbon capture potential in tonnes per hectare per year.'),
  confidenceLevel: z
    .string()
    .describe('The confidence level of the estimation (e.g., High, Medium, Low).'),
  supportingData: z
    .string()
    .describe('A summary of the data and methodology used for the estimation.'),
});
export type EstimateCarbonCaptureOutput = z.infer<typeof EstimateCarbonCaptureOutputSchema>;

export async function estimateCarbonCapture(
  input: EstimateCarbonCaptureInput
): Promise<EstimateCarbonCaptureOutput> {
  return estimateCarbonCaptureFlow(input);
}

const estimateCarbonCapturePrompt = ai.definePrompt({
  name: 'estimateCarbonCapturePrompt',
  input: {schema: EstimateCarbonCaptureInputSchema},
  output: {
    format: 'json',
    schema: EstimateCarbonCaptureOutputSchema,
  },
  prompt: `You are an expert in carbon capture estimation, using satellite-derived NDVI data and NCCR (National Carbon Accounting Report) guidelines.

  Based on the following information, estimate the carbon capture potential of the project.

  NDVI Data: {{{ndviData}}}
  Restoration Type: {{{restorationType}}}
  Plantation Date: {{{plantationDate}}}
  Project Location: {{{projectLocation}}}

  Consider the NCCR guidelines and the specific characteristics of the restoration type to provide an accurate estimation.

  Provide the estimated carbon capture potential in tonnes per hectare per year, a confidence level for the estimation, and a summary of the data and methodology used.
  
  Please provide the output in the following JSON format:
  
  {
    "estimatedCarbonCapture": <number>,
    "confidenceLevel": "<High|Medium|Low>",
    "supportingData": "<string>"
  }
`,
});

const estimateCarbonCaptureFlow = ai.defineFlow(
  {
    name: 'estimateCarbonCaptureFlow',
    inputSchema: EstimateCarbonCaptureInputSchema,
    outputSchema: EstimateCarbonCaptureOutputSchema,
  },
  async input => {
    const {output} = await estimateCarbonCapturePrompt(input);
    return output!;
  }
);
