import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';
import { AdminEntity } from '../core/entities/admin.entity';
import { AdminRoleEntity } from '../core/entities/admin-role.entity';
import { AdminRoleScopeEntity } from '../core/entities/admin-role-scope.entity';
import { controllers } from './controllers';
import { guards } from './guards';
import { services } from './services';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([
      AdminEntity,
      AdminRoleEntity,
      AdminRoleScopeEntity,
    ]),
  ],
  controllers: [...controllers],
  providers: [...guards, ...services],
})
export class AdminModule {}
