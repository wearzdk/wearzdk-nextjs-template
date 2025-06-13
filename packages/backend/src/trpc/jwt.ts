import process from 'node:process';
import * as jose from 'jose';

const JWT_SECRET = process.env.APP_JWT_SECRET || 'wearzdk-test-secret';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function jwtVerify<T = jose.JWTPayload>(
  token: string,
): Promise<T | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as T;
  } catch (error) {
    return null;
  }
}

export async function jwtSign(payload: jose.JWTPayload): Promise<string> {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 days
    .sign(secret);

  return token;
}
