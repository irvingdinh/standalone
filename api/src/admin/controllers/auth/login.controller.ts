import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { IsEmail, IsString } from 'class-validator';
import type { Response } from 'express';
import { Repository } from 'typeorm';

import { AdminEntity } from '../../../core/entities/admin.entity';
import { AuthService } from '../../services/auth.service';
import { RolesService } from '../../services/roles.service';
import { AdminResponse } from '../../types/admin.type';

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@Controller()
export class LoginController {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
  ) {}

  @Post('/api/admin/auth/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AdminResponse> {
    const admin = await this.adminRepository.findOne({
      where: { email: dto.email },
      relations: ['role', 'role.scopes'],
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      admin.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const scopes = this.rolesService.computeScopes(admin);
    const accessToken = this.authService.signAccessToken(admin.id, scopes);
    const refreshToken = this.authService.signRefreshToken(admin.id, scopes);

    this.authService.setAccessCookie(res, accessToken);
    this.authService.setRefreshCookie(res, refreshToken);

    return {
      data: {
        id: admin.id,
        email: admin.email,
        displayName: admin.displayName,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        role: {
          id: admin.role.id,
          name: admin.role.name,
        },
        scopes,
      },
    };
  }
}
