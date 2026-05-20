import type { FastifyInstance } from 'fastify';
import { authenticate, requireRoles } from '@/plugins/jwt.js';
import { createProjectController } from '@/modules/projects/controllers/create-project.controller.js';
import { deleteProjectController } from '@/modules/projects/controllers/delete-project.controller.js';
import { getProjectByIdController } from '@/modules/projects/controllers/get-project-by-id.controller.js';
import { listProjectsController } from '@/modules/projects/controllers/list-projects.controller.js';
import { updateProjectController } from '@/modules/projects/controllers/update-project.controller.js';

const tagsSchema = {
  type: 'array',
  minItems: 1,
  items: { type: 'string', minLength: 1 },
} as const;

const createProjectBodySchema = {
  type: 'object',
  required: ['name_project', 'sub_title', 'tags', 'description', 'foto_url'],
  properties: {
    name_project: { type: 'string', minLength: 1 },
    sub_title: { type: 'string', minLength: 1 },
    tags: tagsSchema,
    description: { type: 'string', minLength: 1 },
    foto_url: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;

const updateProjectBodySchema = {
  type: 'object',
  properties: {
    name_project: { type: 'string', minLength: 1 },
    sub_title: { type: 'string', minLength: 1 },
    tags: tagsSchema,
    description: { type: 'string', minLength: 1 },
    foto_url: { type: 'string', minLength: 1 },
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

export async function projectsModuleRoutes(app: FastifyInstance) {
  app.get('/projects', listProjectsController);

  app.get('/projects/:id', { schema: { params: idParamsSchema } }, getProjectByIdController);

  app.post(
    '/projects',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { body: createProjectBodySchema },
    },
    createProjectController,
  );

  app.patch(
    '/projects/:id',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { params: idParamsSchema, body: updateProjectBodySchema },
    },
    updateProjectController,
  );

  app.delete(
    '/projects/:id',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { params: idParamsSchema },
    },
    deleteProjectController,
  );
}
