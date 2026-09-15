import { existsSync } from 'node:fs';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

function required(name: string): string {
  const value = process.env[name];

  if (!value?.trim()) {
    throw new Error(`${name} is not set`);
  }

  return value.trim();
}

function validateDatabaseUrl(url: string): string {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  if (parsed.protocol !== 'postgresql:' && parsed.protocol !== 'postgres:') {
    throw new Error('DATABASE_URL must use the postgresql:// scheme');
  }

  const insideDocker = existsSync('/.dockerenv');

  if (parsed.hostname === 'postgres' && !insideDocker) {
    throw new Error(
      'DATABASE_URL uses host "postgres", which only resolves inside Docker. ' +
        'On your machine, set DATABASE_URL to @localhost:POSTGRES_PORT in .env, or run: pnpm db:migrate:docker',
    );
  }

  return url;
}

const databaseUrl = validateDatabaseUrl(required('DATABASE_URL'));

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
