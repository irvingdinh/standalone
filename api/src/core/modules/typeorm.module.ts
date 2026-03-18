import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

import type { AppConfig } from '../config/config.js';
import { AdminEntity } from '../entities/admin.entity.js';

export const typeormForRoot = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const config = configService.get<AppConfig>('root')!;
    return {
      type: 'sqlite',
      database: join(config.dir.data, 'standalone.db'),
      entities: [AdminEntity],
      synchronize: true,
    };
  },
  inject: [ConfigService],
});
