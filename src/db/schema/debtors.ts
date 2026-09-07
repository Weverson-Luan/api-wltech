import { relations } from 'drizzle-orm';
import { doublePrecision, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema/users.js';

export const debtors = pgTable('debtors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  amount: doublePrecision('amount').notNull(),
  principal_amount: doublePrecision('principal_amount').notNull(),
  due_date: timestamp('due_date', { mode: 'date' }).notNull(),
  status: text('status').notNull(),
  user_id_applicant: integer('user_id_applicant')
    .notNull()
    .references(() => users.id),
  user_id_owner: integer('user_id_owner')
    .notNull()
    .references(() => users.id),
  created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export const debtorsRelations = relations(debtors, ({ one }) => ({
  applicant: one(users, {
    fields: [debtors.user_id_applicant],
    references: [users.id],
    relationName: 'debtorApplicant',
  }),
  owner: one(users, {
    fields: [debtors.user_id_owner],
    references: [users.id],
    relationName: 'debtorOwner',
  }),
}));
