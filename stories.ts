import { eq, desc, and, gt, sql } from "drizzle-orm";
import { getDb } from "./db";
import { stories, storyViews, users } from "../drizzle/schema";

// Story queries
export async function createStory(
  userId: number,
  mediaUrl: string,
  type: "image" | "video" = "image",
  caption?: string
) {
  const db = await getDb();
  if (!db) return null;

  // Set expiration to 24 hours from now
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const result = await db.insert(stories).values({
    userId,
    mediaUrl,
    type,
    caption,
    expiresAt,
  });

  return {
    id: (result as any).insertId,
    userId,
    mediaUrl,
    type,
    caption,
    expiresAt,
    createdAt: new Date(),
  };
}

export async function getActiveStories(userId: number) {
  const db = await getDb();
  if (!db) return [];

  // Get stories that haven't expired
  return await db
    .select()
    .from(stories)
    .innerJoin(users, eq(stories.userId, users.id))
    .where(gt(stories.expiresAt, new Date()))
    .orderBy(desc(stories.createdAt));
}

export async function getUserStories(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(stories)
    .where(and(eq(stories.userId, userId), gt(stories.expiresAt, new Date())))
    .orderBy(desc(stories.createdAt));
}

export async function getStory(storyId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(stories)
    .where(eq(stories.id, storyId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function deleteStory(storyId: number, userId: number) {
  const db = await getDb();
  if (!db) return;

  // Verify ownership
  const story = await getStory(storyId);
  if (story?.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await db.delete(stories).where(eq(stories.id, storyId));
}

// Story view queries
export async function viewStory(storyId: number, viewerId: number) {
  const db = await getDb();
  if (!db) return null;

  // Check if already viewed
  const existing = await db
    .select()
    .from(storyViews)
    .where(and(eq(storyViews.storyId, storyId), eq(storyViews.viewerId, viewerId)))
    .limit(1);

  if (existing.length > 0) {
    return { alreadyViewed: true };
  }

  // Record view
  const result = await db.insert(storyViews).values({
    storyId,
    viewerId,
  });

  return { id: (result as any).insertId, success: true };
}

export async function getStoryViews(storyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({ user: users, view: storyViews })
    .from(storyViews)
    .innerJoin(users, eq(storyViews.viewerId, users.id))
    .where(eq(storyViews.storyId, storyId))
    .orderBy(desc(storyViews.viewedAt));
}

export async function getStoryViewCount(storyId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(storyViews)
    .where(eq(storyViews.storyId, storyId));

  return result[0]?.count || 0;
}

export async function hasUserViewedStory(storyId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(storyViews)
    .where(and(eq(storyViews.storyId, storyId), eq(storyViews.viewerId, userId)))
    .limit(1);

  return result.length > 0;
}

// Clean up expired stories (can be run as a cron job)
export async function deleteExpiredStories() {
  const db = await getDb();
  if (!db) return;

  await db.delete(stories).where(sql`${stories.expiresAt} < NOW()`);
}
