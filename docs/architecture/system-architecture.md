# HugMood System Architecture

## Overview

HugMood is a mobile-first emotional wellness application structured with a modern microservices-based architecture. The application offers two primary runtime configurations:

1. **WebSocket-based Server** (`server.js`): The original server implementation using WebSockets for real-time communication
2. **GraphQL-based Server** (`new-server.js`): A modern implementation using GraphQL Yoga with subscriptions

This document details the overall system architecture, including the microservices, communication patterns, and data flow.

## System Components

![HugMood System Architecture Diagram](../resources/images/system-architecture.png)

### Client Applications

HugMood is accessible through multiple client interfaces:

1. **Web Application**
   - Progressive Web App (PWA) with offline capabilities
   - Mobile-first responsive design
   - React-based front-end with context-based state management
   - Service worker for caching and background operations

2. **Mobile Application**
   - React Native implementation for iOS and Android
   - Native platform integrations for notifications, haptics, and sensors
   - Shared business logic with web application
   - Offline-first data synchronization

3. **API Clients**
   - Support for third-party integrations via GraphQL API
   - Webhook-based integration capabilities
   - OAuth 2.0 authentication for partner applications

### Microservices Architecture

The application is decomposed into the following microservices:

| Service | Description | Port | Technologies |
|---------|-------------|------|--------------|
| **API Gateway** | Entry point for REST API requests | 4000 | Express, http-proxy-middleware |
| **GraphQL Gateway** | Unified GraphQL API across all services | 5000 | Apollo Server, GraphQL Yoga |
| **Auth Service** | Authentication and authorization | 5001 | Express, JWT, bcrypt, Passport |
| **User Service** | User profile management | 5002 | Express, Sequelize |
| **Mood Service** | Mood tracking and analytics | 5003 | Express, Sequelize, ML algorithms |
| **Hug Service** | Social interactions and virtual hug features | 5004 | Express, WebSockets, Sequelize |
| **GraphQL Mesh Gateway** | Advanced GraphQL gateway using Mesh SDK | 4005 | GraphQL Mesh, Yoga |

## Communication Patterns

The HugMood architecture employs several communication patterns to enable real-time interactions and data flow:

### 1. Request-Response (REST/GraphQL)

Traditional request-response pattern used for:
- CRUD operations on resources
- User authentication
- Data retrieval and updates
- Configuration and preferences

### 2. Real-time Communication (WebSockets)

WebSocket-based communication for real-time features:
- Mood updates from connections
- Hug sending and receiving
- Typing indicators in messaging
- Online status updates
- Real-time notifications

### 3. Event-Driven Communication

Internal event-driven communication between services:
- Service-to-service communication via message broker
- Event sourcing for critical user activities
- Asynchronous processing of analytics data
- Webhook delivery to external integrations

### 4. GraphQL Subscriptions

GraphQL-based real-time updates:
- Modern replacement for WebSocket-based communication
- Typed schema for real-time events
- Client-specific filtering of real-time data
- Stateful subscription management

## Data Flow

### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│   Client    │────▶│ API Gateway │────▶│ Auth Service│────▶│  Database   │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                                       │                   │
       │                                       │                   │
       │                  JWT                  │                   │
       ◀───────────────────────────────────────                   │
       │                                                           │
       │                                                           │
       │                User Data                                  │
       ◀───────────────────────────────────────────────────────────
```

### Mood Tracking Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│   Client    │────▶│GraphQL/Mesh │────▶│ Mood Service│────▶│  Database   │
│             │     │   Gateway   │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                               │                   │
                                               │                   │
                                               │                   │
┌─────────────┐                                │                   │
│  Connected  │◀───────────────────────────────                   │
│   Clients   │     Real-time Update                              │
└─────────────┘                                                    │
       ▲                                                           │
       │                Analytics Data                             │
       └───────────────────────────────────────────────────────────
```

### Virtual Hug Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Sender     │────▶│GraphQL/Mesh │────▶│ Hug Service │────▶│  Database   │
│  Client     │     │   Gateway   │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                               │                   │
                                               │                   │
                                               │                   │
┌─────────────┐                                │                   │
│  Recipient  │◀───────────────────────────────                   │
│   Client    │   WebSocket/Subscription                          │
└─────────────┘             │                                      │
       │                    │         Notification Data            │
       └────────────────────┴──────────────────────────────────────
```

## System Scalability and Resilience

### Horizontal Scaling

- Microservices can be independently scaled based on load
- Stateless services enable multiple instances behind load balancers
- Database read replicas for scaling read operations
- Caching layers for frequently accessed data

### Resilience Mechanisms

- Circuit breakers between service communications
- Retry mechanisms with exponential backoff
- Fallback strategies for degraded functionality
- Health checks and automatic instance recovery
- Rate limiting to prevent abuse

### Offline Capabilities

- Progressive Web App with service worker caching
- IndexedDB for client-side data persistence
- Request queueing for offline operations
- Background sync when connection is restored
- Conflict resolution strategies for concurrent updates

## Data Storage

The application utilizes multiple data storage mechanisms:

1. **PostgreSQL Database**
   - Primary relational database for structured data
   - Stores user accounts, mood entries, relationships, etc.
   - Utilized by Sequelize ORM for data access

2. **Redis Cache**
   - In-memory cache for performance optimization
   - Session storage and rate limiting
   - Pub/Sub mechanism for real-time communication

3. **Client-Side Storage**
   - IndexedDB for offline data persistence
   - Local Storage for user preferences and tokens
   - Cache API for static resource caching

## Cross-Cutting Concerns

### Authentication and Authorization

- JWT-based authentication across services
- Role-based access control (RBAC)
- OAuth 2.0 for third-party authentication
- Social login integration (Google, Facebook, Apple)
- Refresh token rotation for security

### Logging and Monitoring

- Centralized logging with structured log formats
- Distributed tracing for request flows across services
- Real-time monitoring and alerting
- Performance metrics collection
- Error tracking and reporting

### Security Measures

- HTTPS everywhere with TLS 1.3
- CORS policy enforcement
- CSRF protection for API endpoints
- Input validation and sanitization
- Regular security audits and penetration testing

## Development and Deployment Pipeline

### Development Workflow

1. Local development using Docker Compose
2. Feature branch development with Pull Requests
3. Automated linting and testing
4. Code reviews and quality gates

### Deployment Pipeline

1. Continuous Integration with automated tests
2. Artifact building and versioning
3. Deployment to staging environment
4. Manual or automated promotion to production
5. Blue/Green deployment strategy

## Future Architecture Evolution

See [Next-Gen Architecture Vision](../future/next-gen-architecture.md) for details on planned architectural evolution, including:

- Migration to a fully event-driven architecture
- Edge computing for enhanced privacy and performance
- Federated machine learning for improved emotional intelligence
- Multi-region deployment for global low-latency support
- Advanced polyglot persistence strategies