import { Quality } from '~/types';
import cacheService from './cacheService';
import { getVodPlaylist } from './m3u8Service';

const getStream = async (videoId: string, quality: Quality): Promise<string> => {
  const cacheKey = `playlist-data-${videoId}-${quality}`;
  const cacheResult = await cacheService.get(cacheKey);
  if (cacheResult) return cacheResult as string;

  const playlistData = await getPlaylistData(videoId, quality);

  if (playlistData === '') throw `Video not found with id ${videoId}`;

  await cacheService.set(cacheKey, playlistData, 300);

  return playlistData;
};

const getPlaylistData = async (videoId: string, quality: Quality): Promise<string> => {
  const [rawPlaylist, playlistData] = await getVodPlaylist(videoId);

  let playlistUrl = playlistData[0]?.url ?? '';

  switch (quality) {
    case Quality.Auto:
      return rawPlaylist;
    case Quality.P720:
      const url720p = playlistData.find((x) => x.quality === '720p')?.url;
      if (url720p) playlistUrl = url720p;
      break;
    case Quality.P480:
      const url480p = playlistData.find((x) => x.quality === '480p')?.url;
      if (url480p) playlistUrl = url480p;
      break;
    case Quality.Audio:
      const urlAudioOnly = playlistData.find((x) => x.quality === 'Audio Only')?.url;
      if (urlAudioOnly) playlistUrl = urlAudioOnly;
      break;
  }

  const response = await fetch(playlistUrl);
  if (response.status !== 200) throw 'Failed to fetch content stream';

  const baseStreamUrl = playlistUrl.replace(/index[^\.]*\.m3u8/i, '');
  const m3u8 = (await response.text()).replaceAll(/\n([0-9]+[^\.]*\.ts)/gi, `\n${baseStreamUrl}$1`);

  return m3u8;
};

export { getStream };
