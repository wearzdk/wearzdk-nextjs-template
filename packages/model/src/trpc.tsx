'use client';

import type { AppRouter } from '@repo/backend/api';
import superjson from '@repo/shared/utils/superjson';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createTRPCProxyClient,
  createTRPCReact,
  httpLink,
} from '@trpc/react-query';
import { HoxRoot } from 'hox-nextjs';
import type React from 'react';
import { useState } from 'react';
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type UnwrapTrpc<T extends (...args: unknown[]) => Promise<unknown>> =
  UnwrapPromise<ReturnType<T>>;

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (process.env.NODE_ENV === 'development') return '/api';
    if (process.env.IS_VERCEL_DEV) return '/api';
    if (window.location.hostname.includes('vercel'))
      return 'https://aiw.wearzdk.me/api';
    // cloudflare
    if (window.location.hostname.includes('pages.dev'))
      return 'https://aiw.wearzdk.me/api';
    if (process.env.NEXT_PUBLIC_APP_REGION === 'china')
      return 'https://api.aiw.webruix.cn';
  }
  if (
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
  )
    // reference for vercel.com
    return 'https://aiw.wearzdk.me/api';
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  return '/api';
}

const URL = `${getBaseUrl()}/trpc`;

let _jwtToken = '';
export const setJwtToken = (token: string) => {
  _jwtToken = token;
};

export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> =
  createTRPCReact<AppRouter>();

export const trpcNormal = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: URL,
      headers() {
        return {
          // authorization: `Bearer ${getUser()?.token}`,
          authorization: `Bearer ${_jwtToken}`,
        };
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'omit',
        });
      },
    }),
  ],
  transformer: superjson,
});

export const ModelProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            onError(error) {
              console.error(error);
            },
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: URL,
          headers() {
            return {
              authorization: `Bearer ${_jwtToken}`,
            };
          },
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'omit',
            });
          },
        }),
      ],
      transformer: superjson,
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HoxRoot>{children}</HoxRoot>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
