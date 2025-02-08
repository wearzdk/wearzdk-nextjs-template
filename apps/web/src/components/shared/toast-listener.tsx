import type { ToastPayload } from '@repo/model/hooks/useToast';
import { getBus } from '@repo/model/utils/bus';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const ToastListener = () => {
  useEffect(() => {
    const bus = getBus();

    const handler = ({ type, title, description }: ToastPayload) => {
      toast[type](title, {
        description,
      });
    };

    bus.on('toast:show', handler);

    return () => {
      bus.off('toast:show', handler);
    };
  }, []);

  return null;
};
