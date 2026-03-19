import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdminEntity } from '../../../core/entities/admin.entity';
import { AdminId } from '../../decorators';
import { AdminGuard } from '../../guards/admin.guard';
import { RolesService } from '../../services/roles.service';
import { AdminResponse } from '../../types/admin.type';

@Controller()
export class IndexController {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly rolesService: RolesService,
  ) {}

  @Get('/api/admin/auth')
  @UseGuards(AdminGuard)
  async session(@AdminId() adminId: string): Promise<AdminResponse> {
    const admin = await this.adminRepository.findOneOrFail({
      where: { id: adminId },
      relations: ['role', 'role.scopes'],
    });

    const scopes = this.rolesService.computeScopes(admin);

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
