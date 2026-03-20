import { defineConfig } from 'drizzle-kit';
import { homedir } from 'os';
import { join } from 'path';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/core/entities/index.ts',
  out: './database/migrations',
  dbCredentials: {
    url: join(
      process.env.DATA_DIR || join(homedir(), '.standalone'),
      'database.sqlite',
    ),
  },
});
