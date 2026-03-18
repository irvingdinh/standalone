import { ConfigModule } from '@nestjs/config';

import { config } from '../config/config.js';

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [config],
});
