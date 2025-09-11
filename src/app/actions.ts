"use server";
import { revalidatePath } from "next/cache";
import { estimateCarbonCapture, EstimateCarbonCaptureInput } from '@/ai/flows/carbon-capture-estimation';
import { sendEmail } from '@/ai/flows/send-email';
import type { CarbonCredit, Project } from '@/lib/types';
import { generateCertificateHtml } from '@/lib/generate-certificate-html';
import { addProject } from "@/lib/db";

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

export async function createProjectAction(projectData: Omit<Project, 'id' | 'status' | 'imageUrl' | 'imageHint' | 'ngo' | 'creditsAvailable' | 'ndvi' | 'estimatedCarbonCapture'>) {
    try {
        // In a real app, NGO details would come from the user's session.
        const ngoDetails = {
            id: "ngo_amazonas_alive",
            name: "Amazonas Alive",
            logoUrl: "https://picsum.photos/seed/ngo_logo/32/32"
        };
        
        // Mocking some data that would normally be calculated or assigned post-verification
        const newProjectData: Omit<Project, 'id'> = {
            ...projectData,
            ngo: ngoDetails,
            status: 'Pending Verification',
            // Assign a random placeholder image for now
            imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
            imageHint: 'forest',
            // Default values for fields that are determined later in the process
            creditsAvailable: 0,
            ndvi: 0.65, // Using a mock average NDVI
            estimatedCarbonCapture: 15, // Using a mock average
        };

        const newProject = await addProject(newProjectData);
        
        // Revalidate the dashboard path to show the new project
        revalidatePath('/ngo-dashboard');
        
        return { success: true, project: newProject };

    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, error: "Failed to create project." };
    }
}
