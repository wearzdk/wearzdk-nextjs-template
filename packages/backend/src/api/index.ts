import { router } from '../trpc';

import * as helloApi from './hello';
export const appRouter = router({
  hello: router({ ...helloApi }),
});

export type AppRouter = typeof appRouter;
