# GraphQL Schema Reference

## Overview

HugMood uses GraphQL as the primary API interface for client-server communication. The GraphQL schema unifies all microservices into a single, coherent API layer that enables efficient data fetching, real-time updates via subscriptions, and type-safe operations.

## Base Schema Types

### User Types

```graphql
"""
User account information
"""
type User {
  id: ID!
  username: String!
  email: String!
  displayName: String
  profileImage: String
  bio: String
  joinedAt: DateTime!
  lastActive: DateTime
  isAnonymous: Boolean!
  status: UserStatus
  privacySettings: PrivacySettings
  followersCount: Int!
  followingCount: Int!
  moods(limit: Int, offset: Int): [MoodEntry!]!
  latestMood: MoodEntry
  hugsReceived(limit: Int, offset: Int): [Hug!]!
  hugsSent(limit: Int, offset: Int): [Hug!]!
}

"""
Current user status
"""
enum UserStatus {
  ONLINE
  AWAY
  OFFLINE
  DO_NOT_DISTURB
}

"""
User privacy settings
"""
type PrivacySettings {
  shareMode: ShareMode!
  allowHugsFrom: AllowHugsFrom!
  showMoodTo: ShareMode!
  showActivityTo: ShareMode!
  allowFriendRequests: Boolean!
}

"""
Sharing mode for content and activities
"""
enum ShareMode {
  PUBLIC
  FRIENDS
  SELECTED_FRIENDS
  PRIVATE
}

"""
Who can send hugs to this user
"""
enum AllowHugsFrom {
  ANYONE
  FRIENDS
  SELECTED_FRIENDS
  NONE
}
```

### Mood Types

```graphql
"""
A mood entry tracked by a user
"""
type MoodEntry {
  id: ID!
  user: User!
  mood: String!
  intensity: Float!
  valence: Float!
  arousal: Float!
  note: String
  tags: [String!]
  createdAt: DateTime!
  isPublic: Boolean!
  location: Location
  activities: [Activity!]
  weather: Weather
  context: MoodContext
}

"""
Location information
"""
type Location {
  latitude: Float
  longitude: Float
  name: String
  type: LocationType
}

"""
Location types
"""
enum LocationType {
  HOME
  WORK
  SCHOOL
  OUTDOORS
  TRANSIT
  OTHER
}

"""
Activity information associated with mood
"""
type Activity {
  id: ID!
  name: String!
  duration: Int
  intensity: Float
  category: ActivityCategory
}

"""
Activity categories
"""
enum ActivityCategory {
  EXERCISE
  SOCIAL
  WORK
  ENTERTAINMENT
  REST
  SELF_CARE
  OTHER
}

"""
Weather information
"""
type Weather {
  condition: String
  temperature: Float
  humidity: Float
  pressure: Float
}

"""
Context information for mood
"""
type MoodContext {
  sleepQuality: Float
  stressLevel: Float
  energyLevel: Float
  socialInteraction: Float
  notes: String
}
```

### Hug Types

```graphql
"""
A virtual hug between users
"""
type Hug {
  id: ID!
  sender: User!
  recipient: User!
  type: HugType!
  message: String
  sentAt: DateTime!
  receivedAt: DateTime
  isRead: Boolean!
  reaction: HugReaction
}

"""
Type of virtual hug
"""
enum HugType {
  FRIENDLY
  SUPPORTIVE
  COMFORTING
  CELEBRATORY
  GRATEFUL
  HEALING
  ENERGIZING
  CUSTOM
}

"""
Reaction to a received hug
"""
type HugReaction {
  emoji: String!
  message: String
  createdAt: DateTime!
}

"""
A request for a hug
"""
type HugRequest {
  id: ID!
  requester: User!
  requestedFrom: RequestTarget!
  message: String
  status: HugRequestStatus!
  createdAt: DateTime!
  respondedAt: DateTime
  response: HugRequestResponse
}

"""
Who the hug is requested from
"""
union RequestTarget = User | Community

"""
Status of a hug request
"""
enum HugRequestStatus {
  PENDING
  ACCEPTED
  DECLINED
  EXPIRED
}

"""
Response to a hug request
"""
type HugRequestResponse {
  status: HugRequestStatus!
  message: String
  hug: Hug
}

"""
A group hug with multiple participants
"""
type GroupHug {
  id: ID!
  creator: User!
  name: String!
  description: String
  participants: [User!]!
  invitees: [User!]!
  status: GroupHugStatus!
  scheduledFor: DateTime
  expiresAt: DateTime
  createdAt: DateTime!
  message: String
}

"""
Status of a group hug
"""
enum GroupHugStatus {
  PENDING
  ACTIVE
  COMPLETED
  EXPIRED
  CANCELED
}
```

