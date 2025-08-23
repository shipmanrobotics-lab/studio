'use server';

/**
 * @fileOverview Initializes the chatbot with a welcome message.
 *
 * - initializeChatbot - A function that returns a welcome message for new users.
 * - InitializeChatbotOutput - The return type for the initializeChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitializeChatbotOutputSchema = z.object({
  welcomeMessage: z.string().describe('A welcome message or initial prompt for the chatbot.'),
});
export type InitializeChatbotOutput = z.infer<typeof InitializeChatbotOutputSchema>;

export async function initializeChatbot(): Promise<InitializeChatbotOutput> {
  return initializeChatbotFlow();
}

const prompt = ai.definePrompt({
  name: 'initializeChatbotPrompt',
  output: {schema: InitializeChatbotOutputSchema},
  prompt: `You are a helpful chatbot. Generate a welcoming message or initial prompt for a new user to start a conversation.`,
});

const initializeChatbotFlow = ai.defineFlow(
  {
    name: 'initializeChatbotFlow',
    outputSchema: InitializeChatbotOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
