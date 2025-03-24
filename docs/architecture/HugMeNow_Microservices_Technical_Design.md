# HugMeNow: Microservices Technical Design

## Table of Contents
1. [Introduction](#introduction)
2. [Microservices Architecture](#microservices-architecture)
3. [Service Decomposition](#service-decomposition)
4. [Service Implementations](#service-implementations)
5. [Data Management](#data-management)
6. [Inter-Service Communication](#inter-service-communication)
7. [API Design](#api-design)
8. [Service Deployment](#service-deployment)
9. [Monitoring and Observability](#monitoring-and-observability)
10. [Security Implementation](#security-implementation)
11. [Scaling Strategy](#scaling-strategy)
12. [Resilience Patterns](#resilience-patterns)
13. [Development Practices](#development-practices)

## Introduction

This document provides detailed technical design specifications for implementing the HugMeNow microservices architecture. It serves as a technical guide for developers, architects, and DevOps engineers involved in building and maintaining the system. While the Evolution Plan document focuses on the strategic roadmap and high-level architecture, this document dives deeper into technical implementation details.

## Microservices Architecture

### Technology Stack

HugMeNow uses a polyglot microservices architecture with the following primary technologies:

**Service Implementation**:
- **Node.js with Express**: For lightweight, high-throughput services
- **TypeScript**: For type safety and improved maintainability
- **NestJS**: For more complex services requiring structured organization
- **GraphQL (Apollo)**: For flexible API aggregation
- **Python with FastAPI**: For ML/analytics-focused services
- **Go**: For high-performance critical path services

**Data Management**:
- **PostgreSQL**: Primary relational database
- **MongoDB**: For flexible schema requirements
- **Redis**: For caching and real-time features
- **Elasticsearch**: For search functionality
- **TimescaleDB**: For time-series data (mood tracking)
- **Neo4j**: For graph relationship data (social network)

**Infrastructure**:
- **Docker**: For containerization
- **Kubernetes**: For orchestration
- **Istio**: For service mesh capabilities
- **HashiCorp Vault**: For secrets management
- **AWS/GCP/Azure**: For cloud infrastructure

### System Topology

The production environment topology includes:

1. **Edge Layer**:
   - CDN for static assets
   - WAF for security
   - API Gateway for routing

2. **Service Layer**:
   - Kubernetes clusters for service orchestration
   - Service Mesh for communication management
   - Auto-scaling service groups

3. **Data Layer**:
   - Database clusters (primary/replica)
   - Cache clusters
   - Object storage

4. **Observability Layer**:
   - Distributed tracing (Jaeger)
   - Metrics collection (Prometheus)
   - Log aggregation (ELK/Loki)

## Service Decomposition

### Bounded Contexts

HugMeNow is divided into the following bounded contexts (domain areas):

1. **Identity and Access**: User management, authentication, authorization
2. **Mood Tracking**: Emotion recording, analysis, and visualization
3. **Social Connections**: Relationships, interactions, and social graph
4. **Content Management**: Educational resources and recommendations
5. **Marketplace**: Digital goods and creator economy
6. **Analytics and Insights**: Data processing and visualization
7. **Platform Operations**: System health, monitoring, and administration

### Microservice Details

Each microservice has the following characteristics documented:

- **Responsibility**: Core domain and functions
- **Data Ownership**: Tables/collections owned
- **External Dependencies**: Other services required
- **API Surface**: Endpoints and operations provided
- **Event Emissions**: Events published to the event bus
- **Event Subscriptions**: Events consumed from other services
- **Scaling Characteristics**: Expected load patterns
- **Criticality Level**: Impact of service failure

## Service Implementations

### User Service

**Technology**: NestJS with TypeScript

**Responsibility**: Manages user accounts, profiles, authentication, and authorization.

**Data Models**:
```typescript
// Core user entity
interface User {
  id: string;
  email: string;
  passwordHash: string;
  username: string;
  displayName: string;
  profileImageUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User profile
interface UserProfile {
  userId: string;
  bio?: string;
  location?: string;
  themePrefrence: string;
  privacySettings: PrivacySettings;
  notificationSettings: NotificationSettings;
  lastActive: Date;
}

// User authentication method
interface AuthMethod {
  userId: string;
  provider: 'local' | 'google' | 'apple' | 'facebook';
  providerUserId?: string;
  providerData?: Record<string, any>;
  isActive: boolean;
  lastUsed: Date;
}
```

**API Endpoints**:
- `POST /users`: Register new user
- `GET /users/:id`: Get user profile
- `PUT /users/:id`: Update user profile
- `DELETE /users/:id`: Delete user account
- `POST /auth/login`: Authenticate user
- `POST /auth/refresh-token`: Refresh JWT token
- `POST /auth/social/:provider`: Social authentication
- `GET /users/:id/settings`: Get user settings
- `PUT /users/:id/settings`: Update user settings

**Events Published**:
- `UserCreated`: When a new user registers
- `UserUpdated`: When a user profile is modified
- `UserDeleted`: When a user account is removed
- `UserActivated`: When a user logs in (becomes active)
- `UserDeactivated`: When a user logs out or becomes inactive

**Events Consumed**:
- `MoodStreakAchieved`: To update user achievements
- `BadgeAwarded`: To update user profile badges

**Database**: PostgreSQL with the following tables:
- `users`: Core user data
- `user_profiles`: Extended profile information
- `auth_methods`: Authentication providers for each user
- `sessions`: Active user sessions
- `refresh_tokens`: JWT refresh tokens

### Mood Service

**Technology**: NestJS with TypeScript, TimescaleDB for time-series data

**Responsibility**: Manages mood tracking, history, and analysis.

**Data Models**:
```typescript
// Core mood entry
interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  intensity: number;
  note?: string;
  contextualFactors?: ContextualFactor[];
  isPublic: boolean;
  createdAt: Date;
}

// Contextual factor affecting mood
interface ContextualFactor {
  id: string;
  moodEntryId: string;
  factor: string; // e.g., "sleep", "exercise", "work"
  value: number | string; // e.g., hours of sleep, exercise minutes
}

// Mood streak tracking
interface MoodStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: Date;
  streakUpdatedAt: Date;
}
```

**API Endpoints**:
- `POST /moods`: Create mood entry
- `GET /moods/:id`: Get specific mood entry
- `GET /users/:userId/moods`: Get user's mood history
- `GET /users/:userId/moods/stats`: Get mood statistics
- `GET /users/:userId/moods/streak`: Get mood streak information
- `GET /users/:userId/moods/timeline`: Get mood timeline visualization data

**Events Published**:
- `MoodEntryCreated`: When a new mood is recorded
- `MoodStreakUpdated`: When a user's streak changes
- `MoodStreakAchieved`: When a user reaches a streak milestone
- `MoodInsightGenerated`: When a new insight is created from mood data

**Events Consumed**:
- `UserCreated`: To initialize user's mood tracking
- `UserDeleted`: To handle mood data deletion

**Database**: TimescaleDB (PostgreSQL extension) with the following tables:
- `mood_entries`: Time-series mood data
- `contextual_factors`: Factors affecting moods
- `mood_streaks`: Streak tracking for continuous recording
- `mood_patterns`: Detected patterns in mood data

### Hug Service

**Technology**: NestJS with TypeScript

**Responsibility**: Manages virtual hugs, requests, and interactions.

**Data Models**:
```typescript
// Core hug entity
interface Hug {
  id: string;
  senderId: string;
  recipientId: string;
  type: string;
  message?: string;
  customizationData?: Record<string, any>;
  sentAt: Date;
  receivedAt?: Date;
  isRead: boolean;
}

// Hug request
interface HugRequest {
  id: string;
  requesterId: string;
  recipientId?: string; // Null for community requests
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  respondedAt?: Date;
}

// Group hug
interface GroupHug {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  participantIds: string[];
  message?: string;
  createdAt: Date;
  expiresAt?: Date;
  status: 'active' | 'completed' | 'expired';
}
```

**API Endpoints**:
- `POST /hugs`: Send a hug
- `GET /hugs/:id`: Get specific hug
- `GET /users/:userId/hugs/sent`: Get hugs sent by user
- `GET /users/:userId/hugs/received`: Get hugs received by user
- `POST /hug-requests`: Create hug request
- `PUT /hug-requests/:id/respond`: Respond to hug request
- `GET /users/:userId/hug-requests`: Get user's hug requests
- `POST /group-hugs`: Create group hug
- `PUT /group-hugs/:id/join`: Join group hug
- `GET /group-hugs/active`: Get active group hugs

**Events Published**:
- `HugSent`: When a hug is sent
- `HugReceived`: When a hug is received
- `HugRequestCreated`: When a hug request is created
- `HugRequestResponded`: When a request is accepted/declined
- `GroupHugCreated`: When a group hug is created
- `GroupHugJoined`: When a user joins a group hug

**Events Consumed**:
- `UserCreated`: To initialize user's hug metrics
- `UserDeleted`: To handle related hug data
- `FriendshipCreated`: To update hug permissions

**Database**: PostgreSQL with the following tables:
- `hugs`: Core hug data
- `hug_requests`: Hug request data
- `group_hugs`: Group hug data
- `group_hug_participants`: Participants in group hugs
- `hug_statistics`: Aggregated statistics on hug activity

### Social Service

**Technology**: NestJS with TypeScript, Neo4j for social graph

**Responsibility**: Manages friendships, connections, and social interactions.

**Data Models**:
```typescript
// Friendship relationship
interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

// Social feed item
interface FeedItem {
  id: string;
  userId: string;
  itemType: 'mood' | 'hug' | 'achievement' | 'milestone';
  contentId: string;
  createdAt: Date;
  visibility: 'public' | 'friends' | 'private';
  engagement: Engagement;
}

// User engagement with feed items
interface Engagement {
  reactions: Record<string, number>;
  commentCount: number;
  viewCount: number;
}

// Community or group
interface Community {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  moderatorIds: string[];
  memberCount: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**API Endpoints**:
- `POST /friendships`: Send friend request
- `PUT /friendships/:id`: Respond to friend request
- `GET /users/:userId/friends`: Get user's friends
- `GET /users/:userId/feed`: Get user's social feed
- `POST /communities`: Create community
- `GET /communities`: List communities
- `POST /communities/:id/join`: Join community
- `GET /communities/:id/members`: Get community members
- `POST /communities/:id/posts`: Create community post

**Events Published**:
- `FriendshipRequested`: When a friend request is sent
- `FriendshipCreated`: When a friendship is established
- `FriendshipEnded`: When a friendship is terminated
- `CommunityCreated`: When a new community is created
- `CommunityJoined`: When a user joins a community
- `FeedItemCreated`: When a new item appears in social feeds

**Events Consumed**:
- `UserCreated`: To initialize user's social graph
- `UserDeleted`: To clean up social connections
- `MoodEntryCreated`: To potentially create feed items
- `HugSent`: To potentially create feed items
- `BadgeAwarded`: To potentially create feed items

**Database**: 
- Neo4j for social graph (users, relationships)
- PostgreSQL for:
  - `friendships`: Friendship relationships
  - `friend_requests`: Pending friend requests
  - `feed_items`: Social feed content
  - `communities`: User communities
  - `community_members`: Community membership
  - `engagements`: User engagement with content

### Content Service

**Technology**: NestJS with TypeScript, MongoDB for content storage

**Responsibility**: Manages educational content, resources, and recommendations.

**Data Models**:
```typescript
// Content resource
interface Content {
  id: string;
  title: string;
  type: 'article' | 'video' | 'exercise' | 'infographic' | 'audio';
  description: string;
  body: string; // HTML or Markdown
  mediaUrl?: string;
  author: string;
  tags: string[];
  categories: string[];
  relatedMoods: string[];
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
}

// Content category
interface ContentCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  sortOrder: number;
}

// User interaction with content
interface ContentInteraction {
  userId: string;
  contentId: string;
  interactionType: 'view' | 'bookmark' | 'complete' | 'share';
  timeSpent?: number; // seconds
  completionPercentage?: number;
  createdAt: Date;
}
```

**API Endpoints**:
- `GET /content`: List content with filtering
- `GET /content/:id`: Get specific content
- `GET /content/categories`: Get content categories
- `GET /content/recommended`: Get personalized recommendations
- `GET /content/by-mood/:mood`: Get content for specific mood
- `POST /content/:id/interactions`: Record user interaction
- `GET /users/:userId/bookmarks`: Get user's bookmarked content

**Events Published**:
- `ContentPublished`: When new content is published
- `ContentInteractionCreated`: When users interact with content
- `ContentRecommended`: When content is recommended to a user

**Events Consumed**:
- `UserCreated`: To initialize user's content preferences
- `MoodEntryCreated`: To update content recommendations
- `UserSegmentUpdated`: To refine content targeting

**Database**: MongoDB with the following collections:
- `contents`: Content resources
- `contentCategories`: Content categorization
- `contentInteractions`: User interactions with content
- `contentRecommendations`: Personalized recommendations

### Analytics Service

**Technology**: Python with FastAPI for API, Apache Spark for batch processing

**Responsibility**: Processes data for insights, trends, and recommendations.

**Data Models**:
```python
# User insight
class UserInsight:
    id: str
    userId: str
    insightType: str  # "mood_pattern", "trigger_detection", "improvement_suggestion"
    title: str
    description: str
    relevanceScore: float  # 0.0 to 1.0
    data: Dict[str, Any]  # Supporting data
    createdAt: datetime
    expiresAt: Optional[datetime]
    isRead: bool

# User segment
class UserSegment:
    id: str
    name: str
    description: str
    criteria: Dict[str, Any]  # Query criteria
    userCount: int
    createdAt: datetime
    updatedAt: datetime
    isActive: bool

# Analytics job
class AnalyticsJob:
    id: str
    jobType: str  # "batch_insights", "trend_detection", "recommendation_refresh"
    status: str  # "queued", "running", "completed", "failed"
    parameters: Dict[str, Any]
    progress: float  # 0.0 to 1.0
    startedAt: Optional[datetime]
    completedAt: Optional[datetime]
    result: Optional[Dict[str, Any]]
```

**API Endpoints**:
- `GET /users/:userId/insights`: Get personalized insights
- `POST /analytics/jobs`: Schedule analytics job
- `GET /analytics/jobs/:id`: Get job status
- `GET /analytics/trends`: Get platform-wide trends
- `GET /analytics/segments`: List user segments
- `POST /analytics/segments`: Create user segment
- `GET /users/:userId/recommendations`: Get personalized recommendations

**Events Published**:
- `InsightGenerated`: When a new insight is created
- `TrendDetected`: When a significant trend is identified
- `UserSegmentUpdated`: When a user segment changes
- `RecommendationGenerated`: When new recommendations are created

**Events Consumed**:
- `UserCreated`: To initialize analytics profile
- `MoodEntryCreated`: To process for insights
- `HugSent`, `HugReceived`: To analyze social patterns
- `ContentInteractionCreated`: To improve recommendations

**Database**:
- PostgreSQL for structured analytics data:
  - `user_insights`: Personalized insights
  - `user_segments`: User groupings
  - `analytics_jobs`: Processing jobs
- Data Warehouse (BigQuery/Redshift) for aggregated data
- Data Lake (S3/GCS) for raw event data

### Notification Service

**Technology**: Node.js with Express, Redis for real-time delivery

**Responsibility**: Manages all user notifications across channels.

**Data Models**:
```typescript
// Core notification
interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channels: NotificationChannel[];
  status: 'pending' | 'delivered' | 'read' | 'failed';
  createdAt: Date;
  expiresAt?: Date;
}

// Notification channel
interface NotificationChannel {
  type: 'push' | 'email' | 'in-app' | 'sms';
  status: 'pending' | 'delivered' | 'failed';
  deliveredAt?: Date;
  failureReason?: string;
}

// User notification preferences
interface NotificationPreference {
  userId: string;
  categoryPreferences: Record<string, {
    enabled: boolean;
    channels: string[];
  }>;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
    timezone: string;
  };
}
```

**API Endpoints**:
- `POST /notifications`: Create notification
- `GET /users/:userId/notifications`: Get user's notifications
- `PUT /notifications/:id/read`: Mark notification as read
- `DELETE /notifications/:id`: Delete notification
- `GET /users/:userId/notification-preferences`: Get preferences
- `PUT /users/:userId/notification-preferences`: Update preferences
- `POST /notifications/batch`: Send batch notifications

**Events Published**:
- `NotificationCreated`: When a notification is generated
- `NotificationDelivered`: When a notification is delivered
- `NotificationRead`: When a user reads a notification

**Events Consumed**:
- Many service events that trigger notifications:
  - `HugReceived`: To notify recipient
  - `FriendshipRequested`: To notify recipient
  - `MoodStreakAchieved`: To congratulate user
  - `InsightGenerated`: To notify about new insights

**Database**: PostgreSQL with the following tables:
- `notifications`: Core notification data
- `notification_channels`: Delivery channels for notifications
- `notification_templates`: Templates for different notification types
- `notification_preferences`: User preferences for notifications

## Data Management

### Database Strategy

HugMeNow implements a polyglot persistence strategy with service-specific databases:

**Service-Database Mapping**:
- **User Service**: PostgreSQL
- **Mood Service**: TimescaleDB
- **Hug Service**: PostgreSQL
- **Social Service**: Neo4j + PostgreSQL
- **Content Service**: MongoDB
- **Analytics Service**: PostgreSQL + Data Warehouse
- **Notification Service**: PostgreSQL + Redis

### Data Consistency

For maintaining consistency across service boundaries:

1. **Within Service**: ACID transactions for strong consistency
2. **Between Services**: Eventual consistency with event-driven updates
3. **Critical Flows**: Saga pattern for distributed transactions

Example Saga implementation for user registration with profile creation:

```typescript
// Simplified Saga coordinator in User Service
async function createUserWithProfile(userData, profileData) {
  // Start transaction
  const transaction = await transactionManager.begin();
  
  try {
    // Step 1: Create user
    const user = await userRepository.create(userData, { transaction });
    
    // Step 2: Create user profile
    try {
      const profile = await profileRepository.create({
        ...profileData,
        userId: user.id
      }, { transaction });
      
      // Step 3: Initialize user settings
      try {
        await settingsRepository.initialize(user.id, { transaction });
        
        // If all steps succeed, commit transaction
        await transaction.commit();
        
        // Publish events after successful commit
        await eventBus.publish('UserCreated', { user, profile });
        
        return { user, profile };
      } catch (error) {
        // Compensating action: Roll back to previous state
        throw error; // Will trigger catch block and rollback
      }
    } catch (error) {
      // Compensating action: Delete the user we just created
      throw error; // Will trigger catch block and rollback
    }
  } catch (error) {
    // Rollback the entire transaction
    await transaction.rollback();
    throw new Error(`Failed to create user: ${error.message}`);
  }
}
```

### Data Migration Strategy

For evolving database schemas across versions:

1. **Schema Versioning**: Using migration tools (TypeORM, Sequelize, etc.)
2. **Backward Compatibility**: Support for reading old formats
3. **Forward Compatibility**: Anticipate future schema changes
4. **Blue/Green Migrations**: For zero-downtime schema updates

Example migration script for adding a new field:

```typescript
// TypeORM migration example
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrivacySettingsToUserProfile1234567890123 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        // Add new column with default value
        await queryRunner.query(`
            ALTER TABLE user_profiles 
            ADD COLUMN privacy_settings JSONB NOT NULL DEFAULT '{"shareStatus":"friends","allowHugsFrom":"friends"}';
        `);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        // Revert changes
        await queryRunner.query(`
            ALTER TABLE user_profiles 
            DROP COLUMN privacy_settings;
        `);
    }
}
```

## Inter-Service Communication

### Synchronous Communication

REST API design principles:

1. **Resource-Oriented**: APIs model domain resources
2. **Standard Methods**: Using HTTP verbs appropriately
3. **Status Codes**: Proper use of HTTP status codes
4. **Pagination**: Consistent pagination using offset/limit
5. **Filtering**: Query parameter-based filtering
6. **Versioning**: URL-based versioning (e.g., `/v1/users`)

Example REST controller in NestJS:

```typescript
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('search') search?: string
  ) {
    const [users, total] = await this.userService.findAll(limit, offset, search);
    return {
      data: users,
      meta: {
        total,
        limit,
        offset
      }
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(id);
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
```

### Asynchronous Communication

Event-driven communication pattern using a message broker:

1. **Event Standard**: JSON format with standard envelope
2. **Event Sourcing**: For critical business events
3. **Message Durability**: Persistent events for reliability
4. **Dead Letter Queues**: For handling failed processing
5. **Idempotent Consumers**: Safe reprocessing of duplicates

Example event producer in NestJS:

```typescript
@Injectable()
export class UserEventPublisher {
  constructor(
    @Inject('EVENT_BUS') private readonly eventBus: ClientProxy
  ) {}

  async publishUserCreated(user: User): Promise<void> {
    const event = {
      id: uuidv4(),
      type: 'UserCreated',
      timestamp: new Date().toISOString(),
      data: {
        userId: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      },
      metadata: {
        version: '1.0',
        source: 'user-service'
      }
    };
    
    await firstValueFrom(this.eventBus.emit('UserCreated', event));
  }
}
```

Example event consumer in NestJS:

```typescript
@Injectable()
export class UserEventConsumer {
  private readonly logger = new Logger(UserEventConsumer.name);

  constructor(private readonly moodService: MoodService) {}

  @EventPattern('UserCreated')
  async handleUserCreated(event: any): Promise<void> {
    try {
      this.logger.debug(`Processing UserCreated event: ${event.id}`);
      
      // Check for duplicate processing
      const isDuplicate = await this.isDuplicateEvent(event.id);
      if (isDuplicate) {
        this.logger.debug(`Skipping duplicate event: ${event.id}`);
        return;
      }
      
      // Initialize user's mood tracking
      await this.moodService.initializeForUser(event.data.userId);
      
      // Mark event as processed
      await this.markEventAsProcessed(event.id);
      
      this.logger.debug(`Successfully processed event: ${event.id}`);
    } catch (error) {
      this.logger.error(`Error processing UserCreated event: ${error.message}`, error.stack);
      // Depending on the error, we might want to rethrow to trigger retry
      throw error;
    }
  }
  
  private async isDuplicateEvent(eventId: string): Promise<boolean> {
    // Check in processed events storage
    // ...
    return false; // Simplified
  }
  
  private async markEventAsProcessed(eventId: string): Promise<void> {
    // Record in processed events storage
    // ...
  }
}
```

## API Design

### API Gateway Implementation

The API Gateway provides a unified entry point for clients:

**Technologies**:
- Kong or AWS API Gateway for routing
- JWT validation for authentication
- Rate limiting for protection
- Request/response transformation for compatibility

**Gateway Configuration Example** (Kong):

```yaml
services:
  - name: user-service
    url: http://user-service:3000/v1
    routes:
      - name: user-routes
        paths:
          - /api/v1/users
        strip_path: false
        methods:
          - GET
          - POST
          - PUT
          - DELETE
    plugins:
      - name: jwt
        config:
          secret_is_base64: false
          key_claim_name: kid
          claims_to_verify:
            - exp
      - name: rate-limiting
        config:
          second: 10
          hour: 1000
          policy: local

  - name: mood-service
    url: http://mood-service:3000/v1
    routes:
      - name: mood-routes
        paths:
          - /api/v1/moods
        strip_path: false
        methods:
          - GET
          - POST
          - PUT
          - DELETE
    plugins:
      - name: jwt
      - name: rate-limiting
```

### GraphQL API

HugMeNow provides a GraphQL API for flexible data fetching:

**Technologies**:
- Apollo Server for GraphQL implementation
- DataLoader for efficient database access
- Federated GraphQL for service composition

**Example Schema Definitions**:

```graphql
# User Service Schema
type User @key(fields: "id") {
  id: ID!
  username: String!
  email: String!
  displayName: String
  profileImageUrl: String
  createdAt: DateTime!
  isOnline: Boolean!
}

extend type Query {
  user(id: ID!): User
  users(limit: Int = 10, offset: Int = 0): [User!]!
  me: User
}

# Mood Service Schema
type MoodEntry @key(fields: "id") {
  id: ID!
  user: User! @provides(fields: "id")
  mood: String!
  intensity: Float!
  note: String
  isPublic: Boolean!
  createdAt: DateTime!
}

extend type User @key(fields: "id") {
  id: ID! @external
  moodEntries(limit: Int = 10, offset: Int = 0): [MoodEntry!]!
  moodStats: MoodStats!
}

type MoodStats {
  averageMood: Float!
  entryCount: Int!
  streakDays: Int!
  dominantMood: String
}

extend type Query {
  moodEntry(id: ID!): MoodEntry
  moodEntries(userId: ID!, limit: Int = 10, offset: Int = 0): [MoodEntry!]!
}

extend type Mutation {
  createMoodEntry(input: CreateMoodEntryInput!): MoodEntry!
}

input CreateMoodEntryInput {
  mood: String!
  intensity: Float!
  note: String
  isPublic: Boolean = false
}
```

**Example Resolver Implementation**:

```typescript
// User service resolver
const resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      return dataSources.userAPI.getUserById(id);
    },
    users: async (_, { limit, offset }, { dataSources }) => {
      return dataSources.userAPI.getUsers(limit, offset);
    },
    me: async (_, __, { user, dataSources }) => {
      if (!user) return null;
      return dataSources.userAPI.getUserById(user.id);
    }
  },
  User: {
    __resolveReference: async (reference, { dataSources }) => {
      return dataSources.userAPI.getUserById(reference.id);
    }
  }
};

// Mood service resolver
const resolvers = {
  Query: {
    moodEntry: async (_, { id }, { dataSources }) => {
      return dataSources.moodAPI.getMoodEntryById(id);
    },
    moodEntries: async (_, { userId, limit, offset }, { dataSources }) => {
      return dataSources.moodAPI.getMoodEntriesByUserId(userId, limit, offset);
    }
  },
  Mutation: {
    createMoodEntry: async (_, { input }, { user, dataSources }) => {
      if (!user) throw new AuthenticationError('You must be logged in');
      return dataSources.moodAPI.createMoodEntry({ 
        ...input, 
        userId: user.id 
      });
    }
  },
  MoodEntry: {
    user: async (moodEntry, _, { dataSources }) => {
      return { __typename: 'User', id: moodEntry.userId };
    }
  },
  User: {
    moodEntries: async (user, { limit, offset }, { dataSources }) => {
      return dataSources.moodAPI.getMoodEntriesByUserId(user.id, limit, offset);
    },
    moodStats: async (user, _, { dataSources }) => {
      return dataSources.moodAPI.getMoodStatsByUserId(user.id);
    }
  }
};
```

## Service Deployment

### CI/CD Pipeline

HugMeNow uses GitHub Actions for CI/CD with the following workflow:

```yaml
name: Service CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Test
        run: npm test
        
      - name: Build
        run: npm run build

  build-and-push:
    needs: test
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
        
      - name: Login to Container Registry
        uses: docker/login-action@v1
        with:
          registry: ${{ secrets.REGISTRY_URL }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}
          
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v3
        with:
          images: ${{ secrets.REGISTRY_URL }}/hugmenow/user-service
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=sha,format=long
            
      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=${{ secrets.REGISTRY_URL }}/hugmenow/user-service:buildcache
          cache-to: type=registry,ref=${{ secrets.REGISTRY_URL }}/hugmenow/user-service:buildcache,mode=max

  deploy:
    needs: build-and-push
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Kubectl
        uses: azure/setup-kubectl@v1
        
      - name: Set Kubernetes context
        uses: azure/k8s-set-context@v1
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG }}
          
      - name: Deploy to Kubernetes
        run: |
          # Update image version in deployment
          kubectl set image deployment/user-service user-service=${{ secrets.REGISTRY_URL }}/hugmenow/user-service:sha-${{ github.sha }} -n hugmenow
          
          # Wait for rollout to complete
          kubectl rollout status deployment/user-service -n hugmenow --timeout=5m
```

### Kubernetes Deployment

Example Kubernetes manifests for the User Service:

```yaml
# user-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: hugmenow
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: ${REGISTRY_URL}/hugmenow/user-service:${VERSION}
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: user-service-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: user-service-secrets
              key: jwt-secret
        - name: EVENT_BUS_URL
          valueFrom:
            configMapKeyRef:
              name: hugmenow-config
              key: event-bus-url
        resources:
          limits:
            cpu: "1"
            memory: "1Gi"
          requests:
            cpu: "200m"
            memory: "256Mi"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 20

---
# user-service-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: hugmenow
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
# user-service-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service
  namespace: hugmenow
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Helm Charts

For managing environment-specific configurations, Helm is used:

```yaml
# user-service/Chart.yaml
apiVersion: v2
name: user-service
description: HugMeNow User Service
type: application
version: 0.1.0
appVersion: "1.0.0"

# user-service/values.yaml
replicaCount: 3

image:
  repository: ${REGISTRY_URL}/hugmenow/user-service
  tag: latest
  pullPolicy: Always

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

resources:
  limits:
    cpu: 1
    memory: 1Gi
  requests:
    cpu: 200m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

env:
  - name: NODE_ENV
    value: production
  - name: PORT
    value: "3000"

secrets:
  - name: DATABASE_URL
    key: database-url
  - name: JWT_SECRET
    key: jwt-secret

configMaps:
  - name: EVENT_BUS_URL
    key: event-bus-url

probes:
  readiness:
    path: /health
    initialDelaySeconds: 15
    periodSeconds: 10
  liveness:
    path: /health
    initialDelaySeconds: 30
    periodSeconds: 20
```

## Monitoring and Observability

### Distributed Tracing

Implemented using OpenTelemetry with Jaeger:

```typescript
// Initialize tracing in NestJS application
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Initialize OpenTelemetry
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'user-service',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    }),
  });
  
  // Configure exporters
  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new JaegerExporter({
        endpoint: process.env.JAEGER_ENDPOINT || 'http://jaeger:14268/api/traces',
      })
    )
  );
  
  // Register with global tracer provider
  provider.register();
  
  // Add trace context to HTTP requests
  app.use(openTelemetryMiddleware());
  
  await app.listen(3000);
}
```

Example middleware for adding tracing to HTTP requests:

```typescript
export function openTelemetryMiddleware() {
  return (req, res, next) => {
    const tracer = trace.getTracer('http');
    
    // Create span for HTTP request
    const span = tracer.startSpan(`HTTP ${req.method} ${req.path}`, {
      kind: SpanKind.SERVER,
      attributes: {
        [SemanticAttributes.HTTP_METHOD]: req.method,
        [SemanticAttributes.HTTP_URL]: req.url,
        [SemanticAttributes.HTTP_ROUTE]: req.path,
        [SemanticAttributes.HTTP_USER_AGENT]: req.get('User-Agent'),
      },
    });
    
    // Add trace headers to response
    const spanContext = trace.setSpan(context.active(), span);
    const ctx = contextStorage.enterWith(context.active());
    
    // Capture response status
    const originalEnd = res.end;
    res.end = function(...args) {
      span.setAttributes({
        [SemanticAttributes.HTTP_STATUS_CODE]: res.statusCode,
      });
      
      if (res.statusCode >= 400) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: `HTTP Error ${res.statusCode}`,
        });
      }
      
      span.end();
      return originalEnd.apply(this, args);
    };
    
    // Continue request handling
    next();
  };
}
```

### Metrics Collection

Using Prometheus and Grafana for metrics:

```typescript
// NestJS metrics module
@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  controllers: [MetricsController],
})
export class MetricsModule {}

// Metrics controller exposing endpoint
@Controller('metrics')
export class MetricsController {
  constructor(private readonly prometheusService: PrometheusService) {
    // Register custom metrics
    this.prometheusService.registerCounter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    });
    
    this.prometheusService.registerHistogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
    });
    
    this.prometheusService.registerGauge({
      name: 'user_service_active_users',
      help: 'Number of active users in the system',
    });
  }

  @Get()
  getMetrics(@Res() response) {
    response.setHeader('Content-Type', this.prometheusService.contentType);
    response.send(this.prometheusService.metrics);
  }
}
```

### Log Aggregation

Using the ELK stack for log aggregation:

```typescript
// NestJS logger configuration
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('USER-SERVICE', {
      colors: false,
      prettyPrint: false,
    }),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// In production, add Elasticsearch transport
if (process.env.NODE_ENV === 'production') {
  const { ElasticsearchTransport } = require('winston-elasticsearch');
  
  logger.add(new ElasticsearchTransport({
    level: 'info',
    clientOpts: {
      node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
    },
    indexPrefix: 'logs-hugmenow',
  }));
}

// Add request context middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.requestId = requestId;
  
  // Add request context to logger
  logger.defaultMeta = {
    ...logger.defaultMeta,
    requestId,
    userId: req.user?.id,
  };
  
  next();
});
```

## Security Implementation

### Authentication Implementation

Using JSON Web Tokens (JWT) for authentication:

```typescript
// JWT Auth Guard in NestJS
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      
      // Attach user to request
      request.user = payload;
      
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Authentication token expired');
      }
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// JWT creation service
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(user: User): Promise<{accessToken: string, refreshToken: string}> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
    };
    
    // Access token - short-lived
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
    
    // Refresh token - long-lived
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, tokenType: 'refresh' },
      {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }
    );
    
    // Store refresh token hash in database
    await this.storeRefreshToken(user.id, refreshToken);
    
    return {
      accessToken,
      refreshToken,
    };
  }
  
  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    // Hash token before storage
    const tokenHash = createHash('sha256').update(token).digest('hex');
    
    // Store in database with expiry
    await this.refreshTokenRepository.create({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isRevoked: false,
    });
  }
}
```

### Authorization Implementation

Using role-based and attribute-based access control:

```typescript
// Role-based authorization guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// Resource ownership guard
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resourceType = this.reflector.getAllAndOverride<string>('resourceType', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!resourceType) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      return false;
    }
    
    // Check if user is an admin
    if (user.roles?.includes('admin')) {
      return true;
    }
    
    // Get resource ID from request params
    const resourceId = request.params.id;
    
    // Check ownership based on resource type
    switch (resourceType) {
      case 'mood':
        return this.moodService.checkOwnership(resourceId, user.id);
      case 'hug':
        return this.hugService.checkOwnership(resourceId, user.id);
      default:
        return false;
    }
  }
}

// Usage in controller
@Controller('moods')
export class MoodController {
  @Get(':id')
  @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
  @SetMetadata('resourceType', 'mood')
  async getMood(@Param('id') id: string) {
    return this.moodService.findOne(id);
  }
  
  @Post()
  @UseGuards(JwtAuthGuard)
  async createMood(@Body() createMoodDto: CreateMoodDto, @Request() req) {
    return this.moodService.create({
      ...createMoodDto,
      userId: req.user.id,
    });
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
  @SetMetadata('resourceType', 'mood')
  async deleteMood(@Param('id') id: string) {
    return this.moodService.remove(id);
  }
}
```

### Data Protection

Implementing encryption for sensitive data:

```typescript
// Field-level encryption service
@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;
  
  constructor() {
    // Derive key from environment variable
    this.key = crypto.scryptSync(
      process.env.ENCRYPTION_KEY,
      'salt',
      32
    );
  }
  
  encrypt(text: string): string {
    // Generate initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    // Encrypt data
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    // Return IV + Auth Tag + Encrypted data
    return Buffer.concat([
      iv,
      authTag,
      Buffer.from(encrypted, 'hex')
    ]).toString('base64');
  }
  
  decrypt(encryptedData: string): string {
    // Decode base64
    const buffer = Buffer.from(encryptedData, 'base64');
    
    // Extract IV, Auth Tag, and encrypted content
    const iv = buffer.slice(0, 16);
    const authTag = buffer.slice(16, 32);
    const encrypted = buffer.slice(32).toString('hex');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Usage in service
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}
  
  async create(userData: CreateUserDto): Promise<User> {
    // Encrypt sensitive personal information
    const encryptedData = {
      ...userData,
      email: this.encryptionService.encrypt(userData.email),
      // Other sensitive fields
    };
    
    return this.userRepository.create(encryptedData);
  }
  
  async findByEmail(email: string): Promise<User | null> {
    // Find all users and decrypt emails for comparison
    // (In production, we would have a secure lookup mechanism)
    const users = await this.userRepository.findAll();
    
    return users.find(user => {
      try {
        const decryptedEmail = this.encryptionService.decrypt(user.email);
        return decryptedEmail === email;
      } catch (error) {
        return false;
      }
    }) || null;
  }
}
```

## Scaling Strategy

### Horizontal Scaling Implementation

Services are designed for stateless horizontal scaling:

```typescript
// Health check controller for Kubernetes probes
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly cache: RedisHealthIndicator,
    @Inject('RABBITMQ_CONNECTION') private readonly amqpConnection: any,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Database connectivity check
      () => this.db.pingCheck('database', { timeout: 1000 }),
      
      // Redis cache check
      () => this.cache.pingCheck('redis', { timeout: 1000 }),
      
      // Message broker check
      () => this.checkRabbitMQ(),
      
      // Disk space check
      () => this.checkDiskSpace(),
      
      // Memory usage check
      () => this.checkMemoryUsage(),
    ]);
  }
  
  private checkRabbitMQ(): HealthIndicatorResult {
    const isHealthy = this.amqpConnection && this.amqpConnection.isConnected();
    
    return {
      rabbitmq: {
        status: isHealthy ? 'up' : 'down',
      },
    };
  }
  
  private checkDiskSpace(): HealthIndicatorResult {
    // Check if disk space is sufficient
    const freeSpace = this.getDiskFreeSpace();
    const isHealthy = freeSpace > 500 * 1024 * 1024; // 500 MB
    
    return {
      diskSpace: {
        status: isHealthy ? 'up' : 'down',
        freeSpace: `${Math.round(freeSpace / (1024 * 1024))} MB`,
      },
    };
  }
  
  private checkMemoryUsage(): HealthIndicatorResult {
    const memoryUsage = process.memoryUsage();
    const heapUsed = memoryUsage.heapUsed / memoryUsage.heapTotal;
    const isHealthy = heapUsed < 0.9; // Less than 90% heap usage
    
    return {
      memory: {
        status: isHealthy ? 'up' : 'down',
        heapUsage: `${Math.round(heapUsed * 100)}%`,
      },
    };
  }
  
  private getDiskFreeSpace(): number {
    // Implementation depends on environment
    // This is a simplified version
    return 1000 * 1024 * 1024; // 1 GB (mock value)
  }
}
```

### Database Scaling

Implementing connection pooling and read replicas:

```typescript
// Database configuration in NestJS
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        // Connection pool settings
        poolSize: configService.get('DB_POOL_SIZE', 10),
        connectTimeoutMS: 3000,
        // Read replicas for read queries
        replication: {
          master: {
            host: configService.get('DB_MASTER_HOST'),
            port: configService.get('DB_MASTER_PORT'),
            username: configService.get('DB_MASTER_USERNAME'),
            password: configService.get('DB_MASTER_PASSWORD'),
            database: configService.get('DB_DATABASE'),
          },
          slaves: [
            {
              host: configService.get('DB_SLAVE1_HOST'),
              port: configService.get('DB_SLAVE1_PORT'),
              username: configService.get('DB_SLAVE1_USERNAME'),
              password: configService.get('DB_SLAVE1_PASSWORD'),
              database: configService.get('DB_DATABASE'),
            },
            {
              host: configService.get('DB_SLAVE2_HOST'),
              port: configService.get('DB_SLAVE2_PORT'),
              username: configService.get('DB_SLAVE2_USERNAME'),
              password: configService.get('DB_SLAVE2_PASSWORD'),
              database: configService.get('DB_DATABASE'),
            },
          ],
          selector: 'RR', // Round-robin for read queries
        },
        // Additional options
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: true,
        logging: configService.get('DB_LOGGING', false),
        ssl: configService.get('DB_SSL_ENABLED', false)
          ? {
              rejectUnauthorized: false,
            }
          : false,
      }),
    }),
  ],
})
export class DatabaseModule {}
```

## Resilience Patterns

### Circuit Breaker Implementation

Using circuit breaker pattern for external service calls:

```typescript
// Circuit breaker service
@Injectable()
export class CircuitBreakerService {
  private readonly breakers = new Map<string, CircuitBreaker>();
  
  getBreaker(serviceName: string): CircuitBreaker {
    if (!this.breakers.has(serviceName)) {
      // Create new circuit breaker
      const breaker = new CircuitBreaker({
        name: serviceName,
        failureThreshold: 3,        // Number of failures before opening
        resetTimeout: 10000,        // Time in ms to reset to half-open
        halfOpenSuccessThreshold: 2, // Successes needed in half-open state
        timeout: 5000,              // Request timeout
        fallback: this.defaultFallback,
        onOpen: () => console.log(`Circuit opened for ${serviceName}`),
        onClose: () => console.log(`Circuit closed for ${serviceName}`),
        onHalfOpen: () => console.log(`Circuit half-open for ${serviceName}`),
      });
      
      this.breakers.set(serviceName, breaker);
    }
    
    return this.breakers.get(serviceName);
  }
  
  private defaultFallback(err: Error, args: any[]) {
    throw new ServiceUnavailableException(
      `Service is currently unavailable: ${err.message}`
    );
  }
}

// Usage in API client
@Injectable()
export class ExternalServiceClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}
  
  async fetchData(id: string): Promise<any> {
    const breaker = this.circuitBreaker.getBreaker('external-service');
    
    return breaker.exec(async () => {
      const response = await this.httpService.get(
        `https://api.external.com/data/${id}`
      ).toPromise();
      
      return response.data;
    });
  }
}
```

### Retry Pattern Implementation

Implementing retry with exponential backoff:

```typescript
// Retry decorator
export function Retry(options: {
  maxRetries: number;
  backoffFactor: number;
  initialDelay: number;
  maxDelay: number;
  retryableErrors?: Array<any>;
}) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      let retries = 0;
      let delay = options.initialDelay;
      
      while (true) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          // Check if error is retryable
          const shouldRetry = options.retryableErrors 
            ? options.retryableErrors.some(e => error instanceof e)
            : true;
            
          if (!shouldRetry || retries >= options.maxRetries) {
            throw error;
          }
          
          // Log retry attempt
          console.log(`Retrying after error: ${error.message} (${retries + 1}/${options.maxRetries})`);
          
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Increase delay for next retry (with maximum cap)
          delay = Math.min(delay * options.backoffFactor, options.maxDelay);
          retries++;
        }
      }
    };
    
    return descriptor;
  };
}

