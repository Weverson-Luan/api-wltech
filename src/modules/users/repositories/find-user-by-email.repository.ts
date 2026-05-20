import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { roles } from '@/db/schema/roles.js';
import { users } from '@/db/schema/users.js';
import type { UserWithRole } from '@/modules/users/types/user.types.js';
import { userWithRoleSelect, usersJoinRoles } from '@/modules/users/repositories/shared/user.select.js';

export async function findUserByEmailRepository(email: string): Promise<UserWithRole | null> {
  const [row] = await db
    .select(userWithRoleSelect)
    .from(users)
    .innerJoin(roles, usersJoinRoles)
    .where(eq(users.email, email))
    .limit(1);

  return row ?? null;
}
