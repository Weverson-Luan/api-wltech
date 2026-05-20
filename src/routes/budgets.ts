import type { FastifyInstance } from 'fastify';
import { desc } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { budgets } from '@/db/schema/budgets.js';
import { failValidation } from '@/lib/errors/http-error.js';
import {
  sanitizeCreateBudget,
  validateCreateBudget,
  type CreateBudgetBody,
} from '@/lib/validators/budget.js';

const budgetBodySchema = {
  type: 'object',
  required: [
    'name',
    'email',
    'phone',
    'name_app',
    'description_project',
    'platform',
    'delivery_time',
    'main_features',
    'budget_available',
  ],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string', minLength: 8 },
    name_app: { type: 'string', minLength: 1 },
    description_project: { type: 'string', minLength: 1 },
    platform: { type: 'string', minLength: 1 },
    delivery_time: { type: 'string', minLength: 1 },
    main_features: { type: 'string', minLength: 1 },
    budget_available: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;

export async function budgetsRoutes(app: FastifyInstance) {
  app.get('/budgets', async () => {
    return db.select().from(budgets).orderBy(desc(budgets.created_at));
  });

  app.post(
    '/budgets',
    { schema: { body: budgetBodySchema } },
    async (request, reply) => {
      const rawBody = request.body as CreateBudgetBody;
      const errors = validateCreateBudget(rawBody);

      if (errors.length > 0) {
        failValidation(
          'Verifique os dados do orçamento e tente novamente.',
          errors,
          'Orçamento inválido',
        );
      }

      const body = sanitizeCreateBudget(rawBody);

      const [created] = await db
        .insert(budgets)
        .values({
          name: body.name,
          email: body.email,
          phone: body.phone,
          name_app: body.name_app,
          description_project: body.description_project,
          platform: body.platform,
          delivery_time: body.delivery_time,
          main_features: body.main_features,
          budget_available: body.budget_available,
        })
        .returning();

      return reply.code(201).send(created);
    },
  );
}
