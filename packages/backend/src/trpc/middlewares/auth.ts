import { TRPCError } from '@trpc/server';
import { t } from '../trpc';

export const isAuth = t.middleware((opts) => {
  const { ctx } = opts;

  if (!ctx?.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const { userId } = ctx;

  return opts.next({
    ctx: {
      userId,
    },
  });
});
