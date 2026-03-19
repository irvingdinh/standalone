import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdminEntity } from '../../../core/entities/admin.entity';
import { AdminId } from '../../decorators';
import { AdminGuard } from '../../guards/admin.guard';

@Controller()
export class IndexController {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  @Get('/api/admin/auth')
  @UseGuards(AdminGuard)
  async session(@AdminId() adminId: string) {
    const admin = await this.adminRepository.findOneOrFail({
      where: { id: adminId },
    });

    return {
      data: {
        id: admin.id,
        email: admin.email,
        displayName: admin.displayName,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    };
  }
}
