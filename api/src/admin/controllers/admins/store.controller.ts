import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { RequireScopes } from '../../decorators';
import { AdminGuard } from '../../guards/admin.guard';
import { ScopeGuard } from '../../guards/scope.guard';
import { AdminsService } from '../../services/admins.service';
import { RolesService } from '../../services/roles.service';

class StoreAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  displayName: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}

@Controller()
export class StoreController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly rolesService: RolesService,
  ) {}

  @Post('/api/admin/admins')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard, ScopeGuard)
  @RequireScopes('admins:manage')
  async store(@Body() dto: StoreAdminDto) {
    const admin = await this.adminsService.create({
      email: dto.email,
      displayName: dto.displayName,
      password: dto.password,
      roleId: dto.roleId,
    });

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
