import type { ShowModalOptions } from '@ui/components/ui/modal/modal-provider';
import { createContext, useContext } from 'react';

export const ModalContext = createContext<{
  openModal: (options: ShowModalOptions) => string;
  closeModal: (id: string) => void;
  closeAll: () => void;
  onModalEmpty: (fn: () => void) => () => void;
} | null>(null);

export const ModalInnerContext = createContext<{
  id: string;
  closeSelfModal: () => void;
} | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function useModalRef() {
  const context = useContext(ModalInnerContext);
  if (!context) {
    throw new Error('useModalRef must be used within a Modal');
  }
  return context;
}
