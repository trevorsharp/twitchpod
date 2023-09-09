import cacheService from './cacheService';
import type { User, Video } from '~/types';

type DataWrapper<T> = { data?: T };

type RawUser = {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  description: string;
};

type RawVideo = {
  id: string;
  title: string;
  published_at: string;
  duration?: string;
  type: string;
};

type RawCurrentStream = { started_at: string };

const getUserData = async (rawUsername: string) => {
  const username = rawUsername.trim().toLowerCase();

  if (!username.match(new RegExp(/^[a-z0-9][a-z0-9_]{0,24}$/gi)))
    throw `Sorry, "${username}" is not a valid Twitch username 🤷`;

  const rawUserData = await getRawUserData(username);

  const user: User = {
    id: rawUserData.id,
    username: rawUserData.login,
    displayName: rawUserData.display_name,
    profileImageUrl: rawUserData.profile_image_url,
    description: rawUserData.description,
    url: `https://twitch.tv/${rawUserData.login}`,
  };

  return user;
};

const getRawUserData = async (username: string) => {
  const cacheKey = `twitch-api-raw-user-data-${username}`;
  const cacheResult = await cacheService.get<RawUser>(cacheKey);
  if (cacheResult) return cacheResult;

  const data = await getTwitch<DataWrapper<RawUser[]>>(
    `https://api.twitch.tv/helix/users?login=${username}`,
  );

  if (!data || !data.data || data.data.length === 0)
    throw `Sorry, we could not find the user "${username}" 🙁`;

  const rawUserData = data.data[0];

  if (!rawUserData) throw `Sorry, we could not find the user "${username}" 🙁`;

  await cacheService.set(cacheKey, rawUserData, 3 * 86400);

  return rawUserData;
};

const getVideos = async (userId: string) => {
  const cacheKey = `twitch-api-user-videos-${userId}`;
  const cacheResult = await cacheService.get<Video[]>(cacheKey);
  if (cacheResult) return cacheResult;

  const data = await getTwitch<DataWrapper<RawVideo[]>>(
    `https://api.twitch.tv/helix/videos?user_id=${userId}`,
  );

  if (!data || !data.data || data.data.length === 0) return [];

  const currentStreamData = await getTwitch<DataWrapper<RawCurrentStream[]>>(
    `https://api.twitch.tv/helix/streams?user_id=${userId}`,
  );

  const currentStream =
    currentStreamData && currentStreamData.data && currentStreamData.data.length > 0
      ? currentStreamData.data[0]
      : undefined;

  const videos = data.data
    .filter((rawVideo) => rawVideo.type === 'upload' || rawVideo.type === 'archive')
    .map((rawVideo) => {
      const video: Video = {
        id: rawVideo.id,
        title: rawVideo.title,
        date: rawVideo.published_at,
        url: `https://twitch.tv/videos/${rawVideo.id}`,
        duration:
          currentStream &&
          Math.abs(
            new Date(currentStream.started_at).getTime() -
              new Date(rawVideo.published_at).getTime(),
          ) < 900000
            ? undefined
            : getDuration(rawVideo.duration),
      };

      return video;
    });

  await cacheService.set(cacheKey, videos, 600);

  return videos;
};

const getTwitch = async <T>(url: string) => {
  const cacheKey = `twitch-api-token`;
  let token = await cacheService.get<string>(cacheKey);

  if (!token) {
    const data = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_API_CLIENT_ID}&client_secret=${process.env.TWITCH_API_SECRET}&grant_type=client_credentials`,
      { method: 'POST' },
    ).then(
      (response) => response.json() as Promise<{ access_token?: string; expires_in?: number }>,
    );

    if (!data || !data.access_token || !data.expires_in) throw 'Could not get Twith API token';

    token = data.access_token;
    await cacheService.set(cacheKey, token, data.expires_in - 300);
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Client-Id': process.env.TWITCH_API_CLIENT_ID ?? '',
  };
  const data = await fetch(url, { headers }).then((response) => response.json() as Promise<T>);

  return data;
};

const getDuration = (duration: string | undefined) => {
  if (!duration) return 0;

  const getTimePart = (letter: 'h' | 'm' | 's') =>
    parseInt(duration.match(new RegExp('[0-9]+(?=' + letter + ')'))?.find(() => true) ?? '0');

  const hours = getTimePart('h');
  const minutes = getTimePart('m');
  const seconds = getTimePart('s');

  return hours * 3600 + minutes * 60 + seconds;
};

export { getUserData, getVideos };