### Analytics Types

```graphql
"""
Mood analytics data
"""
type MoodAnalytics {
  userId: ID!
  timeRange: TimeRange!
  moodFrequency: [MoodFrequency!]!
  moodByDayOfWeek: [MoodByDay!]!
  moodByTimeOfDay: [MoodByHour!]!
  averageMood: Float!
  dominantMood: String!
  moodVariability: Float!
  moodTrend: TrendDirection!
  correlations: [MoodCorrelation!]!
  insights: [MoodInsight!]!
}

"""
Time range for analytics
"""
enum TimeRange {
  DAY
  WEEK
  MONTH
  THREE_MONTHS
  SIX_MONTHS
  YEAR
}

"""
Frequency count for a specific mood
"""
type MoodFrequency {
  mood: String!
  count: Int!
  percentage: Float!
}

"""
Mood data by day of week
"""
type MoodByDay {
  day: DayOfWeek!
  averageMood: Float!
  entries: Int!
}

"""
Days of the week
"""
enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}

"""
Mood data by hour of day
"""
type MoodByHour {
  hour: Int!
  averageMood: Float!
  entries: Int!
}

"""
Trend direction
"""
enum TrendDirection {
  IMPROVING
  STABLE
  DECLINING
}

"""
Correlation between mood and another factor
"""
type MoodCorrelation {
  factor: String!
  correlationStrength: Float!
  direction: CorrelationDirection!
  description: String!
}

"""
Direction of correlation
"""
enum CorrelationDirection {
  POSITIVE
  NEGATIVE
  NEUTRAL
}

"""
Generated insight from mood data
"""
type MoodInsight {
  id: ID!
  type: InsightType!
  title: String!
  description: String!
  createdAt: DateTime!
  relevanceScore: Float!
  supportingData: JSON
}

"""
Type of mood insight
"""
enum InsightType {
  PATTERN
  TRIGGER
  IMPROVEMENT
  WARNING
  CELEBRATION
  SUGGESTION
}
```

### Authentication Types

```graphql
"""
Authentication credentials
"""
input Credentials {
  email: String!
  password: String!
  rememberMe: Boolean
}

"""
Authentication token response
"""
type AuthToken {
  token: String!
  expires: DateTime!
  refreshToken: String
}

"""
User registration input
"""
input RegisterInput {
  username: String!
  email: String!
  password: String!
  displayName: String
}

"""
Password reset request
"""
input PasswordResetRequest {
  email: String!
}

"""
Password reset confirmation
"""
input PasswordResetConfirmation {
  token: String!
  newPassword: String!
}
```

## Main GraphQL Operations

### Queries

```graphql
type Query {
  # User queries
  me: User!
  user(id: ID!): User
  users(filter: UserFilter, limit: Int, offset: Int): [User!]!
  searchUsers(query: String!, limit: Int): [User!]!
  
  # Mood queries
  moodEntry(id: ID!): MoodEntry
  moodEntries(userId: ID!, limit: Int, offset: Int): [MoodEntry!]!
  moodAnalytics(userId: ID!, timeRange: TimeRange!): MoodAnalytics!
  moodStreak(userId: ID!): StreakInfo!
  
  # Hug queries
  hug(id: ID!): Hug
  hugsReceived(limit: Int, offset: Int): [Hug!]!
  hugsSent(limit: Int, offset: Int): [Hug!]!
  hugRequests(status: HugRequestStatus): [HugRequest!]!
  groupHugs(status: GroupHugStatus): [GroupHug!]!
  
  # Relationship queries
  followers(userId: ID!, limit: Int, offset: Int): [User!]!
  following(userId: ID!, limit: Int, offset: Int): [User!]!
  friendRequests(status: FriendRequestStatus): [FriendRequest!]!
  friends(limit: Int, offset: Int): [User!]!
  
  # Notification queries
  notifications(limit: Int, offset: Int, unreadOnly: Boolean): [Notification!]!
  unreadNotificationsCount: Int!
}
```

