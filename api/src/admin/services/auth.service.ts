import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import jwt from 'jsonwebtoken';

import type { AppConfig } from '../../core/config/config.js';

export interface AdminTokenPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  private readonly secret: string;
  private readonly accessTtl: number;
  private readonly refreshTtl: number;
  private readonly refreshRenewWindow: number;

  constructor(configService: ConfigService) {
    const config = configService.get<AppConfig>('root')!;
    this.secret = config.admin.jwt.secret;
    this.accessTtl = config.admin.jwt.accessTtlSeconds;
    this.refreshTtl = config.admin.jwt.refreshTtlSeconds;
    this.refreshRenewWindow = config.admin.jwt.refreshRenewWindowSeconds;
  }

  signAccessToken(adminId: string): string {
    return jwt.sign({ sub: adminId }, this.secret, {
      expiresIn: this.accessTtl,
    });
  }

  signRefreshToken(adminId: string): string {
    return jwt.sign({ sub: adminId }, this.secret, {
      expiresIn: this.refreshTtl,
    });
  }

  verifyToken(token: string): AdminTokenPayload | null {
    try {
      return jwt.verify(token, this.secret) as AdminTokenPayload;
    } catch {
      return null;
    }
  }

  isRefreshNearExpiry(token: string): boolean {
    const payload = this.verifyToken(token) as
      | (AdminTokenPayload & { exp?: number })
      | null;
    if (!payload?.exp) return false;
    const remaining = payload.exp - Math.floor(Date.now() / 1000);
    return remaining < this.refreshRenewWindow;
  }

  setAccessCookie(res: Response, token: string): void {
    res.cookie('admin_access', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: this.accessTtl * 1000,
    });
  }

  setRefreshCookie(res: Response, token: string): void {
    res.cookie('admin_refresh', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: this.refreshTtl * 1000,
    });
  }

  clearCookies(res: Response): void {
    res.clearCookie('admin_access', { path: '/' });
    res.clearCookie('admin_refresh', { path: '/' });
  }
}
