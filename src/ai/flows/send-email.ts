'use server';

/**
 * @fileOverview A simulated email sending service.
 *
 * - sendEmail - A function that simulates sending an email.
 * - SendEmailInput - The input type for the sendEmail function.
 */

import { z } from 'zod';

const SendEmailInputSchema = z.object({
  to: z.string().email().describe('The email address of the recipient.'),
  subject: z.string().describe('The subject of the email.'),
  htmlBody: z.string().describe('The HTML content of the email body.'),
});
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

export async function sendEmail(input: SendEmailInput): Promise<{ success: boolean }> {
  // Mock implementation to avoid Genkit dependency issues
  console.log('====================================');
  console.log('📧 SIMULATING SENDING EMAIL 📧');
  console.log(`To: ${input.to}`);
  console.log(`Subject: ${input.subject}`);
  console.log('Body (HTML):');
  console.log(input.htmlBody);
  console.log('====================================');

  return { success: true };
}
