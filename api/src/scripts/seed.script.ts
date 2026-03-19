import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

import { AppModule } from '../app.module';
import { AdminEntity } from '../core/entities/admin.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await seedAdmins(app);

  await app.close();
}

void bootstrap();

async function seedAdmins(app: INestApplication) {
  const dataSource = app.get(DataSource);
  const adminRepository = dataSource.getRepository(AdminEntity);

  const email = 'john.doe@example.com';
  const existing = await adminRepository.findOne({ where: { email } });

  if (existing) {
    console.log(`Admin "${email}" already exists, skipping.`);
  } else {
    const admin = adminRepository.create({
      email,
      passwordHash: await bcrypt.hash('password', 10),
    });
    await adminRepository.save(admin);
    console.log(`Admin "${email}" created.`);
  }
}
