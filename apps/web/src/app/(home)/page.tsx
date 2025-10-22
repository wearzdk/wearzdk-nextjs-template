import { HomePageImpl } from '@/app/(home)/components';
import { HydrateClient, prefetch } from '@/trpc/server';
import { trpcServer } from '@/trpc/server';

// 页面缓存30分钟(1800秒)
export const revalidate = 1800;

export default async function HomePage() {
  await prefetch(trpcServer.hello.hello.queryOptions({ name: 'World' }));
  // 也可以直接执行 trpc 逻辑
  // const data2 = await (await getTrpcCaller()).hello.hello({ name: 'World' });
  // console.log(data2);
  return (
    <HydrateClient>
      <HomePageImpl />
    </HydrateClient>
  );
}
