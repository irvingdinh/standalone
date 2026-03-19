import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const AdminScopes = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string[] => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request as unknown as Record<string, unknown>)
      .adminScopes as string[];
  },
);
