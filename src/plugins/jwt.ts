import fastifyJwt from '@fastify/jwt';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { env } from '@/config/env.js';
import { failForbidden, failUnauthorized } from '@/lib/errors/http-error.js';

export async function registerJwt(app: FastifyInstance) {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  });
}

export async function authenticate(request: FastifyRequest) {
  try {
    await request.jwtVerify();
  } catch {
    failUnauthorized();
  }
}

export function requireRoles(...allowedRoles: string[]) {
  return async (request: FastifyRequest) => {
    if (!allowedRoles.includes(request.user.role_name)) {
      failForbidden();
    }
  };
}
