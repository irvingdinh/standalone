'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardDescription,
  SettingsCardFooter,
  SettingsCardHeader,
  SettingsCardTitle,
} from '@/features/core/components/SettingsCard';

import { updateAdmin } from '../../api';

export function StatusToggle({
  adminId,
  initialDeactivated,
  onUpdated,
}: {
  adminId: string;
  initialDeactivated: boolean;
  onUpdated: () => void;
}) {
  const [deactivated, setDeactivated] = useState(initialDeactivated);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await updateAdmin(adminId, { deactivated });
      toast.success(
        deactivated
          ? 'Admin deactivated successfully'
          : 'Admin reactivated successfully',
      );
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SettingsCard>
        <SettingsCardHeader>
          <SettingsCardTitle>Account Status</SettingsCardTitle>
          <SettingsCardDescription>
            Deactivated admins cannot log in to the admin panel.
          </SettingsCardDescription>
        </SettingsCardHeader>
        <SettingsCardContent>
          <FieldGroup>
            {error && <FieldError>{error}</FieldError>}
            <label className="flex items-center gap-3">
              <Switch
                checked={deactivated}
                onCheckedChange={setDeactivated}
                disabled={isSubmitting}
              />
              <span className="text-sm">
                {deactivated ? 'Deactivated' : 'Active'}
              </span>
            </label>
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