### Mutations

```graphql
type Mutation {
  # Authentication mutations
  login(credentials: Credentials!): AuthPayload!
  register(input: RegisterInput!): AuthPayload!
  refreshToken(token: String!): AuthPayload!
  logout: Boolean!
  requestPasswordReset(input: PasswordResetRequest!): Boolean!
  resetPassword(input: PasswordResetConfirmation!): Boolean!
  
  # User mutations
  updateProfile(input: UpdateProfileInput!): User!
  updateProfileImage(file: Upload!): User!
  updatePrivacySettings(settings: PrivacySettingsInput!): PrivacySettings!
  
  # Mood mutations
  createMoodEntry(input: MoodEntryInput!): MoodEntry!
  updateMoodEntry(id: ID!, input: MoodEntryInput!): MoodEntry!
  deleteMoodEntry(id: ID!): Boolean!
  
  # Hug mutations
  sendHug(input: SendHugInput!): Hug!
  reactToHug(hugId: ID!, reaction: HugReactionInput!): Hug!
  requestHug(input: HugRequestInput!): HugRequest!
  respondToHugRequest(requestId: ID!, accept: Boolean!, message: String): HugRequestResponse!
  createGroupHug(input: GroupHugInput!): GroupHug!
  joinGroupHug(groupHugId: ID!): GroupHug!
  
  # Relationship mutations
  followUser(userId: ID!): Boolean!
  unfollowUser(userId: ID!): Boolean!
  sendFriendRequest(userId: ID!): FriendRequest!
  respondToFriendRequest(requestId: ID!, accept: Boolean!): Boolean!
  removeFriend(userId: ID!): Boolean!
  
  # Notification mutations
  markNotificationRead(id: ID!): Notification!
  markAllNotificationsRead: Boolean!
}
```

### Subscriptions

```graphql
type Subscription {
  # User subscriptions
  userStatusChanged(userId: ID): User!
  
  # Mood subscriptions
  moodUpdated(userId: ID): MoodEntry!
  streakUpdated(userId: ID): StreakInfo!
  
  # Hug subscriptions
  hugReceived: Hug!
  hugRequestReceived: HugRequest!
  hugRequestStatusChanged(requestId: ID!): HugRequest!
  groupHugUpdated(groupHugId: ID): GroupHug!
  
  # Relationship subscriptions
  followUpdated: FollowEvent!
  friendRequestReceived: FriendRequest!
  friendRequestStatusChanged(requestId: ID!): FriendRequest!
  
  # Notification subscriptions
  notificationReceived: Notification!
}
```

## Input Types

```graphql
"""
Filter for user queries
"""
input UserFilter {
  usernameContains: String
  byStatus: UserStatus
  byFollowRelation: FollowRelation
}

"""
Follow relation filter
"""
enum FollowRelation {
  FOLLOWERS
  FOLLOWING
  MUTUAL
  SUGGESTED
}

"""
Input for mood entry creation
"""
input MoodEntryInput {
  mood: String!
  intensity: Float!
  note: String
  tags: [String!]
  isPublic: Boolean
  location: LocationInput
  activities: [ActivityInput!]
  weather: WeatherInput
  context: MoodContextInput
}

"""
Location input
"""
input LocationInput {
  latitude: Float
  longitude: Float
  name: String
  type: LocationType
}

"""
Activity input
"""
input ActivityInput {
  name: String!
  duration: Int
  intensity: Float
  category: ActivityCategory
}

"""
Weather input
"""
input WeatherInput {
  condition: String
  temperature: Float
  humidity: Float
  pressure: Float
}

"""
Mood context input
"""
input MoodContextInput {
  sleepQuality: Float
  stressLevel: Float
  energyLevel: Float
  socialInteraction: Float
  notes: String
}

"""
Input for sending a hug
"""
input SendHugInput {
  recipientId: ID!
  type: HugType!
  message: String
  customization: JSON
}

"""
Input for a hug reaction
"""
input HugReactionInput {
  emoji: String!
  message: String
}

"""
Input for requesting a hug
"""
input HugRequestInput {
  targetId: ID!
  targetType: RequestTargetType!
  message: String
  expiresAfter: Int
}

"""
Type of hug request target
"""
enum RequestTargetType {
  USER
  COMMUNITY
}

"""
Input for creating a group hug
"""
input GroupHugInput {
  name: String!
  description: String
  inviteeIds: [ID!]!
  scheduledFor: DateTime
  expiresAt: DateTime
  message: String
}

"""
Input for updating user profile
"""
input UpdateProfileInput {
  displayName: String
  bio: String
  status: UserStatus
}

"""
Input for privacy settings
"""
input PrivacySettingsInput {
  shareMode: ShareMode
  allowHugsFrom: AllowHugsFrom
  showMoodTo: ShareMode
  showActivityTo: ShareMode
  allowFriendRequests: Boolean
}
```

