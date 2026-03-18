import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, AdminModule],
})
export class AppModule {}
