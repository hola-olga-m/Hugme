# HugMood Project Documentation

## Summary

This comprehensive documentation details the HugMood wellness application architecture, components, and functionality. Key accomplishments in the documentation include:

1. **Complete Architecture Overview**: Detailed explanation of the dual server implementation (WebSocket and GraphQL-based) with microservices architecture.
2. **Class and Method Signatures**: Thoroughly documented classes, methods, parameters, and return types for all major components.
3. **Service Worker Implementation**: In-depth documentation of the offline capabilities, caching strategies, and background sync features.
4. **Mobile Integration**: Complete documentation of the React Native mobile implementation with platform-specific features.
5. **Technical Specifications**: Detailed specifications for all components, services, and utilities with their interactions.
6. **Error Handling**: Comprehensive documentation of error handling strategies across the application.

This documentation serves as both a technical reference and onboarding resource for developers working on the HugMood platform.

## Project Overview

HugMood is a mobile-first emotional wellness application providing an innovative, technology-driven approach to personal emotional support and exploration. The application enables users to track their moods, send virtual hugs, and connect with others in a supportive community.

## Key Technologies

- React for cross-platform web development with mobile-first design
- GraphQL for unified API access across microservices 
- WebSockets for real-time updates and notifications
- Sequelize ORM for database interactions
- Express.js for server-side infrastructure
- Progressive Web App (PWA) features with service worker for offline capabilities
- Haptic feedback for enhanced user experience
- JWT-based authentication with support for social login

## System Architecture

The HugMood application is structured with a modern microservices-based architecture, with two primary runtime configurations:

1. **WebSocket-based Server** (`server.js`): The original server implementation using WebSockets for real-time communication
2. **GraphQL-based Server** (`new-server.js`): A modern implementation using GraphQL Yoga with subscriptions

### Microservices Architecture

The application consists of the following microservices:

- **API Gateway** - Entry point for REST API requests, routing to appropriate services (Port: 4000)
- **GraphQL Gateway** - Unified GraphQL API across all services (Port: 5000)
- **Auth Service** - Authentication and authorization (Port: 5001)
- **User Service** - User profile management (Port: 5002)
- **Mood Service** - Mood tracking and analytics (Port: 5003)
- **Hug Service** - Social interactions and virtual hug features (Port: 5004)
- **GraphQL Mesh Gateway** - Advanced GraphQL gateway using Mesh SDK (Port: 4005)

## Project Structure

```
/
├── public/                     # Static assets and client-side files
├── src/                        # Source code
│   ├── assets/                 # Application assets
│   ├── components/             # React components
│   ├── config/                 # Configuration files
│   ├── contexts/               # React context providers
│   ├── graphql/                # GraphQL schema and resolvers
│   ├── hooks/                  # Custom React hooks
│   ├── layouts/                # Page layout components
│   ├── middleware/             # Express middleware
│   ├── models/                 # Database models
│   ├── pages/                  # Page components
│   ├── routes/                 # Route definitions
│   ├── services/               # Service layer
│   ├── styles/                 # CSS and styling
│   └── utils/                  # Utility functions
├── services/                   # Microservices implementation
│   ├── api-gateway/            # API Gateway service
│   ├── auth-service/           # Authentication service
│   ├── graphql-gateway/        # GraphQL Gateway service
│   ├── hug-service/            # Hug management service
│   ├── mood-service/           # Mood tracking service
│   └── user-service/           # User management service
├── mesh/                       # GraphQL Mesh configuration
├── server.js                   # Main WebSocket-based server
├── new-server.js               # GraphQL-based server
├── graphql-server.js           # Apollo GraphQL server setup
├── mesh-sdk-gateway.js         # GraphQL Mesh SDK Gateway
└── start-services.js           # Microservices startup script
```

## Server Implementations

### 1. WebSocket-based Server (`server.js`)

The original server implementation using WebSockets for real-time communication between client and server.

**Main Components:**
- Express application setup
- WebSocket server for real-time communication
- JWT-based authentication
- RESTful API endpoints
- Sequelize database models
- GraphQL integration

**Key Methods:**
- `handleClientMessage(ws, message)`: Processes WebSocket messages from clients
- `handleAuthentication(ws, clients, data)`: Manages user authentication
- `handleRegistration(ws, clientId, client, data)`: Processes user registration
- `handleLogin(ws, clientId, client, data)`: Handles user login
- `handleTokenAuth(ws, clientId, client, data)`: Manages token-based authentication
- `handleMoodUpdate(ws, clients, data)`: Processes mood updates
- `handleSendHug(ws, clients, data)`: Manages sending hugs between users
- `handleHugRequest(ws, clients, data)`: Processes hug requests
- `generateMoodAnalytics(userId, timeRange, includeCorrelations)`: Generates mood analytics

