import { Podcast } from 'podcast';
import { Video, UserData } from '../types';
import cache from '../utilities/cache';
import videoService from './videoService';
import twichService from './twitchService';

class RssService {
  static getRssFeed = async (username: string, hostname: string | undefined): Promise<string> => {
    const cacheKey = `rss-${username}`;
    const cacheResult = cache.get(cacheKey);
    if (cacheResult) return cacheResult;

    const videos: Video[] = await videoService.getVideosForUser(username);
    const userData: UserData | undefined = await twichService.getTwitchUserData(username);

    if (!userData) return '';

    const rssFeed = new Podcast({
      title: userData.displayName,
      description: userData.description,
      author: userData.displayName,
      feedUrl: `http://${hostname}/${username}`,
      siteUrl: `https://twitch.tv/${username}`,
      imageUrl: userData.profileImageUrl,
    });

    videos.forEach((video) => {
      const itunesDuration = video.duration;
      const url = `https://www.twitch.tv/videos/${video.id}`;

      rssFeed.addItem({
        title: video.title,
        itunesTitle: video.title,
        description: [video.description, url].join('\n\n'),
        date: new Date(video.date),
        enclosure: { url: `http://${hostname}/video/${video.id}`, type: 'video/mp4' },
        url,
        itunesDuration,
      });
    });

    const rss = rssFeed.buildXml();

    cache.set(username, rss, 300);

    return rss;
  };
}

export default RssService;
