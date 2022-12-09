import { User, Video } from '../types';
import cacheService from './cacheService';

const getUserData = async (rawUsername: string): Promise<User> => {
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

const getRawUserData = async (username: string): Promise<any> => {
  const cacheKey = `twitch-api-raw-user-data-${username}`;
  const cacheResult = await cacheService.get(cacheKey);
  if (cacheResult) return cacheResult;

  const data = await getTwitch(`https://api.twitch.tv/helix/users?login=${username}`);

  if (!data || !data.data || data.data.length === 0)
    throw `Sorry, we could not find the user "${username}" 🙁`;

  const rawUserData = data.data[0];

  await cacheService.set(cacheKey, rawUserData, 86400);

  return rawUserData;
};

const getVideos = async (userId: string): Promise<Video[]> => {
  const cacheKey = `twitch-api-user-videos-${userId}`;
  const cacheResult = await cacheService.get(cacheKey);
  if (cacheResult) return cacheResult as Video[];

  const data = await getTwitch(`https://api.twitch.tv/helix/videos?user_id=${userId}`);

  if (!data || !data.data || data.data.length === 0) return [];

  const currentStreamData = await getTwitch(
    `https://api.twitch.tv/helix/streams?user_id=${userId}`
  );

  const currentStream =
    currentStreamData && currentStreamData.data && currentStreamData.data.length > 0
      ? currentStreamData.data[0]
      : undefined;

  const videos = data.data
    .map((video: any) => ({
      id: video.id,
      title: video.title,
      date: video.published_at,
      url: `https://twitch.tv/videos/${video.id}`,
      duration:
        currentStream &&
        Math.abs(
          new Date(currentStream.started_at).getTime() - new Date(video.published_at).getTime()
        ) < 900000
          ? undefined
          : getDuration(video.duration),
      type: video.type,
    }))
    .filter((video: any) => video.type === 'upload' || video.type === 'archive');

  await cacheService.set(cacheKey, videos, 600);

  return videos;
};

const getTwitch = async (url: string): Promise<any> => {
  const cacheKey = `twitch-api-token`;
  let token = await cacheService.get(cacheKey);

  if (!token) {
    const data = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_API_CLIENT_ID}&client_secret=${process.env.TWITCH_API_SECRET}&grant_type=client_credentials`,
      { method: 'POST' }
    ).then((response) => response.json());

    if (!data || !data.access_token || !data.expires_in) throw 'Could not get Twith API token';

    token = data.access_token;
    await cacheService.set(cacheKey, token, data.expires_in - 300);
  }

  const headers: any = { Authorization: `Bearer ${token}` };
  headers['Client-Id'] = process.env.TWITCH_API_CLIENT_ID;
  const data = await fetch(url, { headers }).then((response) => response.json());

  return data;
};

const getDuration = (duration: string | undefined): number => {
  if (!duration) return 0;

  const getTimePart = (letter: 'h' | 'm' | 's') =>
    parseInt(duration.match(new RegExp('[0-9]+(?=' + letter + ')'))?.find(() => true) ?? '0');

  const hours = getTimePart('h');
  const minutes = getTimePart('m');
  const seconds = getTimePart('s');

  return hours * 3600 + minutes * 60 + seconds;
};

export { getUserData, getVideos };
