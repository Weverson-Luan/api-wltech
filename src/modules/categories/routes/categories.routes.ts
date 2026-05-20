import type { FastifyInstance } from 'fastify';
import { authenticate, requireRoles } from '@/plugins/jwt.js';
import { createCategoryController } from '@/modules/categories/controllers/create-category.controller.js';
import { deleteCategoryController } from '@/modules/categories/controllers/delete-category.controller.js';
import { getCategoryByIdController } from '@/modules/categories/controllers/get-category-by-id.controller.js';
import { listCategoriesController } from '@/modules/categories/controllers/list-categories.controller.js';
import { updateCategoryController } from '@/modules/categories/controllers/update-category.controller.js';

const createCategoryBodySchema = {
  type: 'object',
  required: ['name', 'description'],
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;

const updateCategoryBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
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

export async function categoriesModuleRoutes(app: FastifyInstance) {
  app.get('/categories', listCategoriesController);

  app.get('/categories/:id', { schema: { params: idParamsSchema } }, getCategoryByIdController);

  app.post(
    '/categories',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { body: createCategoryBodySchema },
    },
    createCategoryController,
  );

  app.patch(
    '/categories/:id',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { params: idParamsSchema, body: updateCategoryBodySchema },
    },
    updateCategoryController,
  );

  app.delete(
    '/categories/:id',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { params: idParamsSchema },
    },
    deleteCategoryController,
  );
}
