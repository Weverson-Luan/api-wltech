import type { FastifyInstance } from 'fastify';
import { authRoutes } from '@/routes/auth.js';
import { budgetsRoutes } from '@/routes/budgets.js';
import { categoriesRoutes } from '@/routes/categories.js';
import { debtorsRoutes } from '@/routes/debtors.js';
import { healthRoutes } from '@/routes/health.js';
import { rolesRoutes } from '@/routes/roles.js';
import { projectsRoutes } from '@/routes/projects.js';
import { transactionsRoutes } from '@/routes/transactions.js';
import { usersRoutes } from '@/routes/users.js';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(rolesRoutes);
  await app.register(usersRoutes);
  await app.register(projectsRoutes);
  await app.register(categoriesRoutes);
  await app.register(debtorsRoutes);
  await app.register(transactionsRoutes);
  await app.register(budgetsRoutes);
}
