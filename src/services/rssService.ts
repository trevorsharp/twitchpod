import { Podcast } from 'podcast';
import { UserData } from '../types';
import twichService from './twitchService';

class RssService {
  static getRssFeed = async (username: string, hostname: string | undefined): Promise<string> => {
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

    userData.videos.forEach((video) => {
      const itunesDuration = video.duration;

      rssFeed.addItem({
        title: video.title,
        itunesTitle: video.title,
        description: video.url,
        date: new Date(video.date),
        enclosure: { url: `http://${hostname}/video/${video.id}`, type: 'video/mp4' },
        url: video.url,
        itunesDuration,
      });
    });

    return rssFeed.buildXml();
  };
}

export default RssService;
