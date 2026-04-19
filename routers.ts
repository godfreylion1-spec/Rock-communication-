import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getUserById, updateUserProfile, setUserOnlineStatus } from "./db";
import { messagingRouter } from "./messaging-router";
import { feedRouter } from "./feed-router";
import { storiesRouter } from "./stories-router";
import { notificationsRouter } from "./notifications-router";
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await getUserById(ctx.user.id);
    }),
    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          bio: z.string().optional(),
          status: z.string().optional(),
          avatarUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await updateUserProfile(ctx.user.id, input);
      }),
    setOnlineStatus: protectedProcedure
      .input(z.object({ isOnline: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        await setUserOnlineStatus(ctx.user.id, input.isOnline);
        return { success: true };
      }),
  }),

  messaging: messagingRouter,
  feed: feedRouter,
  stories: storiesRouter,
  notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
