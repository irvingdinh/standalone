'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useBreadcrumbs } from '@/features/core/components/BreadcrumbProvider';

import type { AdminListItem } from '../../api';
import { fetchAdmins } from '../../api';

export function AdminsListPage() {
  const [admins, setAdmins] = useState<AdminListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useBreadcrumbs([{ label: 'Admins' }]);

  useEffect(() => {
    fetchAdmins()
      .then(setAdmins)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Admins</h1>
        <Button render={<Link href="/admin/admins/create" />}>
          Create Admin
        </Button>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => {
              const isDeleted = admin.deletedAt !== null;
              return (
                <TableRow
                  key={admin.id}
                  className={isDeleted ? 'opacity-50' : ''}
                >
                  <TableCell>
                    <Link
                      href={`/admin/admins/edit?id=${admin.id}`}
                      className="hover:underline"
                    >
                      {admin.displayName}
                    </Link>
                    {isDeleted && (
                      <Badge variant="secondary" className="ml-2">
                        Deactivated
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.role.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
