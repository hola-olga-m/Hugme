# WebSocket Protocol Reference

## Overview

HugMood implements a WebSocket-based communication protocol for real-time features, enabling bidirectional communication between clients and the server. This approach allows for instant updates, notifications, and responsive interaction without requiring clients to poll the server.

## Connection Establishment

### Connection URL

```
wss://api.hugmood.com/ws
```

For local development:

```
ws://localhost:5000/ws
```

### Connection Process

1. The client establishes a WebSocket connection to the server
2. The server accepts the connection and assigns a temporary client ID
3. The client must authenticate within 30 seconds, or the connection will be closed
4. After successful authentication, the connection is established for regular communication

## Message Format

All messages exchanged between client and server follow a JSON format with a consistent structure:

```json
{
  "type": "message_type",
  "id": "unique_message_id",
  "data": {
    // Message-specific data
  },
  "timestamp": "2023-08-25T14:30:00.000Z"
}
```

### Message Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Identifies the type of message |
| `id` | string | Unique identifier for the message (UUID v4) |
| `data` | object | Message-specific payload |
| `timestamp` | string | ISO 8601 timestamp when the message was created |

## Authentication

Authentication is required before regular communication can begin. Clients can authenticate using either login credentials or a JWT token from a previous session.

### Authentication with Credentials

**Client to Server:**

```json
{
  "type": "auth",
  "id": "msg-12345",
  "data": {
    "method": "credentials",
    "email": "user@example.com",
    "password": "userpassword",
    "rememberMe": true
  },
  "timestamp": "2023-08-25T14:30:00.000Z"
}
```

**Server to Client (Success):**

```json
{
  "type": "auth_response",
  "id": "msg-12345-resp",
  "data": {
    "success": true,
    "userId": "user-67890",
    "token": "jwt-token-string",
    "expires": "2023-09-25T14:30:00.000Z"
  },
  "timestamp": "2023-08-25T14:30:05.000Z"
}
```

**Server to Client (Failure):**

```json
{
  "type": "auth_response",
  "id": "msg-12345-resp",
  "data": {
    "success": false,
    "error": "invalid_credentials",
    "message": "Invalid email or password"
  },
  "timestamp": "2023-08-25T14:30:05.000Z"
}
```

### Authentication with Token

**Client to Server:**

```json
{
  "type": "auth",
  "id": "msg-12346",
  "data": {
    "method": "token",
    "token": "jwt-token-string"
  },
  "timestamp": "2023-08-25T14:35:00.000Z"
}
```

**Server to Client (Success):**

```json
{
  "type": "auth_response",
  "id": "msg-12346-resp",
  "data": {
    "success": true,
    "userId": "user-67890",
    "expires": "2023-09-25T14:30:00.000Z"
  },
  "timestamp": "2023-08-25T14:35:05.000Z"
}
```

### Anonymous Authentication

For users who want to use basic features without creating an account:

**Client to Server:**

```json
{
  "type": "auth",
  "id": "msg-12347",
  "data": {
    "method": "anonymous",
    "deviceId": "device-abcdef",
    "nickname": "HappyGuest"
  },
  "timestamp": "2023-08-25T14:40:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "auth_response",
  "id": "msg-12347-resp",
  "data": {
    "success": true,
    "userId": "anon-xyz123",
    "token": "anon-jwt-token-string",
    "expires": "2023-08-26T14:40:00.000Z",
    "isAnonymous": true
  },
  "timestamp": "2023-08-25T14:40:05.000Z"
}
```

## Message Types

### 1. User Status Messages

#### Update Status

**Client to Server:**

```json
{
  "type": "status_update",
  "id": "msg-23456",
  "data": {
    "status": "online",  // online, away, offline, do_not_disturb
    "customMessage": "Feeling creative today"
  },
  "timestamp": "2023-08-25T15:00:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "status_update_response",
  "id": "msg-23456-resp",
  "data": {
    "success": true,
    "status": "online",
    "customMessage": "Feeling creative today"
  },
  "timestamp": "2023-08-25T15:00:05.000Z"
}
```

#### User Status Broadcast

**Server to Clients:**

```json
{
  "type": "user_status_changed",
  "id": "bcast-34567",
  "data": {
    "userId": "user-67890",
    "status": "online",
    "customMessage": "Feeling creative today"
  },
  "timestamp": "2023-08-25T15:00:10.000Z"
}
```

