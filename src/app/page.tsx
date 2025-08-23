'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import ChatLayout from '@/components/chat-layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col h-full bg-background p-4 gap-4">
        <Skeleton className="h-14 w-full" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-16 w-3/4 ml-auto rounded-lg" />
          <Skeleton className="h-24 w-3/4 rounded-lg" />
          <Skeleton className="h-12 w-3/4 ml-auto rounded-lg" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return <ChatLayout />;
}
