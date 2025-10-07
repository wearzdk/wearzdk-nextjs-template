/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtVerify } from './jwt';

export type JwtClaims = {
  userId: string;
  type: 'user' | 'anonymous';
};

export async function createContext(ctx: any) {
  const token = await getJwtToken(ctx.req);
  const ip: string = ctx.req?.socket?.remoteAddress ?? '127.0.0.1';
  return {
    ...token,
    ip,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

async function getJwtToken(req: any) {
  const tokenHeader = req.headers.authorization?.replace('Bearer ', '');

  if (!tokenHeader) {
    return null;
  }
  const token = tokenHeader;
  const res = await jwtVerify<JwtClaims>(token);

  if (!res) {
    return null;
  }
  return res;
}
