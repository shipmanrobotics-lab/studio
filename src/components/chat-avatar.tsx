'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChatAvatar({ role }: { role: 'user' | 'bot' }) {
  return (
    <Avatar className="size-8">
      {role === 'bot' ? (
        <>
          <AvatarImage src="/bot-avatar.png" alt="Bot" />
          <AvatarFallback
            className={cn(
              'bg-primary text-primary-foreground',
            )}
          >
            <Bot className="size-5" />
          </AvatarFallback>
        </>
      ) : (
        <>
          <AvatarImage src="/user-avatar.png" alt="User" />
          <AvatarFallback
            className={cn(
              'bg-accent text-accent-foreground',
            )}
          >
            <User className="size-5" />
          </AvatarFallback>
        </>
      )}
    </Avatar>
  );
}
