import { Module } from '@nestjs/common';

import { modules } from './modules/index.js';

@Module({
  imports: [...modules],
})
export class CoreModule {}
