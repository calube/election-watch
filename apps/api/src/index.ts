import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

const fastify = Fastify({
  logger: {
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
});

await fastify.register(helmet);

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// Health check route
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API routes
fastify.get('/api/v1', async () => {
  return {
    message: 'Election Watch API v1',
    version: '0.1.0',
  };
});

// Register election routes
import { electionsRoutes } from './routes/elections';
await fastify.register(electionsRoutes, { prefix: '/api/v1' });

// Start server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    fastify.log.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
