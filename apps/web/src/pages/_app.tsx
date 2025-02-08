import { ModelProvider } from '@repo/model/trpc';
import { ModalProvider } from '@ui/components/ui/modal/modal-provider';
import { Toaster } from '@ui/components/ui/sonner';
import '@ui/globals.css';
import { ToastListener } from '@/components/shared/toast-listener';
import { AlertDialogProvider } from '@ui/components/alert-dialog-provider';
import NextProgress from 'next-progress';
import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <ModelProvider>
        <AlertDialogProvider>
          <Component {...pageProps} />
          <Toaster position="top-center" />
          <ToastListener />

          <NextProgress color="#DC2525" />
        </AlertDialogProvider>
      </ModelProvider>
    </ModalProvider>
  );
}

export default App;
