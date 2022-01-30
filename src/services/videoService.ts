import { spawn } from 'child_process';
import cache from '../utilities/cache';

interface StreamUrl {
  url?: string;
  error?: string;
}

class VideoService {
  static getStreamUrl = async (videoId: string): Promise<StreamUrl> => {
    const cacheKey = `video-url-${videoId}`;
    const cacheResult = cache.get(cacheKey);
    if (cacheResult) return { url: cacheResult as string };

    const videoUrl = await this.getVideoUrl(videoId);

    if (videoUrl === '') return { error: 'Failed to load video url' };

    cache.set(cacheKey, videoUrl, 300);

    return { url: videoUrl };
  };

  static getVideoUrl = async (videoId: string): Promise<string> => {
    const data = await this.spawnChild(['info', videoId]);

    return /chunked ([^\n]*)/.test(data) ? RegExp.$1 : '';
  };

  private static spawnChild = async (args: string[]) => {
    const child = spawn('twitch-dl', args);

    let data = '';
    for await (const chunk of child.stdout) data += chunk;

    await new Promise((resolve, reject) => child.on('close', resolve));

    return data.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ''
    );
  };
}

export default VideoService;
