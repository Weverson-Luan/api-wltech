import { desc } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { projects } from '@/db/schema/projects.js';
import type { ProjectRecord } from '@/modules/projects/types/project.types.js';

export async function findAllProjectsRepository(): Promise<ProjectRecord[]> {
  return db.select().from(projects).orderBy(desc(projects.created_at));
}
