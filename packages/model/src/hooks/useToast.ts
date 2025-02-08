import { getBus } from '../utils/bus';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastPayload {
  type: ToastType;
  title: string;
  description?: string;
}

export interface ToastEvents {
  'toast:show': ToastPayload;
}

export const useToast = () => {
  const bus = getBus();

  const show = (payload: ToastPayload) => {
    bus.emit('toast:show', payload);
  };

  // 便捷方法
  const success = (title: string, description?: string) => {
    show({ type: 'success', title, description });
  };

  const error = (title: string, description?: string) => {
    show({ type: 'error', title, description });
  };

  const info = (title: string, description?: string) => {
    show({ type: 'info', title, description });
  };

  const warning = (title: string, description?: string) => {
    show({ type: 'warning', title, description });
  };

  return {
    show,
    success,
    error,
    info,
    warning,
  };
};
