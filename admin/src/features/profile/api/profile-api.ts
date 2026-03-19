export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const res = await fetch('/api/admin/auth/change-password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? 'Failed to change password');
  }
}
