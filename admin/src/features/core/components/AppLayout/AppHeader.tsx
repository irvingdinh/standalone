import { ModeToggle } from '@/components/mode-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const AppHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
      <SidebarTrigger />
      <ModeToggle />
    </header>
  );
};
