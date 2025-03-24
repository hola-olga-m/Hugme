# GraphQL and Platform-Agnostic Implementation Guide for HugMood

## Introduction

This document outlines an innovative approach to implementing HugMood using GraphQL-centric tools and frameworks while ensuring platform agnosticism across web and mobile. The architecture leverages modern GraphQL frameworks, code-sharing strategies, and cutting-edge development approaches to create a seamless experience across all platforms.

## Core Architecture Principles

1. **GraphQL-First Design**: Prioritize GraphQL as the primary API layer for all client-server communication
2. **Full-Stack Type Safety**: Ensure type consistency from database to UI with code generation
3. **Cross-Platform Code Sharing**: Maximize shared business logic across platforms
4. **Real-Time by Default**: Built-in support for subscriptions and live data
5. **Offline-First Approach**: All functionality works seamlessly offline
6. **Edge-Ready Architecture**: Deploy and run services at the edge for minimal latency

## Technology Stack Overview

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                         Client Applications                                │
│                                                                           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐    │
│  │                 │    │                 │    │                     │    │
│  │   React Native  │    │   React Web     │    │   Progressive       │    │
│  │   Mobile App    │    │   Application   │    │   Web App           │    │
│  │                 │    │                 │    │                     │    │
│  └────────┬────────┘    └────────┬────────┘    └──────────┬──────────┘    │
│           │                      │                        │               │
│           └──────────────────────┼────────────────────────┘               │
│                                  │                                        │
└──────────────────────────────────┼────────────────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
┌───────────────────▼──┐  ┌────────▼─────────┐  ┌─▼───────────────────────┐
│                      │  │                  │  │                          │
│  Apollo Client       │  │  Relay           │  │  Urql                    │
│  • Apollo Cache      │  │  • Relay Store   │  │  • Normalized Cache      │
│  • Local Resolvers   │  │  • Fragments     │  │  • Exchanges             │
│  • Dev Tools         │  │  • Compiler      │  │  • Custom Exchanges      │
│                      │  │                  │  │                          │
└──────────┬───────────┘  └───────┬──────────┘  └──────────┬───────────────┘
           │                      │                        │
           └──────────────────────┼────────────────────────┘
                                  │
┌──────────────────────────────────┼────────────────────────────────────────┐
│                                  │                                        │
│                Shared State & Business Logic Layer                        │
│                                                                           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐    │
│  │                 │    │                 │    │                     │    │
│  │  React Context  │    │  MobX / Redux   │    │   TanStack Query    │    │
│  │                 │    │                 │    │                     │    │
│  └─────────────────┘    └─────────────────┘    └─────────────────────┘    │
│                                                                           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐    │
│  │                 │    │                 │    │                     │    │
│  │  Recoil         │    │  Jotai / Zustand│    │   Custom Hooks      │    │
│  │                 │    │                 │    │                     │    │
│  └─────────────────┘    └─────────────────┘    └─────────────────────┘    │
│                                                                           │
└──────────────────────────────────┼────────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                          GraphQL API Layer                               │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐      │
│  │                                                                │      │
│  │                      GraphQL Gateway                           │      │
│  │                                                                │      │
│  └───────────────────────────────┬────────────────────────────────┘      │
│                                  │                                       │
│  ┌─────────────────┐  ┌──────────┴──────────┐  ┌─────────────────────┐   │
│  │                 │  │                     │  │                     │   │
│  │  Apollo Server  │  │  Mercurius         │  │  Yoga / Envelop     │   │
│  │                 │  │                     │  │                     │   │
│  └─────────────────┘  └─────────────────────┘  └─────────────────────┘   │
│                                                                          │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                     Backend Framework Layer                              │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │                 │  │                     │  │                     │   │
│  │  Nest.js        │  │  Fastify            │  │  Next.js API        │   │
│  │                 │  │                     │  │                     │   │
│  └─────────────────┘  └─────────────────────┘  └─────────────────────┘   │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │                 │  │                     │  │                     │   │
│  │  Express/Node   │  │  Edge Functions     │  │  Serverless         │   │
│  │                 │  │                     │  │                     │   │
│  └─────────────────┘  └─────────────────────┘  └─────────────────────┘   │
│                                                                          │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                       Data Access Layer                                  │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │                 │  │                     │  │                     │   │
│  │  Prisma         │  │  TypeORM            │  │  Drizzle ORM        │   │
│  │                 │  │                     │  │                     │   │
│  └─────────────────┘  └─────────────────────┘  └─────────────────────┘   │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │                 │  │                     │  │                     │   │
│  │  Sequelize      │  │  Mongoose           │  │  Kysely             │   │
│  │                 │  │                     │  │                     │   │
│  └─────────────────┘  └─────────────────────┘  └─────────────────────┘   │
│                                                                          │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                         Database Layer                                   │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │                 │  │                     │  │                     │   │
│  │  PostgreSQL     │  │  MongoDB            │  │  Redis              │   │
│  │                 │  │                     │  │                     │   │
│  └─────────────────┘  └─────────────────────┘  └─────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Recommended Framework Selection

