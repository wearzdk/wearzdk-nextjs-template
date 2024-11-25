import { isAuth } from './middlewares/auth';
import { t } from './trpc';

export const { router } = t;
export const publicProcedure = t.procedure;

export const authProcedure = publicProcedure.use(isAuth);
