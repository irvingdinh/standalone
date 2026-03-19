import { AppLayout } from '@/features/core/components/AppLayout';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';

export default function Page() {
  return (
    <AppLayout>
      <ProfilePage />
    </AppLayout>
  );
}