### 2. GraphQL-based Server (`new-server.js`)

A modern implementation using GraphQL Yoga with subscriptions for real-time updates.

**Main Components:**
- Express application setup
- GraphQL Yoga server
- PubSub for GraphQL subscriptions
- JWT-based authentication
- Static file serving
- Database connection and model synchronization

**Key Methods:**
- `initializeServices()`: Initializes database and services
- `startYogaServer()`: Configures and starts the GraphQL Yoga server
- `startServer()`: Main entry point for server initialization
- JWT authentication middleware

### 3. GraphQL Server (`graphql-server.js`)

Sets up the GraphQL server using Apollo Server and Express.

**Main Components:**
- Apollo Server setup
- Express application
- WebSocket support for subscriptions
- JWT authentication
- GraphQL schema and resolvers

**Key Methods:**
- `getUserById(userId)`: Retrieves user by ID
- `authenticateUser(email, password)`: Authenticates users with credentials
- `getUserByEmail(email)`: Retrieves user by email
- `getUserByUsername(username)`: Retrieves user by username
- `createUser(userData)`: Creates a new user account
- `getMoodsByUserId(userId)`: Retrieves moods for a user
- `getMoodStreakByUserId(userId)`: Gets a user's mood streak information
- `createMoodEntry(moodData)`: Creates a new mood entry
- `sendHugToUser(hugData)`: Sends a virtual hug to a user
- `createHugRequest(requestData)`: Creates a new hug request
- `startApolloServer()`: Initializes and starts the Apollo server

## Client-Side Services

### Authentication Service (`src/services/authService.js`)

Handles user authentication, registration, and session management.

**Key Methods:**
- `register(userData)`: Registers a new user
- `login(email, password, rememberMe)`: Authenticates a user
- `logout()`: Logs out the current user
- `getToken()`: Gets the current authentication token
- `getCurrentUser()`: Gets the current user data
- `isAuthenticated()`: Checks if user is authenticated
- `updateCurrentUser(userData)`: Updates stored user data
- `forgotPassword(email)`: Initiates password reset
- `resetPassword(token, newPassword)`: Resets password with token
- `startAnonymousSession(nickname, avatarId)`: Starts an anonymous session
- `socialLogin(provider, socialData)`: Handles social login
- `updateProfile(userData)`: Updates user profile

### Communication Bridge (`src/services/communicationBridge.js`)

Bridges between WebSocket communication and GraphQL/REST API architecture.

**Key Methods:**
- `initialize(options)`: Initializes the communication bridge
- `sendMessage(message, preferredMethod)`: Sends messages to the server
- `fetchData(dataType, params)`: Fetches data with offline support
- `authenticate()`: Authenticates with the server
- `registerMessageHandler(messageType, handler)`: Registers message handlers

### GraphQL Communication Bridge (`src/services/graphQLCommunicationBridge.js`)

Provides GraphQL-based communication, replacing WebSockets.

**Key Methods:**
- `initialize(options)`: Initializes the GraphQL bridge
- `sendMessage(message)`: Sends messages using GraphQL
- `fetchData(dataType, params)`: Fetches data using GraphQL
- `subscribe(subscriptionType, params, handler)`: Subscribes to real-time updates
- `addConnectionListener(listener)`: Adds connection status listeners

### Connection Manager (`src/services/connectionManager.js`)

Manages network connection state and communication strategies.

**Key Methods:**
- `initialize(options)`: Initializes the connection manager
- `initializeGraphQL(options)`: Sets up GraphQL client
- `connectWebSocket()`: Connects to WebSocket server
- `send(message, preferredMethod)`: Sends messages using the best available method
- `handleConnectionChange(isOnline)`: Manages online/offline transitions
- `checkConnectionQuality()`: Checks network quality

### GraphQL Client (`src/services/graphqlClient.js`)

Low-level GraphQL client for communication with the server.

**Key Methods:**
- `request(query, variables, options)`: Sends GraphQL requests
- `query(query, variables, options)`: Executes GraphQL queries
- `mutate(mutation, variables, options)`: Executes GraphQL mutations
- `subscribe(subscription, variables, onData, onError)`: Creates GraphQL subscriptions
- `setAuthToken(token)`: Sets authentication token
- `initialize(options)`: Initializes the GraphQL client

### GraphQL Service (`src/services/graphqlService.js`)

Provides a service layer for GraphQL operations.

**Key Methods:**
- `initialize(options)`: Initializes the GraphQL service
- `executeQuery(query, variables, options)`: Executes GraphQL queries
- `executeMutation(mutation, variables, options)`: Executes GraphQL mutations
- `queries.getUserProfile()`: Gets the user profile
- `queries.getMoodHistory(userId, limit, offset)`: Gets mood history
- `queries.getMoodAnalytics(userId, timeRange)`: Gets mood analytics
- `mutations.login(email, password)`: Logs in a user
- `mutations.createMoodEntry(moodData)`: Creates a mood entry
- `mutations.sendHug(hugData)`: Sends a virtual hug

