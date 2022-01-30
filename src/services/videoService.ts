import { spawn } from 'child_process';
import { Video } from '../types';
import cache from '../utilities/cache';

interface StreamUrl {
  url?: string;
  error?: string;
}

class VideoService {
  static getVideosForUser = async (username: string): Promise<Video[]> => {
    const cacheKey = `videos-${username}`;
    const cacheResult = cache.get(cacheKey);

    if (cacheResult) return cacheResult;

    const data = await this.spawnChild(['videos', username, '--limit', '100']);
    const dataByLine = data.split('\n').filter((x) => x !== '');

    const videos: Video[] = [];

    for (let i = 0; i < dataByLine.length; i++) {
      if (/Video ([0-9]+)/.test(dataByLine[i]))
        videos.push({
          id: RegExp.$1,
          title: dataByLine[++i],
          description: dataByLine[++i],
          date: /Published ([^\s]*) @ ([^\s]*)/.test(dataByLine[++i])
            ? `${RegExp.$1}T${RegExp.$2}Z`
            : '',
          duration: /Length: ([0-9]+) h ([0-9]+) min/.test(dataByLine[i])
            ? parseInt(RegExp.$1) * 3600 + parseInt(RegExp.$2) * 60
            : /Length: ([0-9]+) min ([0-9]+) sec/.test(dataByLine[i])
            ? parseInt(RegExp.$1) * 60 + parseInt(RegExp.$2)
            : /Length: ([0-9]+) sec/.test(dataByLine[i])
            ? parseInt(RegExp.$1)
            : undefined,
        });
    }

    cache.set(cacheKey, videos, 300);

    return videos;
  };

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
