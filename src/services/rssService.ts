import { Podcast } from 'podcast';
import { Video } from '../types'
import twitchService from './twitchService';
import config from '../utilities/config';
import cache from '../utilities/cache';

class RssService {
  static getRssFeed = async (username: string, title: string | undefined) => {
    const cacheKey = `videos-${username}`;
    const videos: Video[] = cache.get(cacheKey) ?? await twitchService.getVideosForUser(username);

    cache.set(cacheKey, videos, 300);

    const rssFeed = new Podcast({
      title: title ?? username,
      description: title ?? username,
      author: title ?? username,
      feedUrl: `${config.hostname}/${username}`,
      siteUrl: `https://twitch.tv/${username}`,
      imageUrl: `${config.hostname}/covers/${username.toLowerCase()}${config.coverArtFileExtension}`,
    });

    videos.forEach((video) => {
      const itunesDuration = video.duration;
      rssFeed.addItem({
        title: video.title,
        itunesTitle: video.title,
        description: video.description,
        date: new Date(video.date),
        enclosure: { url: `${config.hostname}/video/${video.id}`, type: 'video/mp4' },
        url: `https://www.twitch.tv/videos/${video.id}`,
        itunesDuration,
      });
    });

    return rssFeed.buildXml();
  };
}

export default RssService;
