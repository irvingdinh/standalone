import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { AdminEntity } from '../../core/entities/admin.entity';
import { AdminRoleEntity } from '../../core/entities/admin-role.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(AdminRoleEntity)
    private readonly roleRepository: Repository<AdminRoleEntity>,
  ) {}

  async findAll(): Promise<AdminEntity[]> {
    return this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .orderBy('role.name', 'ASC')
      .addOrderBy('admin.email', 'ASC')
      .addOrderBy('CASE WHEN admin.deleted_at IS NULL THEN 0 ELSE 1 END', 'ASC')
      .getMany();
  }

  async findById(id: string): Promise<AdminEntity> {
    return this.adminRepository.findOneOrFail({
      where: { id },
      relations: ['role', 'role.scopes'],
    });
  }

  async create(data: {
    email: string;
    displayName: string;
    password: string;
    roleId: string;
  }): Promise<AdminEntity> {
    await this.roleRepository.findOneOrFail({ where: { id: data.roleId } });

    const passwordHash = await bcrypt.hash(data.password, 10);
    const admin = this.adminRepository.create({
      email: data.email,
      displayName: data.displayName,
      passwordHash,
      roleId: data.roleId,
    });
    const saved = await this.adminRepository.save(admin);
    return this.findById(saved.id);
  }

  async update(
    id: string,
    data: {
      email?: string;
      displayName?: string;
      password?: string;
      roleId?: string;
      deletedAt?: Date | null;
    },
  ): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneOrFail({ where: { id } });

    if (data.email !== undefined) admin.email = data.email;
    if (data.displayName !== undefined) admin.displayName = data.displayName;
    if (data.password !== undefined) {
      admin.passwordHash = await bcrypt.hash(data.password, 10);
    }
    if (data.roleId !== undefined) {
      await this.roleRepository.findOneOrFail({ where: { id: data.roleId } });
      admin.roleId = data.roleId;
    }
    if (data.deletedAt !== undefined) admin.deletedAt = data.deletedAt;

    await this.adminRepository.save(admin);
    return this.findById(id);
  }
}
