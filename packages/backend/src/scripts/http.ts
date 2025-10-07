import { log } from '@repo/backend/utils/logger';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
const AUTH_TOKEN = 'C7R36ze111';

async function authenticateRequest(
  req: FastifyRequest<{ Querystring: { token: string } }>,
  res: FastifyReply,
): Promise<boolean> {
  if (req.query.token !== AUTH_TOKEN) {
    res.status(401).send('Unauthorized');
    return false;
  }
  return true;
}

async function handleScriptExecution(
  res: FastifyReply,
  scriptFunction: () => Promise<void>,
): Promise<void> {
  try {
    await scriptFunction();
    res.send('ok');
  } catch (error) {
    log.common.error(error);
    res.status(500).send('Internal Server Error');
  }
}

type ScriptHandler = () => Promise<void>;
type ScriptRoute = {
  path: string;
  handler: ScriptHandler;
};

export function registerScripts(server: FastifyInstance): void {
  const routes: ScriptRoute[] = [];

  for (const { path, handler } of routes) {
    server.get(
      path,
      async (req: FastifyRequest<{ Querystring: { token: string } }>, res) => {
        if (await authenticateRequest(req, res)) {
          await handleScriptExecution(res, handler);
        }
      },
    );
  }
}
