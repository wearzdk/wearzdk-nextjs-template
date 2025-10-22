import { HomePageImpl } from '@/app/(home)/components';
import { HydrateClient, prefetch } from '@/trpc/server';
import { trpcServer } from '@/trpc/server';

// 页面缓存30分钟(1800秒)
export const revalidate = 1800;

export default async function HomePage() {
  await prefetch(trpcServer.hello.hello.queryOptions({ name: 'World' }));
  return (
    <HydrateClient>
      <HomePageImpl />
    </HydrateClient>
  );
}
