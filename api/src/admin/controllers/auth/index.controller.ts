import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { Repository } from 'typeorm';

import { AdminEntity } from '../../../core/entities/admin.entity';
import { AdminGuard } from '../../guards/admin.guard';

@Controller()
export class IndexController {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  @Get('/api/admin/auth')
  @UseGuards(AdminGuard)
  async session(@Req() req: Request) {
    const adminId = (req as unknown as Record<string, unknown>)
      .adminId as string;
    const admin = await this.adminRepository.findOneOrFail({
      where: { id: adminId },
    });

    return {
      data: {
        id: admin.id,
        email: admin.email,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    };
  }
}
