import { mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface AppConfig {
  http: {
    host: string;
    port: number;
  };
  dir: {
    data: string;
  };
  admin: {
    jwt: {
      secret: string;
      accessTtlSeconds: number;
      refreshTtlSeconds: number;
      refreshRenewWindowSeconds: number;
    };
  };
}

function ensureDataDir(): string {
  const dir = process.env.DATA_DIR || join(homedir(), '.standalone');
  mkdirSync(dir, { recursive: true });
  return dir;
}

export const config = (): { root: AppConfig } => ({
  root: {
    http: {
      host: process.env.HOST || '127.0.0.1',
      port: parseInt(process.env.PORT || '25710', 10),
    },
    dir: {
      data: ensureDataDir(),
    },
    admin: {
      jwt: {
        secret: process.env.ADMIN_JWT_SECRET || 'admin-jwt-secret',
        accessTtlSeconds: 5 * 60,
        refreshTtlSeconds: 30 * 24 * 60 * 60,
        refreshRenewWindowSeconds: 7 * 24 * 60 * 60,
      },
    },
  },
});
