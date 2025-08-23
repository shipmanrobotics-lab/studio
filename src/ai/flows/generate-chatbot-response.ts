'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating chatbot responses based on user input.
 *
 * - generateChatbotResponse - A function that takes user input and returns a chatbot response.
 * - GenerateChatbotResponseInput - The input type for the generateChatbotResponse function.
 * - GenerateChatbotResponseOutput - The return type for the generateChatbotResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatbotResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to generate a response for.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
  })).optional().describe('The conversation history to provide context for the response.'),
  persona: z.string().optional().describe('The persona or system instructions for the chatbot.'),
});

export type GenerateChatbotResponseInput = z.infer<typeof GenerateChatbotResponseInputSchema>;

const GenerateChatbotResponseOutputSchema = z.object({
  chatbotResponse: z.string().describe('The chatbot response generated based on the user input.'),
});

export type GenerateChatbotResponseOutput = z.infer<typeof GenerateChatbotResponseOutputSchema>;

export async function generateChatbotResponse(input: GenerateChatbotResponseInput): Promise<GenerateChatbotResponseOutput> {
  return generateChatbotResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatbotResponsePrompt',
  input: {schema: GenerateChatbotResponseInputSchema},
  output: {schema: GenerateChatbotResponseOutputSchema},
  prompt: `{% if persona %}{{persona}}{% else %}You are a helpful chatbot.{% endif %} Generate a response to the user input based on the conversation history.

{% if conversationHistory %}
Conversation History:
{% each conversationHistory %}
{{this.role}}: {{this.content}}
{% endeach %}
{% endif %}

User Input: {{{userInput}}}

Chatbot Response:`, 
});

const generateChatbotResponseFlow = ai.defineFlow(
  {
    name: 'generateChatbotResponseFlow',
    inputSchema: GenerateChatbotResponseInputSchema,
    outputSchema: GenerateChatbotResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
