# API (Nest + Drizzle)

## Migrations

After changing the Drizzle schema under `src/core/entities/`, generate SQL migrations from this directory (`api/`):

```bash
npx drizzle-kit generate
```

Optional migration name:

```bash
npx drizzle-kit generate --name <short-description>
```

Config: `drizzle.config.ts` (SQLite, output: `database/migrations`). The folder is tracked via `.gitkeep` until the first `drizzle-kit generate` run adds SQL and `meta/`.
