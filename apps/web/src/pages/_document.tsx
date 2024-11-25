import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        {/* <Script
          src="https://analyze.webruix.cn/script.js"
          data-website-id="82e6eb44-0898-461d-a13b-5cbefe8a2b3f"
          strategy="lazyOnload"
        /> */}
      </body>
    </Html>
  );
}
