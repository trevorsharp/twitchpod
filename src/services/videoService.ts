import { Quality } from '../types';
import cacheService from './cacheService';
import { getVod } from './m3u8Service';

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
  const cacheResult = await cacheService.get(cacheKey);
  if (cacheResult) return cacheResult as string;

  const videoUrl = await getVideoUrl(videoId, quality);

  if (videoUrl === '') throw `Video not found with id ${videoId}`;

  await cacheService.set(cacheKey, videoUrl, 300);

  return videoUrl;
};

const getVideoUrl = async (videoId: string, quality: Quality): Promise<string> => {
  const vodData = await getVod(videoId);

  switch (quality) {
    case Quality.P720:
      const url720p = vodData.find((x) => x.quality === '720p')?.url;
      if (url720p) return url720p;
      break;
    case Quality.P480:
      const url480p = vodData.find((x) => x.quality === '480p')?.url;
      if (url480p) return url480p;
      break;
    case Quality.Audio:
      const urlAudioOnly = vodData.find((x) => x.quality === 'Audio Only')?.url;
      if (urlAudioOnly) return urlAudioOnly;
      break;
  }

  return vodData[0]?.url ?? '';
};

export { getStream };
