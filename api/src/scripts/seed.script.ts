import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

import { AppModule } from '../app.module.js';
import { AdminEntity } from '../core/entities/admin.entity.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await seedAdmins(app);

  await app.close();
}

void bootstrap();

async function seedAdmins(app: INestApplication) {
  const dataSource = app.get(DataSource);
  const adminRepository = dataSource.getRepository(AdminEntity);

  const email = 'irving@standalone.local';
  const existing = await adminRepository.findOne({ where: { email } });

  if (existing) {
    console.log(`Admin "${email}" already exists, skipping.`);
  } else {
    const admin = adminRepository.create({
      email,
      passwordHash: await bcrypt.hash('letmein', 10),
    });
    await adminRepository.save(admin);
    console.log(`Admin "${email}" created.`);
  }
}
