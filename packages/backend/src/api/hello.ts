import { z } from 'zod';
import { publicProcedure } from '../trpc/procedure';

export const hello = publicProcedure
  .input(z.object({ name: z.string() }))
  .query(({ input }) => {
    return `Hello ${input.name}`;
  });
