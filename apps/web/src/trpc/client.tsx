'use client';

import type { AppRouter } from '@repo/backend/api';
import superjson from '@repo/shared/utils/superjson';
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createTRPCClient,
  httpBatchStreamLink,
  httpLink,
  loggerLink,
  splitLink,
} from '@trpc/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import type React from 'react';
import { useState } from 'react';
import { makeQueryClient } from './query-client';

// 类型定义
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type UnwrapTrpc<T extends (...args: unknown[]) => Promise<unknown>> =
  UnwrapPromise<ReturnType<T>>;

export const {
  TRPCProvider: TrpcInnerProvider,
  useTRPC,
  useTRPCClient,
} = createTRPCContext<AppRouter>();

// 获取基础 URL
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (process.env.NODE_ENV === 'development') {
      return '/api';
    }
    if (window.location.hostname.includes('vercel')) return '/api';
    if (window.location.hostname.includes('pages.dev')) return '/api';
    return 'http://localhost:3001';
  }
  return 'http://localhost:3001';
}
const URL = `${getBaseUrl()}/trpc`;

// JWT Token 管理
let _jwtToken = '';
export const setJwtToken = (token: string) => {
  _jwtToken = token;
};

let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
// Provider 组件
export const TrpcProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition: (op) => {
            return op.input instanceof FormData;
          },
          // 非JSON序列化操作使用 httpLink
          true: httpLink({
            url: URL,
            headers() {
              return {
                authorization: `Bearer ${_jwtToken}`,
              };
            },
            transformer: superjson,
          }),
          // JSON序列化操作使用 httpBatchStreamLink
          false: httpBatchStreamLink({
            url: URL,
            headers() {
              return {
                authorization: `Bearer ${_jwtToken}`,
              };
            },
            transformer: superjson,
          }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TrpcInnerProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TrpcInnerProvider>
    </QueryClientProvider>
  );
};

// 导出类型
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
