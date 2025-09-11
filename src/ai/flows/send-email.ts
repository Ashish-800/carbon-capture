'use server';

/**
 * @fileOverview A simulated email sending service.
 *
 * - sendEmail - A function that simulates sending an email.
 * - SendEmailInput - The input type for the sendEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendEmailInputSchema = z.object({
  to: z.string().email().describe('The email address of the recipient.'),
  subject: z.string().describe('The subject of the email.'),
  htmlBody: z.string().describe('The HTML content of the email body.'),
});
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

export async function sendEmail(input: SendEmailInput): Promise<{ success: boolean }> {
  return sendEmailFlow(input);
}

const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: SendEmailInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    // In a real application, you would integrate with an email service provider
    // like SendGrid, Resend, or AWS SES here.
    // For this prototype, we will just log the email to the console.
    console.log('====================================');
    console.log('📧 SIMULATING SENDING EMAIL 📧');
    console.log(`To: ${input.to}`);
    console.log(`Subject: ${input.subject}`);
    console.log('Body (HTML):');
    console.log(input.htmlBody);
    console.log('====================================');
    
    // We'll assume the email was sent successfully.
    return { success: true };
  }
);
