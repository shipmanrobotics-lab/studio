'use client';

import { Download, Settings } from 'lucide-react';
import { useChat } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { ChatMessages } from '@/components/chat-messages';
import { ChatInput } from '@/components/chat-input';
import { SettingsPanel } from '@/components/settings-panel';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function ChatLayout() {
  const { messages, isLoading, addMessage, clearChat } = useChat();

  const handleExport = () => {
    const data = JSON.stringify(messages, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chattyface-history-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6 text-primary"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
          <h1 className="text-xl font-bold text-foreground font-headline">
            ChattyFace
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExport}
                  disabled={messages.length === 0}
                >
                  <Download className="size-5" />
                  <span className="sr-only">Export Conversation</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export Conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Sheet>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="size-5" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <SettingsPanel clearChat={clearChat} />
          </Sheet>
        </div>
      </header>
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={addMessage} isLoading={isLoading} />
    </div>
  );
}
