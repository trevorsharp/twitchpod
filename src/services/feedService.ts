import { Podcast } from 'podcast';
import { Quality } from '../types';
import { getUserData } from './twitchService';

const getRssFeed = async (
  username: string,
  hostname: string,
  quality: Quality
): Promise<string> => {
  const user = await getUserData(username);

  const rssFeed = new Podcast({
    title: user.displayName,
    description: user.description,
    author: user.displayName,
    feedUrl: `http://${hostname}/${username}`,
    siteUrl: `https://twitch.tv/${username}`,
    imageUrl: user.profileImageUrl,
  });

  user.videos.forEach((video) => {
    const itunesDuration = video.duration;

    rssFeed.addItem({
      title: video.title,
      itunesTitle: video.title,
      description: video.url,
      date: new Date(video.date),
      enclosure: {
        url: `http://${hostname}/videos/${video.id}${
          quality != Quality.Maximum ? `?quality=${quality}` : ''
        }`,
        type: quality === Quality.Audio ? 'audio/aac' : 'video/mp4',
      },
      url: video.url,
      itunesDuration,
    });
  });

  return rssFeed.buildXml();
};

export { getRssFeed };
