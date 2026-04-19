import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "./notifications";

export const notificationsRouter = router({
  // Get all notifications
  getNotifications: protectedProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      return await getNotifications(ctx.user.id, input.limit, input.offset);
    }),

  // Get unread notifications
  getUnreadNotifications: protectedProcedure.query(async ({ ctx }) => {
    return await getUnreadNotifications(ctx.user.id);
  }),

  // Get unread count
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await getUnreadCount(ctx.user.id);
  }),

  // Mark single notification as read
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      await markAsRead(input.notificationId);
      return { success: true };
    }),

  // Mark all notifications as read
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await markAllAsRead(ctx.user.id);
    return { success: true };
  }),

  // Delete single notification
  deleteNotification: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      await deleteNotification(input.notificationId);
      return { success: true };
    }),

  // Delete all notifications
  deleteAllNotifications: protectedProcedure.mutation(async ({ ctx }) => {
    await deleteAllNotifications(ctx.user.id);
    return { success: true };
  }),
});
