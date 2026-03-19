import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

import { AppModule } from '../app.module';
import { AdminEntity } from '../core/entities/admin.entity';
import { AdminRoleEntity } from '../core/entities/admin-role.entity';
import { AdminRoleScopeEntity } from '../core/entities/admin-role-scope.entity';

const SUPER_ADMIN_ROLE_ID = '00000000-0000-0000-0000-000000000000';
const ADMIN_ROLE_ID = '00000000-0000-0000-0000-000000000001';
const ADMINS_MANAGE_SCOPE_ID = '00000000-0000-0000-0000-000000000000';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await seedRoles(app);
  await seedRoleScopes(app);
  await seedAdmins(app);

  await app.close();
}

void bootstrap();

async function seedRoles(app: INestApplication) {
  const dataSource = app.get(DataSource);
  const roleRepository = dataSource.getRepository(AdminRoleEntity);

  const roles = [
    { id: SUPER_ADMIN_ROLE_ID, name: 'Super Admin' },
    { id: ADMIN_ROLE_ID, name: 'Admin' },
  ];

  for (const roleData of roles) {
    const existing = await roleRepository.findOne({
      where: { id: roleData.id },
    });

    if (existing) {
      console.log(`Role "${roleData.name}" already exists, skipping.`);
    } else {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`Role "${roleData.name}" created.`);
    }
  }
}

async function seedRoleScopes(app: INestApplication) {
  const dataSource = app.get(DataSource);
  const scopeRepository = dataSource.getRepository(AdminRoleScopeEntity);

  const scopes = [
    {
      id: ADMINS_MANAGE_SCOPE_ID,
      scope: 'admins:manage',
      roleId: SUPER_ADMIN_ROLE_ID,
    },
  ];

  for (const scopeData of scopes) {
    const existing = await scopeRepository.findOne({
      where: { id: scopeData.id },
    });

    if (existing) {
      console.log(`Scope "${scopeData.scope}" already exists, skipping.`);
    } else {
      const scope = scopeRepository.create(scopeData);
      await scopeRepository.save(scope);
      console.log(`Scope "${scopeData.scope}" created for role.`);
    }
  }
}

async function seedAdmins(app: INestApplication) {
  const dataSource = app.get(DataSource);
  const adminRepository = dataSource.getRepository(AdminEntity);

  const admins = [
    {
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      password: 'password',
      roleId: SUPER_ADMIN_ROLE_ID,
    },
    {
      email: 'jane.doe@example.com',
      displayName: 'Jane Doe',
      password: 'password',
      roleId: ADMIN_ROLE_ID,
    },
  ];

  for (const adminData of admins) {
    const existing = await adminRepository.findOne({
      where: { email: adminData.email },
    });

    if (existing) {
      console.log(`Admin "${adminData.email}" already exists, skipping.`);
    } else {
      const admin = adminRepository.create({
        email: adminData.email,
        displayName: adminData.displayName,
        passwordHash: await bcrypt.hash(adminData.password, 10),
        roleId: adminData.roleId,
      });
      await adminRepository.save(admin);
      console.log(`Admin "${adminData.email}" created.`);
    }
  }
}
