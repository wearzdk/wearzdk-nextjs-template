'use client';

import { TrpcProvider } from '@/trpc/client';
import { AlertDialogProvider } from '@ui/components/alert-dialog-provider';
import { ModalProvider } from '@ui/components/ui/modal/modal-provider';
import { Toaster } from '@ui/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <TrpcProvider>
        <AlertDialogProvider>
          {children}
          <Toaster position="top-center" />
        </AlertDialogProvider>
      </TrpcProvider>
    </ModalProvider>
  );
}
