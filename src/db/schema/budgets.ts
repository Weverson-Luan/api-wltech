import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  name_app: text('name_app').notNull(),
  description_project: text('description_project').notNull(),
  platform: text('platform').notNull(),
  delivery_time: text('delivery_time').notNull(),
  main_features: text('main_features').notNull(),
  budget_available: text('budget_available').notNull(),
  created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});