// Usage in service
@Injectable()
export class NotificationService {
  constructor(private readonly httpService: HttpService) {}
  
  @Retry({
    maxRetries: 3,
    backoffFactor: 2,
    initialDelay: 1000,
    maxDelay: 10000,
    retryableErrors: [
      TimeoutError,
      ConnectionError,
      RequestError,
    ],
  })
  async sendPushNotification(userId: string, payload: any): Promise<boolean> {
    try {
      await this.httpService.post(
        `${this.pushServiceUrl}/notifications`,
        {
          userId,
          payload,
        }
      ).toPromise();
      
      return true;
    } catch (error) {
      console.error(`Failed to send push notification: ${error.message}`);
      throw error;
    }
  }
}
```

### Bulkhead Pattern Implementation

Isolating failures using the bulkhead pattern:

```typescript
// Bulkhead implementation with semaphore
export class Bulkhead {
  private readonly semaphore: Semaphore;
  private readonly queue: Array<{
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    fn: () => Promise<any>;
  }> = [];
  private readonly queueTimeout: number;
  
  constructor(options: {
    maxConcurrent: number;
    maxQueue: number;
    queueTimeout: number;
  }) {
    this.semaphore = new Semaphore(options.maxConcurrent);
    this.queueTimeout = options.queueTimeout;
  }
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Try to acquire semaphore
    if (await this.semaphore.tryAcquire()) {
      try {
        return await fn();
      } finally {
        this.semaphore.release();
        this.processQueue();
      }
    }
    
