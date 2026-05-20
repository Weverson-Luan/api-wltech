import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { projects } from '@/db/schema/projects.js';
import type { UpdateProjectRepositoryInput } from '@/modules/projects/types/project.types.js';
import { findProjectByIdRepository } from '@/modules/projects/repositories/find-project-by-id.repository.js';

export async function updateProjectRepository(id: number, input: UpdateProjectRepositoryInput) {
  await db.update(projects).set(input).where(eq(projects.id, id));

  const project = await findProjectByIdRepository(id);

  if (!project) {
    throw new Error('Failed to load updated project');
  }

  return project;
}
