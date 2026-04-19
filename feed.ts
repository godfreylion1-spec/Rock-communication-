import { eq, desc, and, sql } from "drizzle-orm";
import { getDb } from "./db";
import { feedPosts, feedLikes, feedComments, users, relationships } from "../drizzle/schema";

// Feed post queries
export async function createFeedPost(
  userId: number,
  photoUrl: string,
  caption?: string,
  location?: string
) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(feedPosts).values({
    userId,
    photoUrl,
    caption,
    location,
  });

  return {
    id: (result as any).insertId,
    userId,
    photoUrl,
    caption,
    location,
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date(),
  };
}

export async function getFeedPosts(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(feedPosts)
    .innerJoin(users, eq(feedPosts.userId, users.id))
    .orderBy(desc(feedPosts.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUserFeedPosts(userId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(feedPosts)
    .where(eq(feedPosts.userId, userId))
    .orderBy(desc(feedPosts.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getFeedPost(postId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(feedPosts)
    .where(eq(feedPosts.id, postId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function deleteFeedPost(postId: number, userId: number) {
  const db = await getDb();
  if (!db) return;

  // Verify ownership
  const post = await getFeedPost(postId);
  if (post?.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await db.delete(feedPosts).where(eq(feedPosts.id, postId));
}

// Like queries
export async function likeFeedPost(postId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  // Check if already liked
  const existing = await db
    .select()
    .from(feedLikes)
    .where(and(eq(feedLikes.postId, postId), eq(feedLikes.userId, userId)))
    .limit(1);

  if (existing.length > 0) {
    return { alreadyLiked: true };
  }

  // Add like
  await db.insert(feedLikes).values({ postId, userId });

  // Update like count
  await db
    .update(feedPosts)
    .set({ likeCount: sql`${feedPosts.likeCount} + 1` })
    .where(eq(feedPosts.id, postId));

  return { success: true };
}

export async function unlikeFeedPost(postId: number, userId: number) {
  const db = await getDb();
  if (!db) return;

  // Remove like
  await db
    .delete(feedLikes)
    .where(and(eq(feedLikes.postId, postId), eq(feedLikes.userId, userId)));

  // Update like count
  await db
    .update(feedPosts)
    .set({ likeCount: sql`${feedPosts.likeCount} - 1` })
    .where(eq(feedPosts.id, postId));
}

export async function getPostLikes(postId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({ user: users })
    .from(feedLikes)
    .innerJoin(users, eq(feedLikes.userId, users.id))
    .where(eq(feedLikes.postId, postId));
}

export async function hasUserLikedPost(postId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(feedLikes)
    .where(and(eq(feedLikes.postId, postId), eq(feedLikes.userId, userId)))
    .limit(1);

  return result.length > 0;
}

// Comment queries
export async function commentOnPost(postId: number, userId: number, content: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(feedComments).values({
    postId,
    userId,
    content,
  });

  // Update comment count
  await db
    .update(feedPosts)
    .set({ commentCount: sql`${feedPosts.commentCount} + 1` })
    .where(eq(feedPosts.id, postId));

  return {
    id: (result as any).insertId,
    postId,
    userId,
    content,
    createdAt: new Date(),
  };
}

export async function deleteComment(commentId: number, userId: number) {
  const db = await getDb();
  if (!db) return;

  // Get comment to verify ownership and get postId
  const comment = await db
    .select()
    .from(feedComments)
    .where(eq(feedComments.id, commentId))
    .limit(1);

  if (comment.length === 0 || comment[0].userId !== userId) {
    throw new Error("Unauthorized");
  }

  const postId = comment[0].postId;

  // Delete comment
  await db.delete(feedComments).where(eq(feedComments.id, commentId));

  // Update comment count
  await db
    .update(feedPosts)
    .set({ commentCount: sql`${feedPosts.commentCount} - 1` })
    .where(eq(feedPosts.id, postId));
}

export async function getPostComments(postId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(feedComments)
    .innerJoin(users, eq(feedComments.userId, users.id))
    .where(eq(feedComments.postId, postId))
    .orderBy(desc(feedComments.createdAt))
    .limit(limit)
    .offset(offset);
}

// Follow queries
export async function followUser(userId: number, targetUserId: number) {
  const db = await getDb();
  if (!db) return null;

  // Check if already following
  const existing = await db
    .select()
    .from(relationships)
    .where(
      and(
        eq(relationships.userId, userId),
        eq(relationships.targetUserId, targetUserId),
        eq(relationships.type, "follower")
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return { alreadyFollowing: true };
  }

  const result = await db.insert(relationships).values({
    userId,
    targetUserId,
    type: "follower",
    status: "accepted",
  });

  return { id: (result as any).insertId, success: true };
}

export async function unfollowUser(userId: number, targetUserId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .delete(relationships)
    .where(
      and(
        eq(relationships.userId, userId),
        eq(relationships.targetUserId, targetUserId),
        eq(relationships.type, "follower")
      )
    );
}

export async function getUserFollowers(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({ user: users })
    .from(relationships)
    .innerJoin(users, eq(relationships.userId, users.id))
    .where(
      and(
        eq(relationships.targetUserId, userId),
        eq(relationships.type, "follower"),
        eq(relationships.status, "accepted")
      )
    );
}

export async function getUserFollowing(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({ user: users })
    .from(relationships)
    .innerJoin(users, eq(relationships.targetUserId, users.id))
    .where(
      and(
        eq(relationships.userId, userId),
        eq(relationships.type, "follower"),
        eq(relationships.status, "accepted")
      )
    );
}

export async function isUserFollowing(userId: number, targetUserId: number) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(relationships)
    .where(
      and(
        eq(relationships.userId, userId),
        eq(relationships.targetUserId, targetUserId),
        eq(relationships.type, "follower")
      )
    )
    .limit(1);

  return result.length > 0;
}
