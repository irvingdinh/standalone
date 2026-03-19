import type { AdminUser } from '@/features/auth/api';

export type AdminListItem = {
  id: string;
  email: string;
  displayName: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
  };
};

export type AdminRole = {
  id: string;
  name: string;
};

export async function fetchAdmins(): Promise<AdminListItem[]> {
  const res = await fetch('/api/admin/admins', { credentials: 'include' });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? 'Failed to fetch admins');
  }
  const json: { data: AdminListItem[] } = await res.json();
  return json.data;
}

export async function fetchAdmin(id: string): Promise<AdminUser> {
  const res = await fetch(`/api/admin/admins/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? 'Failed to fetch admin');
  }
  const json: { data: AdminUser } = await res.json();
  return json.data;
}

export async function fetchRoles(): Promise<AdminRole[]> {
  const res = await fetch('/api/admin/admins/roles', {
    credentials: 'include',
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? 'Failed to fetch roles');
  }
  const json: { data: AdminRole[] } = await res.json();
  return json.data;
}

export async function createAdmin(data: {
  email: string;
  displayName: string;
  password: string;
  roleId: string;
}): Promise<AdminUser> {
  const res = await fetch('/api/admin/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? 'Failed to create admin');
  }
  const json: { data: AdminUser } = await res.json();
  return json.data;
}

export async function updateAdmin(
  id: string,
  data: {
    email?: string;
    displayName?: string;
    password?: string;
    roleId?: string;
    deactivated?: boolean;
  },
): Promise<AdminUser> {
  const res = await fetch(`/api/admin/admins/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? 'Failed to update admin');
  }
  const json: { data: AdminUser } = await res.json();
  return json.data;
}
