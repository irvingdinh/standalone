'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AdminUser,
  checkSession,
  logout as logoutApi,
} from '@/features/auth/api';

export type AuthContextValue = {
  user: AdminUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  setUser: (user: AdminUser) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      router.replace('/admin/login');
    }
  }, [router]);

  const value = useMemo(
    () => ({ user, isLoading, logout, setUser }),
    [user, isLoading, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