### HugMood API (`src/services/hugmoodAPI.js`)

Unified client-side API service for the microservices architecture.

**Key Methods:**
- `initialize()`: Initializes the API service
- `fetchData(dataType, params)`: Fetches data from the server
- `updateMood(mood, note, isPublic)`: Updates user's mood
- `sendHug(recipientId, hugType, message)`: Sends a virtual hug
- `requestHug(requestData)`: Requests a hug
- `createGroupHug(groupData)`: Creates a group hug
- `followUser(userId)`: Follows a user
- `unfollowUser(userId)`: Unfollows a user

### Mood Analytics Service (`src/services/moodAnalyticsService.js`)

Provides advanced analysis of mood data with personalized insights.

**Key Methods:**
- `fetchMoodAnalytics(socket, userId, options)`: Fetches mood analytics
- `findMostFrequentMoodGroup(moodFrequency)`: Finds dominant mood group
- `calculateMoodVariability(moodEntries)`: Calculates mood fluctuation
- `calculateImprovementTrend(moodEntries)`: Analyzes mood improvement
- `generateInsights(data)`: Generates personalized insights
- `generateRecommendations(data)`: Creates personalized recommendations

### Offline Storage (`src/services/offlineStorage.js`)

Provides IndexedDB-backed storage for offline functionality.

**Key Methods:**
- `openDatabase()`: Opens the IndexedDB database
- `storeUserData(dataType, data)`: Stores user data locally
- `getUserData(dataType)`: Retrieves user data
- `queueAction(action)`: Queues actions for when back online
- `getPendingActions()`: Gets pending offline actions
- `cacheApiResponse(url, response, ttl)`: Caches API responses

### Streak Service (`src/services/streakService.js`)

Manages user streaks and rewards.

**Key Methods:**
- `calculateCurrentStreak(activities)`: Calculates current streak
- `calculateLongestStreak(activities)`: Finds longest streak
- `getRewardsForStreakMilestone(streakCount)`: Gets milestone rewards
- `getNextMilestone(currentStreak)`: Gets the next streak milestone
- `checkMilestoneReached(oldStreak, newStreak)`: Checks for milestone achievements

## Database Models

The application uses Sequelize ORM with the following models:

- **User**: User accounts and profiles
- **Mood**: User mood entries
- **Hug**: Virtual hug interactions
- **MediaHug**: Rich media hugs with attachments
- **Badge**: Achievement badges
- **UserBadge**: User-badge associations
- **GroupHug**: Group hug events
- **GroupHugParticipant**: Group hug participants
- **Follow**: User follow relationships
- **UserStreak**: User streak tracking
- **WellnessActivity**: Wellness activity records
- **StreakReward**: Rewards for streak milestones

## GraphQL Implementation

The application uses GraphQL for API interactions with the following components:

- **Schema Definition**: Define the API structure and available operations
- **Resolvers**: Implement the logic for each operation
- **Queries**: Read operations for fetching data
- **Mutations**: Write operations for modifying data
- **Subscriptions**: Real-time updates via WebSockets

## React Contexts and State Management

### Auth Context (`src/contexts/AuthContext.js`)

Provides authentication state and operations throughout the application.

**Key Features:**
- User authentication state management
- Login, register, and logout functionality
- Token management and verification
- Anonymous session support
- Social authentication integration
- Password reset and management
- Profile updating

**Implementation Details:**
- Uses React Context API for state sharing
- Leverages GraphQL mutations and queries for auth operations
- Handles offline authentication through local storage fallbacks
- Provides custom hook `useAuth()` for easy access in components

### Hug Context (`src/contexts/HugContext.js`)

Manages hug-related functionality and state.

**Key Features:**
- Hug sending and receiving
- Hug request management
- Group hugs creation and participation
- Real-time hug notifications
- Haptic feedback on hug interactions

**Implementation Details:**
- Tracks different hug types (bear, side, healing, etc.)
- Maintains lists of received hugs, sent hugs, and requests
- Integrates with haptic feedback for physical sensations
- Uses dynamic imports for code splitting

### Theme Context (`src/contexts/ThemeContext.js`)

Handles application theming and appearance.

**Key Features:**
- Theme switching based on user preferences
- Mood-based theming support
- Dynamic color scheme application
- Light/dark mode support

### User Context (`src/contexts/UserContext.js`)

Manages user profile data and related operations.

**Key Features:**
- User profile state management
- Friend and follower management
- User preferences storage
- Status tracking (online/offline)

## Application Assets and Configuration

### Mood Emojis (`src/assets/moodEmojis.js`)

