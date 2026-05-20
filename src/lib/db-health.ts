import { sql } from 'drizzle-orm';
import { db } from '@/db/index.js';

export async function isDatabaseHealthy(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}
