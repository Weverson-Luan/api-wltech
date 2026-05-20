import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});
