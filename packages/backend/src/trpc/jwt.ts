import process from 'node:process';
import JWT from 'jsonwebtoken';

const JWT_SECRET = process.env.APP_JWT_SECRET || 'wearzdk-test-secret';

export function jwtVerify<T>(token: string): Promise<T | null> {
  return new Promise((resolve) => {
    JWT.verify(token, JWT_SECRET, (err, decode) => {
      if (err) resolve(null);
      else resolve(decode as T);
    });
  });
}

export function jwtSign(obj: object) {
  const token = JWT.sign(obj, JWT_SECRET, {
    expiresIn: '7d', // 7 days
  });
  return token;
}
