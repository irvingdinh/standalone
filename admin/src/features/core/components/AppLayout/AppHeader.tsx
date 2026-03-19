'use client';

import Link from 'next/link';
import { Fragment } from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useBreadcrumbItems } from '@/features/core/components/BreadcrumbProvider';

export const AppHeader = () => {
  const items = useBreadcrumbItems();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        {items.length > 0 && (
          <>
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {items.map((item, index) => {
                  const isLast = index === items.length - 1;
                  return (
                    <Fragment key={item.href ?? index}>
                      {index > 0 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                      <BreadcrumbItem
                        className={!isLast ? 'hidden md:block' : undefined}
                      >
                        {isLast || !item.href ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink render={<Link href={item.href} />}>
                            {item.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
      </div>

      <div className="ml-auto px-3">
        <div className="flex items-center gap-2 text-sm">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