### 2. Mood Messages

#### Update Mood

**Client to Server:**

```json
{
  "type": "mood_update",
  "id": "msg-34567",
  "data": {
    "mood": "happy",
    "intensity": 0.8,
    "note": "Just got some great news!",
    "isPublic": true,
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "name": "San Francisco",
      "type": "city"
    },
    "tags": ["achievement", "celebration"]
  },
  "timestamp": "2023-08-25T15:30:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "mood_update_response",
  "id": "msg-34567-resp",
  "data": {
    "success": true,
    "moodId": "mood-78901",
    "streakUpdate": {
      "current": 5,
      "best": 12,
      "lastUpdated": "2023-08-25T15:30:05.000Z"
    }
  },
  "timestamp": "2023-08-25T15:30:05.000Z"
}
```

#### Mood Update Broadcast

**Server to Clients:**

```json
{
  "type": "mood_changed",
  "id": "bcast-45678",
  "data": {
    "userId": "user-67890",
    "moodId": "mood-78901",
    "mood": "happy",
    "intensity": 0.8,
    "isPublic": true,
    "timestamp": "2023-08-25T15:30:00.000Z"
  },
  "timestamp": "2023-08-25T15:30:10.000Z"
}
```

### 3. Hug Messages

#### Send Hug

**Client to Server:**

```json
{
  "type": "send_hug",
  "id": "msg-45678",
  "data": {
    "recipientId": "user-12345",
    "hugType": "supportive",
    "message": "You've got this!",
    "customization": {
      "color": "#FF5733",
      "intensity": 0.7,
      "animation": "gentle_squeeze"
    }
  },
  "timestamp": "2023-08-25T16:00:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "send_hug_response",
  "id": "msg-45678-resp",
  "data": {
    "success": true,
    "hugId": "hug-56789",
    "recipientOnline": true,
    "deliveryStatus": "sent"
  },
  "timestamp": "2023-08-25T16:00:05.000Z"
}
```

#### Receive Hug

**Server to Client:**

```json
{
  "type": "hug_received",
  "id": "notif-56789",
  "data": {
    "hugId": "hug-56789",
    "senderId": "user-67890",
    "senderName": "Jane Smith",
    "hugType": "supportive",
    "message": "You've got this!",
    "sentAt": "2023-08-25T16:00:00.000Z",
    "customization": {
      "color": "#FF5733",
      "intensity": 0.7,
      "animation": "gentle_squeeze"
    }
  },
  "timestamp": "2023-08-25T16:00:10.000Z"
}
```

#### Hug Request

**Client to Server:**

```json
{
  "type": "request_hug",
  "id": "msg-56789",
  "data": {
    "targetType": "user",
    "targetId": "user-12345",
    "message": "Could use some support right now",
    "expiresAfter": 3600 // seconds
  },
  "timestamp": "2023-08-25T16:30:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "request_hug_response",
  "id": "msg-56789-resp",
  "data": {
    "success": true,
    "requestId": "req-67890",
    "expiresAt": "2023-08-25T17:30:00.000Z"
  },
  "timestamp": "2023-08-25T16:30:05.000Z"
}
```

#### Hug Request Received

**Server to Client:**

```json
{
  "type": "hug_request_received",
  "id": "notif-67890",
  "data": {
    "requestId": "req-67890",
    "requesterId": "user-67890",
    "requesterName": "Jane Smith",
    "message": "Could use some support right now",
    "createdAt": "2023-08-25T16:30:00.000Z",
    "expiresAt": "2023-08-25T17:30:00.000Z"
  },
  "timestamp": "2023-08-25T16:30:10.000Z"
}
```

#### Respond to Hug Request

**Client to Server:**

```json
{
  "type": "respond_hug_request",
  "id": "msg-67890",
  "data": {
    "requestId": "req-67890",
    "accept": true,
    "hugType": "comforting",
    "message": "Sending lots of support your way!",
    "customization": {
      "color": "#4287f5",
      "intensity": 0.9,
      "animation": "warm_embrace"
    }
  },
  "timestamp": "2023-08-25T16:45:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "respond_hug_request_response",
  "id": "msg-67890-resp",
  "data": {
    "success": true,
    "requestId": "req-67890",
    "hugId": "hug-78901"
  },
  "timestamp": "2023-08-25T16:45:05.000Z"
}
```

### 4. Group Hug Messages

#### Create Group Hug

**Client to Server:**

