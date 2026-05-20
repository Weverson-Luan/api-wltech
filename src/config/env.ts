function required(name: string): string {
  const value = process.env[name];

  if (!value?.trim()) {
    throw new Error(`${name} is not set`);
  }

  return value.trim();
}

export const env = {
  DATABASE_URL: required('DATABASE_URL'),
  PORT: Number(process.env.PORT ?? 3333),
  HOST: process.env.HOST ?? '0.0.0.0',
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
} as const;
