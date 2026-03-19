import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { REQUIRED_SCOPES_KEY } from '../decorators';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_SCOPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredScopes || requiredScopes.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const adminScopes = (request as unknown as Record<string, unknown>)
      .adminScopes as string[];

    const hasAllScopes = requiredScopes.every((scope) =>
      adminScopes.includes(scope),
    );

    if (!hasAllScopes) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
