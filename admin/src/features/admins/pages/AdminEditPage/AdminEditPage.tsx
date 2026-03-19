'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import type { AdminUser } from '@/features/auth/api';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useBreadcrumbs } from '@/features/core/components/BreadcrumbProvider';

import type { AdminRole } from '../../api';
import { fetchAdmin, fetchRoles } from '../../api';
import { ChangePasswordForm } from './ChangePasswordForm';
import { ChangeRoleForm } from './ChangeRoleForm';
import { EditDisplayNameForm } from './EditDisplayNameForm';
import { EditEmailForm } from './EditEmailForm';
import { StatusToggle } from './StatusToggle';

export function AdminEditPage({ adminId }: { adminId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useBreadcrumbs([
    { label: 'Admins', href: '/admin/admins' },
    { label: admin?.displayName ?? 'Edit' },
  ]);

  useEffect(() => {
    if (user && adminId === user.id) {
      router.replace('/admin/profile');
      return;
    }

    Promise.all([fetchAdmin(adminId), fetchRoles()])
      .then(([adminData, rolesData]) => {
        setAdmin(adminData);
        setRoles(rolesData);
      })
      .finally(() => setIsLoading(false));
  }, [adminId, user, router]);

  const handleUpdated = useCallback(() => {
    fetchAdmin(adminId).then(setAdmin);
  }, [adminId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <p className="text-muted-foreground text-sm">Admin not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <EditEmailForm
          adminId={adminId}
          initialEmail={admin.email}
          onUpdated={handleUpdated}
        />
        <EditDisplayNameForm
          adminId={adminId}
          initialDisplayName={admin.displayName}
          onUpdated={handleUpdated}
        />
        <ChangePasswordForm adminId={adminId} />
        <ChangeRoleForm
          adminId={adminId}
          initialRoleId={admin.role.id}
          roles={roles}
          onUpdated={handleUpdated}
        />
        <StatusToggle
          adminId={adminId}
          initialDeactivated={admin.deletedAt !== null}
          onUpdated={handleUpdated}
        />
      </div>
    </div>
  );
}
