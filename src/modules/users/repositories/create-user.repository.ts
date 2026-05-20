import { db } from '@/db/index.js';
import { users } from '@/db/schema/users.js';
import type { CreateUserRepositoryInput } from '@/modules/users/types/user.types.js';
import { findUserByIdRepository } from '@/modules/users/repositories/find-user-by-id.repository.js';

export async function createUserRepository(input: CreateUserRepositoryInput) {
  const [created] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      password_hash: input.password_hash,
      role_id: input.role_id,
    })
    .returning({ id: users.id });

  const user = await findUserByIdRepository(created.id);

  if (!user) {
    throw new Error('Failed to load created user');
  }

  return user;
}
