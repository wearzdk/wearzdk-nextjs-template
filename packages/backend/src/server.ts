import cors from '@fastify/cors';
import { fastifyFormbody } from '@fastify/formbody';
import { fastifyMultipart } from '@fastify/multipart';
import '@server/model/mongo';
import { exec } from 'node:child_process';
import fs from 'node:fs';
import process from 'node:process';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { fastify } from 'fastify';
import type { AppRouter } from './api/index';
import { appRouter } from './api/index';
import { registerScripts } from './scripts/http';
import { createContext } from './trpc/context';
const execAsync = promisify(exec);
// 连接数据库
const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
});

server.get('/', async () => {
  return '404';
});

server.register(fastifyMultipart);
server.register(fastifyFormbody);
server.register(cors, {
  origin: ['http://localhost:3000', /\.vercel\.app$/, /\.pages\.dev$/],
  allowedHeaders: ['Content-Type', 'Authorization', 'Locale'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  maxAge: 60,
});
// trpc
server.register(fastifyTRPCPlugin<AppRouter>, {
  prefix: '/trpc',
  trpcOptions: { router: appRouter, createContext },
});
registerScripts(server); // 注册脚本
// 代码更新
server.post('/app/QYVqe/upgrade', async (req, res) => {
  // auth
  if (req.headers.authorization !== 'C7R36zeVdrdg35') {
    res.status(401).send('Unauthorized');
    return;
  }

  // file
  const file = await req.file();
  if (!file) {
    res.status(400).send('No file uploaded');
    return;
  }

  const app = fs.createWriteStream('deploy.tar.gz');
  await pipeline(file.file, app);

  // Respond immediately and handle update asynchronously
  res.status(202).send('Update initiated');

  // Perform the update in the background
  execAsync('bash update.sh').catch((err) => {
    console.error('Update failed:', err);
  });
});

const port = Number(process.env.SERVER_PORT) || 3000;

server.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
