'use client';

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
import { Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SettingsPanelProps {
  clearChat: () => void;
}

export function SettingsPanel({ clearChat }: SettingsPanelProps) {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Settings</SheetTitle>
        <SheetDescription>Adjust your chatbot preferences.</SheetDescription>
      </SheetHeader>
      <div className="py-4 space-y-6">
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
