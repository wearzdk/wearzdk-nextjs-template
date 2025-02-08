'use client';

import type { AppRouter } from '@repo/backend/api';
import superjson from '@repo/shared/utils/superjson';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {
  createTRPCClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { HoxRoot } from 'hox-nextjs';
import type { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import type React from 'react';
import { useState } from 'react';
import { useToast } from './hooks/useToast';
// 类型定义
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type UnwrapTrpc<T extends (...args: unknown[]) => Promise<unknown>> =
  UnwrapPromise<ReturnType<T>>;

export interface SSRContext extends NextPageContext {
  status?: number;
}

// 获取基础 URL
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (process.env.NODE_ENV === 'development') return '/api';
    if (process.env.IS_VERCEL_DEV) return '/api';
    if (window.location.hostname.includes('vercel')) return '/api';
    if (window.location.hostname.includes('pages.dev')) return '/api';
    return '';
  }

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  return `http://127.0.0.1:${process.env.PORT ?? 3000}/api`;
}

const URL = `${getBaseUrl()}/trpc`;

// JWT Token 管理
let _jwtToken = '';
export const setJwtToken = (token: string) => {
  _jwtToken = token;
};

// tRPC 客户端创建
export const trpc = createTRPCReact<AppRouter, SSRContext>();
export const trpcNormal = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: () => {
        if (process.env.NODE_ENV === 'development') return true;
        return false;
      },
    }),
    unstable_httpBatchStreamLink({
      url: URL,
      headers() {
        return {
          authorization: `Bearer ${_jwtToken}`,
        };
      },
      transformer: superjson,
    }),
  ],
});

// Provider 组件
export const ModelProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const toast = useToast();
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (error.message.includes('需要登录')) {
              router.push('/login');
            }
            // console.error(error);
            toast.error(error.message); // 全局错误处理
          },
        }),
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
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
          transformer: superjson,
        }),
      ],
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

// 导出类型
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
