import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Repository } from 'typeorm';

import { AdminEntity } from '../../../core/entities/admin.entity';
import { AdminId } from '../../decorators';
import { AdminGuard } from '../../guards/admin.guard';
import { RolesService } from '../../services/roles.service';
import { AdminResponse } from '../../types/admin.type';

class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  displayName: string;
}

@Controller()
export class UpdateController {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly rolesService: RolesService,
  ) {}

  @Put('/api/admin/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @AdminId() adminId: string,
  ): Promise<AdminResponse> {
    const admin = await this.adminRepository.findOneOrFail({
      where: { id: adminId },
      relations: ['role', 'role.scopes'],
    });

    admin.displayName = dto.displayName;
    await this.adminRepository.save(admin);

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
