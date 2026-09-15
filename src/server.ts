/**
 * IMPORTSs
 */
import 'dotenv/config';
import './types/jwt.js';
import Fastify from 'fastify';
import { env } from '@/config/env.js';
import { registerErrorHandler } from '@/plugins/error-handler.js';
import { registerJwt } from '@/plugins/jwt.js';
import { registerRoutes } from '@/routes/index.js';

const port = env.PORT;
const host = env.HOST;

const app = Fastify({ logger: true });

await registerErrorHandler(app);
await registerJwt(app);
await registerRoutes(app);

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
