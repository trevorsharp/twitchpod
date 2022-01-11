import { Feed } from '../types';
import twitchService from './twitchService';
import config from '../utilities/config';

class FeedUpdateService {
  static getFeedData = async (username: string, title?: string): Promise<Feed | null> => {
    const videos = await twitchService.getVideosForUser(username);

    return { id: username, title: title ?? username, videos };
  };
}

export default FeedUpdateService;
