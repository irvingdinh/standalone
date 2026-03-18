import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { UserSidebarMenu } from '@/modules/auth/components/UserSidebarMenu';

export const AppSidebar = () => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader />
      <SidebarContent />
      <UserSidebarMenu />
    </Sidebar>
  );
};
