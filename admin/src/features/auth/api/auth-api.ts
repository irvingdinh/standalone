export type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type AdminUserResponse = {
  data: AdminUser;
};

export async function checkSession(): Promise<AdminUser> {
  const res = await fetch('/api/admin/auth', { credentials: 'include' });
  if (!res.ok) throw new Error('Unauthorized');
  const json: AdminUserResponse = await res.json();
  return json.data;
}

export async function login(
  email: string,
  password: string,
): Promise<AdminUser> {
  const res = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid credentials');
    throw new Error('Login failed');
  }
  const json: AdminUserResponse = await res.json();
  return json.data;
}

export async function logout(): Promise<void> {
  await fetch('/api/admin/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}
