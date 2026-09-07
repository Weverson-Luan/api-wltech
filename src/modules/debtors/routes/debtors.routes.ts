import type { FastifyInstance } from 'fastify';
import { authenticate, requireRoles } from '@/plugins/jwt.js';
import { bulkCreateDebtorsController } from '@/modules/debtors/controllers/bulk-create-debtors.controller.js';
import { createDebtorController } from '@/modules/debtors/controllers/create-debtor.controller.js';
import { deleteDebtorController } from '@/modules/debtors/controllers/delete-debtor.controller.js';
import { getDebtorByIdController } from '@/modules/debtors/controllers/get-debtor-by-id.controller.js';
import { listDebtorsController } from '@/modules/debtors/controllers/list-debtors.controller.js';
import { updateDebtorController } from '@/modules/debtors/controllers/update-debtor.controller.js';


const bulkCreateDebtorsBodySchema = {
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: [
          'uuid',
          'name',
          'description',
          'amount',
          'principal_amount',
          'due_date',
          'status',
          'user_id_applicant',
          'user_id_owner',
        ],
        properties: {
          uuid: { type: 'string', minLength: 1 },
          name: { type: 'string', minLength: 1 },
          description: { type: 'string', minLength: 1 },
          amount: { type: 'number' },
          principal_amount: { type: 'number' },
          due_date: { type: 'string', minLength: 1 },
          status: { type: 'string', minLength: 1 },
          user_id_applicant: { type: 'integer', minimum: 1 },
          user_id_owner: { type: 'integer', minimum: 1 },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
} as const;

const createDebtorBodySchema = {
  type: 'object',
  required: [
    'name',
    'description',
    'amount',
    'principal_amount',
    'due_date',
    'status',
    'user_id_applicant',
    'user_id_owner',
  ],
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    amount: { type: 'number' },
    principal_amount: { type: 'number' },
    due_date: { type: 'string', minLength: 1 },
    status: { type: 'string', minLength: 1 },
    user_id_applicant: { type: 'integer', minimum: 1 },
    user_id_owner: { type: 'integer', minimum: 1 },
  },
  additionalProperties: false,
} as const;

const updateDebtorBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    amount: { type: 'number' },
    principal_amount: { type: 'number' },
    due_date: { type: 'string', minLength: 1 },
    status: { type: 'string', minLength: 1 },
    user_id_applicant: { type: 'integer', minimum: 1 },
    user_id_owner: { type: 'integer', minimum: 1 },
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

export async function debtorsModuleRoutes(app: FastifyInstance) {
  app.get('/debtors', listDebtorsController);

  app.post(
    '/debtors/bulk',
    {
      preHandler: [authenticate],
      schema: { body: bulkCreateDebtorsBodySchema },
    },
    bulkCreateDebtorsController,
  );

  app.get('/debtors/:id', { schema: { params: idParamsSchema } }, getDebtorByIdController);

  app.post(
    '/debtors',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { body: createDebtorBodySchema },
    },
    createDebtorController,
  );

  app.patch(
    '/debtors/:id',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { params: idParamsSchema, body: updateDebtorBodySchema },
    },
    updateDebtorController,
  );

  app.delete(
    '/debtors/:id',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { params: idParamsSchema },
    },
    deleteDebtorController,
  );
}
