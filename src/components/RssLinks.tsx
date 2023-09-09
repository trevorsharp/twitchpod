'use client';

import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
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
        {quality === Quality.Audio ? (
          <a href={`podcast://${getRssLink()}`}>
            <img className="h-10 w-10" src="/applepodcasts.svg" alt="Apple Podcasts" />
          </a>
        ) : (
          <>
            <img
              data-tooltip-id="tooltip"
              data-tooltip-html="<p>Apple Podcasts does not support twitchPOD's video format.</p><p>Try using Pocket Casts or addding the feed as 'Audio Only'.</p>"
              className="h-10 w-10"
              src="/applepodcasts-disabled.svg"
              alt="Apple Podcasts"
            />
          </>
        )}
        <a href={`pktc://subscribe/${getRssLink()}`}>
          <img className="h-10 w-10" src="/pocketcasts.svg" alt="Pocket Casts" />
        </a>
        <img className="h-10 w-10 cursor-pointer" src="/rss.svg" alt="RSS" onClick={copyRssLink} />
      </div>
      {copiedText && <p>{copiedText}</p>}
      <Tooltip id="tooltip" />
    </div>
  );
};

export default RssLinks;
