import type { Metadata } from 'next';
import { Providers } from './providers';
import '@ui/globals.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Welcome to My App',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