    // If semaphore is full, queue the request
    if (this.queue.length >= this.maxQueue) {
      throw new Error('Bulkhead queue is full');
    }
    
    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        // Remove from queue
        const index = this.queue.findIndex(item => 
          item.resolve === resolve && item.reject === reject
        );
        
        if (index !== -1) {
          this.queue.splice(index, 1);
          reject(new Error('Bulkhead queue timeout'));
        }
      }, this.queueTimeout);
      
      this.queue.push({
        resolve: (value) => {
          clearTimeout(timeout);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        fn,
      });
    });
  }
  
  private async processQueue() {
    if (this.queue.length === 0) return;
    
    if (await this.semaphore.tryAcquire()) {
      const nextItem = this.queue.shift();
      
      try {
        const result = await nextItem.fn();
        nextItem.resolve(result);
      } catch (error) {
        nextItem.reject(error);
      } finally {
        this.semaphore.release();
        this.processQueue();
      }
    }
  }
}

// Usage in API client
@Injectable()
export class ExternalApiClient {
  private readonly bulkhead = new Bulkhead({
    maxConcurrent: 10,
    maxQueue: 20,
    queueTimeout: 5000,
  });
  
  constructor(private readonly httpService: HttpService) {}
  
  async fetchUserData(userId: string): Promise<UserData> {
    return this.bulkhead.execute(async () => {
      const response = await this.httpService.get(
        `${this.apiUrl}/users/${userId}`
      ).toPromise();
      
      return response.data;
    });
  }
}
```

## Development Practices

### Code Organization

NestJS module structure for the User Service:

```
src/
├── main.ts                  # Application entry point
├── app.module.ts            # Root module
├── common/                  # Shared utilities
│   ├── decorators/          # Custom decorators
│   ├── filters/             # Exception filters
│   ├── guards/              # Authorization guards
│   ├── interceptors/        # Request/response interceptors
│   ├── middleware/          # HTTP middleware
│   ├── pipes/               # Validation pipes
│   └── utils/               # Utility functions
├── config/                  # Configuration
│   ├── database.config.ts
│   ├── app.config.ts
│   └── validation.schema.ts
├── users/                   # Users domain module
│   ├── dto/                 # Data transfer objects
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── user-response.dto.ts
│   ├── entities/            # Database entities
│   │   └── user.entity.ts
│   ├── repositories/        # Data access
│   │   └── user.repository.ts
│   ├── services/            # Business logic
│   │   └── user.service.ts
│   ├── controllers/         # API endpoints
│   │   └── user.controller.ts
│   ├── events/              # Domain events
│   │   ├── user-created.event.ts
│   │   └── user-events.publisher.ts
│   └── users.module.ts      # Module definition
├── auth/                    # Authentication module
│   ├── dto/
│   ├── strategies/          # Passport strategies
│   ├── guards/              # Auth guards
│   ├── services/
│   ├── controllers/
│   └── auth.module.ts
└── health/                  # Health check module
    ├── controllers/
    └── health.module.ts
