'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/lib/types';
import { ChatAvatar } from '@/components/chat-avatar';

interface ChatMessagesProps {
  messages: Conversation;
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-6 sm:p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-3 animate-in fade-in-20 slide-in-from-bottom-4 duration-300 ease-out',
              {
                'justify-end': message.role === 'user',
              }
            )}
          >
            {message.role === 'bot' && <ChatAvatar role="bot" />}
            <div
              className={cn(
                'max-w-[80%] rounded-lg p-3 text-sm shadow-md',
                {
                  'bg-card text-card-foreground': message.role === 'bot',
                  'bg-primary text-primary-foreground': message.role === 'user',
                }
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && <ChatAvatar role="user" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 animate-in fade-in-20">
            <ChatAvatar role="bot" />
            <div className="bg-card rounded-lg p-3 shadow-md">
              <div className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0s]"></span>
                <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