Defines mood types, their visual representations, and related metadata.

**Key Features:**
- Emoji mapping for different emotional states
- Mood valence groupings (positive, neutral, negative)
- Color coding for mood visualization
- Suggested hug types based on mood
- Transition suggestions between mood states

### Hug Types (`src/assets/hugTypes.js`)

Defines different types of virtual hugs and their characteristics.

**Key Features:**
- Extensive hug type definitions with metadata
- Categorization (comforting, friendly, celebratory, etc.)
- Visual effects and animations
- Duration and intensity parameters
- Support for group hug interactions
- Special hug types (AR, mystery, event)

## Utility Functions

### Haptic Feedback (`src/utils/haptics.js`)

Provides physical feedback through device vibration.

**Key Features:**
- Different vibration patterns for various interactions
- Support for different notification types
- Custom pattern creation
- Device capability detection
- Pattern stopping functionality

### Notifications (`src/utils/notifications.js`)

Manages system notifications for the application.

**Key Features:**
- Permission management for notifications
- Custom notification creation
- Scheduled notifications
- Fallbacks for unsupported browsers

## Mobile Integration

The application includes a React Native mobile version that shares core functionality with the web app.

**Key Features:**
- Shared business logic between web and mobile
- Native device feature integration
- Enhanced haptic feedback on supported devices
- Push notification support
- Offline first approach

## Progressive Web App Features

The application implements PWA capabilities for enhanced mobile experience:

**Key Features:**
- Service worker for offline capabilities
- Asset caching for improved performance
- Offline-first functionality
- Add to home screen support
- Push notifications

## Front-End Components

The front-end is built with React and includes the following major components:

- **App**: The main application component
- **Auth Components**: Login, Register, etc.
- **MoodTracker**: Mood tracking interface
- **Hugs**: Virtual hug creation and interaction
- **Community Feed**: Social feed of community activity
- **User Profile**: User profile management
- **Settings**: Application settings

## Communication Flow and Data Management

### Communication Architecture

1. Client initializes communication via `communicationBridge.js` or `graphQLCommunicationBridge.js`
2. Authentication occurs via `authService.js` 
3. Real-time updates flow through WebSockets or GraphQL subscriptions
4. Data persistence handled by Sequelize models
5. Offline functionality managed by `offlineStorage.js`

### Feature Flags for Communication Method

The application uses feature flags to gradually migrate from WebSockets to GraphQL:

```javascript
// from src/services/hugmoodAPI.js
const FEATURES = {
  auth: {
    useGraphQL: true,
    useWebSocket: false
  },
  mood: {
    useGraphQL: true,
    useWebSocket: false
  },
  hugs: {
    useGraphQL: true,
    useWebSocket: false
  },
  profiles: {
    useGraphQL: true,
    useWebSocket: false
  },
  // Additional features omitted for brevity
};
```

### Offline Support Architecture

The application implements a sophisticated offline support system:

1. **IndexedDB Storage**: Stores user data, mood entries, and pending actions
2. **Action Queue**: Queues operations to be processed when back online
3. **Optimistic Updates**: Updates UI immediately while queuing server operations
4. **Conflict Resolution**: Handles conflicts between offline changes and server state
5. **Cache Management**: TTL-based cache of API responses for offline availability

### Error Handling Strategy

Error handling is implemented throughout the application:

1. **Network Errors**: Graceful degradation with offline mode
2. **Authentication Errors**: Automatic token refresh and re-authentication
3. **Server Errors**: Transparent retry with exponential backoff
4. **Validation Errors**: Detailed user feedback with field-specific messages
5. **Unknown Errors**: Fallback error handling with generic user-friendly messages

## Service Worker Implementation

The application implements a service worker (`public/serviceWorker.js`) for offline capabilities and progressive web app features:

- **Cache API**: Caches static assets for offline use
- **Offline Mode**: Shows offline.html when network is unavailable
- **Push Notifications**: Handles push notifications
- **Background Sync**: Synchronizes data when reconnecting

### Service Worker Lifecycle

```
┌─────────────────┐      ┌──────────────┐      ┌───────────────┐
│                 │      │              │      │               │
│    Install      │─────▶│   Waiting    │─────▶│   Activated   │
│                 │      │              │      │               │
└─────────────────┘      └──────────────┘      └───────────────┘
        │                                              │
        ▼                                              ▼
┌─────────────────┐                          ┌───────────────┐
│  Cache Static   │                          │ Handle Fetch  │
│    Resources    │                          │   Events      │
└─────────────────┘                          └───────────────┘
```

### Cache Strategy

The service worker implements a cache-first strategy for static assets and a network-first strategy for API requests:

1. **Static Assets**: Check cache first, fall back to network
2. **API Requests**: Try network first, fall back to cache if available
3. **HTML Pages**: Network first with offline fallback
4. **Images**: Cache first with stale-while-revalidate approach

