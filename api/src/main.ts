import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import type { AppConfig } from './core/config/config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService).get<AppConfig>('root')!;
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(config.http.port, config.http.host);
}

void bootstrap();
