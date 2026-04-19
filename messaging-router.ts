import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getOrCreateOneOnOneConversation,
  getUserConversations,
  createMessage,
  getConversationMessages,
  markMessageAsRead,
  addMessageReaction,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  blockUser,
  unblockUser,
  getUserFriends,
  getPendingFriendRequests,
  getBlockedUsers,
} from "./messaging";

export const messagingRouter = router({
  // Conversation procedures
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    return await getUserConversations(ctx.user.id);
  }),

  getOrCreateOneOnOne: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await getOrCreateOneOnOneConversation(ctx.user.id, input.userId);
    }),

  // Message procedures
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        content: z.string(),
        type: z.enum(["text", "image", "video", "document", "voice"]).default("text"),
        mediaUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createMessage(
        input.conversationId,
        ctx.user.id,
        input.content,
        input.type,
        input.mediaUrl
      );
    }),

  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number(), limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return await getConversationMessages(input.conversationId, input.limit, input.offset);
    }),

  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ input }) => {
      await markMessageAsRead(input.messageId);
      return { success: true };
    }),

  addReaction: protectedProcedure
    .input(z.object({ messageId: z.number(), emoji: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await addMessageReaction(input.messageId, input.emoji, ctx.user.id);
      return { success: true };
    }),

  // Friend request procedures
  sendFriendRequest: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await sendFriendRequest(ctx.user.id, input.userId);
    }),

  acceptFriendRequest: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await acceptFriendRequest(input.userId, ctx.user.id);
      return { success: true };
    }),

  rejectFriendRequest: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await rejectFriendRequest(input.userId, ctx.user.id);
      return { success: true };
    }),

  // Block procedures
  blockUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await blockUser(ctx.user.id, input.userId);
    }),

  unblockUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await unblockUser(ctx.user.id, input.userId);
      return { success: true };
    }),

  // Get friends and requests
  getFriends: protectedProcedure.query(async ({ ctx }) => {
    return await getUserFriends(ctx.user.id);
  }),

  getPendingRequests: protectedProcedure.query(async ({ ctx }) => {
    return await getPendingFriendRequests(ctx.user.id);
  }),

  getBlockedUsers: protectedProcedure.query(async ({ ctx }) => {
    return await getBlockedUsers(ctx.user.id);
  }),
});
