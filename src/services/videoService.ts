import { spawn } from 'child_process';
import NodeCache from 'node-cache';
import { Quality } from '../types';

const cache = new NodeCache({ checkperiod: 120 });

const getStream = async (videoId: string, quality: Quality): Promise<string> => {
  const streamUrl = await getStreamUrl(videoId, quality);

  const response = await fetch(streamUrl);

  if (response.status !== 200) throw 'Failed to fetch content stream';

  const baseStreamUrl = streamUrl.replace(/index[^\.]*\.m3u8/i, '');

  const m3u8 = (await response.text()).replaceAll(/\n([0-9]+[^\.]*\.ts)/gi, `\n${baseStreamUrl}$1`);

  return m3u8;
};

const getStreamUrl = async (videoId: string, quality: Quality): Promise<string> => {
  const cacheKey = `video-url-${videoId}-${quality}`;
  const cacheResult = cache.get(cacheKey);
  if (cacheResult) return cacheResult as string;

  const videoUrl = await getVideoUrl(videoId, quality);

  if (videoUrl === '') throw `Video not found with id ${videoId}`;

  cache.set(cacheKey, videoUrl, 300);

  return videoUrl;
};

const getVideoUrl = async (videoId: string, quality: Quality): Promise<string> => {
  const data = await spawnChild(['info', videoId]);

  let resolution = 'chunked';

  switch (quality) {
    case Quality.P720:
      resolution = '720p[0-9]{2}';
      break;
    case Quality.P480:
      resolution = '480p[0-9]{2}';
      break;
    case Quality.Audio:
      resolution = '480p[0-9]{2}';
  }

  const regex = new RegExp(`${resolution} ([^\n]*)`, 'gi');
  const match = data.match(regex);

  return match && match.length > 0 ? match[0]?.replace(regex, '$1') ?? '' : '';
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

export { getStream };
