'use client';

import { TrpcProvider } from '@/utils/trpc';
import { AlertDialogProvider } from '@ui/components/alert-dialog-provider';
import { ModalProvider } from '@ui/components/ui/modal/modal-provider';
import { Toaster } from '@ui/components/ui/sonner';
import NextProgress from 'next-progress';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <TrpcProvider>
        <AlertDialogProvider>
          {children}
          <Toaster position="top-center" />
          <NextProgress color="#DC2525" />
        </AlertDialogProvider>
      </TrpcProvider>
    </ModalProvider>
  );
}
