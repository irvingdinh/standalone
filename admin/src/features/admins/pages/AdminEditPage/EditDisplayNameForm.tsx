'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardDescription,
  SettingsCardFooter,
  SettingsCardHeader,
  SettingsCardTitle,
} from '@/features/core/components/SettingsCard';

import { updateAdmin } from '../../api';

export function EditDisplayNameForm({
  adminId,
  initialDisplayName,
  onUpdated,
}: {
  adminId: string;
  initialDisplayName: string;
  onUpdated: () => void;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await updateAdmin(adminId, { displayName });
      toast.success('Display name updated successfully');
      onUpdated();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update display name',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SettingsCard>
        <SettingsCardHeader>
          <SettingsCardTitle>Display Name</SettingsCardTitle>
          <SettingsCardDescription>
            The name shown across the admin panel.
          </SettingsCardDescription>
        </SettingsCardHeader>
        <SettingsCardContent>
          <FieldGroup>
            {error && <FieldError>{error}</FieldError>}
            <Field>
              <FieldLabel className="sr-only" htmlFor="admin-displayName">
                Display Name
              </FieldLabel>
              <Input
                id="admin-displayName"
                name="displayName"
                type="text"
                required
                maxLength={255}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isSubmitting}
              />
            </Field>
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
