"use server";
import { estimateCarbonCapture, EstimateCarbonCaptureInput } from '@/ai/flows/carbon-capture-estimation';
import { sendEmail } from '@/ai/flows/send-email';
import type { CarbonCredit, Project } from '@/lib/types';
import { generateCertificateHtml } from '@/lib/generate-certificate-html';

export async function getCarbonCaptureEstimation(input: EstimateCarbonCaptureInput) {
  try {
    const result = await estimateCarbonCapture(input);
    return result;
  } catch (error) {
    console.error('Error in Genkit flow:', error);
    throw new Error('Failed to get carbon capture estimation.');
  }
}

export async function sendCertificateEmailAction(
  credit: CarbonCredit,
  project: Project,
  buyerEmail: string
) {
  try {
    const certificateHtml = generateCertificateHtml(credit, project);

    const emailResult = await sendEmail({
      to: buyerEmail,
      subject: `Your Carbon Credit Certificate for ${credit.projectName}`,
      htmlBody: certificateHtml,
    });

    return emailResult;
  } catch (error) {
    console.error('Error sending certificate email:', error);
    return { success: false, error: 'Failed to send certificate email.' };
  }
}
