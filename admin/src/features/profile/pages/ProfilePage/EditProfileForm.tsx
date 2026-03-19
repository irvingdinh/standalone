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
import { useAuth } from '@/features/auth/components/AuthProvider';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardDescription,
  SettingsCardFooter,
  SettingsCardHeader,
  SettingsCardTitle,
} from '@/features/core/components/SettingsCard';
import { updateProfile } from '@/features/profile/api';

export function EditProfileForm() {
  const { user, setUser } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const updatedUser = await updateProfile(displayName);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
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
            Your name as shown across the admin panel.
          </SettingsCardDescription>
        </SettingsCardHeader>
        <SettingsCardContent>
          <FieldGroup>
            {error && <FieldError>{error}</FieldError>}
            <Field>
              <FieldLabel className="sr-only" htmlFor="displayName">
                Display Name
              </FieldLabel>
              <Input
                id="displayName"
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
