import userRouter from './routers/userRouter';
import { createTRPCRouter } from '~/server/api/trpc';

export const appRouter = createTRPCRouter({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
