import type { FastifyInstance } from 'fastify';
import { db } from '@/db/index.js';
import { roles } from '@/db/schema/roles.js';

export async function rolesRoutes(app: FastifyInstance) {
  app.get('/roles', async () => {
    return db.select().from(roles);
  });
}
