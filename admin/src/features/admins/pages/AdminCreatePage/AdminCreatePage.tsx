'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBreadcrumbs } from '@/features/core/components/BreadcrumbProvider';
import {
  SettingsCard,
  SettingsCardContent,
  SettingsCardFooter,
  SettingsCardHeader,
  SettingsCardTitle,
} from '@/features/core/components/SettingsCard';

import type { AdminRole } from '../../api';
import { createAdmin, fetchRoles } from '../../api';

export function AdminCreatePage() {
  const router = useRouter();
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useBreadcrumbs([
    { label: 'Admins', href: '/admin/admins' },
    { label: 'Create' },
  ]);

  useEffect(() => {
    fetchRoles().then((data) => {
      setRoles(data);
      if (data.length > 0) setRoleId(data[0].id);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!roleId) {
      setError('Please select a role');
      return;
    }

    setIsSubmitting(true);

    try {
      const admin = await createAdmin({ email, displayName, password, roleId });
      toast.success('Admin created successfully');
      router.push(`/admin/admins/edit?id=${admin.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <form onSubmit={handleSubmit}>
          <SettingsCard>
            <SettingsCardHeader>
              <SettingsCardTitle>Create Admin</SettingsCardTitle>
            </SettingsCardHeader>
            <SettingsCardContent>
              <FieldGroup>
                {error && <FieldError>{error}</FieldError>}
                <Field>
                  <FieldLabel htmlFor="create-email">Email</FieldLabel>
                  <Input
                    id="create-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="create-displayName">
                    Display Name
                  </FieldLabel>
                  <Input
                    id="create-displayName"
                    name="displayName"
                    type="text"
                    required
                    maxLength={255}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="create-password">Password</FieldLabel>
                  <Input
                    id="create-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                </Field>
                <Field>
                  <FieldLabel>Role</FieldLabel>
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
                </Field>
              </FieldGroup>
            </SettingsCardContent>
            <SettingsCardFooter helperText="Password must be at least 8 characters.">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </SettingsCardFooter>
          </SettingsCard>
        </form>
      </div>
    </div>
  );
}
