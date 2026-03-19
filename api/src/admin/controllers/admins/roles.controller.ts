import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdminRoleEntity } from '../../../core/entities/admin-role.entity';
import { RequireScopes } from '../../decorators';
import { AdminGuard } from '../../guards/admin.guard';
import { ScopeGuard } from '../../guards/scope.guard';

@Controller()
export class RolesController {
  constructor(
    @InjectRepository(AdminRoleEntity)
    private readonly roleRepository: Repository<AdminRoleEntity>,
  ) {}

  @Get('/api/admin/admins/roles')
  @UseGuards(AdminGuard, ScopeGuard)
  @RequireScopes('admins:manage')
  async index() {
    const roles = await this.roleRepository.find({ order: { name: 'ASC' } });
    return {
      data: roles.map((role) => ({
        id: role.id,
        name: role.name,
      })),
    };
  }
}
