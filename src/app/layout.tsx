import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'twitchPOD',
  description: 'Generate podcast feeds for your favorite Twitch streamers',
  icons: { icon: { rel: 'icon', url: '/favicon.ico' }, apple: { rel: 'icon', url: '/apple-touch-icon.png'} },
  themeColor: '#9146FF',
};

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en" className="text-base tiny:text-tiny mobile:text-mobile normal:text-normal">
      <body className="bg-twitch">
        <main className="bg-white text-neutral-800 dark:bg-neutral-900 dark:text-white">
          {children}
        </main>
      </body>
    </html>
  );
};

export default Layout;