```

### Testing Approach

Implementing comprehensive testing strategy:

```typescript
// Unit test for UserService
describe('UserService', () => {
  let service: UserService;
  let repository: MockType<Repository<User>>;
  let eventPublisher: MockType<UserEventPublisher>;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: UserEventPublisher,
          useFactory: mockFactory,
        },
      ],
    }).compile();
    
    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
    eventPublisher = module.get(UserEventPublisher);
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('findAll', () => {
    it('should return array of users', async () => {
      const expectedUsers = [new User(), new User()];
      repository.find.mockReturnValue(expectedUsers);
      
      const result = await service.findAll();
      
      expect(result).toEqual(expectedUsers);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('findOne', () => {
    it('should return a user when found', async () => {
      const expectedUser = new User();
      repository.findOne.mockReturnValue(expectedUser);
      
      const result = await service.findOne('1');
      
      expect(result).toEqual(expectedUser);
      expect(repository.findOne).toHaveBeenCalledWith('1');
    });
    
    it('should return null when user not found', async () => {
      repository.findOne.mockReturnValue(null);
      
      const result = await service.findOne('999');
      
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith('999');
    });
  });
  
  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      
      const createdUser = {
        id: '1',
        ...createUserDto,
        createdAt: new Date(),
      };
      
      repository.create.mockReturnValue(createdUser);
      repository.save.mockReturnValue(createdUser);
      
      const result = await service.create(createUserDto);
      
      expect(result).toEqual(createdUser);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(eventPublisher.publishUserCreated).toHaveBeenCalledWith(createdUser);
    });
    
    it('should hash the password before saving', async () => {
      // Implementation details...
    });
  });
});

