import type { TRPCClientErrorLike } from '@trpc/client';
import type { UseTRPCQueryResult } from '@trpc/react-query/shared';
import type { AnyRouter } from '@trpc/server';
import { Alert, AlertDescription } from '@ui/components/ui/alert';
import { Button } from '@ui/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
// import useTranslation from 'next-translate/useTranslation';

interface QueryWrapperProps<TData, TError> {
  query: UseTRPCQueryResult<TData, TError>;
  children: (data: TData) => ReactNode;
  loadingContent?: ReactNode;
  /**
   * 最小加载时间（毫秒），默认 200ms
   * 避免加载状态闪烁
   */
  minLoadingTime?: number;
}

export function QueryWrapper<
  TData,
  TError extends TRPCClientErrorLike<AnyRouter>,
>({
  query,
  children,
  loadingContent,
  minLoadingTime = 200,
}: QueryWrapperProps<TData, TError>) {
  const { data, isLoading: queryIsLoading, error, refetch } = query;
  const [isLoading, setIsLoading] = useState(queryIsLoading);
  // const { t } = useTranslation('common');

  useEffect(() => {
    if (!queryIsLoading) {
      // 如果查询已完成，设置一个延迟来关闭 loading 状态
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, minLoadingTime);
      return () => clearTimeout(timer);
    }
    setIsLoading(true);
  }, [queryIsLoading, minLoadingTime]);

  if (isLoading) {
    return (
      loadingContent || (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription className="flex items-center justify-between">
          <span>加载失败: {error.message}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            重试
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  return <>{children(data as NonNullable<TData>)}</>;
}
