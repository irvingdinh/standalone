import * as React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

function SettingsCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return <Card className={cn('gap-0', className)} {...props} />;
}

function SettingsCardHeader({
  className,
  ...props
}: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader className={cn('pb-2', className)} {...props} />;
}

function SettingsCardTitle(props: React.ComponentProps<typeof CardTitle>) {
  return <CardTitle {...props} />;
}

function SettingsCardDescription(
  props: React.ComponentProps<typeof CardDescription>,
) {
  return <CardDescription {...props} />;
}

function SettingsCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn('py-4', className)} {...props} />;
}

function SettingsCardFooter({
  className,
  children,
  helperText,
  ...props
}: React.ComponentProps<typeof CardFooter> & { helperText?: string }) {
  return (
    <CardFooter className={cn('justify-between gap-4', className)} {...props}>
      {helperText && (
        <p className="text-muted-foreground text-sm">{helperText}</p>
      )}
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </CardFooter>
  );
}

export {
  SettingsCard,
  SettingsCardContent,
  SettingsCardDescription,
  SettingsCardFooter,
  SettingsCardHeader,
  SettingsCardTitle,
};
