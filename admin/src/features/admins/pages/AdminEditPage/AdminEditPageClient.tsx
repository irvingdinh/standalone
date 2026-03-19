'use client';

import { useSearchParams } from 'next/navigation';

import { AdminEditPage } from './AdminEditPage';

export function AdminEditPageClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <p className="text-muted-foreground text-sm">No admin ID provided.</p>
      </div>
    );
  }

  return <AdminEditPage adminId={id} />;
}
