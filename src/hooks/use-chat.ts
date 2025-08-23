'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Message, Conversation } from '@/lib/types';
import { getInitialMessage, getChatbotResponse } from '@/lib/actions';
import { useAuth } from './use-auth';

export function useChat() {
  const [messages, setMessages] = useState<Conversation>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersonaState] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const initialized = useRef(false);

  const getStorageKey = useCallback((type: 'history' | 'persona') => {
    if (!user) return null;
    return `chat_${type}_chrisrobot_${user.uid}`;
  }, [user]);

  useEffect(() => {
    if (!initialized.current && user) {
      initialized.current = true;
      const historyKey = getStorageKey('history');
      const personaKey = getStorageKey('persona');
      if (!historyKey || !personaKey) return;

      try {
        const storedHistory = localStorage.getItem(historyKey);
        const storedPersona = localStorage.getItem(personaKey);
        
        if (storedPersona) {
          setPersonaState(storedPersona);
        }

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
        localStorage.removeItem(historyKey); // Clear corrupted data
      }
    }
  }, [user, getStorageKey]);

  useEffect(() => {
    const historyKey = getStorageKey('history');
    if (messages.length > 0 && historyKey) {
      localStorage.setItem(historyKey, JSON.stringify(messages));
    }
  }, [messages, getStorageKey]);

  const setPersona = useCallback((newPersona: string) => {
    const personaKey = getStorageKey('persona');
    if (!personaKey) return;
    setPersonaState(newPersona);
    localStorage.setItem(personaKey, newPersona);
    toast({
      title: 'Persona Saved',
      description: 'Your chatbot persona has been updated.',
    });
  }, [getStorageKey, toast]);

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
          persona,
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
    [messages, toast, isLoading, persona]
  );

  const clearChat = useCallback(() => {
    const historyKey = getStorageKey('history');
    if (!historyKey) return;
    
    setIsLoading(true);
    localStorage.removeItem(historyKey);
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
  }, [toast, getStorageKey]);

  return { messages, isLoading, addMessage, clearChat, persona, setPersona };
}
