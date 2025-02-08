import { useEffect, useRef } from 'react';

/**
 * 一个安全的 setInterval Hook
 * @param callback 要执行的回调函数
 * @param delay 间隔时间（毫秒）。如果为 null，则暂停 interval
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // 记住最新的回调函数
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 设置 interval
  useEffect(() => {
    // 如果 delay 为 null，不启动 interval
    if (delay === null) return;

    const tick = () => {
      savedCallback.current?.();
    };

    const id = setInterval(tick, delay);

    // cleanup function 清理 interval
    return () => clearInterval(id);
  }, [delay]);
}
