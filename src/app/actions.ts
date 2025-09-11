"use server";
import { estimateCarbonCapture, EstimateCarbonCaptureInput } from '@/ai/flows/carbon-capture-estimation';
import { sendEmail } from '@/ai/flows/send-email';
import { Certificate } from '@/app/my-credits/_components/certificate';
import type { CarbonCredit, Project } from '@/lib/types';
import ReactDOMServer from 'react-dom/server';

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
    const enrichedCredit = {
      ...credit,
      locationName: project.locationName,
      ngoName: project.ngo.name,
    };

    const certificateHtml = ReactDOMServer.renderToString(
      <Certificate credit={enrichedCredit} />
    );

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
