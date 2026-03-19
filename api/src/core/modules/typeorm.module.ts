import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

import type { AppConfig } from '../config/config';
import { AdminEntity } from '../entities/admin.entity';
import { AdminRoleEntity } from '../entities/admin-role.entity';
import { AdminRoleScopeEntity } from '../entities/admin-role-scope.entity';

export const typeormForRoot = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const config = configService.get<AppConfig>('root')!;
    return {
      type: 'sqlite',
      database: join(config.dir.data, 'standalone.db'),
      entities: [AdminEntity, AdminRoleEntity, AdminRoleScopeEntity],
      synchronize: true,
    };
  },
  inject: [ConfigService],
});
