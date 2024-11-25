import { publicProcedure } from '@/trpc';
import { z } from 'zod';

export const hello = publicProcedure
  .input(z.object({ name: z.string() }))
  .query(({ input }) => {
    return `Hello ${input.name}`;
  });