### Service Worker Reset

For debugging and recovery purposes, a service worker reset script (`public/sw-reset.js`) is provided that can:

1. Unregister all service workers
2. Clear caches
3. Register the service worker again

### Implementation Details

The service worker uses modern features including:

- **Cache API** for efficient resource storage
- **Fetch API** for network requests
- **Skip Waiting** for immediate activation
- **Clients Claim** to control all open tabs immediately
- **Navigation Preload** for faster navigations

### Service Worker Architecture

The service worker implementation is organized into several modular components for maintainability:

#### Core Event Handlers

```javascript
// Installation event - precache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    cacheManager.precacheResources()
      .then(() => self.skipWaiting())
  );
});

// Activation event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      cacheManager.clearOldCaches(),
      self.clients.claim()
    ])
  );
});

// Fetch event - intercept network requests
self.addEventListener('fetch', event => {
  // Apply different strategies based on request type
  event.respondWith(
    cacheManager.handleFetch(event)
  );
});

// Sync event - process background syncs
self.addEventListener('sync', event => {
  if (event.tag === 'sync-mood-updates') {
    event.waitUntil(
      offlineQueueManager.processQueue('mood-updates')
    );
  } else if (event.tag === 'sync-hugs') {
    event.waitUntil(
      offlineQueueManager.processQueue('hugs')
    );
  }
});

// Push event - handle push notifications
self.addEventListener('push', event => {
  event.waitUntil(
    pushNotificationHandler.handlePush(event)
  );
});

// Notification click event - handle notification interactions
self.addEventListener('notificationclick', event => {
  event.waitUntil(
    pushNotificationHandler.handleNotificationClick(event)
  );
});
```

#### Cache Management

The service worker implements a sophisticated cache management system with specialized strategies for different resource types:

```javascript
/**
 * Determine caching strategy based on request
 * @param {Request} request - The fetch request
 * @return {Promise<Response>} The response
 */
async function determineStrategy(request) {
  const url = new URL(request.url);
  
  // Static assets (CSS, JS, fonts, images)
  if (
    /\.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp)$/i.test(url.pathname)
  ) {
    return cacheFirst(request);
  }
  
  // API requests
  if (url.pathname.startsWith('/api/') || url.pathname === '/graphql') {
    return networkFirst(request);
  }
  
  // HTML pages
  if (request.mode === 'navigate' || request.headers.get('Accept').includes('text/html')) {
    return networkFirst(request, {
      // Fallback to offline page if network fails and page not in cache
      fallbackUrl: '/offline.html'
    });
  }
  
  // Default - try network with cache fallback
  return networkFirst(request);
}
```

#### Background Sync

The offline queueing system stores operations when the user is offline and replays them when connectivity is restored:

```javascript
/**
 * Queue an operation for background sync
 * @param {string} operationType - Type of operation ('mood', 'hug', etc.)
 * @param {Object} data - Operation data
 * @return {Promise<void>}
 */
async function queueOperation(operationType, data) {
  const db = await openDatabase();
  const tx = db.transaction('offline-operations', 'readwrite');
  const store = tx.objectStore('offline-operations');
  
  await store.add({
    id: generateId(),
    timestamp: Date.now(),
    type: operationType,
    data: data,
    attempts: 0,
    status: 'pending'
  });
  
  // Register for sync if supported
  if ('sync' in self.registration) {
    await self.registration.sync.register(`sync-${operationType}s`);
  }
}
```

#### Communication with Clients

The service worker communicates with client pages through the PostMessage API:

```javascript
/**
 * Broadcast message to all clients
 * @param {Object} message - Message to broadcast
 * @return {Promise<void>}
 */
async function broadcastMessage(message) {
  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window'
  });
  
  clients.forEach(client => {
    client.postMessage(message);
  });
}

/**
 * Notify clients about new content available
 * @return {Promise<void>}
 */
async function notifyUpdateAvailable() {
  broadcastMessage({
    type: 'UPDATE_AVAILABLE',
    timestamp: Date.now()
  });
}
```

#### Service Worker Registration

The main application registers the service worker during initialization:

```javascript
/**
 * Register the service worker
 * @return {Promise<void>}
 */
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js');
      
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            showUpdateNotification();
          }
        });
      });
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', event => {
        handleServiceWorkerMessage(event.data);
      });
      
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
}

## Classes and Method Signatures

### Server-Side Classes

#### `WebSocketServer` (server.js)
```javascript
/**
 * Main WebSocket server implementation
 * Handles real-time communication between clients and server
 */
class WebSocketServer {
  constructor(server, options = {}) { ... }
  