After evaluating various GraphQL and platform-agnostic frameworks, we recommend the following stack for HugMood:

### Backend Framework: NestJS with GraphQL

**Rationale**:
- TypeScript-first architecture with exceptional module organization
- Built-in GraphQL integration with code-generation capabilities
- Microservices support with multiple transport options
- Excellent dependency injection system for testability
- Enterprise-ready features for long-term scalability

**Key Technologies**:
- NestJS GraphQL module (using Apollo Server or Mercurius under the hood)
- NestJS Microservices for service-to-service communication
- Prisma for type-safe database access
- GraphQL Code Generator for type generation
- GraphQL Mesh for service federation (when needed)

### Frontend Framework: React Native with Expo (for mobile) + React (for web)

**Rationale**:
- Maximum code sharing between platforms (up to 80-90%)
- Expo framework for accelerated mobile development
- React Native Web for shared UI components
- Well-established ecosystem with excellent performance

**Key Technologies**:
- Expo SDK with EAS (Expo Application Services)
- React Native Web for cross-platform UI components
- Reanimated for cross-platform animations
- Styled Components/Emotion for cross-platform styling

### GraphQL Client: Apollo Client

**Rationale**:
- Excellent caching capabilities with local state management
- Robust offline support and conflict resolution
- Integrated subscription handling
- Extensive developer tools and ecosystem
- Works well across React Native and React Web

**Key Technologies**:
- Apollo Client 3 with normalized cache
- Apollo Client Devtools
- Apollo CodeGen for type generation
- Apollo Link modules for customization

## Code-Sharing Strategy

One of the primary advantages of this architecture is the ability to share code across platforms:

```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│                      Web + Mobile Shared Code                     │
│                                                                   │
│  • GraphQL operations (queries, mutations)                        │
│  • State management                                               │
│  • Business logic                                                 │
│  • GraphQL-generated types                                        │
│  • Utility functions                                              │
│  • Form validation                                                │
│  • API interaction logic                                          │
│  • Authentication logic                                           │
│                                                                   │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
┌───────────────▼───────────────┐   ┌───────────▼───────────────────┐
│                               │   │                               │
│     Web-Specific Code         │   │     Mobile-Specific Code      │
│                               │   │                               │
│  • Web-specific UI components │   │  • Mobile UI components       │
│  • Web-specific navigation    │   │  • Native APIs                │
│  • Browser-specific features  │   │  • Mobile navigation          │
│  • Responsive design          │   │  • Push notifications         │
│  • PWA capabilities           │   │  • Device-specific features   │
│                               │   │                               │
└───────────────────────────────┘   └───────────────────────────────┘
```

## Innovation: Backend as a Service (BaaS) Approach

For rapid development and excellent cross-platform support, we can implement a Backend as a Service (BaaS) approach using modern GraphQL tools:

### Option 1: The Guild GraphQL Mesh Gateway

