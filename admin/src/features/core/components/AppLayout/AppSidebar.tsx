'use client';

import { Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { UserSidebarMenu } from '@/features/auth/components/UserSidebarMenu';

export const AppSidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const hasAdminsManage = user?.scopes.includes('admins:manage') ?? false;

  return (
    <Sidebar variant="inset">
      <SidebarHeader />
      <SidebarContent>
        {hasAdminsManage && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/admin/admins" />}
                    isActive={pathname.startsWith('/admin/admins')}
                  >
                    <Users />
                    Admins
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <UserSidebarMenu />
    </Sidebar>
  );
};
