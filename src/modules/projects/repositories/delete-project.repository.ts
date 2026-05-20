import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { projects } from '@/db/schema/projects.js';

export async function deleteProjectRepository(id: number): Promise<boolean> {
  const result = await db.delete(projects).where(eq(projects.id, id)).returning({ id: projects.id });
  return result.length > 0;
}