  /**
   * Initialize the WebSocket server
   * @param {http.Server} httpServer - The HTTP server to attach to
   * @return {WebSocketServer} The initialized server instance
   */
  initialize(httpServer) { ... }
  
  /**
   * Handle new client connections
   * @param {WebSocket} ws - The client WebSocket connection
   * @param {http.IncomingMessage} req - The HTTP request that initiated the connection
   */
  handleConnection(ws, req) { ... }
  
  /**
   * Authenticate a client connection
   * @param {WebSocket} ws - The client WebSocket connection
   * @param {Object} authData - The authentication data
   * @return {Promise<Object>} Authentication result with user data
   */
  authenticateClient(ws, authData) { ... }
  
  /**
   * Broadcast a message to all connected clients
   * @param {Object} message - The message to broadcast
   * @param {Function} [filter] - Optional filter function to determine which clients receive the message
   */
  broadcast(message, filter) { ... }
  
  /**
   * Send a message to a specific client
   * @param {string} clientId - The client ID
   * @param {Object} message - The message to send
   * @return {boolean} Whether the message was sent successfully
   */
  sendToClient(clientId, message) { ... }
  
  /**
   * Send a message to a specific user across all their connections
   * @param {string} userId - The user ID
   * @param {Object} message - The message to send
   * @return {boolean} Whether the message was sent to at least one connection
   */
  sendToUser(userId, message) { ... }
}
```

#### `GraphQLServer` (graphql-server.js)
```javascript
/**
 * Apollo GraphQL server implementation
 * Provides a unified GraphQL API for clients
 */
class GraphQLServer {
  constructor(options = {}) { ... }
  
  /**
   * Start the Apollo server
   * @param {Object} options - Server options
   * @return {Promise<ApolloServer>} The started server
   */
  async start(options) { ... }
  
  /**
   * Create the executable schema
   * @param {string} typeDefs - GraphQL type definitions
   * @param {Object} resolvers - GraphQL resolvers
   * @return {GraphQLSchema} The executable schema
   */
  createSchema(typeDefs, resolvers) { ... }
  
  /**
   * Set up WebSocket support for subscriptions
   * @param {http.Server} httpServer - The HTTP server
   * @param {GraphQLSchema} schema - The GraphQL schema
   * @return {Object} WebSocket server instance
   */
  setupWebSocketServer(httpServer, schema) { ... }
  
  /**
   * Create context for GraphQL operations
   * @param {Object} ctx - The context object
   * @return {Promise<Object>} The enhanced context
   */
  async createContext(ctx) { ... }
}
```

#### `MeshGateway` (mesh-sdk-gateway.js)
```javascript
/**
 * GraphQL Mesh Gateway
 * Unifies multiple GraphQL and REST APIs into a single endpoint
 */
class MeshGateway {
  constructor(options = {}) { ... }
  
  /**
   * Initialize the Mesh gateway
   * @param {Object} meshConfig - Configuration for the mesh
   * @return {Promise<Object>} The Mesh runtime
   */
  async initialize(meshConfig) { ... }
  
  /**
   * Add a source to the mesh
   * @param {string} name - Source name
   * @param {Object} handler - Source handler
   * @param {Object} options - Source options
   * @return {MeshGateway} This instance
   */
  addSource(name, handler, options) { ... }
  
  /**
   * Add a plugin to the mesh
   * @param {Object} plugin - The plugin to add
   * @param {Object} options - Plugin options
   * @return {MeshGateway} This instance
   */
  usePlugin(plugin, options) { ... }
  
  /**
   * Start the gateway server
   * @param {Object} serverOptions - Server options
   * @return {Promise<Object>} The started server
   */
  async serve(serverOptions) { ... }
}
```

### Client-Side Classes and Services

#### `AuthService` (src/services/authService.js)
```javascript
/**
 * Authentication service
 * Handles user authentication, registration, and session management
 */
export class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} [userData.displayName] - Display name
   * @return {Promise<Object>} Registration result
   */
  register(userData) { ... }
  
  /**
   * Login with email/username and password
   * @param {string} email - Email or username
   * @param {string} password - Password
   * @param {boolean} [rememberMe=false] - Whether to persist login
   * @return {Promise<Object>} Login result with token and user data
   */
  login(email, password, rememberMe = false) { ... }
  
  /**
   * Logout the current user
   * @return {Promise<void>}
   */
  logout() { ... }
  
  /**
   * Start an anonymous session
   * @param {string} [nickname='Guest'] - Nickname for anonymous user
   * @param {number} [avatarId=1] - Avatar ID
   * @return {Promise<Object>} Session result
   */
  startAnonymousSession(nickname = 'Guest', avatarId = 1) { ... }
  
  /**
   * Convert anonymous user to registered user
   * @param {Object} userData - User registration data
   * @return {Promise<Object>} Conversion result
   */
  convertAnonymousUser(userData) { ... }
  
  /**
   * Get current authentication status
   * @return {boolean} Whether user is authenticated
   */
  isAuthenticated() { ... }
  
  /**
   * Get current user data
   * @return {Promise<Object>} User data
   */
  getCurrentUser() { ... }
}
```

#### `ConnectionManager` (src/services/connectionManager.js)
```javascript
/**
 * Manages network connection state and communication strategies
 */
