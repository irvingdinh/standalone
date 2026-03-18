import { ReactNode } from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import { AuthProvider } from '@/modules/auth/components/AuthProvider';
import { AppHeader } from '@/modules/core/components/AppLayout/AppHeader';
import { AppSidebar } from '@/modules/core/components/AppLayout/AppSidebar';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <AuthGuard>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  );
};
