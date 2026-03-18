import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module.js';
import { AdminEntity } from '../core/entities/admin.entity.js';
import { controllers } from './controllers/index.js';
import { guards } from './guards/index.js';
import { services } from './services/index.js';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([AdminEntity])],
  controllers: [...controllers],
  providers: [...guards, ...services],
})
export class AdminModule {}
