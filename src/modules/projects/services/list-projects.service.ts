import { toProjectResponse } from '@/modules/projects/mappers/project.mapper.js';
import { findAllProjectsRepository } from '@/modules/projects/repositories/find-all-projects.repository.js';

export async function listProjectsService() {
  const projects = await findAllProjectsRepository();
  return projects.map(toProjectResponse);
}
