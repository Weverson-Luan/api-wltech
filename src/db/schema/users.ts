import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { roles } from '@/db/schema/roles.js';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password_hash: text('password_hash').notNull(),
  role_id: integer('role_id')
    .notNull()
    .references(() => roles.id),
  created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.role_id],
    references: [roles.id],
  }),
}));
