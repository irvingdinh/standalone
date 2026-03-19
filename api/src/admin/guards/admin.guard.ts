import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';

import { AdminEntity } from '../../core/entities/admin.entity';
import { AuthService } from '../services/auth.service';
import { RolesService } from '../services/roles.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const cookies = request.cookies as Record<string, string | undefined>;
    const accessToken = cookies.admin_access;
    const refreshToken = cookies.admin_refresh;

    // Scenario 1: No cookies at all
    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException();
    }

    // Try verifying the access token
    const accessPayload = accessToken
      ? this.authService.verifyToken(accessToken)
      : null;

    if (accessPayload) {
      // Scopes are embedded in the JWT at sign time and may become stale
      // if the admin's role changes before the token expires. This is
      // acceptable for an admin panel — the staleness window is bounded
      // by the access token TTL, and scopes are refreshed on token rotation.
      let adminScopes: string[] = accessPayload.scopes ?? [];

      // Scenario 6: Access valid but refresh near expiry — rotate both
      if (refreshToken && this.authService.isRefreshNearExpiry(refreshToken)) {
        const admin = await this.adminRepository.findOne({
          where: { id: accessPayload.sub },
          relations: ['role', 'role.scopes'],
        });

        if (!admin || admin.deletedAt !== null) {
          this.authService.clearCookies(response);
          throw new UnauthorizedException();
        }

        const scopes = this.rolesService.computeScopes(admin);
        adminScopes = scopes;

        this.authService.setAccessCookie(
          response,
          this.authService.signAccessToken(admin.id, scopes),
        );
        this.authService.setRefreshCookie(
          response,
          this.authService.signRefreshToken(admin.id, scopes),
        );
      }

      // Scenario 5: Both valid — continue
      (request as unknown as Record<string, unknown>).adminId =
        accessPayload.sub;
      (request as unknown as Record<string, unknown>).adminScopes = adminScopes;
      return true;
    }

    // Access token is missing or expired. Try refresh token.
    // Scenario 2: No refresh token
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const refreshPayload = this.authService.verifyToken(refreshToken);

    // Scenario 3: Refresh token also expired/invalid
    if (!refreshPayload) {
      this.authService.clearCookies(response);
      throw new UnauthorizedException();
    }

    // Scenario 4: Access expired + refresh valid — check isActive, refresh
    const admin = await this.adminRepository.findOne({
      where: { id: refreshPayload.sub },
      relations: ['role', 'role.scopes'],
    });

    if (!admin || admin.deletedAt !== null) {
      this.authService.clearCookies(response);
      throw new UnauthorizedException();
    }

    const scopes = this.rolesService.computeScopes(admin);

    this.authService.setAccessCookie(
      response,
      this.authService.signAccessToken(admin.id, scopes),
    );

    // Also rotate refresh if near expiry
    if (this.authService.isRefreshNearExpiry(refreshToken)) {
      this.authService.setRefreshCookie(
        response,
        this.authService.signRefreshToken(admin.id, scopes),
      );
    }

    (request as unknown as Record<string, unknown>).adminId =
      refreshPayload.sub;
    (request as unknown as Record<string, unknown>).adminScopes = scopes;
    return true;
  }
}