class ConnectionManager {
  constructor() { ... }
  
  /**
   * Initialize connection manager
   * @param {Object} options - Configuration options
   * @return {ConnectionManager} This instance
   */
  initialize(options = {}) { ... }
  
  /**
   * Initialize GraphQL client
   * @param {Object} options - Configuration options
   */
  initializeGraphQL(options = {}) { ... }
  
  /**
   * Connect to WebSocket server
   * @return {WebSocket} The WebSocket connection
   */
  connectWebSocket() { ... }
  
  /**
   * Send a message using the best available method
   * @param {Object} message - The message to send
   * @param {string} [preferredMethod='auto'] - Preferred method ('graphql', 'websocket', 'rest', 'auto')
   * @return {Promise<Object>} Response data or status
   */
  async send(message, preferredMethod = 'auto') { ... }
  
  /**
   * Handle connection status change
   * @param {boolean} isOnline - Whether device is online
   */
  handleConnectionChange(isOnline) { ... }
  
  /**
   * Check network connection quality
   * @return {Promise<Object>} Connection quality metrics
   */
  async checkConnectionQuality() { ... }
  
  /**
   * Add a listener for connection events
   * @param {Function} listener - Event listener callback
   * @return {Function} Function to remove the listener
   */
  addListener(listener) { ... }
}
```

#### `HugContext` (src/contexts/HugContext.js)
```javascript
/**
 * Hug Context Provider Component
 * Manages hug-related state and operations
 */
export const HugProvider = ({ children }) => {
  /**
   * Initialize the hug system
   * @return {Promise<void>}
   */
  const initializeHugSystem = useCallback(async () => { ... }, []);
  
  /**
   * Fetch all hug-related data for the user
   * @return {Promise<void>}
   */
  const fetchUserHugData = async () => { ... };
  
  /**
   * Send a hug to a user
   * @param {string} recipientId - Recipient's user ID
   * @param {string} hugTypeId - Type of hug to send
   * @param {string|null} [message=null] - Optional message
   * @return {Promise<Object>} The sent hug object
   */
  const sendHugToUser = async (recipientId, hugTypeId, message = null) => { ... };
  
  /**
   * Send a hug request
   * @param {Object} requestData - Request data
   * @return {Promise<Object>} The created request
   */
  const sendHugRequest = async (requestData) => { ... };
  
  /**
   * Respond to a hug request
   * @param {string} requestId - Request ID
   * @param {string} response - Response ('accept' or 'decline')
   * @param {string|null} [message=null] - Optional response message
   * @return {Promise<Object>} Response result
   */
  const respondToRequest = async (requestId, response, message = null) => { ... };
  
  /**
   * Create a group hug
   * @param {Object} groupHugData - Group hug data
   * @return {Promise<Object>} The created group hug
   */
  const createGroupHug = async (groupHugData) => { ... };
  
  /**
   * Join a group hug
   * @param {string} groupId - Group hug ID
   * @return {Promise<Object>} Join result
   */
  const joinGroupHug = async (groupId) => { ... };
};
```

#### `MoodAnalyticsService` (src/services/moodAnalyticsService.js)
```javascript
/**
 * Mood Analytics Service
 * Provides advanced analysis of mood data with personalized insights
 */
export class MoodAnalyticsService {
  /**
   * Fetch mood analytics data for a user
   * @param {WebSocket|null} socket - Optional WebSocket connection
   * @param {string} userId - User ID
   * @param {Object} options - Analysis options
   * @param {number} options.timeRange - Time range in days (7, 30, 90, 365)
   * @param {boolean} options.includeCorrelations - Whether to include correlations
   * @return {Promise<Object>} Mood analytics data
   */
  fetchMoodAnalytics(socket, userId, options = {}) { ... }
  
  /**
   * Find most frequent mood group
   * @param {Object} moodFrequency - Frequency of each mood
   * @return {string} The dominant mood group
   */
  findMostFrequentMoodGroup(moodFrequency) { ... }
  
  /**
   * Calculate mood variability
   * @param {Array} moodEntries - User's mood entries
   * @return {string} Variability level (low, moderate, high)
   */
  calculateMoodVariability(moodEntries) { ... }
  
  /**
   * Calculate improvement trend in mood
   * @param {Array} moodEntries - User's mood entries
   * @return {string} Trend direction (improving, stable, declining)
   */
  calculateImprovementTrend(moodEntries) { ... }
  
