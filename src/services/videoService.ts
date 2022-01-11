import cache from '../utilities/cache';
import twitchService from './twitchService';

interface StreamUrl {
  url?: string;
  error?: string;
}

class VideoService {
  static getStreamUrl = async (videoId: string): Promise<StreamUrl> => {
    const cacheKey = `video-url-${videoId}`;
    const cacheResult = cache.get(cacheKey);
    if (cacheResult) return { url: cacheResult as string };

    const videoUrl = await twitchService.getVideoUrl(videoId);

    if (videoUrl === '') return { error: 'Failed to load video url' };

    cache.set(cacheKey, videoUrl, 300);

    return { url: videoUrl };
  };
}

export default VideoService;
