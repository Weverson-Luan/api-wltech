import { eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { users } from '@/db/schema/users.js';

export async function deleteUserRepository(id: number): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
  return result.length > 0;
}
