import type { ToastPayload } from '@repo/model/hooks/useToast';
import mitt from 'mitt';
export const bus = mitt<{
  'toast:show': ToastPayload;
  [key: string]: any;
}>();
export const getBus = () => bus;
