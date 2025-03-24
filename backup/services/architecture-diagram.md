# HugMood Microservices Architecture Diagram

```
                                      ┌─────────────────┐
                                      │                 │
                                      │  Web/Mobile     │
                                      │  Client         │
                                      │                 │
                                      └────────┬────────┘
                                               │
                                               │ HTTP/WS
                                               ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                            API Gateway (4000)                             │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  - REST API routing                - Authentication forwarding            │
│  - WebSocket handling              - Request/response transformation      │
│  - Service discovery               - Health checks                        │
│                                                                           │
└───────────────┬───────────────────────────────────────┬───────────────────┘
                │                                       │
                │ HTTP                                  │ HTTP
                ▼                                       ▼
┌───────────────────────────────────┐     ┌───────────────────────────────────┐
│                                   │     │                                   │
│     GraphQL Gateway (5000)        │     │     Service-specific REST APIs    │
│                                   │     │                                   │
├───────────────────────────────────┤     └───────────────┬───────────────────┘
│                                   │                     │
│  - Schema stitching               │                     │
│  - Cross-service queries          │                     │
│  - GraphQL subscriptions          │                     │
│  - Federation/mesh                │                     │
│                                   │                     │
└─────────────┬─────────────────────┘                     │
              │                                           │
              │ HTTP/GraphQL                              │ HTTP
              │                                           │
┌─────────────┼───────────────────────────────────────────┼─────────────────┐
│             │                                           │                 │
│             ▼                                           ▼                 │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  │                      │ │                      │ │                      │
│  │  Auth Service (5001) │ │  User Service (5002) │ │  Mood Service (5003) │
│  │                      │ │                      │ │                      │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘
│                                                                           │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  │                      │ │                      │ │                      │
│  │  Hug Service (5004)  │ │  Social Service*     │ │  Streak Service*     │
│  │                      │ │  (Planned)           │ │  (Planned)           │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘
│                                                                           │
│                         Microservices Layer                               │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ SQL
                                     ▼
                          ┌──────────────────────┐
                          │                      │
                          │  PostgreSQL Database │
                          │                      │
                          └──────────────────────┘
```

## Architecture Components

### Client Layer
- Web applications (React)
- Mobile applications (React Native)
- Communicates via HTTP REST, GraphQL, and WebSockets

### Gateway Layer
- **API Gateway (Port 4000)**: Routes REST API requests, handles WebSockets
- **GraphQL Gateway (Port 5000)**: Provides unified GraphQL API with federation

### Microservices Layer
- **Auth Service (Port 5001)**: Authentication, authorization, user identity
- **User Service (Port 5002)**: User profiles, badges, settings
- **Mood Service (Port 5003)**: Mood tracking, analytics, insights
- **Hug Service (Port 5004)**: Social interactions, hugs, group hugs
- **Social Service** (Planned): Follows, social sharing
- **Streak Service** (Planned): Wellness streaks, rewards

### Data Layer
- PostgreSQL database for persistent storage
- Each service has its own schema/tables
- Cross-service data access via APIs, not direct database access

## Communication Patterns

- **REST API**: Service-to-service HTTP communication
- **GraphQL**: Unified API for clients with cross-service data fetching
- **WebSockets**: Real-time communication for live updates
- **JWT Authentication**: Secure authentication with token validation

## Resilience Strategies

- **Circuit Breakers**: Prevent cascading failures between services
- **Fallback Mechanisms**: Local validation when services are unavailable
- **Health Checks**: Regular monitoring of service health
- **Offline Support**: Client-side caching and queuing for offline operations