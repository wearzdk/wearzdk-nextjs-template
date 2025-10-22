import superjson from '@repo/shared/utils/superjson';
import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from '@tanstack/react-query';
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) => {
          return (
            defaultShouldDehydrateQuery(query) ||
            query.state.status === 'pending'
          );
        },
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
