import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang="en" className="h-full">
    <Head />
    <body className="bg-twitch h-full m-0 p-0 normal:text-normal text-mobile">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
