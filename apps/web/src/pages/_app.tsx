import { ModelProvider } from '@repo/model/trpc';
import { ModalProvider } from '@repo/ui/components/ui/modal/modal-provider';
import { Toaster } from '@repo/ui/components/ui/sonner';
import '@repo/ui/globals.css';
import NextProgress from 'next-progress';
import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <ModelProvider>
        <Component {...pageProps} />
        <Toaster position="top-center" />
        <NextProgress color="#DC2525" />
      </ModelProvider>
    </ModalProvider>
  );
}

export default App;
