import axios from 'axios';
import { UserData } from '../types';
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

    const userData = {
      displayName: rawUserData.display_name,
      profileImageUrl: rawUserData.profile_image_url,
      description: rawUserData.description,
    };

    cache.set(cacheKey, userData, 86400);

    return userData;
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
}

export default TwitchService;
