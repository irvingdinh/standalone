'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FieldError, FieldGroup } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardDescription,
  SettingsCardFooter,
  SettingsCardHeader,
  SettingsCardTitle,
} from '@/features/core/components/SettingsCard';

import type { AdminRole } from '../../api';
import { updateAdmin } from '../../api';

export function ChangeRoleForm({
  adminId,
  initialRoleId,
  roles,
  onUpdated,
}: {
  adminId: string;
  initialRoleId: string;
  roles: AdminRole[];
  onUpdated: () => void;
}) {
  const [roleId, setRoleId] = useState(initialRoleId);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await updateAdmin(adminId, { roleId });
      toast.success('Role updated successfully');
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SettingsCard>
        <SettingsCardHeader>
          <SettingsCardTitle>Role</SettingsCardTitle>
          <SettingsCardDescription>
            The role determines what permissions this admin has.
          </SettingsCardDescription>
        </SettingsCardHeader>
        <SettingsCardContent>
          <FieldGroup>
            {error && <FieldError>{error}</FieldError>}
            <Select
              value={roleId}
              onValueChange={(v) => v !== null && setRoleId(v)}
            >
              <SelectTrigger className="w-full" disabled={isSubmitting}>
                <SelectValue>
                  {roles.find((r) => r.id === roleId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldGroup>
        </SettingsCardContent>
        <SettingsCardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </SettingsCardFooter>
      </SettingsCard>
    </form>
  );
}
