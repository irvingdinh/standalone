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

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
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
      // Scenario 6: Access valid but refresh near expiry — rotate both
      if (refreshToken && this.authService.isRefreshNearExpiry(refreshToken)) {
        const admin = await this.adminRepository.findOne({
          where: { id: accessPayload.sub },
        });

        if (!admin || !admin.isActive) {
          this.authService.clearCookies(response);
          throw new UnauthorizedException();
        }

        this.authService.setAccessCookie(
          response,
          this.authService.signAccessToken(admin.id),
        );
        this.authService.setRefreshCookie(
          response,
          this.authService.signRefreshToken(admin.id),
        );
      }

      // Scenario 5: Both valid — continue
      (request as unknown as Record<string, unknown>).adminId =
        accessPayload.sub;
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
    });

    if (!admin || !admin.isActive) {
      this.authService.clearCookies(response);
      throw new UnauthorizedException();
    }

    this.authService.setAccessCookie(
      response,
      this.authService.signAccessToken(admin.id),
    );

    // Also rotate refresh if near expiry
    if (this.authService.isRefreshNearExpiry(refreshToken)) {
      this.authService.setRefreshCookie(
        response,
        this.authService.signRefreshToken(admin.id),
      );
    }

    (request as unknown as Record<string, unknown>).adminId =
      refreshPayload.sub;
    return true;
  }
}
