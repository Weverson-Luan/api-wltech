import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { roles } from '@/db/schema/roles.js';

export async function findRoleByIdRepository(id: number): Promise<{ id: number; name: string } | null> {
  const [role] = await db
    .select({ id: roles.id, name: roles.name })
    .from(roles)
    .where(eq(roles.id, id))
    .limit(1);

  return role ?? null;
}
