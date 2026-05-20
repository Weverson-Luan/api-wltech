import { db } from '@/db/index.js';
import { projects } from '@/db/schema/projects.js';
import type { CreateProjectRepositoryInput } from '@/modules/projects/types/project.types.js';
import { findProjectByIdRepository } from '@/modules/projects/repositories/find-project-by-id.repository.js';

export async function createProjectRepository(input: CreateProjectRepositoryInput) {
  const [created] = await db
    .insert(projects)
    .values(input)
    .returning({ id: projects.id });

  const project = await findProjectByIdRepository(created.id);

  if (!project) {
    throw new Error('Failed to load created project');
  }

  return project;
}
