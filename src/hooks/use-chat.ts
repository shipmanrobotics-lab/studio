'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Message, Conversation } from '@/lib/types';
import { getInitialMessage, getChatbotResponse } from '@/lib/actions';

const STORAGE_KEY = 'chat_history_chattyface';

export function useChat() {
  const [messages, setMessages] = useState<Conversation>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      try {
        const storedHistory = localStorage.getItem(STORAGE_KEY);
        if (storedHistory) {
          setMessages(JSON.parse(storedHistory));
        } else {
          setIsLoading(true);
          getInitialMessage()
            .then((welcomeMessage) => {
              const botMessage: Message = {
                id: crypto.randomUUID(),
                role: 'bot',
                content: welcomeMessage,
              };
              setMessages([botMessage]);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      } catch (error) {
        console.error('Failed to parse chat history from localStorage', error);
        localStorage.removeItem(STORAGE_KEY); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const conversationHistory = newMessages.slice(-10).map((msg) => ({
          role: msg.role as 'user' | 'bot',
          content: msg.content,
        }));
        
        const botResponseContent = await getChatbotResponse({
          userInput: content,
          conversationHistory: conversationHistory.slice(0, -1),
        });
        const botMessage: Message = { id: crypto.randomUUID(), role: 'bot', content: botResponseContent };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        const errorMessage = 'Sorry, I encountered an error. Please try again.';
        const errorBotMessage: Message = { id: crypto.randomUUID(), role: 'bot', content: errorMessage };
        setMessages((prev) => [...prev, errorBotMessage]);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to get a response from the chatbot.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [messages, toast, isLoading]
  );

  const clearChat = useCallback(() => {
    setIsLoading(true);
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
    getInitialMessage()
      .then((welcomeMessage) => {
        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: 'bot',
          content: welcomeMessage,
        };
        setMessages([botMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    toast({
      title: 'Chat Cleared',
      description: 'The conversation history has been cleared.',
    });
  }, [toast]);

  return { messages, isLoading, addMessage, clearChat };
}