```json
{
  "type": "create_group_hug",
  "id": "msg-78901",
  "data": {
    "name": "Project Celebration",
    "description": "We completed the project!",
    "inviteeIds": ["user-12345", "user-23456", "user-34567"],
    "scheduledFor": "2023-08-26T15:00:00.000Z",
    "expiresAt": "2023-08-26T16:00:00.000Z",
    "message": "Let's celebrate our success together!"
  },
  "timestamp": "2023-08-25T17:00:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "create_group_hug_response",
  "id": "msg-78901-resp",
  "data": {
    "success": true,
    "groupHugId": "group-12345",
    "invitationsSent": 3
  },
  "timestamp": "2023-08-25T17:00:05.000Z"
}
```

#### Group Hug Invitation

**Server to Client:**

```json
{
  "type": "group_hug_invitation",
  "id": "notif-78901",
  "data": {
    "groupHugId": "group-12345",
    "name": "Project Celebration",
    "description": "We completed the project!",
    "creatorId": "user-67890",
    "creatorName": "Jane Smith",
    "scheduledFor": "2023-08-26T15:00:00.000Z",
    "expiresAt": "2023-08-26T16:00:00.000Z",
    "message": "Let's celebrate our success together!"
  },
  "timestamp": "2023-08-25T17:00:10.000Z"
}
```

#### Join Group Hug

**Client to Server:**

```json
{
  "type": "join_group_hug",
  "id": "msg-89012",
  "data": {
    "groupHugId": "group-12345"
  },
  "timestamp": "2023-08-25T17:30:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "join_group_hug_response",
  "id": "msg-89012-resp",
  "data": {
    "success": true,
    "groupHugId": "group-12345",
    "participants": [
      {"userId": "user-67890", "name": "Jane Smith"},
      {"userId": "user-12345", "name": "John Doe"},
      {"userId": "user-23456", "name": "Alice Johnson"}
    ]
  },
  "timestamp": "2023-08-25T17:30:05.000Z"
}
```

#### Group Hug Update

**Server to Clients:**

```json
{
  "type": "group_hug_update",
  "id": "bcast-89012",
  "data": {
    "groupHugId": "group-12345",
    "updateType": "participant_joined",
    "participant": {
      "userId": "user-34567",
      "name": "Bob Williams"
    },
    "participantCount": 4
  },
  "timestamp": "2023-08-25T17:45:00.000Z"
}
```

### 5. Follow / Friend Messages

#### Follow User

**Client to Server:**

```json
{
  "type": "follow_user",
  "id": "msg-90123",
  "data": {
    "targetUserId": "user-12345",
    "action": "follow" // or "unfollow"
  },
  "timestamp": "2023-08-25T18:00:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "follow_user_response",
  "id": "msg-90123-resp",
  "data": {
    "success": true,
    "targetUserId": "user-12345",
    "action": "follow",
    "currentFollowerCount": 42
  },
  "timestamp": "2023-08-25T18:00:05.000Z"
}
```

#### Follow Update

**Server to Client:**

```json
{
  "type": "follow_update",
  "id": "notif-90123",
  "data": {
    "userId": "user-67890",
    "userName": "Jane Smith",
    "action": "followed_you",
    "timestamp": "2023-08-25T18:00:00.000Z"
  },
  "timestamp": "2023-08-25T18:00:10.000Z"
}
```

### 6. Fetch Data Messages

#### Fetch Data Request

**Client to Server:**

```json
{
  "type": "fetch",
  "id": "msg-12349",
  "data": {
    "dataType": "mood_history",
    "userId": "user-67890", // can be omitted for current user
    "limit": 10,
    "offset": 0,
    "filters": {
      "startDate": "2023-08-01T00:00:00.000Z",
      "endDate": "2023-08-25T23:59:59.999Z"
    }
  },
  "timestamp": "2023-08-25T18:15:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "fetch_response",
  "id": "msg-12349-resp",
  "data": {
    "success": true,
    "dataType": "mood_history",
    "totalCount": 25,
    "items": [
      {
        "id": "mood-12345",
        "mood": "happy",
        "intensity": 0.8,
        "note": "Great day at work",
        "createdAt": "2023-08-24T15:30:00.000Z"
      },
      {
        "id": "mood-12346",
        "mood": "calm",
        "intensity": 0.6,
        "note": "Evening meditation",
        "createdAt": "2023-08-23T20:45:00.000Z"
      }
      // ... more items
    ]
  },
  "timestamp": "2023-08-25T18:15:05.000Z"
}
```

