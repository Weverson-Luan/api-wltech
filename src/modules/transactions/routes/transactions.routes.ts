import type { FastifyInstance } from 'fastify';
import { authenticate, requireRoles } from '@/plugins/jwt.js';
import { bulkCreateTransactionsController } from '@/modules/transactions/controllers/bulk-create-transactions.controller.js';
import { createTransactionController } from '@/modules/transactions/controllers/create-transaction.controller.js';
import { deleteTransactionController } from '@/modules/transactions/controllers/delete-transaction.controller.js';
import { getTransactionByIdController } from '@/modules/transactions/controllers/get-transaction-by-id.controller.js';
import { listTransactionsController } from '@/modules/transactions/controllers/list-transactions.controller.js';
import { updateTransactionController } from '@/modules/transactions/controllers/update-transaction.controller.js';


const bulkCreateTransactionsBodySchema = {
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: ['uuid', 'user_id', 'type', 'amount', 'category_id', 'payment_method', 'date'],
        properties: {
          uuid: { type: 'string', minLength: 1 },
          user_id: { type: 'integer', minimum: 1 },
          type: { type: 'string', minLength: 1 },
          amount: { type: 'number' },
          category_id: { type: 'integer', minimum: 1 },
          payment_method: { type: 'string', minLength: 1 },
          date: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          notes: { type: ['string', 'null'] },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
} as const;

const createTransactionBodySchema = {
  type: 'object',
  required: ['user_id', 'type', 'amount', 'category_id', 'payment_method', 'date'],
  properties: {
    user_id: { type: 'integer', minimum: 1 },
    type: { type: 'string', minLength: 1 },
    amount: { type: 'number' },
    category_id: { type: 'integer', minimum: 1 },
    payment_method: { type: 'string', minLength: 1 },
    date: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    notes: { type: ['string', 'null'] },
  },
  additionalProperties: false,
} as const;

const updateTransactionBodySchema = {
  type: 'object',
  properties: {
    user_id: { type: 'integer', minimum: 1 },
    type: { type: 'string', minLength: 1 },
    amount: { type: 'number' },
    category_id: { type: 'integer', minimum: 1 },
    payment_method: { type: 'string', minLength: 1 },
    date: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    notes: { type: ['string', 'null'] },
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

export async function transactionsModuleRoutes(app: FastifyInstance) {
  app.get('/transactions', listTransactionsController);

  app.post(
    '/transactions/bulk',
    {
      preHandler: [authenticate],
      schema: { body: bulkCreateTransactionsBodySchema },
    },
    bulkCreateTransactionsController,
  );

  app.get(
    '/transactions/:id',
    { schema: { params: idParamsSchema } },
    getTransactionByIdController,
  );

  app.post(
    '/transactions',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { body: createTransactionBodySchema },
    },
    createTransactionController,
  );

  app.patch(
    '/transactions/:id',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { params: idParamsSchema, body: updateTransactionBodySchema },
    },
    updateTransactionController,
  );

  app.delete(
    '/transactions/:id',
    {
      preHandler: [authenticate, requireRoles('admin')],
      schema: { params: idParamsSchema },
    },
    deleteTransactionController,
  );
}
