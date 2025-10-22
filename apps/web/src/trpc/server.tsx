import 'server-only'; // <-- ensure this file cannot be imported from the client
import { appRouter } from '@repo/backend/api';
import { createContext } from '@repo/backend/trpc/context';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { headers } from 'next/headers';
import { cache } from 'react';
import { makeQueryClient } from './query-client';

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpcServer = createTRPCOptionsProxy({
  ctx: async () => {
    // 在 SSG 模式下，headers() 不可用，需要提供默认值
    let authorization = '';
    let remoteAddress = '127.0.0.1';

    try {
      const headersList = await headers();
      authorization = headersList.get('authorization') || '';
      remoteAddress = headersList.get('x-forwarded-for') || '127.0.0.1';
    } catch {
      // SSG/Static Export 模式下 headers() 会抛出错误，使用默认值
    }

    return createContext({
      req: {
        headers: {
          authorization,
        },
        socket: {
          remoteAddress,
        },
      },
    });
  },
  router: appRouter,
  queryClient: getQueryClient,
});

// export const getTrpcCaller = cache(async () => {
//   return appRouter.createCaller(
//     await createContext({
//       req: {
//         headers: {
//           authorization: '',
//         },
//         socket: {
//           remoteAddress: '127.0.0.1',
//         },
//       },
//     }),
//   );
// });

// If your router is on a separate server, pass a client:
// createTRPCOptionsProxy({
//   client: createTRPCClient({
//     links: [httpLink({ url: '...' })],
//   }),
//   queryClient: getQueryClient,
// });

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
export async function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    await queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    await queryClient.prefetchQuery(queryOptions);
  }
}
