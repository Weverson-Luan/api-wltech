import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/plugins/jwt.js';
import { loginController } from '@/modules/auth/controllers/login.controller.js';
import { meController } from '@/modules/auth/controllers/me.controller.js';
import { registerController } from '@/modules/auth/controllers/register.controller.js';

const loginBodySchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;

const registerBodySchema = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
  additionalProperties: false,
} as const;

export async function authModuleRoutes(app: FastifyInstance) {
  app.post('/auth/login', { schema: { body: loginBodySchema } }, loginController);

  app.post('/auth/register', { schema: { body: registerBodySchema } }, registerController);

  app.get('/auth/me', { preHandler: [authenticate] }, meController);
}
