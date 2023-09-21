'use client';

import { useState } from 'react';
import { Quality } from '~/types';

type RssLinksProps = {
  username: string;
  quality: Quality;
  hostname: string;
};

const RssLinks = ({ username, quality, hostname }: RssLinksProps) => {
  const [copiedText, setCopiedText] = useState<string>('');

  const getRssLink = () =>
    `${hostname}/${username}/feed${quality != Quality.Maximum ? `?quality=${quality}` : ''}`;

  const copyRssLink = () => {
    void navigator.clipboard.writeText(`http://${getRssLink()}`).then(() => {
      setCopiedText('Copied link to RSS feed 🎉');
      setTimeout(() => setCopiedText(''), 2000);
    });
  };

  return (
    <div className="flex h-24 flex-col items-center gap-6">
      <div className="flex gap-4">
        <a href={`podcast://${getRssLink()}`}>
          <img className="h-10 w-10" src="/applepodcasts.svg" alt="Apple Podcasts" />
        </a>
        <a href={`pktc://subscribe/${getRssLink()}`}>
          <img className="h-10 w-10" src="/pocketcasts.svg" alt="Pocket Casts" />
        </a>
        <img className="h-10 w-10 cursor-pointer" src="/rss.svg" alt="RSS" onClick={copyRssLink} />
      </div>
      {copiedText && <p>{copiedText}</p>}
    </div>
  );
};

export default RssLinks;
