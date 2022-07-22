import { useState } from 'react';
import { Quality } from '../types';

const RssLinks = ({
  host,
  username,
  quality,
}: {
  host: string;
  username: string;
  quality: Quality;
}) => {
  const [copiedText, setCopiedText] = useState<string>('');

  const getRssLink = () =>
    `${host}/${username}/feed${quality != Quality.Maximum ? `?quality=${quality}` : ''}`;

  const copyRssLink = () => {
    navigator.clipboard.writeText(`http://${getRssLink()}`);
    setCopiedText('Copied link to RSS feed 🎉');
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6 h-24">
      <div className="flex gap-4">
        <a href={`podcast://${getRssLink()}`}>
          <img className="w-10 h-10" src="/applepodcasts.svg" alt="apple podcasts" />
        </a>
        <a href={`pktc://subscribe/${getRssLink()}`}>
          <img className="w-10 h-10" src="/pocketcasts.svg" alt="pocket casts" />
        </a>
        <img className="w-10 h-10" src="/rss.svg" alt="rss" onClick={copyRssLink} />
      </div>
      {copiedText && <p>{copiedText}</p>}
    </div>
  );
};

export default RssLinks;