  /**
   * Generate personalized insights
   * @param {Object} data - Mood analytics data
   * @return {Array} Array of insight objects
   */
  generateInsights(data) { ... }
  
  /**
   * Generate personalized recommendations
   * @param {Object} data - Mood analytics data
   * @return {Array} Array of recommendation objects
   */
  generateRecommendations(data) { ... }
}
```

#### `OfflineStorage` (src/services/offlineStorage.js)
```javascript
/**
 * Offline Storage Service
 * Provides IndexedDB-backed storage for offline functionality
 */
export class OfflineStorage {
  /**
   * Open the IndexedDB database
   * @return {Promise<IDBDatabase>} Database instance
   */
  openDatabase() { ... }
  
  /**
   * Store user data locally
   * @param {string} dataType - Type of data (e.g., 'mood_history', 'hugs')
   * @param {Object} data - Data to store
   * @return {Promise<boolean>} Success status
   */
  storeUserData(dataType, data) { ... }
  
  /**
   * Retrieve user data
   * @param {string} dataType - Type of data to retrieve
   * @return {Promise<Object|null>} The retrieved data or null if not found
   */
  getUserData(dataType) { ... }
  
  /**
   * Queue an action to be performed when back online
   * @param {Object} action - The action to queue
   * @return {Promise<number>} ID of the queued action
   */
  queueAction(action) { ... }
  
  /**
   * Get all pending actions from the outbox
   * @return {Promise<Array>} Array of pending actions
   */
  getPendingActions() { ... }
  
  /**
   * Cache an API response
   * @param {string} url - The API URL
   * @param {Object} response - The response data
   * @param {number} [ttl=3600000] - Time to live in milliseconds
   * @return {Promise<boolean>} Success status
   */
  cacheApiResponse(url, response, ttl = 3600000) { ... }
}
```

### Utility Classes

#### `HapticFeedback` (src/utils/haptics.js)
```javascript
/**
 * Haptic Feedback Utilities
 * Provides physical feedback through device vibration
 */
export class HapticFeedback {
  /**
   * Play haptic feedback
   * @param {string} [type='selection'] - Type of feedback
   */
  static playHapticFeedback(type = 'selection') { ... }
  
  /**
   * Check if haptic feedback is supported
   * @return {boolean} True if supported
   */
  static isHapticFeedbackSupported() { ... }
  
  /**
   * Play notification haptic pattern
   * @param {string} [notificationType='message'] - Type of notification
   */
  static playNotificationHaptic(notificationType = 'message') { ... }
  
  /**
   * Create a custom haptic pattern
   * @param {Array<number>} pattern - Array of durations in ms
   */
  static playCustomHaptic(pattern) { ... }
  
  /**
   * Stop haptic feedback
   */
  static stopHapticFeedback() { ... }
}
```

#### `NotificationService` (src/utils/notifications.js)
```javascript
/**
 * Notification Service
 * Manages system notifications
 */
export class NotificationService {
  /**
   * Show a notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body text
   * @param {Object} options - Additional options
   * @return {Promise<Notification|null>} The notification object
   */
  static async showNotification(title, body, options = {}) { ... }
  
  /**
   * Schedule a notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body text
   * @param {number} delay - Delay in milliseconds
   * @param {Object} options - Additional options
   * @return {number} The timeout ID
   */
  static scheduleNotification(title, body, delay, options = {}) { ... }
  
  /**
   * Check if notifications are enabled
   * @return {boolean} True if enabled
   */
  static areNotificationsEnabled() { ... }
  
  /**
   * Request notification permission
   * @return {Promise<string>} Permission status
   */
  static async requestNotificationPermission() { ... }
}
```

## Development Guidelines

### Key Development Principles

1. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with JS
2. **Accessibility First**: All features are accessible using keyboard and screen readers
3. **Mobile-First Design**: Optimized for mobile devices, then enhanced for desktop
4. **Offline Support**: Core functionality available without network connection
5. **Performance Budget**: Initial load under 2 seconds, interactions under 100ms

### Development Workflow

1. **Feature Development**: 
   - Create components in isolation
   - Develop against mock data
   - Test with real API endpoints
   - Add to main application

2. **Testing Strategy**:
   - Unit tests for business logic and utilities
   - Component tests for UI elements
   - Integration tests for feature flows
   - End-to-end tests for critical paths

3. **Review Process**:
   - Code review focuses on performance, accessibility, and offline support
   - UI review checks responsive behavior and animation smoothness
   - Security review for authentication and data handling

### Microservices Development

For adding or modifying microservices:

1. Define service contract with OpenAPI or GraphQL schema
2. Implement service with comprehensive tests
3. Add to GraphQL Mesh or API Gateway
4. Update client-side code to use new endpoints
5. Add feature flags for gradual rollout