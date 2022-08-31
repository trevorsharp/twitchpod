import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang="en" className="h-full text-base tiny:text-tiny mobile:text-mobile normal:text-normal">
    <Head>
      <meta name="description" content="Create podcast feeds from Twitch VODs" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="112x112" href="/apple-touch-icon.png" />
    </Head>
    <body className="h-full bg-twitch">
      <main className="h-full min-h-fit bg-white text-neutral-800 dark:bg-neutral-900 dark:text-white">
        <Main />
        <NextScript />
      </main>
    </body>
  </Html>
);

export default Document;
