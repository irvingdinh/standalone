import { Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from '../../services/auth.service';

@Controller()
export class LogoutController {
  constructor(private readonly authService: AuthService) {}

  @Post('/api/admin/auth/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.clearCookies(res);
    return { message: 'Logged out' };
  }
}