[GraphQL Mesh](https://the-guild.dev/graphql/mesh) provides a unified GraphQL gateway that can integrate multiple APIs (REST, GraphQL, gRPC) into a single GraphQL schema.

**Key Benefits**:
- Federation of multiple services into a single GraphQL API
- Transformation and extension of existing APIs
- Authentication and authorization handling
- Automatic schema generation from various sources
- Extensible plugin system
- Caching and performance optimization
- Support for subscriptions and real-time data

**Implementation Example**:

```yaml
# .meshrc.yaml
sources:
  - name: UserService
    handler:
      graphql:
        endpoint: http://localhost:4001/graphql
        
  - name: MoodService
    handler:
      openapi:
        source: http://localhost:4002/swagger.json
        
  - name: HugService
    handler:
      graphql:
        endpoint: http://localhost:4003/graphql

  - name: NotificationService
    handler:
      grpc:
        endpoint: localhost:5000
        protoFilePath: ./proto/notification.proto

serve:
  playground: true

plugins:
  - auth:
      mode: JWT
      jwt:
        secret: ${JWT_SECRET}
  - cache:
      ttl: 300  # 5 minutes
  - logger: {}
```

### Option 2: Hasura GraphQL Engine

[Hasura](https://hasura.io/) provides instant GraphQL APIs over PostgreSQL databases with advanced features like real-time subscriptions, permissions, and actions.

**Key Benefits**:
- Instant GraphQL API with zero coding
- Granular permissions and role-based access control
- Real-time subscriptions out of the box
- Remote schema stitching for custom GraphQL services
- Event triggers for webhooks and actions
- Excellent performance characteristics
- Support for multiple database types

**Implementation Example**:

```yaml
# Remote Schema setup in Hasura

type defs: |
  type Hug {
    id: ID!
    from: String!
    to: String!
    message: String
    sentAt: String!
  }
  
  type Query {
    getHugs(userId: String!): [Hug!]!
  }
  
  type Mutation {
    sendHug(from: String!, to: String!, message: String): Hug!
  }

remote_schema_name: hug_service
definition:
  url: http://hug-service:4000/graphql
  timeout_seconds: 60
  forward_client_headers: true
```

### Option 3: Modern Serverless GraphQL with Redwood.js

[RedwoodJS](https://redwoodjs.com/) is a full-stack, serverless web application framework designed to optimize developer productivity in building modern, database-backed, GraphQL-based applications.

**Key Benefits**:
- End-to-end type safety with automatic validation
- GraphQL API with minimal boilerplate code
- Cells pattern for data fetching and rendering
- Built-in authentication and authorization
- Deploy to traditional hosts or serverless platforms
- Full-stack architecture with code organization
- Database agnostic (via Prisma)

**Implementation Example**:

```javascript
// api/src/graphql/moods.sdl.js
export const schema = gql`
  type Mood {
    id: Int!
    user: User!
    userId: Int!
    feeling: String!
    intensity: Int!
    note: String
    createdAt: DateTime!
  }

  type Query {
    moods: [Mood!]! @requireAuth
    mood(id: Int!): Mood @requireAuth
    userMoods(userId: Int!): [Mood!]! @requireAuth
  }

  input CreateMoodInput {
    userId: Int!
    feeling: String!
    intensity: Int!
    note: String
  }

  input UpdateMoodInput {
    userId: Int
    feeling: String
    intensity: Int
    note: String
  }

  type Mutation {
    createMood(input: CreateMoodInput!): Mood! @requireAuth
    updateMood(id: Int!, input: UpdateMoodInput!): Mood! @requireAuth
    deleteMood(id: Int!): Mood! @requireAuth
  }
`
```

## Innovative Cross-Platform Solutions

### 1. React Native Web + Next.js

Combining React Native Web with Next.js provides an excellent platform-agnostic solution:

**Key Benefits**:
- Share UI components between React Native and Web
- Server-side rendering for web performance
- Next.js API routes for backend functionality
- Static site generation for marketing pages
- Incremental static regeneration for dynamic content
- Unified styling with Styled Components or Emotion

**Implementation Example**:

```javascript
// shared/components/MoodCard.js
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { formatDistanceToNow } from 'date-fns'

export const MoodCard = ({ mood }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.feeling}>{mood.feeling}</Text>
      <Text style={styles.intensity}>Intensity: {mood.intensity}/10</Text>
      {mood.note && <Text style={styles.note}>{mood.note}</Text>}
      <Text style={styles.time}>
        {formatDistanceToNow(new Date(mood.createdAt), { addSuffix: true })}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16
  },
  feeling: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  intensity: {
    fontSize: 14,
    color: '#666'
  },
  note: {
    marginTop: 8,
    fontSize: 14
  },
  time: {
    marginTop: 12,
    fontSize: 12,
    color: '#999'
  }
})
```

### 2. Expo + Expo Web

Using Expo's platform provides a unified development experience:

**Key Benefits**:
- Build web and mobile from the same codebase
- Single command to run on multiple platforms
- Over-the-air updates for mobile apps
- Web support with PWA capabilities
- Seamless integration with native features
- Excellent TypeScript support

**Implementation Example**:

```javascript
// src/screens/MoodTracker.tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_MOOD, GET_USER_MOODS } from '../graphql/moods'
import { MoodPicker } from '../components/MoodPicker'
import { MoodHistory } from '../components/MoodHistory'
import { TextInput, Button } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'
import { showNotification } from '../utils/notifications'
import { playHapticFeedback } from '../utils/haptics'

export const MoodTrackerScreen = () => {
  const { user } = useAuth()
  const [feeling, setFeeling] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState('')

  const { data, loading, refetch } = useQuery(GET_USER_MOODS, {
    variables: { userId: user?.id },
    fetchPolicy: 'cache-and-network'
  })

  const [createMood, { loading: submitting }] = useMutation(CREATE_MOOD, {
    onCompleted: () => {
      refetch()
      setFeeling('')
      setIntensity(5)
      setNote('')
      
      // Show feedback based on platform
      if (Platform.OS !== 'web') {
        playHapticFeedback('success')
      }
      
      showNotification('Mood Recorded', 'Your mood has been successfully tracked!')
    },
    onError: (error) => {
      console.error('Failed to record mood:', error)
      showNotification('Error', 'Failed to record your mood. Please try again.')
    }
  })

  const handleSubmit = () => {
    if (!feeling) return
    
    createMood({
      variables: {
        input: {
          userId: user.id,
          feeling,
          intensity,
          note: note.trim() || null
        }
      }
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      
      <MoodPicker
        selected={feeling}
        onSelect={setFeeling}
        intensity={intensity}
        onIntensityChange={setIntensity}
      />
      
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Add a note about how you're feeling..."
        multiline
        style={styles.noteInput}
      />
      
      <Button
        title="Record Mood"
        onPress={handleSubmit}
        disabled={!feeling || submitting}
        loading={submitting}
      />
      
      <MoodHistory moods={data?.userMoods || []} loading={loading} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  noteInput: {
    height: 100,
    marginVertical: 16
  }
})
```

### 3. Unified State Management with Zustand

Zustand provides a lightweight yet powerful state management solution that works across platforms:

**Key Benefits**:
- Minimal boilerplate compared to Redux
- Works seamlessly in React and React Native
- Selector-based subscription system for performance
- TypeScript support out of the box
- Middleware support for extensions
- Compatible with React Context for nested state

**Implementation Example**:

```typescript
// src/stores/moodStore.ts
import create from 'zustand'
import { persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MoodEntry } from '../types'

interface MoodState {
  currentMood: MoodEntry | null
  moodHistory: MoodEntry[]
  isLoading: boolean
  error: string | null
  setCurrentMood: (mood: MoodEntry) => void
  addMoodEntry: (mood: MoodEntry) => void
  setMoodHistory: (moods: MoodEntry[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useMoodStore = create<MoodState>(
  persist(
    (set) => ({
      currentMood: null,
      moodHistory: [],
      isLoading: false,
      error: null,
      setCurrentMood: (mood) => set({ currentMood: mood }),
      addMoodEntry: (mood) => set((state) => ({
        currentMood: mood,
        moodHistory: [mood, ...state.moodHistory]
      })),
      setMoodHistory: (moods) => set({ moodHistory: moods }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'mood-storage',
      getStorage: () => AsyncStorage
    }
  )
)
```

## Real-World Architecture: End-to-End Implementation

### 1. Schema-First Development with GraphQL Code Generator

Use GraphQL Code Generator to ensure type safety across your entire stack:

```yaml
# codegen.yml
schema: ./schema.graphql
documents: ./src/**/*.graphql
generates:
  ./src/generated/graphql.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withHOC: false
      withComponent: false
  ./src/generated/schema.graphql:
    plugins:
      - schema-ast
```

### 2. Universal GraphQL Module Setup

Create a shared GraphQL setup that works across web and mobile:

```typescript
// src/graphql/client.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { onError } from '@apollo/client/link/error'
import { API_URL, WS_URL } from '../config'
import { getAuthToken } from '../utils/auth'

// Common error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    })
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

// HTTP link with auth
const httpLink = new HttpLink({
  uri: API_URL,
  headers: {
    get authorization() {
      const token = getAuthToken()
      return token ? `Bearer ${token}` : ''
    }
  }
})

// WebSocket link with auth
const wsLink = new WebSocketLink({
  uri: WS_URL,
  options: {
    reconnect: true,
    connectionParams: () => ({
      authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : ''
    })
  }
})

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        userMoods: {
          merge(existing = [], incoming) {
            return [...incoming]
          }
        }
      }
    }
  }
})

// Create Apollo Client
export const client = new ApolloClient({
  link: errorLink.concat(splitLink),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all'
    },
    mutate: {
      errorPolicy: 'all'
    }
  }
})
```

### 3. The Nest.js GraphQL Server Implementation

On the backend, NestJS provides a robust foundation:

```typescript
// src/mood/mood.resolver.ts
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { Mood } from './entities/mood.entity'
import { MoodService } from './mood.service'
import { CreateMoodInput } from './dto/create-mood.input'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

const pubSub = new PubSub()

@Resolver(() => Mood)
export class MoodResolver {
  constructor(private readonly moodService: MoodService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Mood])
  async userMoods(
    @Args('userId') userId: string,
    @CurrentUser() currentUser
  ) {
    // Check if user has permission to access these moods
    if (userId !== currentUser.id && !currentUser.isAdmin) {
      throw new Error('You do not have permission to access these moods')
    }
    
    return this.moodService.findAllByUser(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Mood)
  async createMood(
    @Args('input') createMoodInput: CreateMoodInput,
    @CurrentUser() currentUser
  ) {
    // Validate user is creating their own mood
    if (createMoodInput.userId !== currentUser.id) {
      throw new Error('You can only create moods for yourself')
    }
    
    const mood = await this.moodService.create(createMoodInput)
    
    // Publish subscription event
    pubSub.publish('moodCreated', { moodCreated: mood })
    
    return mood
  }

  @Subscription(() => Mood, {
    filter: (payload, variables) => {
      return payload.moodCreated.userId === variables.userId
    }
  })
  moodCreated(@Args('userId') userId: string) {
    return pubSub.asyncIterator('moodCreated')
  }
}
```

### 4. Offline Support with Apollo Client

Implement robust offline support:

```typescript
// src/hooks/useMoodTracking.ts
import { useCallback } from 'react'
import { useApolloClient } from '@apollo/client'
import { useNetInfo } from '@react-native-community/netinfo'
import { v4 as uuidv4 } from 'uuid'
import {
  useCreateMoodMutation,
  CreateMoodInput,
  MoodFragment
} from '../generated/graphql'
import { useOfflineStore } from '../stores/offlineStore'

export function useMoodTracking() {
  const netInfo = useNetInfo()
  const client = useApolloClient()
  const { addOfflineOperation, processOfflineQueue } = useOfflineStore()
  
  const [createMood, { loading }] = useCreateMoodMutation({
    onError: (error) => {
      console.error('Error creating mood:', error)
    }
  })
  
  const trackMood = useCallback(async (moodInput: CreateMoodInput) => {
    // Generate optimistic ID
    const optimisticId = uuidv4()
    
    // Create optimistic response
    const optimisticMood = {
      __typename: 'Mood',
      id: optimisticId,
      feeling: moodInput.feeling,
      intensity: moodInput.intensity,
      note: moodInput.note || null,
      createdAt: new Date().toISOString(),
      userId: moodInput.userId,
      user: {
        __typename: 'User',
        id: moodInput.userId
      }
    }
    
    if (netInfo.isConnected) {
      // Online: perform mutation with optimistic response
      return createMood({
        variables: { input: moodInput },
        optimisticResponse: {
          createMood: optimisticMood
        },
        update: (cache, { data }) => {
          // If we don't get a server response, keep the optimistic version
          if (!data?.createMood) return
          
          // Update cache
          cache.modify({
            fields: {
              userMoods(existingMoods = []) {
                const newMoodRef = cache.writeFragment({
                  data: data.createMood,
                  fragment: MoodFragment,
                  fragmentName: 'MoodFragment'
                })
                return [newMoodRef, ...existingMoods]
              }
            }
          })
        }
      })
    } else {
      // Offline: store in cache and queue for later
      // Store optimistic response in cache
      client.writeFragment({
        fragment: MoodFragment,
        fragmentName: 'MoodFragment',
        data: optimisticMood
      })
      
      // Update cache for userMoods query
      client.cache.modify({
        fields: {
          userMoods(existingMoods = []) {
            const newMoodRef = client.cache.writeFragment({
              data: optimisticMood,
              fragment: MoodFragment,
              fragmentName: 'MoodFragment'
            })
            return [newMoodRef, ...existingMoods]
          }
        }
      })
      
      // Queue operation for when back online
      addOfflineOperation({
        type: 'mutation',
        name: 'createMood',
        variables: { input: moodInput },
        optimisticId,
        timestamp: Date.now()
      })
      
      // Return the optimistic response
      return Promise.resolve({ data: { createMood: optimisticMood } })
    }
  }, [netInfo.isConnected, createMood, client, addOfflineOperation])
  
  // Process offline queue when network is restored
  useEffect(() => {
    if (netInfo.isConnected) {
      processOfflineQueue(client)
    }
  }, [netInfo.isConnected, processOfflineQueue, client])
  
  return {
    trackMood,
    loading
  }
}
```

## Getting Started: Implementation Guide

### 1. Initial Project Setup

Start with a monorepo setup using Turborepo or NX to manage both web and mobile codebases:

```bash
# Using create-turbo
npx create-turbo@latest hugmood

cd hugmood

# Add apps
npx turbo gen workspace --type app web
npx turbo gen workspace --type app mobile

# Add shared packages
npx turbo gen workspace --type package ui
npx turbo gen workspace --type package api-client
npx turbo gen workspace --type package schema
npx turbo gen workspace --type package utils

# Setting up Expo for mobile
cd apps/mobile
npx expo init . --template blank-typescript
```

### 2. GraphQL Schema Setup

Define your schema in a shared package:

```graphql
# packages/schema/schema.graphql
scalar DateTime

type User {
  id: ID!
  username: String!
  email: String!
  displayName: String
  createdAt: DateTime!
  moods: [Mood!]!
  hugs: [Hug!]!
  friendships: [Friendship!]!
}

type Mood {
  id: ID!
  user: User!
  userId: ID!
  feeling: String!
  intensity: Int!
  note: String
  isPublic: Boolean!
  createdAt: DateTime!
}

type Hug {
  id: ID!
  sender: User!
  senderId: ID!
  recipient: User!
  recipientId: ID!
  message: String
  type: String!
  createdAt: DateTime!
  isRead: Boolean!
}

type Friendship {
  id: ID!
  user: User!
  userId: ID!
  friend: User!
  friendId: ID!
  status: FriendshipStatus!
  createdAt: DateTime!
}

enum FriendshipStatus {
  PENDING
  ACCEPTED
  DECLINED
  BLOCKED
}

type Query {
  me: User
  user(id: ID!): User
  userByUsername(username: String!): User
  
  moods(limit: Int, offset: Int): [Mood!]!
  userMoods(userId: ID!, limit: Int, offset: Int): [Mood!]!
  moodById(id: ID!): Mood
  
  hugs(limit: Int, offset: Int): [Hug!]!
  sentHugs(userId: ID!, limit: Int, offset: Int): [Hug!]!
  receivedHugs(userId: ID!, limit: Int, offset: Int): [Hug!]!
  hugById(id: ID!): Hug
  
  friendships(userId: ID!, status: FriendshipStatus): [Friendship!]!
}

input CreateUserInput {
  username: String!
  email: String!
  password: String!
  displayName: String
}

input LoginInput {
  username: String
  email: String
  password: String!
}

input CreateMoodInput {
  userId: ID!
  feeling: String!
  intensity: Int!
  note: String
  isPublic: Boolean!
}

input SendHugInput {
  senderId: ID!
  recipientId: ID!
  message: String
  type: String!
}

input CreateFriendshipInput {
  userId: ID!
  friendId: ID!
}

input UpdateFriendshipInput {
  id: ID!
  status: FriendshipStatus!
}

type AuthPayload {
  token: String!
  user: User!
}

type Mutation {
  register(input: CreateUserInput!): AuthPayload
  login(input: LoginInput!): AuthPayload
  
  createMood(input: CreateMoodInput!): Mood!
  
  sendHug(input: SendHugInput!): Hug!
  
  createFriendship(input: CreateFriendshipInput!): Friendship!
  updateFriendship(input: UpdateFriendshipInput!): Friendship!
}

type Subscription {
  moodCreated(userId: ID!): Mood!
  hugReceived(userId: ID!): Hug!
  friendshipUpdated(userId: ID!): Friendship!
}
```

### 3. NestJS GraphQL Server Implementation

```typescript
// apps/api/src/app.module.ts
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { MoodsModule } from './moods/moods.module'
import { HugsModule } from './hugs/hugs.module'
import { FriendshipsModule } from './friendships/friendships.module'
import { GraphQLDateTime } from 'graphql-iso-date'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'schema.graphql'),
        sortSchema: true,
        playground: configService.get('NODE_ENV') !== 'production',
        introspection: configService.get('NODE_ENV') !== 'production',
        installSubscriptionHandlers: true,
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': true,
        },
        context: ({ req, connection }) => {
          // context for both HTTP and WebSocket
          if (connection) {
            return { req: connection.context };
          }
          return { req };
        },
        resolvers: { DateTime: GraphQLDateTime },
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MoodsModule,
    HugsModule,
    FriendshipsModule,
  ],
})
export class AppModule {}
```

### 4. Creating Shared UI Components

```tsx
// packages/ui/src/MoodTracker.tsx
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, TextInput, Button, Card } from './components'
import { MoodPicker } from './MoodPicker'

export interface MoodTrackerProps {
  onSubmit: (data: {
    feeling: string
    intensity: number
    note: string
    isPublic: boolean
  }) => void
  isLoading: boolean
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [feeling, setFeeling] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  const handleSubmit = () => {
    if (!feeling) return
    
    onSubmit({
      feeling,
      intensity,
      note,
      isPublic,
    })
    
    // Reset form
    setFeeling('')
    setIntensity(5)
    setNote('')
  }

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      
      <MoodPicker
        selected={feeling}
        onSelect={setFeeling}
        intensity={intensity}
        onIntensityChange={setIntensity}
      />
      
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Add a note about how you're feeling..."
        multiline
        style={styles.noteInput}
      />
      
      <View style={styles.toggleContainer}>
        <Text>Share with friends</Text>
        <Switch
          value={isPublic}
          onValueChange={setIsPublic}
        />
      </View>
      
      <Button
        title="Record Mood"
        onPress={handleSubmit}
        disabled={!feeling || isLoading}
        loading={isLoading}
      />
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  noteInput: {
    height: 100,
    marginVertical: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
})
```

### 5. Implementation in Next.js (Web)

```tsx
// apps/web/pages/dashboard.tsx
import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { MoodTracker } from '@hugmood/ui'
import { useAuth } from '../hooks/useAuth'
import { useCreateMoodMutation, useUserMoodsQuery } from '../generated/graphql'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { MoodHistory } from '../components/MoodHistory'
import { useToast } from '../hooks/useToast'

const DashboardPage: NextPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  const toast = useToast()
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      router.replace('/login')
    }
  }, [user, router])
  
  const { data, loading } = useUserMoodsQuery({
    variables: { userId: user?.id },
    skip: !user,
  })
  
  const [createMood, { loading: submitting }] = useCreateMoodMutation({
    onCompleted: () => {
      toast.success('Mood recorded successfully!')
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`)
    },
    update: (cache, { data: newData }) => {
      if (!newData?.createMood) return
      
      // Update local cache
      const newMood = newData.createMood
      
      cache.modify({
        fields: {
          userMoods(existingMoods = []) {
            const newMoodRef = cache.writeFragment({
              data: newMood,
              fragment: gql`
                fragment NewMood on Mood {
                  id
                  feeling
                  intensity
                  note
                  isPublic
                  createdAt
                }
              `
            })
            return [newMoodRef, ...existingMoods]
          }
        }
      })
    }
  })
  
  const handleSubmitMood = async (moodData) => {
    if (!user) return
    
    await createMood({
      variables: {
        input: {
          userId: user.id,
          ...moodData
        }
      }
    })
  }
  
  if (!user) {
    return null // or loading component
  }
  
  return (
    <DashboardLayout>
      <h1>Welcome back, {user.displayName || user.username}!</h1>
      
      <MoodTracker
        onSubmit={handleSubmitMood}
        isLoading={submitting}
      />
      
      <MoodHistory
        moods={data?.userMoods || []}
        isLoading={loading}
      />
    </DashboardLayout>
  )
}

