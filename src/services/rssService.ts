import { Podcast } from 'podcast';
import { Feed } from '../types';
import config from '../utilities/config';
import cache from '../utilities/cache';

class RssService {
  static getRssFeed = async (feed: Feed) => {
    const cacheKey = `rss-${feed.id}`;
    const cacheResult = cache.get(cacheKey);
    if (cacheResult) return cacheResult;

    const rssFeed = new Podcast({
      title: feed.title,
      description: feed.title,
      author: feed.title,
      feedUrl: `${config.hostname}/${feed.id}`,
      siteUrl: `https://twitch.tv/${feed.id}`,
      imageUrl: `${config.hostname}/covers/${feed.id.toLowerCase()}${config.coverArtFileExtension}`,
    });

    feed.videos.forEach((video) => {
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

    const rssContent = rssFeed.buildXml();

    cache.set(cacheKey, rssContent, 300);

    return rssContent;
  };
}

export default RssService;
