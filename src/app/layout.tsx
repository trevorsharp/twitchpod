import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'twitchPOD',
  description: 'Generate podcast feeds for your favorite Twitch streamers',
};

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en" className="text-base tiny:text-tiny mobile:text-mobile normal:text-normal">
      <head>
        <meta name="description" content="Create podcast feeds from Twitch VODs" />
        <meta name="theme-color" content="#9146FF" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="112x112" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-twitch">
        <main className="bg-white text-neutral-800 dark:bg-neutral-900 dark:text-white">
          {children}
        </main>
      </body>
    </html>
  );
};

export default Layout;
