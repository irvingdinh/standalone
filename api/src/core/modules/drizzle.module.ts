import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Database from 'better-sqlite3';
import {
  type BetterSQLite3Database,
  drizzle,
} from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { existsSync } from 'fs';
import { join } from 'path';

import type { AppConfig } from '../config/config.js';
import * as schema from '../entities/index.js';

export const DRIZZLE = 'DRIZZLE';

export type DrizzleDB = BetterSQLite3Database<typeof schema>;

const SQLITE_FILENAME = 'database.sqlite';

function migrationsDir(): string {
  return join(__dirname, '..', '..', '..', 'database', 'migrations');
}

function migrateDrizzleDb(db: DrizzleDB, folder: string): void {
  if (existsSync(join(folder, 'meta', '_journal.json'))) {
    migrate(db, { migrationsFolder: folder });
  }
}

function createDrizzleDb(dbPath: string): DrizzleDB {
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');

  const db = drizzle(sqlite, { schema });
  migrateDrizzleDb(db, migrationsDir());
  return db;
}

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: (configService: ConfigService): DrizzleDB => {
        const config = configService.get<AppConfig>('root')!;
        const dbPath = join(config.dir.data, SQLITE_FILENAME);
        return createDrizzleDb(dbPath);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