### 7. Analytics and Insights

#### Fetch Mood Analytics

**Client to Server:**

```json
{
  "type": "fetch",
  "id": "msg-12350",
  "data": {
    "dataType": "mood_analytics",
    "userId": "user-67890", // can be omitted for current user
    "timeRange": "month", // day, week, month, year
    "includeCorrelations": true
  },
  "timestamp": "2023-08-25T18:30:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "fetch_response",
  "id": "msg-12350-resp",
  "data": {
    "success": true,
    "dataType": "mood_analytics",
    "analytics": {
      "moodFrequency": {
        "happy": 0.45,
        "calm": 0.25,
        "sad": 0.15,
        "anxious": 0.10,
        "angry": 0.05
      },
      "moodByDayOfWeek": [
        {"day": "Monday", "averageMood": 6.2},
        {"day": "Tuesday", "averageMood": 6.5},
        {"day": "Wednesday", "averageMood": 7.0},
        {"day": "Thursday", "averageMood": 6.8},
        {"day": "Friday", "averageMood": 7.5},
        {"day": "Saturday", "averageMood": 8.1},
        {"day": "Sunday", "averageMood": 7.3}
      ],
      "moodByTimeOfDay": [
        {"hour": 8, "averageMood": 6.7},
        {"hour": 12, "averageMood": 7.2},
        {"hour": 16, "averageMood": 6.9},
        {"hour": 20, "averageMood": 7.6}
      ],
      "averageMood": 7.1,
      "correlations": [
        {
          "factor": "sleep",
          "correlationStrength": 0.72,
          "direction": "positive"
        },
        {
          "factor": "exercise",
          "correlationStrength": 0.65,
          "direction": "positive"
        },
        {
          "factor": "work_hours",
          "correlationStrength": 0.48,
          "direction": "negative"
        }
      ],
      "insights": [
        {
          "id": "insight-12345",
          "type": "pattern",
          "title": "Weekend Mood Boost",
          "description": "Your mood tends to improve significantly on weekends, with Saturday being your happiest day on average."
        },
        {
          "id": "insight-12346",
          "type": "correlation",
          "title": "Sleep Quality Connection",
          "description": "Days with better sleep quality (7+ hours) show a strong correlation with improved mood."
        }
      ]
    }
  },
  "timestamp": "2023-08-25T18:30:05.000Z"
}
```

### 8. Notifications

#### Notification Received

**Server to Client:**

```json
{
  "type": "notification",
  "id": "notif-12345",
  "data": {
    "notificationId": "n-12345",
    "notificationType": "badge_earned",
    "title": "New Badge Earned!",
    "body": "You've earned the 'Consistent Tracker' badge for tracking your mood daily for 7 days.",
    "createdAt": "2023-08-25T19:00:00.000Z",
    "data": {
      "badgeId": "badge-12345",
      "badgeName": "Consistent Tracker",
      "badgeImage": "https://assets.hugmood.com/badges/consistent_tracker.png"
    }
  },
  "timestamp": "2023-08-25T19:00:05.000Z"
}
```

#### Mark Notification Read

**Client to Server:**

```json
{
  "type": "mark_notification_read",
  "id": "msg-12351",
  "data": {
    "notificationId": "n-12345"
  },
  "timestamp": "2023-08-25T19:05:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "mark_notification_read_response",
  "id": "msg-12351-resp",
  "data": {
    "success": true,
    "notificationId": "n-12345",
    "unreadCount": 3
  },
  "timestamp": "2023-08-25T19:05:05.000Z"
}
```

## Error Handling

When errors occur, the server responds with an error message:

```json
{
  "type": "error",
  "id": "err-12345",
  "data": {
    "code": "invalid_request",
    "message": "The request format is invalid",
    "originalMessageId": "msg-12345",
    "details": {
      "field": "data.mood",
      "issue": "required_field_missing"
    }
  },
  "timestamp": "2023-08-25T19:10:00.000Z"
}
```

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `auth_required` | Authentication is required for this operation |
| `invalid_auth` | Authentication credentials are invalid |
| `auth_expired` | Authentication token has expired |
| `invalid_request` | The request format is invalid |
| `not_found` | The requested resource was not found |
| `permission_denied` | User lacks permission for this operation |
| `rate_limit_exceeded` | Too many requests in a short time period |
| `server_error` | Internal server error |

