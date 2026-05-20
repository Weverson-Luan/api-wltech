import { relations } from 'drizzle-orm';
import { doublePrecision, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { categories } from '@/db/schema/categories.js';
import { users } from '@/db/schema/users.js';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id),
  type: text('type').notNull(),
  amount: doublePrecision('amount').notNull(),
  category_id: integer('category_id')
    .notNull()
    .references(() => categories.id),
  payment_method: text('payment_method').notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.user_id],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.category_id],
    references: [categories.id],
  }),
}));
