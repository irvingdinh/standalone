'use client';

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/components/AuthProvider';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardDescription,
  SettingsCardHeader,
  SettingsCardTitle,
} from '@/features/core/components/SettingsCard';

import { ChangePasswordForm } from './ChangePasswordForm';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <SettingsCard>
          <SettingsCardHeader>
            <SettingsCardTitle>Email</SettingsCardTitle>
            <SettingsCardDescription>
              Your email address used to sign in.
            </SettingsCardDescription>
          </SettingsCardHeader>
          <SettingsCardContent>
            <FieldGroup>
              <Field>
                <FieldLabel className="sr-only" htmlFor="email">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                />
              </Field>
            </FieldGroup>
          </SettingsCardContent>
        </SettingsCard>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
