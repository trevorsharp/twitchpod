import cache from '../cache';

type Video = {
  id: string;
  title: string;
  date: string;
  description: string;
  duration: number;
  url: string;
};

type RawUserData = {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  description: string;
};

type User = {
  id: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  description: string;
  videos: Video[];
};

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
    videos: await getVideos(rawUserData.id),
  };

  return user;
};

const getRawUserData = async (username: string): Promise<RawUserData> => {
  const cacheKey = `twitch-api-raw-user-data-${username}`;
  const cacheResult = cache.get(cacheKey);
  if (cacheResult) return cacheResult as RawUserData;

  const token = await getToken();

  const headers: any = { Authorization: `Bearer ${token}` };
  headers['Client-Id'] = process.env.TWITCH_API_CLIENT_ID;
  const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
    headers,
  });

  if (response.status !== 200) throw response.statusText;

  const data = await response.json();

  if (!data || !data.data || data.data.length === 0)
    throw `Sorry, we could not find the user "${username}" 🙁`;

  const rawUserData = data.data[0];

  cache.set(cacheKey, rawUserData, 86400);

  return rawUserData as RawUserData;
};

const getVideos = async (userId: string): Promise<Video[]> => {
  const cacheKey = `twitch-api-user-videos-${userId}`;
  const cacheResult = cache.get(cacheKey);
  if (cacheResult) return cacheResult as Video[];

  const token = await getToken();

  const headers: any = { Authorization: `Bearer ${token}` };
  headers['Client-Id'] = process.env.TWITCH_API_CLIENT_ID;
  const data = await fetch(`https://api.twitch.tv/helix/videos?user_id=${userId}`, {
    headers,
  }).then((response) => response.json());

  if (!data || !data.data || data.data.length === 0) return [];

  const videos = data.data.map((v: any) => ({
    id: v.id,
    title: v.title,
    date: v.published_at,
    url: v.url,
    duration: getDuration(v.duration),
  }));

  cache.set(cacheKey, videos, 500);

  return videos;
};

const getToken = async (): Promise<string> => {
  const cacheKey = `twitch-api-token`;
  const cacheResult = cache.get(cacheKey);
  if (cacheResult) return cacheResult as string;

  const data = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_API_CLIENT_ID}&client_secret=${process.env.TWITCH_API_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  ).then((response) => response.json());

  if (!data || !data.access_token || !data.expires_in) throw 'Could not get Twith API token';

  const token = data.access_token;
  cache.set(cacheKey, token, data.expires_in - 300);

  return token;
};

const getDuration = (duration: string): number => {
  const splitTime = duration
    .replace('h', ':')
    .replace('m', ':')
    .replace('s', '')
    .split(':')
    .map((t) => parseInt(t))
    .map((t) => (isNaN(t) ? 0 : t));

  let seconds = 0;
  let multiplier = 1;

  while (splitTime.length > 0) {
    seconds += splitTime.pop()! * multiplier;
    multiplier *= 60;
  }

  return seconds;
};

export { getUserData };
export type { User };
