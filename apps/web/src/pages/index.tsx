import { trpc, trpcNormal } from '@repo/model/trpc';
import { Button } from '@ui/components/ui/button';

export default function Home() {
  const { data } = trpc.hello.hello.useQuery({
    name: 'test',
  });
  return (
    <div className="text-red-500">
      <Button>按钮</Button>
      {data}
    </div>
  );
}
