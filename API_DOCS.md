# ROCK API Documentation

Complete API reference for ROCK tRPC endpoints.

## Authentication

All API calls require authentication via OAuth 2.0. Authentication is handled automatically by the session cookie.

### Login Flow
1. User clicks "Get Started"
2. Redirected to OAuth provider
3. User authorizes app
4. Redirected back with session cookie
5. Session persists across requests

### Protected Procedures
Protected procedures require an authenticated user. If not authenticated, they return a 401 error.

```typescript
// Protected procedure example
const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx });
});
```

## API Endpoints

### Authentication Routes

#### `auth.me`
Get current authenticated user

**Type**: Query (Public)

**Returns**:
```typescript
{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  bio: string | null;
  status: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

**Example**:
```typescript
const user = await trpc.auth.me.useQuery();
```

#### `auth.logout`
Logout current user

**Type**: Mutation (Protected)

**Returns**:
```typescript
{ success: boolean }
```

**Example**:
```typescript
const logout = trpc.auth.logout.useMutation();
await logout.mutateAsync();
```

---

### User Profile Routes

#### `user.updateProfile`
Update user profile information

**Type**: Mutation (Protected)

**Input**:
```typescript
{
  name?: string;
  bio?: string;
  status?: string;
  avatar?: string; // URL to avatar image
}
```

**Returns**:
```typescript
{
  id: number;
  name: string | null;
  bio: string | null;
  status: string | null;
  avatar: string | null;
}
```

**Example**:
```typescript
const update = trpc.user.updateProfile.useMutation();
await update.mutateAsync({
  name: 'John Doe',
  bio: 'Software developer',
  status: 'Available'
});
```

#### `user.getProfile`
Get user profile by ID

**Type**: Query (Public)

**Input**:
```typescript
{ userId: number }
```

**Returns**: User profile object

---

### Messaging Routes

#### `messaging.getConversations`
Get all conversations for current user

**Type**: Query (Protected)

**Input**:
```typescript
{
  limit?: number; // Default: 50
  offset?: number; // Default: 0
}
```

**Returns**:
```typescript
{
  id: number;
  type: 'direct' | 'group';
  name: string | null;
  lastMessage: string | null;
  lastMessageTime: Date | null;
  unreadCount: number;
  members: User[];
}[]
```

**Example**:
```typescript
const { data: conversations } = trpc.messaging.getConversations.useQuery({
  limit: 20,
  offset: 0
});
```

#### `messaging.getMessages`
Get messages in a conversation

**Type**: Query (Protected)

**Input**:
```typescript
{
  conversationId: number;
  limit?: number; // Default: 50
  offset?: number; // Default: 0
}
```

**Returns**:
```typescript
{
  id: number;
  content: string;
  type: 'text' | 'image' | 'video' | 'voice' | 'document';
  senderId: number;
  sender: User;
  createdAt: Date;
  isRead: boolean;
  reactions: { emoji: string; count: number }[];
}[]
```

#### `messaging.sendMessage`
Send a message to a conversation

**Type**: Mutation (Protected)

**Input**:
```typescript
{
  conversationId: number;
  content: string;
  type: 'text' | 'image' | 'video' | 'voice' | 'document';
  mediaUrl?: string; // URL to media file
}
```

**Returns**:
```typescript
{
  id: number;
  content: string;
  type: string;
  senderId: number;
  conversationId: number;
  createdAt: Date;
}
```

**Example**:
```typescript
const send = trpc.messaging.sendMessage.useMutation();
await send.mutateAsync({
  conversationId: 1,
  content: 'Hello!',
  type: 'text'
});
```

#### `messaging.reactToMessage`
Add emoji reaction to message

**Type**: Mutation (Protected)

**Input**:
```typescript
{
  messageId: number;
  emoji: string;
}
```

**Returns**: Success status

---

### Friend/Relationship Routes

#### `messaging.getFriends`
Get list of friends

**Type**: Query (Protected)

**Returns**: User[] - Array of friend objects

#### `messaging.getPendingRequests`
Get pending friend requests

**Type**: Query (Protected)

**Returns**: User[] - Array of users who sent requests

#### `messaging.acceptFriendRequest`
Accept a friend request

**Type**: Mutation (Protected)

**Input**:
```typescript
{ userId: number }
```

**Returns**: Success status

#### `messaging.rejectFriendRequest`
Reject a friend request

**Type**: Mutation (Protected)

**Input**:
```typescript
{ userId: number }
```

**Returns**: Success status

#### `messaging.blockUser`
Block a user

**Type**: Mutation (Protected)

**Input**:
```typescript
{ userId: number }
```

**Returns**: Success status

#### `messaging.unblockUser`
Unblock a user

**Type**: Mutation (Protected)

**Input**:
```typescript
{ userId: number }
```

**Returns**: Success status

---

### Feed Routes

#### `feed.getFeedPosts`
Get feed posts

**Type**: Query (Protected)

**Input**:
```typescript
{
  limit?: number; // Default: 20
  offset?: number; // Default: 0
  sortBy?: 'recent' | 'trending' | 'following'; // Default: 'recent'
}
```

**Returns**:
```typescript
{
  id: number;
  caption: string;
  location: string | null;
  photoUrl: string;
  authorId: number;
  author: User;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: Date;
}[]
```

#### `feed.createPost`
Create a new feed post

**Type**: Mutation (Protected)

**Input**:
```typescript
{
  photoUrl: string;
  caption?: string;
  location?: string;
}
```

**Returns**: Created post object

#### `feed.likePost`
Like a post

**Type**: Mutation (Protected)

**Input**:
```typescript
{ postId: number }
```

**Returns**: Success status

#### `feed.unlikePost`
Unlike a post

**Type**: Mutation (Protected)

**Input**:
```typescript
{ postId: number }
```

**Returns**: Success status

#### `feed.commentOnPost`
Add comment to post

**Type**: Mutation (Protected)

**Input**:
```typescript
{
  postId: number;
  content: string;
}
```

**Returns**: Created comment object

#### `feed.deleteComment`
Delete a comment

**Type**: Mutation (Protected)

**Input**:
```typescript
{ commentId: number }
```

**Returns**: Success status

#### `feed.followUser`
Follow a user

**Type**: Mutation (Protected)

**Input**:
```typescript
{ userId: number }
```

**Returns**: Success status

#### `feed.unfollowUser`
Unfollow a user

**Type**: Mutation (Protected)

**Input**:
```typescript
{ userId: number }
```

**Returns**: Success status

---

### Stories Routes

#### `stories.createStory`
Create a new story

**Type**: Mutation (Protected)

**Input**:
```typescript
{
  mediaUrl: string;
  type: 'photo' | 'video';
  caption?: string;
}
```

**Returns**: Created story object

#### `stories.getActiveStories`
Get active stories from contacts

**Type**: Query (Protected)

**Returns**:
```typescript
{
  id: number;
  mediaUrl: string;
  type: 'photo' | 'video';
  caption: string | null;
  authorId: number;
  author: User;
  viewCount: number;
  isViewed: boolean;
  createdAt: Date;
  expiresAt: Date;
}[]
```

#### `stories.getUserStories`
Get stories from specific user

**Type**: Query (Protected)

**Input**:
```typescript
{ userId: number }
```

**Returns**: Story[] - Array of user's stories

#### `stories.viewStory`
Record story view

**Type**: Mutation (Protected)

**Input**:
```typescript
{ storyId: number }
```

**Returns**: Success status

#### `stories.getStoryViews`
Get viewers of a story

**Type**: Query (Protected)

**Input**:
```typescript
{ storyId: number }
```

**Returns**: User[] - Array of users who viewed story

---

### Notifications Routes

#### `notifications.getNotifications`
Get notifications

**Type**: Query (Protected)

**Input**:
```typescript
{
  limit?: number; // Default: 50
  offset?: number; // Default: 0
}
```

**Returns**:
```typescript
{
  id: number;
  type: 'message' | 'friendRequest' | 'like' | 'comment' | 'storyView' | 'follow';
  content: string;
  actorId: number;
  actor: User;
  isRead: boolean;
  createdAt: Date;
}[]
```

#### `notifications.getUnreadCount`
Get count of unread notifications

**Type**: Query (Protected)

**Returns**:
```typescript
{ count: number }
```

#### `notifications.markAsRead`
Mark notification as read

**Type**: Mutation (Protected)

**Input**:
```typescript
{ notificationId: number }
```

**Returns**: Success status

#### `notifications.markAllAsRead`
Mark all notifications as read

**Type**: Mutation (Protected)

**Returns**: Success status

#### `notifications.deleteNotification`
Delete a notification

**Type**: Mutation (Protected)

**Input**:
```typescript
{ notificationId: number }
```

**Returns**: Success status

---

## Error Handling

All API errors follow the tRPC error format:

```typescript
{
  code: string; // 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_REQUEST' | etc.
  message: string;
  cause?: unknown;
}
```

### Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| UNAUTHORIZED | 401 | User not authenticated |
| FORBIDDEN | 403 | User not authorized |
| NOT_FOUND | 404 | Resource not found |
| BAD_REQUEST | 400 | Invalid input |
| CONFLICT | 409 | Resource already exists |
| INTERNAL_SERVER_ERROR | 500 | Server error |

## Rate Limiting

API endpoints are rate limited:
- 100 requests per minute per user
- 1000 requests per hour per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1619827200
```

## Pagination

List endpoints support pagination:

```typescript
{
  limit: 20,    // Items per page
  offset: 0,    // Starting position
  total: 500,   // Total items available
  hasMore: true // More items available
}
```

## Sorting

Supported sort options vary by endpoint. Check individual endpoint documentation.

Common sort options:
- `recent` - Most recent first
- `trending` - Most popular first
- `following` - From followed users first

## Caching

Responses are cached on the client:
- Queries: Cached for 5 minutes
- Mutations: Cache invalidated immediately
- Manual invalidation: `trpc.useUtils().endpoint.invalidate()`

## WebSocket (Future)

Real-time features planned:
- Live messaging
- Typing indicators
- Online presence
- Instant notifications

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Base URL**: `https://your-app.manus.space/api/trpc`
