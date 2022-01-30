import axios from 'axios';
import { UserData, Video } from '../types';
import cache from '../utilities/cache';

class TwitchService {
  static getTwitchUserData = async (username: string): Promise<UserData | undefined> => {
    const cacheKey = `twitch-api-user-data-${username}`;
    const cacheResult = cache.get(cacheKey);
    if (cacheResult) return cacheResult;

    const token = await this.getToken();

    const headers: any = { Authorization: `Bearer ${token}` };
    headers['Client-Id'] = process.env.TWITCH_API_CLIENT_ID;
    const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
      headers,
    });

    if (response.status !== 200 || !response.data.data || response.data.data.length === 0) {
      console.log(`Twitch API Error: ${response.statusText}`);
      return undefined;
    }

    const rawUserData = response.data.data[0];

    const userData: UserData = {
      id: rawUserData.id,
      displayName: rawUserData.display_name,
      profileImageUrl: rawUserData.profile_image_url,
      description: rawUserData.description,
      videos: await this.getVideos(rawUserData.id),
    };

    cache.set(cacheKey, userData, 86400);

    return userData;
  };

  private static getVideos = async (userId: string): Promise<Video[]> => {
    const token = await this.getToken();

    const headers: any = { Authorization: `Bearer ${token}` };
    headers['Client-Id'] = process.env.TWITCH_API_CLIENT_ID;
    const response = await axios.get(`https://api.twitch.tv/helix/videos?user_id=${userId}`, {
      headers,
    });

    if (response.status !== 200 || !response.data.data || response.data.data.length === 0) {
      console.log(`Twitch API Error: ${response.statusText}`);
      return [];
    }

    return response.data.data.map((v: any) => ({
      id: v.id,
      title: v.title,
      date: v.published_at,
      url: v.url,
      duration: this.getDuration(v.duration),
    }));
  };

  private static getToken = async (): Promise<string> => {
    const cacheKey = `twitch-api-token`;
    const cacheResult = cache.get(cacheKey);
    if (cacheResult) return cacheResult as string;

    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_API_CLIENT_ID}&client_secret=${process.env.TWITCH_API_SECRET}&grant_type=client_credentials`
    );

    if (response.status !== 200) {
      console.log(`Twitch API Error: ${response.statusText}`);
      return '';
    }

    const token = response.data.access_token;
    cache.set(cacheKey, token, response.data.expires_in - 300);

    return token;
  };

  private static getDuration = (duration: string): number => {
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
}

export default TwitchService;
