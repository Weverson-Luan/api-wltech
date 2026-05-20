import type { FastifyInstance } from 'fastify';
import { authenticate, requireRoles } from '@/plugins/jwt.js';
import { createUserController } from '@/modules/users/controllers/create-user.controller.js';
import { deleteUserController } from '@/modules/users/controllers/delete-user.controller.js';
import { getUserByIdController } from '@/modules/users/controllers/get-user-by-id.controller.js';
import { listUsersController } from '@/modules/users/controllers/list-users.controller.js';
import { updateUserController } from '@/modules/users/controllers/update-user.controller.js';

const createUserBodySchema = {
  type: 'object',
  required: ['name', 'email', 'password', 'role_id'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    role_id: { type: 'integer' },
  },
  additionalProperties: false,
} as const;

const updateUserBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    role_id: { type: 'integer' },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

const idParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', pattern: '^[0-9]+$' },
  },
} as const;

export async function usersModuleRoutes(app: FastifyInstance) {
  app.get(
    '/users',
    { preHandler: [authenticate, requireRoles('admin', 'manager')] },
    listUsersController,
  );

  app.get(
    '/users/:id',
    { preHandler: [authenticate], schema: { params: idParamsSchema } },
    getUserByIdController,
  );

  app.post(
    '/users',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { body: createUserBodySchema },
    },
    createUserController,
  );

  app.patch(
    '/users/:id',
    {
      preHandler: [authenticate],
      schema: { params: idParamsSchema, body: updateUserBodySchema },
    },
    updateUserController,
  );

  app.delete(
    '/users/:id',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { params: idParamsSchema },
    },
    deleteUserController,
  );
}
