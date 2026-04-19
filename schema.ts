import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal, index, foreignKey } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with profile fields: avatar, bio, status, online presence.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  avatarUrl: text("avatarUrl"), // S3 URL for user avatar
  bio: text("bio"), // User bio/description
  status: varchar("status", { length: 255 }), // Status message (e.g., "Available", "In a meeting")
  isOnline: boolean("isOnline").default(false).notNull(),
  lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Relationships table for friends, followers, and blocks.
 */
export const relationships = mysqlTable(
  "relationships",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    targetUserId: int("targetUserId").notNull(),
    type: mysqlEnum("type", ["friend", "follower", "blocked"]).notNull(),
    status: mysqlEnum("status", ["pending", "accepted", "rejected"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_user_target").on(table.userId, table.targetUserId),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id], name: "fk_relationships_user" }).onDelete("cascade"),
    foreignKey({ columns: [table.targetUserId], foreignColumns: [users.id], name: "fk_relationships_target" }).onDelete("cascade"),
  ]
);

export type Relationship = typeof relationships.$inferSelect;
export type InsertRelationship = typeof relationships.$inferInsert;

/**
 * Conversations table for one-on-one and group chats.
 */
export const conversations = mysqlTable(
  "conversations",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }), // Group name (null for one-on-one)
    isGroup: boolean("isGroup").default(false).notNull(),
    avatarUrl: text("avatarUrl"), // Group avatar (S3 URL)
    createdBy: int("createdBy").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.createdBy], foreignColumns: [users.id], name: "fk_conversations_creator" }).onDelete("cascade"),
  ]
);

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Conversation members table for group chat membership.
 */
export const conversationMembers = mysqlTable(
  "conversationMembers",
  {
    id: int("id").autoincrement().primaryKey(),
    conversationId: int("conversationId").notNull(),
    userId: int("userId").notNull(),
    role: mysqlEnum("role", ["admin", "member"]).default("member").notNull(),
    joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_conversation_user").on(table.conversationId, table.userId),
    foreignKey({ columns: [table.conversationId], foreignColumns: [conversations.id], name: "fk_members_conversation" }).onDelete("cascade"),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id], name: "fk_members_user" }).onDelete("cascade"),
  ]
);

export type ConversationMember = typeof conversationMembers.$inferSelect;
export type InsertConversationMember = typeof conversationMembers.$inferInsert;

/**
 * Messages table for one-on-one and group chats.
 */
export const messages = mysqlTable(
  "messages",
  {
    id: int("id").autoincrement().primaryKey(),
    conversationId: int("conversationId").notNull(),
    senderId: int("senderId").notNull(),
    content: text("content"),
    type: mysqlEnum("type", ["text", "image", "video", "document", "voice", "system"]).default("text").notNull(),
    mediaUrl: text("mediaUrl"), // S3 URL for media
    reactions: json("reactions"), // JSON array of reactions: [{emoji: '👍', userIds: [1, 2, 3]}]
    isRead: boolean("isRead").default(false).notNull(),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_conversation_created").on(table.conversationId, table.createdAt),
    foreignKey({ columns: [table.conversationId], foreignColumns: [conversations.id], name: "fk_messages_conversation" }).onDelete("cascade"),
    foreignKey({ columns: [table.senderId], foreignColumns: [users.id], name: "fk_messages_sender" }).onDelete("cascade"),
  ]
);

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Stories table for ephemeral 24-hour photo/video content.
 */
export const stories = mysqlTable(
  "stories",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    mediaUrl: text("mediaUrl").notNull(), // S3 URL for story image/video
    type: mysqlEnum("type", ["image", "video"]).default("image").notNull(),
    caption: text("caption"),
    expiresAt: timestamp("expiresAt").notNull(), // 24 hours from creation
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_user_expires").on(table.userId, table.expiresAt),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id], name: "fk_stories_user" }).onDelete("cascade"),
  ]
);

export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;

/**
 * Story views table to track who viewed each story.
 */
