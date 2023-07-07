import NodeCache from 'node-cache';
import { Redis } from '@upstash/redis';
import { env } from '~/env.mjs';

const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : undefined;

const cache = new NodeCache({ checkperiod: 120 });

const get = async <T>(key: string) => {
  if (redis) {
    return await redis.get<T>(key);
  }

  return cache.get<T>(key);
};

const set = async <T>(key: string, value: T, ttl: number) => {
  if (redis) {
    return (await redis.set<T>(key, value, { ex: ttl })) !== null;
  }

  return cache.set<T>(key, value, ttl);
};

const del = async (key: string | string[]) => {
  if (redis) {
    return await redis.del(...(typeof key === 'string' ? [key] : key));
  }

  return cache.del(key);
};

const cacheService = { get, set, del };

export default cacheService;
