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
  ) {}

  @Put('/api/admin/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @AdminId() adminId: string,
  ) {
    const admin = await this.adminRepository.findOneOrFail({
      where: { id: adminId },
    });

    admin.displayName = dto.displayName;
    await this.adminRepository.save(admin);

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
