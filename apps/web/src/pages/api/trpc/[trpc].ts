import { appRouter } from '@repo/backend/api';
import { createContext } from '@repo/backend/trpc/context';
import * as trpcNext from '@trpc/server/adapters/next';

export const config = {
  maxDuration: 15, // 5 seconds
  api: {
    bodyParser: {
      sizeLimit: '2mb', // Set desired value here
    },
  },
};

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error);
    }
  },
  batching: {
    enabled: true,
  },
});
