import { eq, desc, and, sql } from "drizzle-orm";
import { getDb } from "./db";
import { notifications, users } from "../drizzle/schema";

export type NotificationType = 
  | "message" 
  | "friend_request" 
  | "friend_accepted" 
  | "story_view" 
  | "post_like" 
  | "post_comment" 
  | "follow";

export async function createNotification(
  userId: number,
  type: NotificationType,
  actorId: number,
  targetId?: number,
  content?: string
) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(notifications).values({
    userId,
    type: type as any,
    actorId,
    targetId,
    content,
    isRead: false,
  });

  return {
    id: (result as any).insertId,
    userId,
    type,
    actorId,
    targetId,
    content,
    isRead: false,
    createdAt: new Date(),
  };
}

export async function getNotifications(userId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .innerJoin(users, eq(notifications.actorId, users.id))
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUnreadNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .innerJoin(users, eq(notifications.actorId, users.id))
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
    .orderBy(desc(notifications.createdAt));
}

export async function getUnreadCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

  return result[0]?.count || 0;
}

export async function markAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId));
}

export async function markAllAsRead(userId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}

export async function deleteNotification(notificationId: number) {
  const db = await getDb();
  if (!db) return;

  await db.delete(notifications).where(eq(notifications.id, notificationId));
}

export async function deleteAllNotifications(userId: number) {
  const db = await getDb();
  if (!db) return;

  await db.delete(notifications).where(eq(notifications.userId, userId));
}

// Helper functions for creating specific notification types
export async function notifyNewMessage(conversationId: number, actorId: number, recipientId: number) {
  return await createNotification(
    recipientId,
    "message" as NotificationType,
    actorId,
    conversationId,
    "sent you a message"
  );
}

export async function notifyFriendRequest(actorId: number, recipientId: number) {
  return await createNotification(
    recipientId,
    "friendRequest" as NotificationType,
    actorId,
    undefined,
    "sent you a friend request"
  );
}

export async function notifyStoryView(storyId: number, viewerId: number, storyOwnerId: number) {
  return await createNotification(
    storyOwnerId,
    "storyView" as NotificationType,
    viewerId,
    storyId,
    "viewed your story"
  );
}

export async function notifyPostLike(postId: number, likerId: number, postOwnerId: number) {
  return await createNotification(
    postOwnerId,
    "like" as NotificationType,
    likerId,
    postId,
    "liked your post"
  );
}

export async function notifyPostComment(postId: number, commenterId: number, postOwnerId: number, commentText: string) {
  return await createNotification(
    postOwnerId,
    "comment" as NotificationType,
    commenterId,
    postId,
    `commented: "${commentText.substring(0, 50)}..."`
  );
}

export async function notifyFollow(followerId: number, followingId: number) {
  return await createNotification(
    followingId,
    "follow" as NotificationType,
    followerId,
    undefined,
    "started following you"
  );
}
