import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name_project: text('name_project').notNull(),
  sub_title: text('sub_title').notNull(),
  tags: text('tags').notNull(),
  description: text('description').notNull(),
  foto_url: text('foto_url').notNull(),
  created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});
