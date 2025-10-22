import { appRouter } from '@repo/backend/api';
import { createContext } from '@repo/backend/trpc/context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
    onError({ error }) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        console.error('Something went wrong', error);
      }
    },
  });

export { handler as GET, handler as POST };

export const maxDuration = 15;
