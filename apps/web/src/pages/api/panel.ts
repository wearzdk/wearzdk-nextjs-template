// import { renderTrpcPanel } from "trpc-panel";
import { renderTrpcPanel } from '@clburlison/trpc-panel';
import { appRouter } from '@repo/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 仅在开发环境提供此接口
  if (process.env.NODE_ENV !== 'development') {
    res.status(404).send('Not Found');
    return;
  }

  res.setHeader('Content-Type', 'text/html');
  res.send(
    renderTrpcPanel(appRouter, {
      url: '/api/trpc',
      transformer: 'superjson',
    }),
  );
}
