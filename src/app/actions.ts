"use server";
import { estimateCarbonCapture, EstimateCarbonCaptureInput } from '@/ai/flows/carbon-capture-estimation';

export async function getCarbonCaptureEstimation(input: EstimateCarbonCaptureInput) {
  try {
    const result = await estimateCarbonCapture(input);
    return result;
  } catch (error) {
    console.error('Error in Genkit flow:', error);
    throw new Error('Failed to get carbon capture estimation.');
  }
}
