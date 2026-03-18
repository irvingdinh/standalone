import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module.js';
import { CoreModule } from './core/core.module.js';

@Module({
  imports: [CoreModule, AdminModule],
})
export class AppModule {}
