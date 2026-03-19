'use client';

import { usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';

import { BreadcrumbContext, BreadcrumbItem } from './BreadcrumbProvider';

export function useBreadcrumbs(items: BreadcrumbItem[]): void {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  const { setItems } = context;
  const pathname = usePathname();
  const serialized = JSON.stringify(items);

  useEffect(() => {
    setItems(JSON.parse(serialized), pathname);
  }, [serialized, setItems, pathname]);
}

export function useBreadcrumbItems(): BreadcrumbItem[] {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error(
      'useBreadcrumbItems must be used within a BreadcrumbProvider',
    );
  }
  const pathname = usePathname();
  if (context.state.pathname !== pathname) return [];
  return context.state.items;
}
