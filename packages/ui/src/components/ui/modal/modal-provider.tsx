'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@ui/components/ui/dialog';
import { ModalContext, ModalInnerContext } from '@ui/hooks/useModal';
import { cn } from '@ui/lib/utils';
import { Loader2 } from 'lucide-react';
import type React from 'react';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

export interface ShowModalOptions {
  id?: string;
  content:
    | React.ReactNode
    | (() => React.ReactNode)
    | (() => Promise<React.ReactNode>);
  title?: string;
  onClose?: () => void;
  className?: string;
  delay?: number;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ShowModalOptions[]>([]);
  const [openedModals, setOpenedModals] = useState<string[]>([]);
  const hasModalOpened = useRef(false);
  const modalEmptyHandlers = useRef<(() => void)[]>([]);

  const openModal = useCallback((options: ShowModalOptions): string => {
    const id = options.id || Math.random().toString(36).substring(2, 9);
    setModals((prev) => [...prev, { ...options, id }]);
    hasModalOpened.current = true;
    setTimeout(() => {
      setOpenedModals((prev) => [...prev, id]);
    }, 0);
    return id;
  }, []);

  const closeModal = useCallback(
    (id: string) => {
      setOpenedModals((prev) => prev.filter((modalId) => modalId !== id));
      const modal = modals.find((modal) => modal.id === id);
      modal?.onClose?.();
      setTimeout(() => {
        setModals((prev) => prev.filter((modal) => modal.id !== id));
      }, modal?.delay || 300);
    },
    [modals],
  );

  const closeAll = useCallback(() => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    modals.forEach((modal) => modal.onClose?.());
    setModals([]);
    setOpenedModals([]);
  }, [modals]);

  const onModalEmpty = useCallback((fn: () => void) => {
    modalEmptyHandlers.current.push(fn);
    const index = modalEmptyHandlers.current.length - 1;
    return () => {
      modalEmptyHandlers.current.splice(index, 1);
    };
  }, []);

  useEffect(() => {
    if (modals.length === 0 && hasModalOpened.current) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      modalEmptyHandlers.current.forEach((fn) => fn());
      hasModalOpened.current = false;
    }
  }, [modals]);

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, closeAll, onModalEmpty }}
    >
      {children}
      {modals.map((modalProps) => (
        <ModalInnerContext.Provider
          key={modalProps.id}
          value={{
            id: modalProps.id ?? '',
            closeSelfModal: () => closeModal(modalProps.id ?? ''),
          }}
        >
          <Dialog
            open={openedModals.includes(modalProps.id ?? '')}
            onOpenChange={() => closeModal(modalProps.id ?? '')}
          >
            <DialogContent
              className={modalProps.className}
              aria-describedby={undefined}
            >
              <DialogHeader className={modalProps.title ? '' : 'hidden'}>
                <DialogTitle>{modalProps.title}</DialogTitle>
              </DialogHeader>
              <Suspense
                fallback={
                  <div
                    className={cn(
                      'flex items-center justify-center w-[400px] h-[280px]',
                    )}
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }
              >
                <div className="transition-all duration-300 ease-in-out">
                  {typeof modalProps.content === 'function'
                    ? (modalProps.content as () => React.ReactNode)()
                    : modalProps.content}
                </div>
              </Suspense>
            </DialogContent>
          </Dialog>
        </ModalInnerContext.Provider>
      ))}
    </ModalContext.Provider>
  );
}
