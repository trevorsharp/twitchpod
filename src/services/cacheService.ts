import { Redis } from '@upstash/redis';
import NodeCache from 'node-cache';

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
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

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

const withCache =
  <TFunc extends (...args: any[]) => Promise<any>>(cachePrefix: string, ttl: number, func: TFunc) =>
  async (...args: Parameters<TFunc>): Promise<Awaited<ReturnType<TFunc>>> => {
    const cacheKey = `${cachePrefix}${args.join('-')}`;
    const cacheResult = await get<Awaited<ReturnType<TFunc>>>(cacheKey);

    if (cacheResult) return cacheResult;

    const result = await func(...args);

    if (result) set<Awaited<ReturnType<TFunc>>>(cacheKey, result, ttl);

    return result;
  };

export { get, set, withCache };
