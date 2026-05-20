import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { users } from '@/db/schema/users.js';
import type { UpdateUserRepositoryInput } from '@/modules/users/types/user.types.js';
import { findUserByIdRepository } from '@/modules/users/repositories/find-user-by-id.repository.js';

export async function updateUserRepository(id: number, input: UpdateUserRepositoryInput) {
  await db.update(users).set(input).where(eq(users.id, id));

  const user = await findUserByIdRepository(id);

  if (!user) {
    throw new Error('Failed to load updated user');
  }

  return user;
}
