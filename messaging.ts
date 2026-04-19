import { eq, and, or, desc, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  conversations,
  conversationMembers,
  messages,
  relationships,
  users,
} from "../drizzle/schema";

// Conversation queries
export async function getOrCreateOneOnOneConversation(userId1: number, userId2: number) {
  const db = await getDb();
  if (!db) return null;

  // Find existing one-on-one conversation
  const existing = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.isGroup, false),
        or(
          and(
            sql`EXISTS (SELECT 1 FROM conversationMembers cm1 WHERE cm1.conversationId = conversations.id AND cm1.userId = ${userId1})`,
            sql`EXISTS (SELECT 1 FROM conversationMembers cm2 WHERE cm2.conversationId = conversations.id AND cm2.userId = ${userId2})`
          )
        )
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new one-on-one conversation
  const result = await db.insert(conversations).values({
    isGroup: false,
    createdBy: userId1,
  });

  const conversationId = (result as any).insertId as number;

  // Add members
  await db.insert(conversationMembers).values([
    { conversationId, userId: userId1 },
    { conversationId, userId: userId2 },
  ]);

  return { id: conversationId, isGroup: false, createdBy: userId1, createdAt: new Date(), updatedAt: new Date() };
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(conversations)
    .innerJoin(conversationMembers, eq(conversationMembers.conversationId, conversations.id))
    .where(eq(conversationMembers.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

// Message queries
export async function createMessage(
  conversationId: number,
  senderId: number,
  content: string,
  type: "text" | "image" | "video" | "document" | "voice" = "text",
  mediaUrl?: string
) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(messages).values({
    conversationId,
    senderId,
    content,
    type,
    mediaUrl,
    isRead: false,
  });

  return { id: (result as any).insertId, conversationId, senderId, content, type, mediaUrl, isRead: false, createdAt: new Date() };
}

export async function getConversationMessages(conversationId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function markMessageAsRead(messageId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(messages)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(messages.id, messageId));
}

export async function addMessageReaction(messageId: number, emoji: string, userId: number) {
  const db = await getDb();
  if (!db) return;

  const message = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
  if (message.length === 0) return;

  const reactions = message[0].reactions as any[] || [];
  const existingReaction = reactions.find((r) => r.emoji === emoji);

  if (existingReaction) {
    if (!existingReaction.userIds.includes(userId)) {
      existingReaction.userIds.push(userId);
    }
  } else {
    reactions.push({ emoji, userIds: [userId] });
  }

  await db.update(messages).set({ reactions }).where(eq(messages.id, messageId));
}

// Relationship queries
export async function sendFriendRequest(fromUserId: number, toUserId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(relationships).values({
    userId: fromUserId,
    targetUserId: toUserId,
    type: "friend",
    status: "pending",
  });

  return { id: (result as any).insertId, userId: fromUserId, targetUserId: toUserId, type: "friend", status: "pending" };
}

export async function acceptFriendRequest(fromUserId: number, toUserId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(relationships)
    .set({ status: "accepted" })
    .where(
      and(
        eq(relationships.userId, fromUserId),
        eq(relationships.targetUserId, toUserId),
        eq(relationships.type, "friend")
      )
    );

  // Create reciprocal relationship
  await db.insert(relationships).values({
    userId: toUserId,
    targetUserId: fromUserId,
    type: "friend",
    status: "accepted",
  });
}

export async function rejectFriendRequest(fromUserId: number, toUserId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(relationships)
    .set({ status: "rejected" })
    .where(
      and(
        eq(relationships.userId, fromUserId),
        eq(relationships.targetUserId, toUserId),
        eq(relationships.type, "friend")
      )
    );
}

export async function blockUser(userId: number, blockedUserId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(relationships).values({
    userId,
    targetUserId: blockedUserId,
    type: "blocked",
    status: "accepted",
  });

  return { id: (result as any).insertId, userId, targetUserId: blockedUserId, type: "blocked", status: "accepted" };
}

export async function unblockUser(userId: number, blockedUserId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .delete(relationships)
    .where(
      and(
        eq(relationships.userId, userId),
        eq(relationships.targetUserId, blockedUserId),
        eq(relationships.type, "blocked")
      )
    );
}

export async function getUserFriends(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({ user: users })
    .from(relationships)
    .innerJoin(users, eq(relationships.targetUserId, users.id))
    .where(
      and(
        eq(relationships.userId, userId),
        eq(relationships.type, "friend"),
        eq(relationships.status, "accepted")
      )
    );
}

export async function getPendingFriendRequests(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({ user: users, relationship: relationships })
    .from(relationships)
    .innerJoin(users, eq(relationships.userId, users.id))
    .where(
      and(
        eq(relationships.targetUserId, userId),
        eq(relationships.type, "friend"),
        eq(relationships.status, "pending")
      )
    );
}

export async function getBlockedUsers(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({ user: users })
    .from(relationships)
    .innerJoin(users, eq(relationships.targetUserId, users.id))
    .where(
      and(
        eq(relationships.userId, userId),
        eq(relationships.type, "blocked")
      )
    );
}
