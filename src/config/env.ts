function required(name: string): string {
  const value = process.env[name];

  if (!value?.trim()) {
    throw new Error(`${name} is not set`);
  }

  return value.trim();
}

function parsePort(value: string | undefined, fallback: number): number {
  const port = Number(value ?? fallback);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return port;
}

function validateDatabaseUrl(url: string): string {
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    throw new Error('DATABASE_URL must be a PostgreSQL connection string');
  }

  return url;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';

const DEFAULT_JWT_SECRET = 'altere-para-um-segredo-forte-em-producao';

function validateJwtSecret(secret: string): string {
  if (isProduction && secret === DEFAULT_JWT_SECRET) {
    throw new Error('JWT_SECRET must be changed in production');
  }

  if (isProduction && secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }

  return secret;
}

export const env = {
  NODE_ENV: nodeEnv,
  IS_PRODUCTION: isProduction,
  DATABASE_URL: validateDatabaseUrl(required('DATABASE_URL')),
  PORT: parsePort(process.env.PORT, 3333),
  HOST: process.env.HOST ?? '0.0.0.0',
  JWT_SECRET: validateJwtSecret(required('JWT_SECRET')),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
} as const;
