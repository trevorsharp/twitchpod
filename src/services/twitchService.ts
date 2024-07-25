import "server-only";
import { env } from "~/env";
import type { User, Video } from "~/types";

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
  const data = await getTwitch<DataWrapper<RawUser[]>>(
    `https://api.twitch.tv/helix/users?login=${username}`,
    { ttl: 3 * 24 * 60 * 60 },
  );

  if (!data?.data || data.data.length === 0)
    throw `Sorry, we could not find the user "${username}" 🙁`;

  const rawUserData = data.data[0];

  if (!rawUserData) throw `Sorry, we could not find the user "${username}" 🙁`;

  return rawUserData;
};

const getVideos = async (userId: string) => {
  const data = await getTwitch<DataWrapper<RawVideo[]>>(
    `https://api.twitch.tv/helix/videos?user_id=${userId}`,
  );

  if (!data?.data || data.data.length === 0) return [];

  const currentStreamData = await getTwitch<DataWrapper<RawCurrentStream[]>>(
    `https://api.twitch.tv/helix/streams?user_id=${userId}`,
  );

  const currentStream =
    currentStreamData?.data && currentStreamData.data.length > 0
      ? currentStreamData.data[0]
      : undefined;

  const videos = data.data
    .filter((rawVideo) => rawVideo.type === "upload" || rawVideo.type === "archive")
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

  return videos;
};

const getTwitchToken = async () => {
  const data = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${env.TWITCH_API_CLIENT_ID}&client_secret=${env.TWITCH_API_SECRET}&grant_type=client_credentials`,
    { method: "POST", next: { revalidate: 2 * 60 * 60 } },
  ).then((response) => response.json() as Promise<{ access_token?: string; expires_in?: number }>);

  if (!data?.access_token || !data?.expires_in) throw "Could not get Twith API token";

  return data.access_token;
};

const getTwitch = async <T>(url: string, options?: { ttl?: number }) => {
  const token = await getTwitchToken();

  const headers = {
    Authorization: `Bearer ${token}`,
    "Client-Id": env.TWITCH_API_CLIENT_ID,
  };

  const cacheOptions = options?.ttl
    ? ({ next: { revalidate: options?.ttl ?? 0 } } as const)
    : ({ cache: "no-store" } as const);

  const data = await fetch(url, { headers, ...cacheOptions }).then(
    (response) => response.json() as Promise<T>,
  );

  return data;
};

const getDuration = (duration: string | undefined) => {
  if (!duration) return 0;

  const getTimePart = (letter: "h" | "m" | "s") =>
    parseInt(duration.match(new RegExp("[0-9]+(?=" + letter + ")"))?.find(() => true) ?? "0");

  const hours = getTimePart("h");
  const minutes = getTimePart("m");
  const seconds = getTimePart("s");

  return hours * 3600 + minutes * 60 + seconds;
};

export { getUserData, getVideos };