## Custom Scalars

```graphql
"""
Date and time scalar
"""
scalar DateTime

"""
JSON scalar for flexible data structures
"""
scalar JSON

"""
Upload scalar for file uploads
"""
scalar Upload
```

## Directives

```graphql
"""
Authentication directive
"""
directive @auth(requires: Role = USER) on OBJECT | FIELD_DEFINITION

"""
Rate limiting directive
"""
directive @rateLimit(limit: Int!, duration: Int!) on FIELD_DEFINITION

"""
Caching directive
"""
directive @cacheControl(maxAge: Int!, scope: CacheScope = PUBLIC) on FIELD_DEFINITION | OBJECT
```

## Authentication Flow

The authentication flow uses JWT tokens for securing API access:

1. Client sends login mutation with credentials
2. Server validates credentials and returns JWT token
3. Client includes token in Authorization header for subsequent requests
4. Token expiration is handled via refresh tokens

Example auth flow:

```graphql
# Login mutation
mutation Login {
  login(credentials: {
    email: "user@example.com",
    password: "password123",
    rememberMe: true
  }) {
    token
    expires
    refreshToken
    user {
      id
      username
      displayName
    }
  }
}

# Using the token in subsequent requests
# Authorization: Bearer <token>

# Refreshing token when expired
mutation RefreshToken {
  refreshToken(token: "refresh-token-string") {
    token
    expires
    refreshToken
  }
}
```

## Real-time Subscriptions

GraphQL subscriptions enable real-time updates using WebSocket Protocol. Clients can subscribe to events of interest and receive immediate updates when those events occur.

Example subscription:

```graphql
# Subscribe to new hugs
subscription OnHugReceived {
  hugReceived {
    id
    sender {
      id
      username
      displayName
    }
    type
    message
    sentAt
  }
}

# Subscribe to mood updates from friends
subscription OnFriendMoodUpdated {
  moodUpdated(friendsOnly: true) {
    id
    user {
      id
      username
      displayName
    }
    mood
    intensity
    note
    createdAt
  }
}
```

## Error Handling

GraphQL errors follow a standardized format:

```json
{
  "errors": [
    {
      "message": "Error message",
      "locations": [
        {
          "line": 2,
          "column": 7
        }
      ],
      "path": ["login"],
      "extensions": {
        "code": "UNAUTHENTICATED",
        "details": "Additional error details"
      }
    }
  ]
}
```

Common error codes:

- `UNAUTHENTICATED`: Missing or invalid authentication
- `FORBIDDEN`: Authenticated but not authorized
- `BAD_USER_INPUT`: Invalid input parameters
- `NOT_FOUND`: Requested resource not found
- `INTERNAL_SERVER_ERROR`: Server-side error
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Best Practices

When working with the HugMood GraphQL API:

1. **Request only what you need**: GraphQL allows you to specify exactly which fields to fetch
2. **Use fragments** for reusable field selections
3. **Implement pagination** for list queries to limit response size
4. **Handle errors gracefully** on the client side
5. **Cache responses** where appropriate to reduce server load
6. **Use variables** instead of string interpolation for dynamic values
7. **Secure operations** that require authentication with the @auth directive