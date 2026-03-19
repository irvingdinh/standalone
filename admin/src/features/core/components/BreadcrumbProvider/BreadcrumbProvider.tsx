'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbState = {
  items: BreadcrumbItem[];
  pathname: string | null;
};

export type BreadcrumbContextValue = {
  state: BreadcrumbState;
  setItems: (items: BreadcrumbItem[], pathname: string) => void;
};

export const BreadcrumbContext = createContext<
  BreadcrumbContextValue | undefined
>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BreadcrumbState>({
    items: [],
    pathname: null,
  });

  const setItems = useCallback((items: BreadcrumbItem[], pathname: string) => {
    setState({ items, pathname });
  }, []);

  const value = useMemo(() => ({ state, setItems }), [state, setItems]);

  return <BreadcrumbContext value={value}>{children}</BreadcrumbContext>;
}
