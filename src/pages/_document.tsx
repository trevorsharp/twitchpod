import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang="en" className="text-base tiny:text-tiny mobile:text-mobile normal:text-normal">
    <Head>
      <meta name="description" content="Create podcast feeds from Twitch VODs" />
      <meta name="theme-color" content="#9146FF" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="112x112" href="/apple-touch-icon.png" />
    </Head>
    <body className="bg-twitch">
      <main className="bg-white text-neutral-800 dark:bg-neutral-900 dark:text-white">
        <Main />
        <NextScript />
      </main>
    </body>
  </Html>
);

export default Document;
