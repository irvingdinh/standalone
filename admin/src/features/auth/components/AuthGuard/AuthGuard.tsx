'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/features/auth/components/AuthProvider';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const redirect =
        pathname !== '/admin'
          ? `?redirect=${encodeURIComponent(pathname)}`
          : '';
      router.replace(`/admin/login${redirect}`);
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh w-full">
        <Skeleton className="hidden w-64 md:block" />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
