import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createFeedPost,
  getFeedPosts,
  getUserFeedPosts,
  getFeedPost,
  deleteFeedPost,
  likeFeedPost,
  unlikeFeedPost,
  getPostLikes,
  hasUserLikedPost,
  commentOnPost,
  deleteComment,
  getPostComments,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
  isUserFollowing,
} from "./feed";

export const feedRouter = router({
  // Post procedures
  createPost: protectedProcedure
    .input(
      z.object({
        photoUrl: z.string(),
        caption: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createFeedPost(ctx.user.id, input.photoUrl, input.caption, input.location);
    }),

  getFeedPosts: protectedProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return await getFeedPosts(input.limit, input.offset);
    }),

  getUserPosts: protectedProcedure
    .input(z.object({ userId: z.number(), limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return await getUserFeedPosts(input.userId, input.limit, input.offset);
    }),

  getPost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      return await getFeedPost(input.postId);
    }),

  deletePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteFeedPost(input.postId, ctx.user.id);
      return { success: true };
    }),

  // Like procedures
  likePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await likeFeedPost(input.postId, ctx.user.id);
    }),

  unlikePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await unlikeFeedPost(input.postId, ctx.user.id);
      return { success: true };
    }),

  getPostLikes: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      return await getPostLikes(input.postId);
    }),

  hasLiked: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await hasUserLikedPost(input.postId, ctx.user.id);
    }),

  // Comment procedures
  commentOnPost: protectedProcedure
    .input(z.object({ postId: z.number(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await commentOnPost(input.postId, ctx.user.id, input.content);
    }),

  deleteComment: protectedProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteComment(input.commentId, ctx.user.id);
      return { success: true };
    }),

  getPostComments: protectedProcedure
    .input(z.object({ postId: z.number(), limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return await getPostComments(input.postId, input.limit, input.offset);
    }),

  // Follow procedures
  followUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await followUser(ctx.user.id, input.userId);
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await unfollowUser(ctx.user.id, input.userId);
      return { success: true };
    }),

  getFollowers: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await getUserFollowers(input.userId);
    }),

  getFollowing: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await getUserFollowing(input.userId);
    }),

  isFollowing: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await isUserFollowing(ctx.user.id, input.userId);
    }),
});
