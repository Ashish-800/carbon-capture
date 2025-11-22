
"use server";
import { revalidatePath } from "next/cache";
import { estimateCarbonCapture, EstimateCarbonCaptureInput } from '@/ai/flows/carbon-capture-estimation';
import { sendEmail } from '@/ai/flows/send-email';
import type { CarbonCredit, Project, UserProfile } from '@/lib/types';
import { generateCertificateHtml } from '@/lib/generate-certificate-html';
import { addProject, addUserProfile } from "@/lib/db";

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

type CreateProjectData = Omit<Project, 'id' | 'status' | 'imageUrl' | 'imageHint' | 'ngo' | 'creditsAvailable' | 'ndvi' | 'estimatedCarbonCapture'> & {
  imageDataUrl: string;
};

export async function createProjectAction(projectData: CreateProjectData) {
  try {
    // TODO: In a production environment, fetch NGO details from the authenticated user's session.
    // For this prototype, we are using a mock NGO profile.
    const ngoDetails = {
      id: "ngo_amazonas_alive",
      name: "Amazonas Alive",
      logoUrl: "https://picsum.photos/seed/ngo_logo/32/32"
    };

    // Mocking some data that would normally be calculated or assigned post-verification
    const newProjectData: Omit<Project, 'id'> = {
      name: projectData.name,
      location: projectData.location,
      locationName: projectData.locationName,
      restorationType: projectData.restorationType,
      plantationDate: projectData.plantationDate,
      description: projectData.description,
      ngo: ngoDetails,
      status: 'Pending Verification',
      imageUrl: projectData.imageDataUrl, // Use the uploaded image data URL
      imageHint: 'restoration project', // Generic hint for user-uploaded images
      // Default values for fields that are determined later in the process
      creditsAvailable: 0,
      ndvi: 0.65, // Using a mock average NDVI
      estimatedCarbonCapture: 15, // Using a mock average,
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

export async function completeNgoOnboardingAction(userId: string, data: any) {
  try {
    const userProfile: Omit<UserProfile, 'id'> = {
      email: data.email,
      role: 'ngo',
      displayName: data.ngoName,
      ngoType: data.ngoType,
      registrationNumber: data.registrationNumber,
      pan: data.pan,
      address: data.registeredAddress,
      website: data.website,
      keyPerson: data.keyPersonName,
    };
    await addUserProfile(userId, userProfile);
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error("Error completing NGO onboarding:", error);
    return { success: false, error: "Failed to save profile information." };
  }
}

export async function completeBuyerOnboardingAction(userId: string, data: any) {
  try {
    const userProfile: Omit<UserProfile, 'id'> = {
      email: data.corporateEmail,
      role: 'buyer',
      displayName: data.companyName,
      companyType: data.companyType,
      cin: data.cin,
      incorporationDate: data.incorporationDate,
      address: data.registeredAddress,
      pan: data.companyPan,
      gstNumber: data.gstNumber,
      industry: data.industry,
      phone: data.corporatePhone,
      website: data.website,
      keyPerson: data.authPersonName,
      authPersonDesignation: data.authPersonDesignation,
      authPersonEmail: data.authPersonEmail,
      authPersonPhone: data.authPersonPhone,
    };
    await addUserProfile(userId, userProfile);
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error("Error completing Buyer onboarding:", error);
    return { success: false, error: "Failed to save profile information." };
  }
}
