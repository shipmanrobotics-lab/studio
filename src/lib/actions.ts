'use server';

import {
  generateChatbotResponse,
  type GenerateChatbotResponseInput,
} from '@/ai/flows/generate-chatbot-response';
import { initializeChatbot } from '@/ai/flows/initialize-chatbot';

export async function getInitialMessage() {
  try {
    const { welcomeMessage } = await initializeChatbot();
    return welcomeMessage;
  } catch (error) {
    console.error('Error initializing chatbot:', error);
    return 'Hello! I seem to be having some trouble starting up. Please try again later.';
  }
}

export async function getChatbotResponse(input: GenerateChatbotResponseInput) {
  try {
    const { chatbotResponse } = await generateChatbotResponse(input);
    return chatbotResponse;
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Sorry, I encountered an error and cannot respond right now.';
  }
}
