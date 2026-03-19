import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { RequireScopes } from '../../decorators';
import { AdminGuard } from '../../guards/admin.guard';
import { ScopeGuard } from '../../guards/scope.guard';
import { AdminsService } from '../../services/admins.service';
import { RolesService } from '../../services/roles.service';

@Controller()
export class ShowController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly rolesService: RolesService,
  ) {}

  @Get('/api/admin/admins/:id')
  @UseGuards(AdminGuard, ScopeGuard)
  @RequireScopes('admins:manage')
  async show(@Param('id') id: string) {
    const admin = await this.adminsService.findById(id);
    const scopes = this.rolesService.computeScopes(admin);
    return {
      data: {
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
        scopes,
      },
    };
  }
}
