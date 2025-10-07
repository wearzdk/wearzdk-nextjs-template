import process from 'node:process';
import cors from '@fastify/cors';
import { fastifyFormbody } from '@fastify/formbody';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { fastify } from 'fastify';
import type { AppRouter } from './api/index';
import { appRouter } from './api/index';
import { registerScripts } from './scripts/http';
import { createContext } from './trpc/context';
// 连接数据库
const server = fastify({
  routerOptions: {
    maxParamLength: 1024,
  },
  bodyLimit: 1024 * 1024 * 5, // 5MB
});

server.get('/', async () => {
  return '404';
});

server.register(fastifyMultipart);
server.register(fastifyFormbody);
server.register(cors, {
  origin: ['http://localhost:4000', /\.vercel\.app$/, /\.pages\.dev$/],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Locale',
    'trpc-accept',
    'region',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  maxAge: 60,
});
// trpc
server.register(fastifyTRPCPlugin<AppRouter>, {
  prefix: '/trpc',
  trpcOptions: { router: appRouter, createContext },
});
registerScripts(server); // 注册脚本
const port = Number(process.env.SERVER_PORT) || 3001;

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
