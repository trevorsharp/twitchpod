import { z } from 'zod';

const envSchema = z.object({
  TWITCH_API_CLIENT_ID: z.string(),
  TWITCH_API_SECRET: z.string(),
});

export default envSchema;
