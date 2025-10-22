import { appRouter } from '@repo/backend/api';
import { NextResponse } from 'next/server';
import { renderTrpcPanel } from 'trpc-ui';

export async function GET() {
  // 仅在开发环境提供此接口
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  const html = renderTrpcPanel(appRouter, {
    url: '/api/trpc',
    transformer: 'superjson',
  });

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
