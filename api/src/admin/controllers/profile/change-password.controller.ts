import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { IsString, MinLength } from 'class-validator';
import type { Request } from 'express';
import { Repository } from 'typeorm';

import { AdminEntity } from '../../../core/entities/admin.entity';
import { AdminGuard } from '../../guards/admin.guard';

class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}

@Controller()
export class ChangePasswordController {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  @Put('/api/admin/auth/change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async changePassword(@Body() dto: ChangePasswordDto, @Req() req: Request) {
    const adminId = (req as unknown as Record<string, unknown>)
      .adminId as string;
    const admin = await this.adminRepository.findOneOrFail({
      where: { id: adminId },
    });

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      admin.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    admin.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.adminRepository.save(admin);

    return {
      data: { message: 'Password changed successfully' },
    };
  }
}
