import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { roles } from '@/db/schema/roles.js';

export async function findRoleIdByNameRepository(roleName: string): Promise<number | null> {
  const [role] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, roleName))
    .limit(1);

  return role?.id ?? null;
}
