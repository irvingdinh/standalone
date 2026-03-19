import { ReactNode } from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { AuthProvider } from '@/features/auth/components/AuthProvider';
import { AppHeader } from '@/features/core/components/AppLayout/AppHeader';
import { AppSidebar } from '@/features/core/components/AppLayout/AppSidebar';
import { BreadcrumbProvider } from '@/features/core/components/BreadcrumbProvider';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <AuthGuard>
        <BreadcrumbProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppHeader />
              <main>{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </BreadcrumbProvider>
      </AuthGuard>
    </AuthProvider>
  );
};
