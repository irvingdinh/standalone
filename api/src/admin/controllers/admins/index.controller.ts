import { Controller, Get, UseGuards } from '@nestjs/common';

import { RequireScopes } from '../../decorators';
import { AdminGuard } from '../../guards/admin.guard';
import { ScopeGuard } from '../../guards/scope.guard';
import { AdminsService } from '../../services/admins.service';

@Controller()
export class IndexController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('/api/admin/admins')
  @UseGuards(AdminGuard, ScopeGuard)
  @RequireScopes('admins:manage')
  async index() {
    const admins = await this.adminsService.findAll();
    return {
      data: admins.map((admin) => ({
        id: admin.id,
        email: admin.email,
        displayName: admin.displayName,
        deletedAt: admin.deletedAt,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        role: {
          id: admin.role.id,
          name: admin.role.name,
        },
      })),
    };
  }
}
