# ROCK App - Development TODO

## Phase 1: Brand & Design System
- [x] Generate ROCK logo (scorpion + mountain emblem)
- [x] Create design system document with color palette, typography, and spacing
- [x] Set up Tailwind CSS with ROCK brand colors and custom theme
- [x] Apply logo to app header, favicon, and splash screen

## Phase 2: Database Schema
- [x] Design and implement users table (profile, avatar, bio, status, online presence)
- [x] Design and implement messages table (one-on-one and group chats)
- [x] Design and implement relationships table (friends, followers, blocks)
- [x] Design and implement stories table (ephemeral 24-hour content)
- [x] Design and implement feed_posts table (photos, likes, comments)
- [x] Design and implement notifications table (messages, friend requests, story views, feed interactions)
- [x] Design and implement media table (images, videos, documents, voice messages with S3 URLs)
- [x] Create database migrations and verify schema integrity

## Phase 3: Authentication & Onboarding
- [x] Implement OAuth login flow with Manus Auth
- [x] Build onboarding UI (welcome screen, profile setup)
- [x] Build user profile management page (edit name, bio, status)
- [x] Build profile view page (display user info)
- [x] Implement session management and logout functionality
- [x] Create Home page with feature navigation
- [x] Create placeholder pages for Messages, Feed, Stories, Contacts

## Phase 4: Real-Time Messaging System
- [x] Set up WebSocket server for real-time communication
- [x] Implement one-on-one messaging with text and emoji support
- [x] Implement group messaging with member management
- [x] Build message reactions (emoji reactions on messages)
- [x] Implement read receipts (single/double checkmarks, "seen" status)
- [x] Implement typing indicators (show when user is typing)
- [x] Implement online presence status (online, away, offline)
- [x] Build chat list UI with last message preview and unread count
- [x] Build message detail view with message history and scrolling
- [x] Implement message search within conversations

## Phase 5: Media Sharing
- [x] Set up S3-compatible storage integration
- [x] Implement image upload in chats (compress, store, return URL)
- [x] Implement video upload in chats (store, return URL)
- [x] Implement document upload in chats (PDF, DOC, etc.)
- [x] Implement voice message recording and playback
- [x] Build media preview/lightbox UI for images and videos
- [x] Implement media deletion and expiration (if applicable)

## Phase 6: Social Photo Feed
- [x] Build feed UI with photo grid layout
- [x] Implement photo upload to feed (with caption, location, tags)
- [x] Implement like functionality on feed photos
- [x] Implement comment system on feed photos
- [x] Build comment thread UI with nested replies
- [x] Implement follow/unfollow system
- [x] Build user profile feed (show user's own photos)
- [x] Implement feed sorting (recent, trending, following)
- [x] Build feed discovery/explore page
- [x] Implement photo deletion and editing

## Phase 7: Stories & Status Updates
- [x] Build story upload UI (photo/video, 24-hour expiration)
- [x] Implement story viewing with progression (next/previous story)
- [x] Implement story view tracking (who viewed your story)
- [x] Build story viewer UI with user avatars and timestamps
- [x] Implement story reactions and replies
- [x] Build story feed/carousel UI
- [x] Implement story deletion after 24 hours
- [x] Build status update feature (text status with optional emoji)

## Phase 8: Contacts & Friends System
- [x] Build contacts list UI
- [x] Implement friend request sending
- [x] Implement friend request acceptance/rejection
- [x] Build friend request notifications
- [x] Implement block functionality
- [x] Build blocked users list
- [x] Implement unblock functionality
- [x] Build friend suggestions/recommendations
- [x] Implement contact search and filtering

## Phase 9: Voice & Video Calls
- [x] Build call initiation UI (start call button in chat/profile)
- [x] Implement WebRTC for peer-to-peer audio/video
- [x] Build incoming call notification and answer/reject UI
- [x] Build call screen with video preview
- [x] Implement mute/unmute audio control
- [x] Implement camera toggle (on/off)
- [x] Implement speaker toggle
- [x] Implement end call button
- [x] Build call duration timer
- [x] Implement call history/logs
- [x] Build group call support (if applicable)

## Phase 10: Notifications System
- [x] Build in-app notification center
- [x] Implement notifications for new messages
- [x] Implement notifications for friend requests
- [x] Implement notifications for story views
- [x] Implement notifications for feed likes and comments
- [x] Implement notifications for mentions (@username)
- [x] Build notification preferences/settings
- [x] Implement notification badges (unread count)
- [x] Implement notification sound/vibration (if applicable)
- [x] Build notification history and clearing

## Phase 11: Search Functionality
- [x] Build search bar UI (global search)
- [x] Implement user search with results display
- [x] Implement message search within conversations
- [x] Implement photo search in feed (by caption, tags, user)
- [x] Build search history and saved searches
- [x] Implement search filters (by type: users, messages, photos)
- [x] Implement search suggestions/autocomplete

## Phase 12: UI/UX Polish & Testing
- [x] Apply ROCK brand colors and gradients throughout app
- [x] Implement responsive design for mobile, tablet, desktop
- [x] Add loading states and skeleton screens
- [x] Add error handling and user-friendly error messages
- [x] Implement empty states for lists and feeds
- [x] Add animations and transitions (fade, slide, scale)
- [x] Optimize performance (lazy loading, code splitting)
- [x] Test all features across browsers and devices
- [x] Write unit tests for critical features (auth, messaging, storage)
- [x] Implement accessibility features (ARIA labels, keyboard navigation)

## Phase 13: Deployment & Documentation
- [x] Create deployment guide
- [x] Create user documentation
- [x] Create API documentation (if applicable)
- [x] Set up CI/CD pipeline
- [x] Prepare app for production deployment
- [x] Create README with feature overview
- [x] Document known limitations and future roadmap

## Documentation
- [x] README.md - Complete feature overview and setup guide
- [x] DEPLOYMENT.md - Production deployment guide
- [x] USER_GUIDE.md - End-user documentation
- [x] API_DOCS.md - Complete API reference
- [x] DESIGN_SYSTEM.md - Brand and design guidelines

## Bugs & Issues
(To be updated as issues are discovered during development)

## Notes
- All media uploads must use S3-compatible storage with database URL references
- WebSocket server must handle real-time message delivery, typing indicators, and online presence
- Logo CDN URLs: Compressed (WebP) and Original (PNG) for all touchpoints
- Design system uses violet-to-teal gradient with asymmetric layout and generous negative space
- No "futures" feature in social feed (as per requirements)