// Integration test for UserController
describe('UserController (Integration)', () => {
  let app: INestApplication;
  let userService: UserService;
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        UsersModule,
        AuthModule,
      ],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    
    // Apply middleware, global pipes, etc.
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  describe('GET /users', () => {
    it('should return an array of users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
    
    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/users?limit=5&offset=10')
        .expect(200)
        .then(response => {
          expect(response.body.meta.limit).toBe(5);
          expect(response.body.meta.offset).toBe(10);
        });
    });
  });
  
  describe('POST /users', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'Password123!',
        })
        .expect(201)
        .then(response => {
          expect(response.body.id).toBeDefined();
          expect(response.body.email).toBe('test@example.com');
          expect(response.body.username).toBe('testuser');
          expect(response.body.password).toBeUndefined(); // Password should not be returned
        });
    });
    
    it('should return validation errors for invalid input', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'invalid-email',
          username: 'te', // Too short
          password: 'weak',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toContain('validation failed');
          expect(response.body.errors).toBeDefined();
        });
    });
  });
});
```

### Documentation

Using Swagger for API documentation:

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('HugMeNow User Service')
    .setDescription('The User Service API description')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
}

// Controller with Swagger decorators
@ApiTags('users')
@Controller('users')
export class UserController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Pagination limit' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Pagination offset' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserResponseDto] })
  async findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    // Implementation...
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'The user record', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    // Implementation...
  }
  
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async create(@Body() createUserDto: CreateUserDto) {
    // Implementation...
  }
  
  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Implementation...
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  async remove(@Param('id') id: string) {
    // Implementation...
  }
}
```

This detailed technical design document provides a comprehensive blueprint for implementing the HugMeNow microservices architecture. It covers the specific technical implementation details that developers need to follow when building each microservice, from data models and API designs to resilience patterns and security implementations.