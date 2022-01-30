import { spawn } from 'child_process';
import cache from '../utilities/cache';
import { StatusWrapper } from '../utilities/types';

export const getStreamUrl = async (videoId: string): Promise<StatusWrapper<string>> => {
  const cacheKey = `video-url-${videoId}`;
  const cacheResult = cache.get(cacheKey);
  if (cacheResult) return { body: cacheResult as string };

  const videoUrl = await getVideoUrl(videoId);

  if (videoUrl === '')
    return { errorMessage: `Video not found with id ${videoId}`, statusCode: 404 };

  cache.set(cacheKey, videoUrl, 300);

  return { body: videoUrl };
};

const getVideoUrl = async (videoId: string): Promise<string> => {
  const data = await spawnChild(['info', videoId]);

  return /chunked ([^\n]*)/.test(data) ? RegExp.$1 : '';
};

const spawnChild = async (args: string[]) => {
  const child = spawn('twitch-dl', args);

  let data = '';
  for await (const chunk of child.stdout) data += chunk;

  await new Promise((resolve, _) => child.on('close', resolve));

  return data.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
};
