'use client';

import { useTheme } from 'next-themes';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Monitor, Sun, Moon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SettingsPanelProps {
  clearChat: () => void;
}

export function SettingsPanel({ clearChat }: SettingsPanelProps) {
  const { setTheme, theme } = useTheme();

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Settings</SheetTitle>
        <SheetDescription>Adjust your chatbot preferences.</SheetDescription>
      </SheetHeader>
      <div className="py-4 space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger>
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="size-4" />
                  <span>Light</span>
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="size-4" />
                  <span>Dark</span>
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Monitor className="size-4" />
                  <span>System</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="ai-model">AI Model</Label>
          <Select defaultValue="gemini-2.0-flash" disabled>
            <SelectTrigger id="ai-model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.0-flash">
                Gemini 2.0 Flash (Default)
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Model selection is not yet available.
          </p>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Manage Conversation</Label>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={clearChat}
          >
            <Trash2 className="size-4" />
            Clear Chat History
          </Button>
          <p className="text-xs text-muted-foreground">
            This will permanently delete your current conversation.
          </p>
        </div>
      </div>
    </SheetContent>
  );
}
