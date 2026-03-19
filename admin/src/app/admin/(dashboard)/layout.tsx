import { ReactNode } from 'react';

import { AppLayout } from '@/features/core/components/AppLayout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
