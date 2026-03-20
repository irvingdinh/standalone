import { Module } from '@nestjs/common';

import { CoreModule } from '../core/core.module';
import { repositories } from './repositories';

@Module({
  imports: [CoreModule],
  providers: [...repositories],
  exports: [...repositories],
})
export class AdminModule {}
