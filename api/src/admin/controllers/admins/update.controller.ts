import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { AdminId, RequireScopes } from '../../decorators';
import { AdminGuard } from '../../guards/admin.guard';
import { ScopeGuard } from '../../guards/scope.guard';
import { AdminsService } from '../../services/admins.service';
import { RolesService } from '../../services/roles.service';

class UpdateAdminDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  roleId?: string;

  @IsOptional()
  @IsBoolean()
  deactivated?: boolean;
}

@Controller()
export class UpdateController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly rolesService: RolesService,
  ) {}

  @Put('/api/admin/admins/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard, ScopeGuard)
  @RequireScopes('admins:manage')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdminDto,
    @AdminId() adminId: string,
  ) {
    if (id === adminId) {
      throw new ForbiddenException(
        'Cannot edit your own account through this endpoint',
      );
    }

    const updateData: {
      email?: string;
      displayName?: string;
      password?: string;
      roleId?: string;
      deletedAt?: Date | null;
    } = {};

    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.displayName !== undefined) updateData.displayName = dto.displayName;
    if (dto.password !== undefined) updateData.password = dto.password;
    if (dto.roleId !== undefined) updateData.roleId = dto.roleId;
    if (dto.deactivated !== undefined) {
      updateData.deletedAt = dto.deactivated ? new Date() : null;
    }

    const admin = await this.adminsService.update(id, updateData);
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
