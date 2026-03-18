import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';
import { AdminEntity } from '../core/entities/admin.entity';
import { controllers } from './controllers';
import { guards } from './guards';
import { services } from './services';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([AdminEntity])],
  controllers: [...controllers],
  providers: [...guards, ...services],
})
export class AdminModule {}
