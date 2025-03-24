# HugMood Microservices Architecture

This directory contains the microservices that power the HugMood application, providing a robust, scalable backend with GraphQL support.

## Architecture Overview

The HugMood microservices architecture consists of the following components:

1. **API Gateway** - Entry point for REST API requests, handling routing to appropriate services
2. **GraphQL Gateway** - Unified GraphQL endpoint that implements a mesh pattern across services
3. **Auth Service** - Authentication and authorization service
4. **User Service** - User profile management service
5. **Mood Service** - Mood tracking and analytics
6. **Hug Service** - Social interaction features
7. **Social Service** (planned) - Follower management and social sharing
8. **Streak Service** (planned) - Wellness streak tracking and rewards

## Services

### API Gateway

- **Port**: 4000
- **Role**: Routes REST API requests to appropriate microservices
- **Features**:
  - Request forwarding
  - Authentication validation
  - WebSocket support for real-time features
  - Service health monitoring

### GraphQL Gateway

- **Port**: 5000
- **Role**: Provides a unified GraphQL API across all services
- **Features**:
  - Federation/mesh pattern for cross-service queries
  - GraphQL subscriptions for real-time updates
  - GraphQL Playground for API exploration
  - Forward authentication

### Auth Service

- **Port**: 5001
- **Role**: Handles user authentication and authorization
- **Features**:
  - User registration and login
  - JWT token generation and validation
  - Password management
  - Social authentication (planned)

### User Service

- **Port**: 5002
- **Role**: Manages user profiles and user-related data
- **Features**:
  - User profile CRUD operations
  - Badge management
  - Settings management
  - Online status tracking

### Mood Service

- **Port**: 5003
- **Role**: Handles mood tracking and analytics
- **Features**:
  - Mood creation and updating
  - Mood history retrieval
  - Advanced mood analytics
  - Mood pattern recognition
  - Personalized insights and recommendations

### Hug Service

- **Port**: 5004
- **Role**: Manages social interactions like hugs and group hugs
- **Features**:
  - Sending and receiving hugs
  - Hug requests (public and private)
  - Group hug creation and participation
  - Hug type management
  - Hug history tracking

## Communication Patterns

The microservices communicate with each other using several patterns:

1. **Service-to-Service HTTP** - Direct REST API calls between services
2. **GraphQL Federation** - GraphQL Gateway aggregates data from multiple services
3. **WebSockets** - Real-time communication for subscriptions and user events
4. **Event-Driven** (planned) - Asynchronous communication via message queues

## Resilience Strategies

The architecture implements several resilience strategies:

1. **Circuit Breaking** - Prevent cascading failures when a service is down
2. **Fallback Mechanisms** - Local JWT validation when Auth service is unavailable
3. **Health Checks** - Regular monitoring of service health
4. **Offline Support** - Client-side caching and queuing for offline operation

## Authentication Flow

1. User authenticates via API Gateway or GraphQL Gateway
2. Auth Service validates credentials and issues JWT token
3. Token is validated by API Gateway on subsequent requests
4. Service-to-service communication uses X-User-ID header

## Development

### Requirements

Each service has its own requirements.txt file with the necessary dependencies.

### Starting Services

For local development, each service can be started individually:

```bash
cd services/auth-service
pip install -r requirements.txt
python app.py
```

### Environment Variables

Each service supports the following environment variables:

- `PORT` - The port to run the service on
- `JWT_SECRET` - Secret key for JWT operations
- `DEBUG` - Enable debug mode
- Service-specific URLs (e.g., `AUTH_SERVICE_URL`)

## Future Work

1. Implement remaining microservices (Social, Streak)
2. Add message queue for asynchronous communication
3. Implement database migrations
4. Add service discovery and dynamic routing
5. Container orchestration
6. Integrate with proper PostgreSQL database instead of SQLite
7. Add monitoring and observability tools
8. Enhance service resilience with circuit breakers
9. Implement proper user resolver in all services