export const storyViews = mysqlTable(
  "storyViews",
  {
    id: int("id").autoincrement().primaryKey(),
    storyId: int("storyId").notNull(),
    viewerId: int("viewerId").notNull(),
    viewedAt: timestamp("viewedAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_story_viewer").on(table.storyId, table.viewerId),
    foreignKey({ columns: [table.storyId], foreignColumns: [stories.id], name: "fk_storyviews_story" }).onDelete("cascade"),
    foreignKey({ columns: [table.viewerId], foreignColumns: [users.id], name: "fk_storyviews_viewer" }).onDelete("cascade"),
  ]
);

export type StoryView = typeof storyViews.$inferSelect;
export type InsertStoryView = typeof storyViews.$inferInsert;

/**
 * Feed posts table for social photo sharing.
 */
export const feedPosts = mysqlTable(
  "feedPosts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    photoUrl: text("photoUrl").notNull(), // S3 URL for feed photo
    caption: text("caption"),
    location: varchar("location", { length: 255 }),
    likeCount: int("likeCount").default(0).notNull(),
    commentCount: int("commentCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_user_created").on(table.userId, table.createdAt),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id], name: "fk_feedposts_user" }).onDelete("cascade"),
  ]
);

export type FeedPost = typeof feedPosts.$inferSelect;
export type InsertFeedPost = typeof feedPosts.$inferInsert;

/**
 * Feed likes table.
 */
export const feedLikes = mysqlTable(
  "feedLikes",
  {
    id: int("id").autoincrement().primaryKey(),
    postId: int("postId").notNull(),
    userId: int("userId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_post_user").on(table.postId, table.userId),
    foreignKey({ columns: [table.postId], foreignColumns: [feedPosts.id], name: "fk_feedlikes_post" }).onDelete("cascade"),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id], name: "fk_feedlikes_user" }).onDelete("cascade"),
  ]
);

export type FeedLike = typeof feedLikes.$inferSelect;
export type InsertFeedLike = typeof feedLikes.$inferInsert;

/**
 * Feed comments table.
 */
export const feedComments = mysqlTable(
  "feedComments",
  {
    id: int("id").autoincrement().primaryKey(),
    postId: int("postId").notNull(),
    userId: int("userId").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_post_created").on(table.postId, table.createdAt),
    foreignKey({ columns: [table.postId], foreignColumns: [feedPosts.id], name: "fk_feedcomments_post" }).onDelete("cascade"),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id], name: "fk_feedcomments_user" }).onDelete("cascade"),
  ]
);

export type FeedComment = typeof feedComments.$inferSelect;
export type InsertFeedComment = typeof feedComments.$inferInsert;

/**
 * Notifications table for all in-app alerts.
 */
export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    type: mysqlEnum("type", ["message", "friendRequest", "storyView", "like", "comment", "mention", "follow"]).notNull(),
    actorId: int("actorId").notNull(), // User who triggered the notification
    targetId: int("targetId"), // Post/Story/Message ID
    content: text("content"),
    isRead: boolean("isRead").default(false).notNull(),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_user_read").on(table.userId, table.isRead),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id], name: "fk_notifications_user" }).onDelete("cascade"),
    foreignKey({ columns: [table.actorId], foreignColumns: [users.id], name: "fk_notifications_actor" }).onDelete("cascade"),
  ]
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Media table for tracking all uploaded media (images, videos, documents, voice messages).
 */
export const media = mysqlTable(
  "media",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    url: text("url").notNull(), // S3 URL
    type: mysqlEnum("type", ["image", "video", "document", "voice"]).notNull(),
    mimeType: varchar("mimeType", { length: 100 }),
    size: int("size"), // File size in bytes
    duration: int("duration"), // Duration in seconds (for video/voice)
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_user_type").on(table.userId, table.type),
    foreignKey({ columns: [table.userId], foreignColumns: [users.id], name: "fk_media_user" }).onDelete("cascade"),
  ]
);

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

/**
 * Relations for Drizzle ORM (for convenience in queries).
 */
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversationMembers),
  messages: many(messages),
  stories: many(stories),
  feedPosts: many(feedPosts),
  media: many(media),
}));

export const conversationsRelations = relations(conversations, ({ many }) => ({
  members: many(conversationMembers),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));