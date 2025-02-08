import { appRouter } from '@repo/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderTrpcPanel } from 'trpc-ui';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 仅在开发环境提供此接口
  if (process.env.NODE_ENV !== 'development') {
    res.status(404).send('Not Found');
    return;
  }

  console.log(appRouter);

  res.setHeader('Content-Type', 'text/html');
  res.send(
    renderTrpcPanel(appRouter, {
      url: '/api/trpc',
      transformer: 'superjson',
    }),
  );
}
