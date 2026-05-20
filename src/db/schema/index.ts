import { relations } from 'drizzle-orm';
import { budgets } from '@/db/schema/budgets.js';
import { categories } from '@/db/schema/categories.js';
import { debtors, debtorsRelations } from '@/db/schema/debtors.js';
import { projects } from '@/db/schema/projects.js';
import { roles } from '@/db/schema/roles.js';
import { transactions, transactionsRelations } from '@/db/schema/transactions.js';
import { users, usersRelations } from '@/db/schema/users.js';

export {
  budgets,
  categories,
  debtors,
  debtorsRelations,
  projects,
  roles,
  transactions,
  transactionsRelations,
  users,
  usersRelations,
};

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));
