/**
 * Handle fetching data
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Map} clients - The map of client connections
 * @param {Object} data - The fetch request data
 */
async function handleFetchData(ws, clients, data) {
  const clientId = [...clients.entries()].find(([_, client]) => client.ws === ws)?.[0];
  const client = clients.get(clientId);
  
  if (!clientId || !client) {
    ws.send(JSON.stringify({
      type: 'fetch_response',
      error: 'Client not found',
      messageId: data.messageId
    }));
    return;
  }
  
  try {
    const { dataType, params = {} } = data;
    let responseData = null;
    
    // Fetch different types of data based on dataType
    switch (dataType) {
      case 'user_profile': {
        const { userId } = params;
        
        if (!userId) {
          throw new Error('Missing userId parameter');
        }
        
        // Use GraphQL Mesh gateway to fetch user profile
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': client.user ? `Bearer ${client.user.token}` : ''
          },
          body: JSON.stringify({
            query: `
              query GetUserProfile($userId: ID!) {
                userProfile(userId: $userId) {
                  user {
                    id
                    username
                    displayName
                    avatarUrl
                    createdAt
                  }
                  moods {
                    id
                    value
                    score
                    note
                    createdAt
                  }
                  moodStreak {
                    currentStreak
                    longestStreak
                  }
                  sentHugs {
                    id
                    type
                    createdAt
                  }
                  receivedHugs {
                    id
                    type
                    createdAt
                  }
                }
              }
            `,
            variables: { userId }
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        responseData = result.data.userProfile;
        break;
      }
      
      case 'mood_history': {
        const { userId, period = '30days' } = params;
        
        if (!userId) {
          throw new Error('Missing userId parameter');
        }
        
        // Use GraphQL Mesh gateway to fetch mood history
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': client.user ? `Bearer ${client.user.token}` : ''
          },
          body: JSON.stringify({
            query: `
              query GetMoodHistory($userId: ID!, $period: String) {
                moodHistory(userId: $userId, period: $period) {
                  days {
                    date
                    value
                    score
                    note
                  }
                  summary {
                    averageScore
                    moodFrequency {
                      mood
                      count
                      percentage
                    }
                    startDate
                    endDate
                  }
                }
              }
            `,
            variables: { userId, period }
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        responseData = result.data.moodHistory;
        break;
      }
      
      case 'mood_analytics': {
        const { userId, timeRange = 30, includeCorrelations = true } = params;
        
        if (!userId) {
          throw new Error('Missing userId parameter');
        }
        
        // Use GraphQL Mesh gateway to fetch mood analytics
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': client.user ? `Bearer ${client.user.token}` : ''
          },
          body: JSON.stringify({
            query: `
              query GetMoodAnalytics($userId: ID!, $timeRange: Int, $includeCorrelations: Boolean) {
                moodAnalytics(userId: $userId, timeRange: $timeRange, includeCorrelations: $includeCorrelations) {
                  statistics {
                    totalEntries
                    uniqueMoods
                    currentStreak
                    longestStreak
                    averageScore
                    moodVariability
                    dominantMood
                    improvementTrend
                  }
                  metrics {
                    moodFrequency
                    moodByDayOfWeek {
                      day
                      average
                      count
                    }
                    moodByTimeOfDay {
                      period
                      average
                      count
                    }
                  }
                  correlations @include(if: $includeCorrelations) {
                    activities
                    sleep
                    weather
                    screenTime
                  }
                  insights {
                    id
                    type
                    title
                    description
                    priority
                  }
                  recommendations {
                    type
                    title
                    description
                    priority
                  }
                }
              }
            `,
            variables: { userId, timeRange, includeCorrelations }
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        responseData = result.data.moodAnalytics;
        break;
      }
      
      case 'community_feed': {
        const { limit = 20, offset = 0, filter = 'all' } = params;
        
        // Use GraphQL Mesh gateway to fetch community feed
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': client.user ? `Bearer ${client.user.token}` : ''
          },
          body: JSON.stringify({
            query: `
              query GetCommunityFeed($limit: Int, $offset: Int) {
                communityFeed(limit: $limit, offset: $offset) {
                  items {
                    type
                    createdAt
                    ... on MoodFeedItem {
                      mood {
                        id
                        value
                        note
                        userId
                        createdAt
                      }
                    }
                    ... on HugFeedItem {
                      hug {
                        id
                        type
                        senderId
                        recipientId
                        createdAt
                      }
                    }
                  }
                  hasMore
                }
              }
            `,
            variables: { limit, offset }
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        // Filter feed items if needed
        let feedItems = result.data.communityFeed.items;
        
        if (filter !== 'all') {
          feedItems = feedItems.filter(item => {
            switch (filter) {
              case 'moods': return item.type === 'MOOD';
              case 'hugs': return item.type === 'HUG';
              default: return true;
            }
          });
        }
        
        responseData = {
          ...result.data.communityFeed,
          items: feedItems
        };
        break;
      }
      
      case 'wellness_dashboard': {
        const { userId } = params;
        
        if (!userId) {
          throw new Error('Missing userId parameter');
        }
        
        // Use GraphQL Mesh gateway to fetch wellness dashboard
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': client.user ? `Bearer ${client.user.token}` : ''
          },
          body: JSON.stringify({
            query: `
              query GetWellnessDashboard($userId: ID!) {
                wellnessDashboard(userId: $userId) {
                  user {
                    id
                    username
                    displayName
                  }
                  streak {
                    currentStreak
                    longestStreak
                  }
                  insights {
                    id
                    type
                    title
                    description
                    priority
                    isRead
                  }
                  analytics {
                    statistics {
                      totalEntries
                      averageScore
                      dominantMood
                      improvementTrend
                    }
                  }
                  recentActivities {
                    id
                    activityType
                    duration
                    createdAt
                  }
                }
              }
            `,
            variables: { userId }
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        responseData = result.data.wellnessDashboard;
        break;
      }
      
      case 'user_settings': {
        // Fetch settings using GraphQL Mesh gateway
        const userId = client.user?.id;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${client.user.token}`
          },
          body: JSON.stringify({
            query: `
              query GetUserSettings($userId: ID!) {
                userSettings(userId: $userId) {
                  theme
                  notifications {
                    enabled
                    types
                  }
                  privacy {
                    shareMoods
                    shareActivity
                    profileVisibility
                  }
                  accessibility {
                    highContrast
                    textSize
                    reduceAnimations
                  }
                }
              }
            `,
            variables: { userId }
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        responseData = result.data.userSettings;
        break;
      }
      
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }
    
    // Send response
    ws.send(JSON.stringify({
      type: 'fetch_response',
      dataType,
      data: responseData,
      messageId: data.messageId
    }));
  } catch (error) {
    console.error(`Error handling fetch request (${data.dataType}):`, error);
    
    // Send error response
    ws.send(JSON.stringify({
      type: 'fetch_response',
      error: error.message,
      dataType: data.dataType,
      messageId: data.messageId
    }));
  }
}

module.exports = handleFetchData;