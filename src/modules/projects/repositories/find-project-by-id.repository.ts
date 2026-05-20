import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { projects } from '@/db/schema/projects.js';
import type { ProjectRecord } from '@/modules/projects/types/project.types.js';

export async function findProjectByIdRepository(id: number): Promise<ProjectRecord | null> {
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return row ?? null;
}
