import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { getUserData } from '~/services/twitchService';

const userRouter = createTRPCRouter({
  getUserData: publicProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(({ input }) => getUserData(input.username)),
});

export default userRouter;
