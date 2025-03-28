# GraphQL Mesh SDK for HugMeNow

This SDK provides type-safe access to the HugMeNow GraphQL API.

## Installation

The SDK is automatically bundled with the HugMeNow application.

## Usage

### Basic Usage

```javascript
import { getSdk } from '../../mesh-sdk';

// Create a client with options
const client = getSdk({
  baseUrl: '/graphql',  // Endpoint URL
  token: localStorage.getItem('authToken')  // Auth token (optional)
});

// Fetch public moods
async function getPublicMoods() {
  try {
    const result = await client.PublicMoods();
    return result.publicMoods;
  } catch (error) {
    console.error('Error fetching public moods:', error);
    return [];
  }
}

// Create a mood entry
async function createMood(mood, intensity, note) {
  try {
    const moodInput = {
      mood,
      intensity,
      note,
      isPublic: true
    };
    
    const result = await client.CreateMoodEntry(moodInput);
    return result.createMoodEntry;
  } catch (error) {
    console.error('Error creating mood entry:', error);
    throw error;
  }
}
```

### React Integration Example

```jsx
import React, { useState, useEffect } from 'react';
import { getSdk } from '../../mesh-sdk';

function MoodList() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const client = getSdk({ token });
    
    async function fetchMoods() {
      try {
        setLoading(true);
        const result = await client.PublicMoods();
        setMoods(result.publicMoods);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMoods();
  }, []);
  
  if (loading) return <div>Loading moods...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Public Moods</h2>
      <ul>
        {moods.map(mood => (
          <li key={mood.id}>
            {mood.user.name}: {mood.mood} ({mood.intensity}/10) - {mood.note}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Available Operations

### Authentication
- `Login(loginInput)` - Log in with email and password
- `Register(registerInput)` - Register a new user account
- `AnonymousLogin(anonymousLoginInput)` - Log in anonymously

### User Operations
- `GetMe()` - Get the current user's profile
- `GetUsers()` - Get a list of all users

### Mood Operations
- `GetUserMoods()` - Get the current user's moods
- `PublicMoods()` - Get all public moods
- `FriendsMoods()` - Get moods from friends
- `CreateMoodEntry(moodInput)` - Create a new mood entry
- `GetMoodStreak()` - Get the current user's mood streak stats

### Hug Operations
- `GetReceivedHugs()` - Get hugs received by the current user
- `GetSentHugs()` - Get hugs sent by the current user
- `SendHug(sendHugInput)` - Send a hug to another user
- `MarkHugAsRead(hugId)` - Mark a hug as read

### Hug Request Operations
- `GetMyHugRequests()` - Get the current user's hug requests
- `GetPendingHugRequests()` - Get pending hug requests for the current user
- `GetCommunityHugRequests()` - Get community hug requests
- `CreateHugRequest(createHugRequestInput)` - Create a new hug request
- `RespondToHugRequest(respondToRequestInput)` - Respond to a hug request

### Friendship Operations
- `SendFriendRequest(createFriendshipInput)` - Send a friend request
- `RespondToFriendRequest(updateFriendshipInput)` - Respond to a friend request

### Utility Operations
- `HealthCheck()` - Check if the API is healthy