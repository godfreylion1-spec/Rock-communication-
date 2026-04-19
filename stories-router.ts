import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createStory,
  getActiveStories,
  getUserStories,
  getStory,
  deleteStory,
  viewStory,
  getStoryViews,
  getStoryViewCount,
  hasUserViewedStory,
} from "./stories";

export const storiesRouter = router({
  // Story procedures
  createStory: protectedProcedure
    .input(
      z.object({
        mediaUrl: z.string(),
        type: z.enum(["image", "video"]).default("image"),
        caption: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createStory(ctx.user.id, input.mediaUrl, input.type, input.caption);
    }),

  getActiveStories: protectedProcedure.query(async () => {
    return await getActiveStories(0); // Get all active stories
  }),

  getUserStories: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await getUserStories(input.userId);
    }),

  getStory: protectedProcedure
    .input(z.object({ storyId: z.number() }))
    .query(async ({ input }) => {
      return await getStory(input.storyId);
    }),

  deleteStory: protectedProcedure
    .input(z.object({ storyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteStory(input.storyId, ctx.user.id);
      return { success: true };
    }),

  // View procedures
  viewStory: protectedProcedure
    .input(z.object({ storyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await viewStory(input.storyId, ctx.user.id);
    }),

  getStoryViews: protectedProcedure
    .input(z.object({ storyId: z.number() }))
    .query(async ({ input }) => {
      return await getStoryViews(input.storyId);
    }),

  getStoryViewCount: protectedProcedure
    .input(z.object({ storyId: z.number() }))
    .query(async ({ input }) => {
      return await getStoryViewCount(input.storyId);
    }),

  hasViewed: protectedProcedure
    .input(z.object({ storyId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await hasUserViewedStory(input.storyId, ctx.user.id);
    }),
});