export default DashboardPage
```

### 6. Implementation in Expo (Mobile)

```tsx
// apps/mobile/src/screens/DashboardScreen.tsx
import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MoodTracker } from '@hugmood/ui'
import { useAuth } from '../hooks/useAuth'
import { useCreateMoodMutation, useUserMoodsQuery } from '../generated/graphql'
import { Header } from '../components/Header'
import { MoodHistoryList } from '../components/MoodHistoryList'
import { useNotification } from '../hooks/useNotification'
import { playHapticFeedback } from '../utils/haptics'

export const DashboardScreen = () => {
  const { user } = useAuth()
  const navigation = useNavigation()
  const notification = useNotification()
  
  const { data, loading, refetch } = useUserMoodsQuery({
    variables: { userId: user?.id },
    skip: !user,
  })
  
  const [createMood, { loading: submitting }] = useCreateMoodMutation({
    onCompleted: () => {
      playHapticFeedback('success')
      notification.show({
        title: 'Success',
        message: 'Your mood has been recorded',
        type: 'success'
      })
    },
    onError: (error) => {
      notification.show({
        title: 'Error',
        message: error.message,
        type: 'error'
      })
    }
  })
  
  const handleSubmitMood = async (moodData) => {
    if (!user) return
    
    await createMood({
      variables: {
        input: {
          userId: user.id,
          ...moodData
        }
      }
    })
  }
  
  React.useEffect(() => {
    if (!user) {
      navigation.replace('Login')
    }
  }, [user, navigation])
  
  if (!user) {
    return null // or loading component
  }
  
  return (
    <View style={styles.container}>
      <Header title={`Hi, ${user.displayName || user.username}!`} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MoodTracker
          onSubmit={handleSubmitMood}
          isLoading={submitting}
        />
        
        <MoodHistoryList
          moods={data?.userMoods || []}
          isLoading={loading}
          onRefresh={refetch}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  scrollContent: {
    padding: 16
  }
})
```

## Deployment Strategy

The architecture can be deployed in various ways:

### 1. Monolithic Deployment with Next.js + API Routes

Deploy the GraphQL API and web frontend together using Next.js API routes, with a Vercel or Netlify deployment. Mobile app links to the same API.

### 2. Serverless GraphQL API

Deploy NestJS to serverless functions on AWS Lambda, Vercel Functions, or Cloudflare Workers, with web and mobile connecting to this API.

### 3. Containerized Architecture

Deploy the NestJS API in Docker containers using Kubernetes, with separate deployments for web and mobile builds.

### 4. BaaS-based Deployment

Use existing BaaS providers like Hasura, AWS AppSync, or Firebase to handle backend functionality, with custom functions for specific business logic.

## Conclusion

This architecture provides a modern, GraphQL-first approach to developing HugMood with maximum code sharing between web and mobile platforms. By leveraging the latest tools and frameworks in the GraphQL ecosystem, we can deliver a high-quality, real-time application with excellent developer experience and user satisfaction.

The platform-agnostic nature of this architecture ensures that new features can be built once and deployed everywhere, while still allowing for platform-specific optimizations when necessary. As the application scales, the microservices approach facilitated by GraphQL Mesh or similar federation tools will allow different teams to work on different parts of the system independently.

By adopting this approach, HugMood will be well-positioned for rapid growth, with a robust, scalable architecture that can evolve with changing requirements and user demands.