import { TrpcProvider } from '@/utils/trpc';
import { ModalProvider } from '@ui/components/ui/modal/modal-provider';
import { Toaster } from '@ui/components/ui/sonner';
import '@ui/globals.css';
import { AlertDialogProvider } from '@ui/components/alert-dialog-provider';
import NextProgress from 'next-progress';
import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <TrpcProvider>
        <AlertDialogProvider>
          <Component {...pageProps} />
          <Toaster position="top-center" />
          <NextProgress color="#DC2525" />
        </AlertDialogProvider>
      </TrpcProvider>
    </ModalProvider>
  );
}

export default App;