## Connection Management

### Keep-Alive Mechanism

To maintain connection status and detect disconnections:

1. **Ping-Pong**: The server sends a ping message every 30 seconds, and clients must respond with a pong message.

**Server to Client:**

```json
{
  "type": "ping",
  "id": "ping-12345",
  "data": {
    "timestamp": "2023-08-25T19:15:00.000Z"
  },
  "timestamp": "2023-08-25T19:15:00.000Z"
}
```

**Client to Server:**

```json
{
  "type": "pong",
  "id": "pong-12345",
  "data": {
    "pingId": "ping-12345"
  },
  "timestamp": "2023-08-25T19:15:01.000Z"
}
```

2. **Client Heartbeat**: As an alternative, clients can send a heartbeat message every 30 seconds.

**Client to Server:**

```json
{
  "type": "heartbeat",
  "id": "heartbeat-12345",
  "data": {},
  "timestamp": "2023-08-25T19:15:00.000Z"
}
```

### Connection Close

When the client wants to gracefully close the connection:

**Client to Server:**

```json
{
  "type": "disconnect",
  "id": "disconnect-12345",
  "data": {
    "reason": "user_logout"
  },
  "timestamp": "2023-08-25T20:00:00.000Z"
}
```

If the server needs to close the connection:

**Server to Client:**

```json
{
  "type": "connection_close",
  "id": "close-12345",
  "data": {
    "code": "session_expired",
    "message": "Your session has expired, please reconnect",
    "reconnectDelay": 1000 // milliseconds
  },
  "timestamp": "2023-08-25T20:30:00.000Z"
}
```

## Offline Handling and Reconnection

### Sequence Numbers

All messages include a sequence number to track message order and detect missed messages:

```json
{
  "type": "mood_update",
  "id": "msg-34567",
  "sequenceNumber": 42,
  "data": {
    // Message data
  },
  "timestamp": "2023-08-25T15:30:00.000Z"
}
```

### Reconnection Process

1. Client stores the last received sequence number
2. On reconnection, client includes this sequence number in the authentication message
3. Server sends any missed messages since that sequence number

**Client to Server:**

```json
{
  "type": "auth",
  "id": "msg-12346",
  "data": {
    "method": "token",
    "token": "jwt-token-string",
    "lastSequenceNumber": 42
  },
  "timestamp": "2023-08-25T14:35:00.000Z"
}
```

**Server to Client:**

```json
{
  "type": "missed_messages",
  "id": "missed-12345",
  "data": {
    "messages": [
      // Array of missed messages
    ],
    "startSequence": 43,
    "endSequence": 47
  },
  "timestamp": "2023-08-25T14:35:05.000Z"
}
```

## Best Practices

### Client Implementation

1. **Implement reconnection logic** with exponential backoff
2. **Queue outgoing messages** when offline for later transmission
3. **Track sequence numbers** to ensure no messages are missed
4. **Handle authentication expiration** by refreshing tokens
5. **Implement keep-alive mechanism** to detect disconnections

### Security Considerations

1. **Always use secure WebSocket (wss://)** in production
2. **Validate all incoming messages** before processing
3. **Implement rate limiting** to prevent abuse
4. **Use HTTPS for the initial connection** and token acquisition
5. **Don't share authentication tokens** between different sessions
6. **Implement token expiration** and refresh mechanisms

### Performance Optimization

1. **Keep messages small** by omitting unnecessary fields
2. **Use compression** for large messages
3. **Batch small updates** when appropriate
4. **Implement selective subscriptions** for relevant events only
5. **Use binary format** (via `messagepack` or similar) for reduced payload size in high-throughput scenarios

## WebSocket to GraphQL Transition

For clients migrating from WebSocket to GraphQL:

| WebSocket Message Type | GraphQL Equivalent |
|------------------------|-------------------|
| `auth` | `login` or `refreshToken` mutation |
| `mood_update` | `createMoodEntry` mutation |
| `send_hug` | `sendHug` mutation |
| `request_hug` | `requestHug` mutation |
| `fetch` (mood_history) | `moodEntries` query |
| `fetch` (mood_analytics) | `moodAnalytics` query |
| Real-time updates | GraphQL subscriptions |

The WebSocket protocol will be maintained alongside GraphQL for backward compatibility, but new features will primarily be added to the GraphQL API.